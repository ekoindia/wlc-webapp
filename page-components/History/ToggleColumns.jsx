import { ToggleColumns as GenericToggleColumns } from "components";
import { useHistory } from "./HistoryContext";

/**
 * Component to toggle the visibility of columns in the Transaction History table.
 * This is a wrapper around the generic ToggleColumns component that connects
 * to the HistoryContext for state management.
 * @returns {JSX.Element} The rendered ToggleColumns component
 */
const ToggleColumns = () => {
	// Get context values from HistoryContext
	const {
		historyParameterMetadata,
		hiddenColumns,
		toggleColumnVisibility,
		resetColumnVisibility,
	} = useHistory();

	// Filter out all columns where visible_in_table is true & there is a label
	const columns = historyParameterMetadata?.filter(
		(column) => column.visible_in_table && column.label
	);

	return (
		<GenericToggleColumns
			columns={columns}
			hiddenColumns={hiddenColumns}
			onToggle={toggleColumnVisibility}
			onReset={resetColumnVisibility}
		/>
	);
};

export default ToggleColumns;
