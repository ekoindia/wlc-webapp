import { Flex, Text } from "@chakra-ui/react";
import {
	getHistoryTableProcessedData,
	HistoryCard,
	historyParametersMetadata,
	Table,
} from ".";

/**
 * A <HistoryTable> component
 * @param 	{object}	prop	Properties passed to the component
 * @example	`<HistoryTable></HistoryTable>` TODO: Fix example
 */
const HistoryTable = ({
	pageNumber,
	setPageNumber,
	tableRowLimit,
	transactionList,
	loading = false,
}) => {
	const processedData = getHistoryTableProcessedData(transactionList);

	if (!loading && processedData?.length < 1) {
		return (
			<Flex direction="column" align="center" gap="2" mt="8" mb="2">
				<Text color="light">Nothing Found</Text>
			</Flex>
		);
	}

	return (
		<Table
			renderer={historyParametersMetadata}
			data={processedData}
			isLoading={loading}
			pageNumber={pageNumber}
			setPageNumber={setPageNumber}
			visibleColumns={6}
			ResponsiveCard={HistoryCard}
			tableRowLimit={tableRowLimit}
		/>
	);
};

export default HistoryTable;
