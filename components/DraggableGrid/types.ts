import { ReactNode, RefObject } from "react";
import { Layout } from "react-grid-layout";

/**
 * Individual grid item layout configuration
 */
export interface LayoutItem {
	/** Unique identifier for the grid item */
	i: string;
	/** X position in grid units */
	x: number;
	/** Y position in grid units */
	y: number;
	/** Width in grid units */
	w: number;
	/** Height in grid units */
	h: number;
	/** Minimum width in grid units */
	minW?: number;
	/** Minimum height in grid units */
	minH?: number;
	/** Maximum width in grid units */
	maxW?: number;
	/** Maximum height in grid units */
	maxH?: number;
	/** If true, item is not draggable */
	static?: boolean;
}

/**
 * Responsive layouts for all breakpoints
 * Aligned with react-grid-layout expectations
 */
export interface GridLayouts {
	/** Large screens: >= 1024px */
	lg: LayoutItem[];
	/** Medium screens: >= 768px */
	md: LayoutItem[];
	/** Small screens: fallback (0px+) */
	sm: LayoutItem[];
	/** Extra large screens (optional) */
	xl?: LayoutItem[];
	/** 2x large screens (optional) */
	"2xl"?: LayoutItem[];
	/** Index signature for dynamic access */
	[key: string]: LayoutItem[] | undefined;
}

/**
 * Options for useDraggableGrid hook
 */
export interface UseDraggableGridOptions {
	/**
	 * Unique storage key for persisting layout
	 * This is REQUIRED to prevent conflicts between different grids
	 */
	storageKey: string;
	/** Default layout configuration for each breakpoint */
	defaultLayouts: GridLayouts;
}

/**
 * Return type for useDraggableGrid hook
 */
export interface UseDraggableGridReturn {
	/** Current layouts for all breakpoints */
	layouts: GridLayouts;
	/** Handler for layout changes (saves to storage) */
	handleLayoutChange: (
		_currentLayout: Layout,
		_allLayouts: Partial<Record<string, Layout>>
	) => void;
	/** Handler for drag stop - syncs order across breakpoints with debounce */
	handleDragStop: (_layout: LayoutItem[]) => void;
	/** Reset layout to default configuration */
	resetLayout: () => void;
	/** Ref to attach to container element for width measurement */
	containerRef: RefObject<HTMLDivElement>;
	/** Measured container width in pixels */
	width: number;
	/** Whether the container has been mounted and measured */
	mounted: boolean;
}

/**
 * Props for DraggableGrid component
 */
export interface DraggableGridProps {
	/** Grid items keyed by their layout id */
	children: Record<string, ReactNode>;
	/** Current layouts from useDraggableGrid hook */
	layouts: GridLayouts;
	/** Container width from useDraggableGrid hook */
	width: number;
	/** Container ref from useDraggableGrid hook */
	containerRef: RefObject<HTMLDivElement>;
	/** Whether container is mounted from useDraggableGrid hook */
	mounted: boolean;
	/** Layout change handler from useDraggableGrid hook */
	onLayoutChange: (
		_currentLayout: Layout,
		_allLayouts: Partial<Record<string, Layout>>
	) => void;
	/** Drag stop handler for syncing order across breakpoints */
	onDragStop?: (_layout: LayoutItem[]) => void;
	/** Whether grid items are draggable */
	isDraggable?: boolean;
	/** Whether grid items are resizable */
	isResizable?: boolean;
	/** Height of each row in pixels */
	rowHeight?: number;
	/** Margin between items [x, y] in pixels */
	margin?: [number, number];
	/** Padding around container [x, y] in pixels */
	containerPadding?: [number, number];
}

/**
 * Props for DragHandle component
 */
export interface DragHandleProps {
	/** Content to render inside the drag handle */
	children: ReactNode;
	/** Whether dragging is enabled (affects cursor style) */
	isDraggable?: boolean;
}

/**
 * Default breakpoints aligned with themes.tsx
 * Values are the minimum width for each breakpoint
 * Note: sm is 0 to serve as fallback for all widths
 */
export const GRID_BREAKPOINTS = {
	lg: 1024,
	md: 768,
	sm: 0,
} as const;

/**
 * Default column configuration for each breakpoint
 */
export const GRID_COLS = {
	lg: 12,
	md: 12,
	sm: 12,
} as const;
