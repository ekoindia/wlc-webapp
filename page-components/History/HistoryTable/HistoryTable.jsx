import { Flex, Text } from "@chakra-ui/react";
import { HistoryCard, Table } from ".";
import { useHistory } from "../HistoryContext";

/**
 * A <HistoryTable> component
 * @param 	{object}	prop	Properties passed to the component
 * @param prop.pageNumber
 * @param prop.setPageNumber
 * @param prop.tableRowLimit
 * @param prop.transactionList
 * @param prop.loading
 */
const HistoryTable = ({
	pageNumber,
	setPageNumber,
	tableRowLimit,
	loading = false,
}) => {
	// Get context values from HistoryContext
	const { data, historyParameterMetadata } = useHistory();

	if (!loading && data?.length < 1) {
		return (
			<Flex direction="column" align="center" gap="2" mt="8" mb="2">
				<Text color="light">Nothing Found</Text>
			</Flex>
		);
	}

	return (
		<Table
			renderer={historyParameterMetadata}
			data={data}
			isLoading={loading}
			pageNumber={pageNumber}
			setPageNumber={setPageNumber}
			ResponsiveCard={HistoryCard}
			tableRowLimit={tableRowLimit}
		/>
	);
};

export default HistoryTable;
