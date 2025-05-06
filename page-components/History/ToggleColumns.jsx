import { Flex, FormControl, FormLabel, Switch, Text } from "@chakra-ui/react";
import { Button } from "components";
import { useHistory } from "./HistoryContext";

/**
 * Component to toggle the visibility of columns in the Transaction History table.
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

	console.log("ToggleColumns: ", historyParameterMetadata, columns);

	return (
		<Flex
			direction="column"
			align="flex-start"
			justify="center"
			gap="0.6em"
			p="4"
			w="100%"
		>
			<Text fontSize="md">Show or hide columns in the table:</Text>
			{columns?.map((column, index) => {
				const isHidden =
					column.name in hiddenColumns
						? hiddenColumns[column.name]
						: column.hide_by_default;

				return (
					<FormControl
						key={column.label + index}
						display="flex"
						alignItems="center"
						gap="0.8em"
					>
						<Switch
							isChecked={!isHidden}
							onChange={() =>
								toggleColumnVisibility(column.name, !isHidden)
							}
						/>
						<FormLabel mb="0">{column.label}</FormLabel>
					</FormControl>
				);
			})}
			<Button mt="4" colorScheme="blue" onClick={resetColumnVisibility}>
				Reset Columns
			</Button>
		</Flex>
	);
};

export default ToggleColumns;
