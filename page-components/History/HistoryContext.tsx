import { useLocalStorage } from "hooks";
import {
	createContext,
	FC,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

interface HistoryContextType {
	mainColumns: any[]; // Columns to show in the table
	extraColumns: any[]; // Columns to show in the extra section after expanding  table row
	visibleColumns: number; // (Deprecated) Number of columns to show in the table
	expandedRow: number | null; // Index of the currently expanded row
	setExpandedRow: (_index: number | null) => void;
	toggleExpand: (_index: number) => void;
	isFiltered: boolean;
	setIsFiltered: (_value: boolean) => void;
	clearFilter: () => void;
	forNetwork: boolean; // If true, show network transaction history
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

interface HistoryProviderProps {
	children: ReactNode;
	initialVisibleColumns?: number;
	initialIsFiltered?: boolean;
	forNetwork?: boolean;
	onClearFilter?: () => void;
	historyParameterMetadata?: any[];
	data?: any[];
}

/**
 * Provider component for history-related state management.
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @param {number} [props.initialVisibleColumns] - Initial number of visible columns
 * @param {boolean} [props.initialIsFiltered] - Whether the table is currently filtered
 * @param {boolean} [props.forNetwork] - Whether this is for network history view
 * @param {Function} [props.onClearFilter] - External callback when filter is cleared
 * @param {Array} [props.historyParameterMetadata] - Metadata to compute table columns
 * @param {Array} [props.data] - Data to be displayed in the table
 */
export const HistoryProvider: FC<HistoryProviderProps> = ({
	children,
	initialVisibleColumns = 0,
	initialIsFiltered = false,
	forNetwork = false,
	onClearFilter,
	historyParameterMetadata,
	data,
}) => {
	const [mainColumns, setMainColumns] = useState([]);
	const [extraColumns, setExtraColumns] = useState([]);
	const [expandedRow, setExpandedRow] = useState<number | null>(null);
	const [isFiltered, setIsFiltered] = useState(initialIsFiltered);
	const [visibleColumns] = useState(initialVisibleColumns);
	const [processedData, setProcessedData] = useState([]); // Computed from data
	const [hiddenColumns, setHiddenColumns] = useLocalStorage(
		"infHistHidnCols",
		{}
	); // Track columns hidden by the user
	const [aggregatedData, setAggregatedData] = useState([]); // Column data with aggregate values over all the rows

	const toggleExpand = (index: number) => {
		setExpandedRow(index === expandedRow ? null : index);
	};

	const clearFilter = () => {
		if (onClearFilter) {
			onClearFilter();
		}
		setIsFiltered(false);
	};

	/**
	 * useEffect: Partition the historyParameterMetadata into mainColumns and extraColumns.
	 * This is based on the following properties and conditions:
	 * - `visible_in_table`: If true, the column is a main column (show as a table column). If false, it is an extra column (show in the expanded section).
	 * - `hide_by_default`: If true, the column is hidden by default (unless the user has toggled it).
	 * - the `name` property is not set as true in the hiddenColumns state (i.e., the user has not hidden it).
	 */
	useEffect(() => {
		if (historyParameterMetadata) {
			const mainCols: any[] = [];
			const extraCols: any[] = [];

			historyParameterMetadata.forEach((column) => {
				if (column.visible_in_table === true) {
					const isHidden =
						column.name in hiddenColumns
							? hiddenColumns[column.name]
							: column.hide_by_default;
					if (!isHidden) {
						mainCols.push(column);
					}
				} else {
					extraCols.push(column);
				}
			});

			setMainColumns(mainCols);
			setExtraColumns(extraCols);
		}
	}, [historyParameterMetadata, hiddenColumns]);

	/**
	 * useEffect: Calculate processedData with computed values (if the `compute` function is defined).
	 */
	useEffect(() => {
		let _processedData = [...data];

		// Get a list of all fields in mainColumns and extraColumns which has a computed value
		const computedFields = [...mainColumns, ...extraColumns].filter(
			(column) => column.compute && typeof column.compute === "function"
		);

		// Process data to add computed values
		if (computedFields.length > 0) {
			_processedData = _processedData.map((row, index) => {
				const newRow = { ...row };
				computedFields.forEach((column) => {
					let value = "";
					if (column.name) {
						value = row[column.name] || "";
					}
					value = column.compute(value, row, index);
					newRow[column.name] = value;
				});
				return newRow;
			});
		}

		// Set the processed data
		setProcessedData(_processedData);
	}, [data, mainColumns, extraColumns]);

	/**
	 * useEffect: Calculate Aggregated Data Row.
	 */
	useEffect(() => {
		if (!mainColumns) {
			return;
		}
		if (!processedData) {
			return;
		}

		const aggregaredCols = mainColumns.map((column) => {
			if (
				column.aggregate &&
				column.aggregate.type &&
				column.visible_in_table &&
				!hiddenColumns[column.name]
			) {
				return {
					...column,
					label: column.aggregate.label || column.aggregate.type,
					name: column.name,
					value: calculateAggregatedValues(
						column.name,
						column.aggregate.type,
						processedData
					),
				};
			}
			return { name: column.name, label: "", value: "" };
		});
		setAggregatedData(aggregaredCols);
	}, [mainColumns, hiddenColumns, processedData]);

	/**
	 * Toggle visibility of a main column in the History table.
	 * Note: It does not impact the visibility of fields in the extra expanded section.
	 * @param {string} name - The name of the column to toggle visibility for.
	 * @param {boolean} isHidden - Should the column be hidden?
	 */
	const toggleColumnVisibility = (name: string, isHidden: boolean) => {
		setHiddenColumns((prevHiddenColumns) => ({
			...prevHiddenColumns,
			[name]: isHidden,
		}));
	};

	/**
	 * Function to reset the columns visibility to default.
	 */
	const resetColumnVisibility = () => {
		setHiddenColumns({});
	};

	// Memoize the context value to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({
			data: processedData,
			historyParameterMetadata,
			mainColumns,
			extraColumns,
			aggregatedData,
			visibleColumns,
			expandedRow,
			hiddenColumns,
			toggleColumnVisibility,
			resetColumnVisibility,
			setExpandedRow,
			toggleExpand,
			isFiltered,
			setIsFiltered,
			clearFilter,
			forNetwork,
		}),
		[
			processedData,
			historyParameterMetadata,
			mainColumns,
			extraColumns,
			aggregatedData,
			hiddenColumns,
			toggleColumnVisibility,
			resetColumnVisibility,
			visibleColumns,
			expandedRow,
			isFiltered,
			forNetwork,
			onClearFilter,
		]
	);

	return (
		<HistoryContext.Provider value={contextValue}>
			{children}
		</HistoryContext.Provider>
	);
};

/**
 * Custom hook to access history context values
 * @returns {HistoryContextType} The history context values
 * @throws {Error} If used outside of a HistoryProvider
 */
export const useHistory = (): HistoryContextType => {
	const context = useContext(HistoryContext);
	if (context === undefined) {
		throw new Error("useHistory must be used within a HistoryProvider");
	}
	return context;
};

/**
 * Helper function to calculate aggregated value for a column
 * @param {string} field - The field name to aggregate
 * @param {string} aggregate - The aggregation type (sum, avg, min, max, first, last)
 * @param {Array} processedData - The data to aggregate
 * @returns {number|string} The aggregated value
 */
const calculateAggregatedValues = (field, aggregate, processedData) => {
	if (!processedData || processedData.length === 0) {
		return "";
	}

	let value = 0;
	switch (aggregate) {
		case "sum":
			value = processedData.reduce(
				(acc, row) => acc + (row[field] || 0),
				0
			);
			break;
		case "avg":
			value =
				processedData.reduce((acc, row) => acc + (row[field] || 0), 0) /
				processedData.length;
			break;
		case "min":
			value = Math.min(
				...processedData
					.map((row) => row[field])
					.filter(
						(row) => row !== null && row !== undefined && row !== ""
					)
			);
			break;
		case "max":
			value = Math.max(
				...processedData
					.map((row) => row[field])
					.filter(
						(row) => row !== null && row !== undefined && row !== ""
					)
			);
			break;
		case "first":
			value = processedData[0][field] || "";
			break;
		case "last":
			value = processedData[processedData.length - 1][field] || "";
			break;
	}

	return value;
};

export default HistoryContext;
