import { Box, Flex } from "@chakra-ui/react";
import { cloneElement, isValidElement, useMemo } from "react";
import { ResponsiveGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { DraggableGridProps, GRID_BREAKPOINTS, GRID_COLS } from "./types";

/**
 * A generic, reusable draggable and resizable grid layout component.
 * Use with useDraggableGrid hook for state management and persistence.
 * @param {DraggableGridProps} props - Component properties
 * @param {Record<string, React.ReactNode>} props.children - Grid items keyed by their layout id
 * @param {GridLayouts} props.layouts - Current layouts from useDraggableGrid hook
 * @param {number} props.width - Container width from useDraggableGrid hook
 * @param {React.RefObject<HTMLDivElement>} props.containerRef - Container ref from useDraggableGrid hook
 * @param {boolean} props.mounted - Whether container is mounted from useDraggableGrid hook
 * @param {Function} props.onLayoutChange - Layout change handler from useDraggableGrid hook
 * @param {boolean} [props.isDraggable] - Whether grid items are draggable
 * @param {boolean} [props.isResizable] - Whether grid items are resizable
 * @param {number} [props.rowHeight] - Height of each grid row in pixels
 * @param {[number, number]} [props.margin] - Horizontal and vertical margin between grid items
 * @param {[number, number]} [props.containerPadding] - Horizontal and vertical padding for the grid container
 * @returns {JSX.Element} The rendered draggable grid
 * @example
 * ```tsx
 * const { layouts, handleLayoutChange, containerRef, width, mounted } = useDraggableGrid({
 *   storageKey: 'my-grid',
 *   defaultLayouts: MY_LAYOUTS,
 * });
 *
 * <DraggableGrid
 *   layouts={layouts}
 *   width={width}
 *   containerRef={containerRef}
 *   mounted={mounted}
 *   onLayoutChange={handleLayoutChange}
 * >
 *   {{ widget1: <MyWidget /> }}
 * </DraggableGrid>
 * ```
 */
export const DraggableGrid = ({
	children,
	layouts,
	width,
	containerRef,
	mounted,
	onLayoutChange,
	isDraggable = true,
	isResizable = true,
	rowHeight = 80,
	margin = [16, 16],
	containerPadding = [10, 10],
}: DraggableGridProps): JSX.Element => {
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
				<Box h="100%" overflow="auto" className="customScrollbars">
					{isValidElement(child)
						? cloneElement(child, {
								isDraggable,
							} as Partial<unknown>)
						: child}
				</Box>
			</Flex>
		));
	}, [children, isDraggable]);

	// Show placeholder while measuring container width
	if (!mounted || !width) {
		return (
			<Box ref={containerRef} minH="600px" w="100%">
				{/* Placeholder for width measurement */}
			</Box>
		);
	}

	return (
		<Box
			ref={containerRef}
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
				breakpoints={GRID_BREAKPOINTS}
				cols={GRID_COLS}
				rowHeight={rowHeight}
				width={width}
				margin={margin}
				containerPadding={containerPadding}
				dragConfig={{
					enabled: isDraggable,
					handle: ".drag-handle",
					cancel: "select, button, input, a, [data-no-drag]",
				}}
				resizeConfig={{
					enabled: isResizable,
				}}
				onLayoutChange={onLayoutChange}
			>
				{gridItems}
			</ResponsiveGridLayout>
		</Box>
	);
};

export default DraggableGrid;
