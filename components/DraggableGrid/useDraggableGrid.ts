import { useLocalStorage } from "hooks";
import { useCallback, useMemo, useRef } from "react";
import { Layout, useContainerWidth } from "react-grid-layout";
import { debounce } from "utils";
import {
	GridLayouts,
	LayoutItem,
	UseDraggableGridOptions,
	UseDraggableGridReturn,
} from "./types";

/**
 * Syncs the vertical order of items across all breakpoints when a layout change is made.
 * This ensures that if you rearrange items at one breakpoint, the same relative order
 * is applied to other breakpoints.
 * @param {GridLayouts} allLayouts - All layout configurations for all breakpoints
 * @param {Layout} currentLayout - The layout that was just changed
 * @returns {GridLayouts} Updated layouts with synced ordering
 */
const syncOrderAcrossBreakpoints = (
	allLayouts: GridLayouts,
	currentLayout: LayoutItem[]
): GridLayouts => {
	if (!Array.isArray(currentLayout) || currentLayout.length === 0) {
		return allLayouts;
	}

	// Create order map from current layout (sorted by y, then x)
	const sortedItems = [...currentLayout].sort((a, b) => {
		if (a.y !== b.y) return a.y - b.y;
		return a.x - b.x;
	});

	// Create an order index for each item id
	const orderMap: Record<string, number> = {};
	sortedItems.forEach((item, index) => {
		orderMap[item.i] = index;
	});

	// Apply this order to all other breakpoints
	const syncedLayouts: GridLayouts = { ...allLayouts };
	const breakpoints = Object.keys(allLayouts) as Array<keyof GridLayouts>;

	for (const bp of breakpoints) {
		const layout = allLayouts[bp];
		if (!layout || !Array.isArray(layout)) continue;

		// Sort the items in this breakpoint by the order from the current layout
		const sortedLayout = [...layout].sort((a, b) => {
			const orderA = orderMap[a.i] ?? Infinity;
			const orderB = orderMap[b.i] ?? Infinity;
			return orderA - orderB;
		});

		// Recalculate Y positions for stacked layout (single column)
		let currentY = 0;
		const updatedLayout = sortedLayout.map((item) => {
			const newItem = { ...item, y: currentY };
			currentY += item.h;
			return newItem;
		});

		syncedLayouts[bp] = updatedLayout;
	}

	return syncedLayouts;
};

/** Debounce delay for syncing order across breakpoints (ms) */
const SYNC_DEBOUNCE_DELAY = 300;

/**
 * Custom hook for managing draggable grid state and persistence
 * Uses useLocalStorage for automatic persistence to localStorage
 * @param {UseDraggableGridOptions} options - Configuration options
 * @param {string} options.storageKey - REQUIRED unique key for persisting layout
 * @param {GridLayouts} options.defaultLayouts - Default layout configuration for each breakpoint
 * @returns {UseDraggableGridReturn} Grid state and handlers
 * @example
 * ```tsx
 * const { layouts, handleLayoutChange, handleDragStop, containerRef, width, mounted } = useDraggableGrid({
 *   storageKey: 'my-dashboard-grid',
 *   defaultLayouts: MY_DEFAULT_LAYOUTS,
 * });
 * ```
 */
export const useDraggableGrid = ({
	storageKey,
	defaultLayouts,
}: UseDraggableGridOptions): UseDraggableGridReturn => {
	// Use the shared useLocalStorage hook for automatic persistence
	const [layouts, setLayouts] = useLocalStorage<GridLayouts>(
		storageKey,
		defaultLayouts
	);

	// Keep a ref to the latest layouts for debounced sync
	const layoutsRef = useRef(layouts);
	layoutsRef.current = layouts;

	// Container width measurement
	const { width, mounted, containerRef } = useContainerWidth({
		measureBeforeMount: true,
	});

	// Handle layout changes - just save, no sync across breakpoints
	// This fires on every layout change including breakpoint transitions
	const handleLayoutChange = useCallback(
		(
			_currentLayout: Layout,
			allLayouts: Partial<Record<string, Layout>>
		) => {
			const newLayouts = allLayouts as unknown as GridLayouts;
			setLayouts(newLayouts);
		},
		[]
	);

	// Debounced sync function - only called on drag stop
	const debouncedSync = useMemo(() => {
		const result = debounce((currentLayout: LayoutItem[]) => {
			const syncedLayouts = syncOrderAcrossBreakpoints(
				layoutsRef.current,
				currentLayout
			);
			setLayouts(syncedLayouts);
		}, SYNC_DEBOUNCE_DELAY) as unknown as {
			debouncedFunc: (..._args: LayoutItem[][]) => void;
			cancel: () => void;
		};

		// Return both function and cleanup
		return { sync: result.debouncedFunc, cancel: result.cancel };
	}, []);

	// Handle drag stop - sync order across breakpoints with debounce
	// This only fires when user finishes dragging
	const handleDragStop = useCallback(
		(layout: LayoutItem[]) => {
			debouncedSync.sync(layout);
		},
		[debouncedSync]
	);

	// Reset layout to default configuration
	const resetLayout = useCallback(() => {
		debouncedSync.cancel();
		setLayouts(defaultLayouts);
	}, [defaultLayouts, debouncedSync]);

	return {
		layouts,
		handleLayoutChange,
		handleDragStop,
		resetLayout,
		containerRef,
		width,
		mounted,
	};
};

export default useDraggableGrid;
