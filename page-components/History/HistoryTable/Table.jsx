import {
	Box,
	Table as ChakraTable,
	Tbody as ChakraTbody,
	Flex,
	TableContainer,
	Thead,
	useMediaQuery,
} from "@chakra-ui/react";
import { Pagination } from "components";
import { tableRowLimit as trl } from "constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tbody, Th } from ".";
import { useHistory } from "../HistoryContext";

/**
 * A Table component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param prop.renderer
 * @param prop.data
 * @param prop.isLoading
 * @param prop.pageNumber
 * @param prop.setPageNumber
 * @param prop.ResponsiveCard
 * @param prop.variant
 * @param prop.tableRowLimit
 * @param prop.printExpansion
 * @example	`<Table></Table>` TODO: Fix example
 */
const Table = ({
	renderer,
	data,
	isLoading,
	// totalRecords,
	pageNumber = 1,
	setPageNumber = () => {},
	// onRowClick,
	ResponsiveCard,
	variant = "stripedActionExpand",
	tableRowLimit = trl?.DEFAULT,
	printExpansion = true, // Print only the expanded card (when expanded), otherwise nothing
}) => {
	const [, setHasNoMoreItems] = useState(false);
	const router = useRouter();
	const [isSmallScreen] = useMediaQuery("only screen and (max-width: 860px)");

	// Get context values from HistoryContext
	const {
		mainColumns,
		extraColumns,
		visibleColumns,
		expandedRow,
		setExpandedRow,
		toggleExpand,
	} = useHistory();

	const tableDataSize = data?.length || 0;

	/**
	 * Set the page number from the page number in the URL query string
	 * and reset the expanded row
	 */
	useEffect(() => {
		if (router.query.page && +router.query.page !== pageNumber) {
			setPageNumber(+router.query.page);
		}
		setExpandedRow(null);
	}, [router.query.page]);

	/**
	 * Prepare the mobile cards for the table
	 * @returns {JSX.Element[]} - Array of mobile cards
	 */
	const prepareMobileCards = () => {
		return data?.map((item, index) => (
			<Box
				bg="white"
				width="100%"
				height="auto"
				p="16px"
				borderRadius="10px"
				// onClick={onRowClick}
				key={index}
				sx={{
					"@media print": {
						display:
							expandedRow === index ? null : "none !important",
						padding: "0px",
						borderRadius: 0,
					},
				}}
			>
				<ResponsiveCard
					item={item}
					renderer={renderer}
					expanded={expandedRow === index}
					toggleExpand={() => toggleExpand(index)}
					visibleColumns={visibleColumns}
				/>
			</Box>
		));
	};

	return (
		<Box w="100%">
			{!isSmallScreen ? (
				// Large screen
				<TableContainer
					borderRadius="10px 10px 0 0"
					mt={{ base: "20px", "2xl": "10px" }}
					border="1px solid #E9EDF1"
					css={{
						"&::-webkit-scrollbar": {
							height: "10px",
						},
						"&::-webkit-scrollbar-thumb": {
							background: "#757575",
							borderRadius: "99px",
						},
						"&::-webkit-scrollbar-thumb:hover": {
							background: "#888",
						},
						"&::-webkit-scrollbar-track": {
							background: "#e1e1e1",
						},
					}}
					sx={{
						"@media print": {
							borderRadius: 0,
							borderWidth: 0,
						},
					}}
				>
					<ChakraTable variant={variant} bg="white">
						<Thead
							sx={{
								"@media print": printExpansion
									? {
											display: "none !important",
										}
									: null,
							}}
						>
							<Th
								columns={mainColumns}
								isExpandable={extraColumns?.length}
							/>
						</Thead>
						<ChakraTbody>
							<Tbody
								{...{
									data,
									// onRowClick,
									pageNumber,
									tableRowLimit,
									mainColumns,
									extraColumns,
									isLoading,
									printExpansion,
									expandedRow,
									setExpandedRow,
								}}
							/>
						</ChakraTbody>
					</ChakraTable>
				</TableContainer>
			) : (
				// Small screen
				<Flex
					direction="column"
					align="center"
					borderRadius="10px 10px 0 0"
					mt="16px"
					gap={4}
				>
					{prepareMobileCards()}
				</Flex>
			)}

			{/* Pagination */}
			{tableDataSize < tableRowLimit && pageNumber === 1 ? null : (
				<Pagination
					className="pagination-bar"
					currentPage={pageNumber}
					// totalCount={totalRecords}
					pageSize={tableRowLimit}
					onPageChange={(page) => {
						router.query.page = page;
						router.replace(router);
						setPageNumber(page);
					}}
					isSmallScreen={isSmallScreen}
					tableDataSize={tableDataSize}
					tableRowLimit={tableRowLimit}
					setHasNoMoreItems={setHasNoMoreItems}
				/>
			)}
		</Box>
	);
};

export default Table;
