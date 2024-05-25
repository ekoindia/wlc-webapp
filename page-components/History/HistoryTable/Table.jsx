import {
	Box,
	Flex,
	Table as ChakraTable,
	TableContainer,
	Tbody as ChakraTbody,
	Thead,
	useMediaQuery,
} from "@chakra-ui/react";
import { Pagination } from "components";
import { tableRowLimit as trl } from "constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tbody, Th } from ".";

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
	// totalRecords,
	pageNumber = 1,
	setPageNumber = () => {},
	visibleColumns,
	// onRowClick,
	ResponsiveCard,
	variant = "stripedActionExpand",
	tableRowLimit = trl?.DEFAULT,
	printExpansion = true, // Print only the expanded card (when expanded), otherwise nothing
}) => {
	const [, setHasNoMoreItems] = useState(false);
	const router = useRouter();
	const [isSmallScreen] = useMediaQuery("only screen and (max-width: 860px)");
	// const isSmallScreen = useBreakpointValue({ base: true, lg: false });
	const [expandedRow, setExpandedRow] = useState(null);
	const toggleExpand = (index) => {
		setExpandedRow(index === expandedRow ? null : index);
	};

	const tableDataSize = data?.length;

	useEffect(() => {
		if (router.query.page && +router.query.page !== pageNumber) {
			setPageNumber(+router.query.page);
		}
		setExpandedRow(null);
	}, [router.query.page]);

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
					mt={{ base: "20px", "2xl": "10px" }} //TODO remove this
					border="1px solid #E9EDF1"
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
						<Thead
							sx={{
								"@media print": printExpansion
									? {
											display: "none !important",
										}
									: null,
							}}
						>
							<Th {...{ renderer, visibleColumns }} />
						</Thead>
						<ChakraTbody>
							<Tbody
								{...{
									data,
									renderer,
									// onRowClick,
									pageNumber,
									tableRowLimit,
									visibleColumns,
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
			{!(tableDataSize < tableRowLimit && pageNumber === 1) && (
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
