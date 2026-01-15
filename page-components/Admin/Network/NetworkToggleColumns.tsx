import { ToggleColumns as GenericToggleColumns } from "components";

/**
 * Column visibility toggle interface for network table columns
 */
interface NetworkToggleColumnsProps {
	columns: any[];
	hiddenColumns: Record<string, boolean>;
	onToggle: (_name: string, _isHidden: boolean) => void;
	onReset: () => void;
}

/**
 * Component to toggle the visibility of columns in the Network table.
 * This is a simple wrapper around the generic ToggleColumns component.
 * @param {NetworkToggleColumnsProps} props - Component props
 * @param {Array} props.columns - Array of column metadata
 * @param {Record<string, boolean>} props.hiddenColumns - Object mapping column names to hidden state
 * @param {Function} props.onToggle - Callback to toggle column visibility
 * @param {Function} props.onReset - Callback to reset column visibility
 * @returns {JSX.Element} The rendered ToggleColumns component
 */
const NetworkToggleColumns = ({
	columns,
	hiddenColumns,
	onToggle,
	onReset,
}: NetworkToggleColumnsProps) => {
	// Filter columns that can be toggled
	const toggleableColumns = columns?.filter(
		(column) => column.label && column.name
	);

	return (
		<GenericToggleColumns
			columns={toggleableColumns}
			hiddenColumns={hiddenColumns}
			onToggle={onToggle}
			onReset={onReset}
		/>
	);
};

export default NetworkToggleColumns;
