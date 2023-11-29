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
import { useEffect } from "react";
import { MobileView, Th, Tr } from ".";
import { Pagination } from "..";

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
		<div>
			{!isSmallScreen ? (
				// Large screen
				<TableContainer
					borderRadius="10px 10px 0 0"
					border="1px solid var(--chakra-colors-divider)"
					css={{
						"&::-webkit-scrollbar": {
							height: "10px",
						},

						"&::-webkit-scrollbar-thumb": {
							background: "#AAA",
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
