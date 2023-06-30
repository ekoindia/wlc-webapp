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
