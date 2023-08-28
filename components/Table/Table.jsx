import {
	Table as ChakraTable,
	TableContainer,
	Tbody,
	Thead,
	Tr as ChakraTr,
	useMediaQuery,
} from "@chakra-ui/react";
import { tableRowLimit as trl } from "constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MobileView, Th, Tr } from ".";
import { Pagination } from "..";

/**
 * A Table component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @example	`<Table></Table>` TODO: Fix example
 */
const Table = ({
	renderer,
	data,
	isLoading,
	totalRecords,
	pageNumber = 1,
	setPageNumber = () => {},
	visibleColumns,
	tableName,
	onRowClick,
	ResponsiveCard,
	isReceipt = false,
	variant = "stripedActionNone",
	tableRowLimit = trl?.DEFAULT,
	printExpansion = false,
}) => {
	const [hasNoMoreItems, setHasNoMoreItems] = useState(false);
	console.log("hasNoMoreItems", hasNoMoreItems);
	const router = useRouter();
	const [isSmallScreen] = useMediaQuery("only screen and (max-width: 860px)");
	const rowExpansion =
		visibleColumns > 0 && renderer?.length > visibleColumns;
	// const isSmallScreen = useBreakpointValue({ base: true, lg: false });

	const tableDataListLength = data?.length;

	useEffect(() => {
		if (router.query.page && +router.query.page !== pageNumber) {
			setPageNumber(+router.query.page);
		}
	}, [router.query.page]);

	return (
		<div>
			{!isSmallScreen ? (
				// Large screen
				<TableContainer
					// className="customScrollbars"
					borderRadius="10px 10px 0 0"
					mt={{ base: "20px", "2xl": "10px" }} //TODO remove this
					border="1px solid var(--chakra-colors-divider)"
					css={{
						"&::-webkit-scrollbar": {
							height: "2px",
							width: "7px",
						},

						"&::-webkit-scrollbar-thumb": {
							background: "#555555",
							border: "1px solid #707070",
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
						<Thead>
							<ChakraTr
								sx={{
									"@media print": printExpansion
										? {
												display: "none !important",
										  }
										: null,
								}}
							>
								<Th
									{...{
										renderer,
										visibleColumns,
										rowExpansion,
									}}
								/>
							</ChakraTr>
						</Thead>
						<Tbody>
							<Tr
								{...{
									data,
									renderer,
									onRowClick,
									pageNumber,
									tableRowLimit,
									tableName,
									visibleColumns,
									isLoading,
									printExpansion,
									rowExpansion,
								}}
							/>
						</Tbody>
					</ChakraTable>
				</TableContainer>
			) : (
				// Small screen
				<MobileView
					{...{
						data,
						renderer,
						isLoading,
						ResponsiveCard,
						onRowClick,
						isReceipt,
					}}
				/>
			)}

			{/* Pagination */}
			{!(tableDataListLength < tableRowLimit && pageNumber === 1) && (
				<Pagination
					className="pagination-bar"
					currentPage={pageNumber}
					totalCount={totalRecords}
					pageSize={tableRowLimit}
					onPageChange={(page) => {
						router.query.page = page;
						router.replace(router);
						setPageNumber(page);
					}}
					isSmallScreen={isSmallScreen}
					tableDataListLength={tableDataListLength}
					tableRowLimit={tableRowLimit}
					setHasNoMoreItems={setHasNoMoreItems}
				/>
			)}
		</div>
	);
};

export default Table;
