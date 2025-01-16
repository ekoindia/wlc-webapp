import { Flex, Text } from "@chakra-ui/react";
import {
	getAdditionalTransactionMetadata,
	getHistoryTableProcessedData,
	HistoryCard,
	historyParametersMetadata,
	Table,
} from ".";

interface HistoryTableProps {
	pageNumber: number;
	setPageNumber: (_pageNumber: number) => void;
	tableRowLimit: number;
	transactionList: any[];
	loading?: boolean;
}

/**
 * A <HistoryTable> component
 * @param 	{object}	prop	Properties passed to the component
 * @param prop.pageNumber
 * @param prop.setPageNumber
 * @param prop.tableRowLimit
 * @param prop.transactionList
 * @param prop.loading
 * @example	`<HistoryTable></HistoryTable>` TODO: Fix example
 */
const HistoryTable: React.FC<HistoryTableProps> = ({
	pageNumber,
	setPageNumber,
	tableRowLimit,
	transactionList,
	loading = false,
}) => {
	const processedData = getHistoryTableProcessedData(transactionList);

	const { trxn_data, history_parameter_metadata } =
		getAdditionalTransactionMetadata(
			processedData,
			historyParametersMetadata
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
			visibleColumns={6}
			ResponsiveCard={HistoryCard}
			tableRowLimit={tableRowLimit}
		/>
	);
};

export default HistoryTable;
