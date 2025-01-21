import { Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import {
	getAdditionalTransactionMetadata,
	getHistoryTableProcessedData,
	HistoryCard,
	historyParametersMetadata,
	networkHistoryParametersMetadata,
	Table,
} from ".";

/**
 * A <HistoryTable> component
 * @param 	{object}	prop	Properties passed to the component
 * @param prop.pageNumber
 * @param prop.setPageNumber
 * @param prop.tableRowLimit
 * @param prop.transactionList
 * @param prop.loading
 * @param prop.forNetwork
 */
const HistoryTable = ({
	pageNumber,
	setPageNumber,
	tableRowLimit,
	transactionList,
	loading = false,
	forNetwork = false,
}) => {
	const processedData = useMemo(
		() => getHistoryTableProcessedData(transactionList),
		[transactionList]
	);

	// How many columns to show in the table (for self or network history)
	const visibleColumns = forNetwork ? 7 : 6;

	const { trxn_data, history_parameter_metadata } = useMemo(
		() =>
			getAdditionalTransactionMetadata(
				processedData,
				forNetwork
					? networkHistoryParametersMetadata
					: historyParametersMetadata
			),
		[processedData]
	);

	if (!loading && processedData?.length < 1) {
		return (
			<Flex direction="column" align="center" gap="2" mt="8" mb="2">
				<Text color="light">Nothing Found</Text>
			</Flex>
		);
	}

	return (
		<Table
			renderer={history_parameter_metadata}
			data={trxn_data}
			isLoading={loading}
			pageNumber={pageNumber}
			setPageNumber={setPageNumber}
			visibleColumns={visibleColumns}
			ResponsiveCard={HistoryCard}
			tableRowLimit={tableRowLimit}
		/>
	);
};

export default HistoryTable;
