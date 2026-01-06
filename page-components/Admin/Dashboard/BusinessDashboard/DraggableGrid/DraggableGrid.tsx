import { Box, Flex } from "@chakra-ui/react";
import {
	cloneElement,
	isValidElement,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	Layout,
	ResponsiveGridLayout,
	useContainerWidth,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const LAYOUT_STORAGE_KEY = "inf-dashboard-grid-layout";

interface LayoutItem {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
	minW?: number;
	minH?: number;
}

interface DashboardLayouts {
	lg: LayoutItem[];
	md: LayoutItem[];
	sm: LayoutItem[];
	[key: string]: LayoutItem[];
}

/** Default layout configuration for dashboard widgets */
const DEFAULT_LAYOUTS: DashboardLayouts = {
	lg: [
		{ i: "earning", x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
		{ i: "success", x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
		{ i: "services", x: 0, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
		{ i: "analytics", x: 4, y: 4, w: 8, h: 4, minW: 4, minH: 3 },
		{ i: "merchants", x: 0, y: 8, w: 12, h: 5, minW: 6, minH: 4 },
	],
	md: [
		{ i: "earning", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
		{ i: "success", x: 6, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
		{ i: "services", x: 0, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
		{ i: "analytics", x: 6, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
		{ i: "merchants", x: 0, y: 8, w: 12, h: 5, minW: 6, minH: 4 },
	],
	sm: [
		{ i: "earning", x: 0, y: 0, w: 12, h: 4, minW: 12, minH: 3 },
		{ i: "success", x: 0, y: 4, w: 12, h: 4, minW: 12, minH: 3 },
		{ i: "services", x: 0, y: 8, w: 12, h: 4, minW: 12, minH: 3 },
		{ i: "analytics", x: 0, y: 12, w: 12, h: 4, minW: 12, minH: 3 },
		{ i: "merchants", x: 0, y: 16, w: 12, h: 5, minW: 12, minH: 4 },
	],
};

interface DraggableGridProps {
	children: Record<string, ReactNode>;
	isDraggable?: boolean;
	isResizable?: boolean;
}

/**
 * A draggable and resizable grid layout for dashboard widgets.
 * Persists layout changes to localStorage.
 * @param {DraggableGridProps} props - Component properties
 * @returns {JSX.Element} Draggable grid layout component
 */
const DraggableGrid = ({
	children,
	isDraggable = true,
	isResizable = true,
}: DraggableGridProps): JSX.Element => {
	const [layouts, setLayouts] = useState<DashboardLayouts>(DEFAULT_LAYOUTS);
	const {
		width,
		mounted: containerMounted,
		containerRef,
	} = useContainerWidth({ measureBeforeMount: true });

	// Load saved layout from localStorage on mount
	useEffect(() => {
		const savedLayouts = localStorage.getItem(LAYOUT_STORAGE_KEY);
		if (savedLayouts) {
			try {
				const parsed = JSON.parse(savedLayouts);
				setLayouts(parsed);
			} catch (e) {
				console.error("Failed to parse saved layout:", e);
			}
		}
	}, []);

	// Save layout to localStorage when changed
	const handleLayoutChange = useCallback(
		(_currentLayout: Layout, allLayouts: Record<string, Layout>) => {
			setLayouts(allLayouts as DashboardLayouts);
			localStorage.setItem(
				LAYOUT_STORAGE_KEY,
				JSON.stringify(allLayouts)
			);
		},
		[]
	);

	// Render grid items from children object
	// Clones each child and injects isDraggable prop so widgets can use DragHandle
	const gridItems = useMemo(() => {
		return Object.entries(children).map(([key, child]) => (
			<Flex
				key={key}
				direction="column"
				bg="white"
				borderRadius="10"
				overflow="hidden"
				h="100%"
			>
				{/* Widget Content - clone child to inject isDraggable prop */}
				<Box flex="1" overflow="auto">
					{isValidElement(child)
						? cloneElement(child, {
								isDraggable,
							} as Partial<unknown>)
						: child}
				</Box>
			</Flex>
		));
	}, [children, isDraggable]);

	if (!containerMounted || !width) {
		return (
			<Box ref={containerRef} minH="600px" w="100%">
				{/* Placeholder for width measurement */}
			</Box>
		);
	}

	return (
		<Box
			ref={containerRef}
			mx="-10px"
			sx={{
				".react-grid-item.react-grid-placeholder": {
					bg: "primary.light",
					opacity: 0.2,
					borderRadius: "10px",
				},
				".react-grid-item > .react-resizable-handle": {
					opacity: 0.3,
					"&:hover": {
						opacity: 1,
					},
				},
			}}
		>
			<ResponsiveGridLayout
				layouts={layouts}
				breakpoints={{ lg: 1024, md: 768, sm: 0 }}
				cols={{ lg: 12, md: 12, sm: 12 }}
				rowHeight={80}
				width={width}
				margin={[16, 16]}
				containerPadding={[10, 10]}
				dragConfig={{
					enabled: isDraggable,
					handle: ".drag-handle",
					cancel: "select, button, input, a, [data-no-drag]",
				}}
				resizeConfig={{
					enabled: isResizable,
				}}
				onLayoutChange={handleLayoutChange}
			>
				{gridItems}
			</ResponsiveGridLayout>
		</Box>
	);
};

export default DraggableGrid;

/**
 * DragHandle component - renders a draggable header bar with grip icon
 * Use this in widget components to create a draggable area
 * @param {object} props - Component properties
 * @param {ReactNode} props.children - Content to render inside the drag handle
 * @param {boolean} props.isDraggable - Whether dragging is enabled
 */
interface DragHandleProps {
	children: ReactNode;
	isDraggable?: boolean;
}

export const DragHandle = ({
	children,
	isDraggable = true,
}: DragHandleProps): JSX.Element => {
	return (
		<Flex
			className="drag-handle"
			align="center"
			justify="space-between"
			w="100%"
			cursor={isDraggable ? "grab" : "default"}
			_active={isDraggable ? { cursor: "grabbing" } : undefined}
			userSelect="none"
		>
			{children}
			{/* Drag indicator icon */}
			<Box
				as="span"
				fontSize="16px"
				color="gray.300"
				opacity={0.5}
				transition="color 0.2s, opacity 0.2s"
				ml="2"
				_groupHover={{
					color: "gray.500",
					opacity: 1,
				}}
				sx={{
					".drag-handle:hover &": {
						color: "gray.500",
						opacity: 1,
					},
				}}
			>
				⠿
			</Box>
		</Flex>
	);
};

/**
 * Resets the dashboard layout to default configuration
 * @returns {void}
 */
export const resetDashboardLayout = (): void => {
	localStorage.removeItem(LAYOUT_STORAGE_KEY);
	window.location.reload();
};

export { DEFAULT_LAYOUTS, LAYOUT_STORAGE_KEY };
