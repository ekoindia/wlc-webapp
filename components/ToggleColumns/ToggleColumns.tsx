import { Flex, FormControl, FormLabel, Switch, Text } from "@chakra-ui/react";
import { Button } from "components";

/**
 * Column metadata interface for ToggleColumns component
 */
export interface ColumnMetadata {
	name: string;
	label?: string;
	visible_in_table?: boolean;
	hide_by_default?: boolean;
	[key: string]: any;
}

/**
 * Props for ToggleColumns component
 */
export interface ToggleColumnsProps {
	/**
	 * Array of column metadata objects to display toggle switches for
	 */
	columns: ColumnMetadata[];

	/**
	 * Object mapping column names to their hidden state
	 */
	hiddenColumns: Record<string, boolean>;

	/**
	 * Callback to toggle column visibility
	 * @param _name - Column name
	 * @param _isHidden - Whether the column should be hidden
	 */
	onToggle: (_name: string, _isHidden: boolean) => void;

	/**
	 * Callback to reset all columns to default visibility
	 */
	onReset: () => void;

	/**
	 * Optional title text to display above the column list
	 */
	title?: string;

	/**
	 * Optional button text for the reset button
	 */
	resetButtonText?: string;
}

/**
 * Generic reusable component for toggling column visibility in tables.
 * This component can be used with any table that needs column visibility controls.
 * It displays a list of switches for each toggleable column and a reset button.
 * Features:
 * - Displays switches for all columns with visible_in_table=true and a label
 * - Respects hide_by_default values from column metadata
 * - Provides a reset button to restore default visibility
 * - Fully controlled component - state managed by parent
 * @param {ToggleColumnsProps} props - Component props
 * @returns {JSX.Element} The rendered component
 * @example
 * ```tsx
 * const { hiddenColumns, toggleColumnVisibility, resetColumnVisibility } =
 *   useColumnVisibility({ storageKey: "myTableCols", columns });
 *
 * <ToggleColumns
 *   columns={columns.filter(c => c.visible_in_table && c.label)}
 *   hiddenColumns={hiddenColumns}
 *   onToggle={toggleColumnVisibility}
 *   onReset={resetColumnVisibility}
 * />
 * ```
 */
const ToggleColumns = ({
	columns,
	hiddenColumns,
	onToggle,
	onReset,
	title = "Show or hide columns in the table:",
	resetButtonText = "Reset Columns",
}: ToggleColumnsProps) => {
	return (
		<Flex
			direction="column"
			align="flex-start"
			justify="center"
			gap="0.6em"
			p="4"
			w="100%"
		>
			<Text fontSize="md">{title}</Text>
			{columns?.map((column, index) => {
				const isHidden =
					column.name in hiddenColumns
						? hiddenColumns[column.name]
						: (column.hide_by_default ?? false);

				return (
					<FormControl
						key={column.label + index}
						display="flex"
						alignItems="center"
						gap="0.8em"
					>
						<Switch
							isChecked={!isHidden}
							onChange={() => onToggle(column.name, !isHidden)}
						/>
						<FormLabel mb="0">{column.label}</FormLabel>
					</FormControl>
				);
			})}
			<Button mt="4" colorScheme="blue" onClick={onReset}>
				{resetButtonText}
			</Button>
		</Flex>
	);
};

export default ToggleColumns;
