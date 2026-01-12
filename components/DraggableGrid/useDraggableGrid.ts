import { useCallback, useEffect, useState } from "react";
import { Layout, useContainerWidth } from "react-grid-layout";
import {
	GridLayouts,
	UseDraggableGridOptions,
	UseDraggableGridReturn,
} from "./types";

/**
 * Storage adapter interface for future API migration
 * Currently uses localStorage, but can be extended to support API persistence
 */
interface StorageAdapter {
	get: (_key: string) => GridLayouts | null;
	set: (_key: string, _layouts: GridLayouts) => void;
	remove: (_key: string) => void;
}

/**
 * Default localStorage adapter
 */
const localStorageAdapter: StorageAdapter = {
	get: (key: string) => {
		if (typeof window === "undefined") return null;
		try {
			const saved = localStorage.getItem(key);
			return saved ? JSON.parse(saved) : null;
		} catch (e) {
			console.error(`Failed to parse saved layout for key "${key}":`, e);
			return null;
		}
	},
	set: (key: string, layouts: GridLayouts) => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(key, JSON.stringify(layouts));
		} catch (e) {
			console.error(`Failed to save layout for key "${key}":`, e);
		}
	},
	remove: (key: string) => {
		if (typeof window === "undefined") return;
		localStorage.removeItem(key);
	},
};

/**
 * Custom hook for managing draggable grid state and persistence
 * @param {UseDraggableGridOptions} options - Configuration options
 * @param {string} options.storageKey - REQUIRED unique key for persisting layout
 * @param {GridLayouts} options.defaultLayouts - Default layout configuration for each breakpoint
 * @returns {UseDraggableGridReturn} Grid state and handlers
 * @example
 * ```tsx
 * const { layouts, handleLayoutChange, containerRef, width, mounted } = useDraggableGrid({
 *   storageKey: 'my-dashboard-grid',
 *   defaultLayouts: MY_DEFAULT_LAYOUTS,
 * });
 * ```
 */
export const useDraggableGrid = ({
	storageKey,
	defaultLayouts,
}: UseDraggableGridOptions): UseDraggableGridReturn => {
	const [layouts, setLayouts] = useState<GridLayouts>(defaultLayouts);
	const [isInitialized, setIsInitialized] = useState(false);

	// Use storage adapter (localStorage by default, can be swapped for API later)
	const storage = localStorageAdapter;

	// Container width measurement
	const { width, mounted, containerRef } = useContainerWidth({
		measureBeforeMount: true,
	});

	// Load saved layout from storage on mount
	useEffect(() => {
		const savedLayouts = storage.get(storageKey);
		if (savedLayouts) {
			setLayouts(savedLayouts);
		}
		setIsInitialized(true);
	}, [storageKey, storage]);

	// Handle layout changes and persist to storage
	const handleLayoutChange = useCallback(
		(
			_currentLayout: Layout,
			allLayouts: Partial<Record<string, Layout>>
		) => {
			const newLayouts = allLayouts as unknown as GridLayouts;
			setLayouts(newLayouts);

			// Only persist after initial load to avoid overwriting with defaults
			if (isInitialized) {
				storage.set(storageKey, newLayouts);
			}
		},
		[storageKey, isInitialized, storage]
	);

	// Reset layout to default configuration
	const resetLayout = useCallback(() => {
		storage.remove(storageKey);
		setLayouts(defaultLayouts);
	}, [storageKey, defaultLayouts, storage]);

	return {
		layouts,
		handleLayoutChange,
		resetLayout,
		containerRef,
		width,
		mounted,
	};
};

export default useDraggableGrid;
