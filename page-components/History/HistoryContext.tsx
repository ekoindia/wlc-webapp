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

	const toggleExpand = (index: number) => {
		setExpandedRow(index === expandedRow ? null : index);
	};

	const clearFilter = () => {
		if (onClearFilter) {
			onClearFilter();
		}
		setIsFiltered(false);
	};

	// useEffect to update mainColumns and extraColumns based on historyParameterMetadata
	useEffect(() => {
		if (historyParameterMetadata) {
			const mainCols: any[] = [];
			const extraCols: any[] = [];

			historyParameterMetadata.forEach((column) => {
				if (column.visible_in_table === true) {
					if (column.hide_by_default !== true) {
						mainCols.push(column);
					}
				} else {
					extraCols.push(column);
				}
			});

			setMainColumns(mainCols);
			setExtraColumns(extraCols);
		}
	}, [historyParameterMetadata]); // rule: memoization

	// Memoize the context value to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({
			data,
			historyParameterMetadata,
			mainColumns,
			extraColumns,
			visibleColumns,
			expandedRow,
			setExpandedRow,
			toggleExpand,
			isFiltered,
			setIsFiltered,
			clearFilter,
			forNetwork,
		}),
		[
			mainColumns,
			extraColumns,
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

export default HistoryContext;
