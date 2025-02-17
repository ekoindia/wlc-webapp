# Feature: Transaction History


## 1. Self Transaction History

This feature allows all users (both admins and agents) to view their transaction history. It shows transaction history for a single user, who is accessing the page.

### How to Access?
In the left sidebar, expand "Others" menu-item and click on the `Transaction History` link.

On mobile devices, click on the "More" icon in the bottom navigation bar and then expand "Others" and click on the `Transaction History` link.

### Technical Details
- Page component: [page-components/History/History.jsx](page-components/History/History.jsx)
	- Data is fetched from server here and passed to the HistoryTable component.
- History Table metadata: [page-components/History/HistoryTable/historyParametersMetadata.js](page-components/History/HistoryTable/historyParametersMetadata.js)
	- To add a new data-point in the history table, add a new entry in the `historyParametersMetadata` array.
- History API response is parsed into the required format in [page-components/History/HistoryTable/processHistoryTableData.js](page-components/History/HistoryTable/processHistoryTableData.js)
- History Table component: [page-components/History/HistoryTable/HistoryTable.jsx](page-components/History/HistoryTable/HistoryTable.jsx)
- To control the number of columns shown in the history table, update the `visibleColumns` constant in [page-components/History/HistoryTable/HistoryTable.jsx](page-components/History/HistoryTable/HistoryTable.jsx).
	```javascript
	const visibleColumns = forNetwork ? 7 : 7;
	```

#### History Table Component Hierarchy:
	- Root path: [page-components/History/HistoryTable/](page-components/History/HistoryTable/)
	- Components:
		- [History](page-components/History/History.jsx) - Data is loaded here and passed to the HistoryTable component
			- [HistoryTable](page-components/History/HistoryTable/HistoryTable.jsx) - It renders `HistoryCard` on small screens and `Table` on large screens.
				- [HistoryCard](page-components/History/HistoryTable/HistoryCard.jsx) - for mobile view cards layout
				- [Table](page-components/History/HistoryTable/Table.jsx)
					- [Th](page-components/History/HistoryTable/Th.jsx)
					- [Tbody](page-components/History/HistoryTable/Tbody.jsx)

#### How are table rows and cells rendered?
- The `Tbody` component renders the rows of the table.
- It calls the `prepareTableCell()` function from [page-components/History/HistoryTable/historyUtils.js](page-components/History/HistoryTable/historyUtils.js) to render each cell in a row in the required format.
- The `prepareTableCell()` function uses helper functions for various formats from the [helpers/TableHelpers.jsx](helpers/TableHelpers.jsx) file.
- Each cell can render different types of data based on its type and the formatting rules defined in the helpers.

#### How is the card-view rendered on small-screens?
- The HistoryTable component accepts an optional ResponsiveCard component to render on small devices, instead of the Table component.
- The following component is used for this: [page-components/History/HistoryTable/HistoryCard.jsx](page-components/History/HistoryTable/HistoryCard.jsx)

#### How to show Computed data in the table?
- To show computed data in the table, add a new entry in the `historyParametersMetadata` array in [page-components/History/HistoryTable/historyParametersMetadata.js](page-components/History/HistoryTable/historyParametersMetadata.js).
- Add a `compute` function which should return the computed value based on the data passed to it.
- the `compute` function is called with the followign arguments:
	- `value` - the value of the current cell, if returned by the server
	- `item` - the entire row data object
	- `index` - the index of the current row in the history data array
- Eg:
	```javascript
	{
		name: "debit",
		label: "Debit",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
		compute: (value, row, _index) =>
			(row.amount > 0 ? row.amount : 0) +
				(row.fee > 0 ? row.fee : 0) +
				(row.tds > 0 ? row.tds : 0) +
				(row.eko_gst > 0 ? row.eko_gst : 0) || "",
	}
	```

## 2. Network Transactions (Statement) - Admin Only

This feature allows admins to view transaction history of all users in the network. It shows transaction history for all users in the network.

It uses the same HistoryTable component as the "Transaction History" feature, but with a different data source and metadata.

### How to Access?
In the left sidebar for Admins, click on the `Network Transactions` link.

On mobile devices, click on the "More" icon in the bottom navigation bar and then click on the `Network Transactions` link.

### Technical Details

- Page component: [page-components/NetworkHistory/NetworkHistory.jsx](page-components/NetworkHistory/NetworkHistory.jsx)
	- This is the same as component as "Transaction History", but passed the boolean prop `forNetwork` to show network transactions.
- History Table metadata: [page-components/History/HistoryTable/historyParametersMetadata.js](page-components/History/HistoryTable/historyParametersMetadata.js)
	- To add a new data-point in the history table, add a new entry in the `networkHistoryParametersMetadata` array.
- To control the number of columns shown in the history table, update the `visibleColumns` constant in [page-components/History/HistoryTable/HistoryTable.jsx](page-components/History/HistoryTable/HistoryTable.jsx).
	```javascript
	const visibleColumns = forNetwork ? 7 : 7;
	```
