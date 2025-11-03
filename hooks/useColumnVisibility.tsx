import { useLocalStorage } from "hooks";
import { useCallback, useMemo } from "react";

/**
 * Column metadata interface for visibility management
 */
export interface ColumnMetadata {
	name: string;
	label?: string;
	visible_in_table?: boolean;
	hide_by_default?: boolean;
	[key: string]: any; // Allow additional properties
}

/**
 * Configuration options for useColumnVisibility hook
 */
export interface UseColumnVisibilityOptions {
	/**
	 * Unique key for localStorage persistence
	 */
	storageKey: string;

	/**
	 * Array of column metadata objects
	 */
	columns?: ColumnMetadata[];
}

/**
 * Return type for useColumnVisibility hook
 */
export interface UseColumnVisibilityReturn {
	/**
	 * Object mapping column names to their hidden state
	 */
	hiddenColumns: Record<string, boolean>;

	/**
	 * Toggle visibility of a specific column
	 * @param _name - Column name to toggle
	 * @param _isHidden - Whether the column should be hidden
	 */
	toggleColumnVisibility: (_name: string, _isHidden: boolean) => void;

	/**
	 * Reset all columns to their default visibility state
	 */
	resetColumnVisibility: () => void;

	/**
	 * Get filtered array of visible columns
	 * @param _columns - Optional column array to filter (uses options.columns if not provided)
	 * @returns Array of visible columns
	 */
	getVisibleColumns: (_columns?: ColumnMetadata[]) => ColumnMetadata[];

	/**
	 * Check if a specific column is hidden
	 * @param _name - Column name to check
	 * @param _column - Optional column metadata for default value
	 * @returns True if column is hidden
	 */
	isColumnHidden: (_name: string, _column?: ColumnMetadata) => boolean;
}

/**
 * Generic hook for managing column visibility state across any table.
 * Features:
 * - LocalStorage persistence with unique key per table
 * - Toggle individual columns
 * - Reset to default state
 * - Filter visible columns
 * - Respect column metadata (visible_in_table, hide_by_default)
 * @param {UseColumnVisibilityOptions} options - Configuration options
 * @returns {UseColumnVisibilityReturn} Column visibility state and functions
 * @example
 * ```tsx
 * const { hiddenColumns, toggleColumnVisibility, getVisibleColumns } =
 *   useColumnVisibility({
 *     storageKey: "myTableHiddenCols",
 *     columns: myColumnMetadata
 *   });
 *
 * const visibleCols = getVisibleColumns();
 * ```
 */
export const useColumnVisibility = ({
	storageKey,
	columns = [],
}: UseColumnVisibilityOptions): UseColumnVisibilityReturn => {
	const [hiddenColumns, setHiddenColumns] = useLocalStorage<
		Record<string, boolean>
	>(storageKey, {});

	/**
	 * Toggle visibility of a column
	 */
	const toggleColumnVisibility = useCallback(
		(name: string, isHidden: boolean) => {
			setHiddenColumns((prevHiddenColumns) => ({
				...prevHiddenColumns,
				[name]: isHidden,
			}));
		},
		[setHiddenColumns]
	);

	/**
	 * Reset all columns to default visibility
	 */
	const resetColumnVisibility = useCallback(() => {
		setHiddenColumns({});
	}, [setHiddenColumns]);

	/**
	 * Check if a column is hidden
	 */
	const isColumnHidden = useCallback(
		(name: string, column?: ColumnMetadata): boolean => {
			if (name in hiddenColumns) {
				return hiddenColumns[name];
			}
			return column?.hide_by_default ?? false;
		},
		[hiddenColumns]
	);

	/**
	 * Get array of visible columns
	 */
	const getVisibleColumns = useCallback(
		(columnsToFilter?: ColumnMetadata[]): ColumnMetadata[] => {
			const targetColumns = columnsToFilter ?? columns;

			return targetColumns.filter((column) => {
				// If column doesn't have visible_in_table property, include it
				if (column.visible_in_table === undefined) {
					return !isColumnHidden(column.name, column);
				}

				// Only include columns marked as visible_in_table
				if (!column.visible_in_table) {
					return false;
				}

				// Check if column is hidden by user or by default
				return !isColumnHidden(column.name, column);
			});
		},
		[columns, isColumnHidden]
	);

	// Memoize the return object to prevent unnecessary re-renders
	const returnValue = useMemo(
		() => ({
			hiddenColumns,
			toggleColumnVisibility,
			resetColumnVisibility,
			getVisibleColumns,
			isColumnHidden,
		}),
		[
			hiddenColumns,
			toggleColumnVisibility,
			resetColumnVisibility,
			getVisibleColumns,
			isColumnHidden,
		]
	);

	return returnValue;
};
