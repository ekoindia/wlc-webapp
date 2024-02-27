import {
	Table as ChakraTable,
	TableContainer,
	Tbody,
	Thead,
	useMediaQuery,
} from "@chakra-ui/react";
import { tableRowLimit as trl } from "constants";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { MobileView, Th, Tr } from ".";
import { Pagination, XScrollArrow } from "..";

/**
 * A Table component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @example	`<Table></Table>` TODO: Fix example
 */
const Table = ({
	data,
	renderer,
	isLoading,
	tableName,
	onRowClick,
	totalRecords,
	pageNumber = 1,
	visibleColumns,
	ResponsiveCard,
	isReceipt = false,
	printExpansion = false,
	setPageNumber = () => {},
	variant = "stripedActionNone",
	tableRowLimit = trl?.DEFAULT,
}) => {
	const router = useRouter();
	const [isSmallScreen] = useMediaQuery("only screen and (max-width: 860px)");
	const rowExpansion =
		visibleColumns > 0 && renderer?.length > visibleColumns;

	const tableDataSize = data?.length;

	const handlePageChange = (page) => {
		router.query.page = page;
		// router.replace(router);
		router.replace({
			pathname: router.pathname,
			query: router.query,
		});
	};

	useEffect(() => {
		if (
			router.query.page &&
			+router.query.page > 0 &&
			+router.query.page !== pageNumber
		) {
			setPageNumber(+router.query.page);
		}
	}, [router.query.page]);

	return (
		<div id="table-pagination-container">
			{!isSmallScreen ? (
				// Large screen
				<XScrollArrow>
					<TableContainer
						id="table-container"
						maxW="unset"
						borderRadius="10px 10px 0 0"
						border="1px solid var(--chakra-colors-divider)"
						sx={{
							"@media print": {
								borderRadius: 0,
								borderWidth: 0,
							},
						}}
					>
						<ChakraTable id="table" variant={variant} bg="white">
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
									{...{
										renderer,
										visibleColumns,
										rowExpansion,
									}}
								/>
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
				</XScrollArrow>
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
			{!(tableDataSize < tableRowLimit && pageNumber === 1) && (
				<Pagination
					className="pagination-bar"
					currentPage={pageNumber}
					totalCount={totalRecords}
					pageSize={tableRowLimit}
					onPageChange={(page) => {
						handlePageChange(page);
					}}
					isSmallScreen={isSmallScreen}
					tableDataSize={tableDataSize}
				/>
			)}
		</div>
	);
};

export default Table;
