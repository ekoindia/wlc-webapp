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

/**
 * A Table component
 * @param {object} props - Properties passed to the component
 * @param {Function} props.renderer - Function to render table cells
 * @param {Array} props.data - Data to be displayed in the table
 * @param {boolean} props.isLoading - Flag to indicate if data is loading
 * @param {number} [props.pageNumber] - Current page number
 * @param {Function} props.setPageNumber - Function to set the current page number
 * @param {number} props.visibleColumns - Number of columns visible in the table
 * @param {Function} props.ResponsiveCard - Component to render responsive cards for small screens
 * @param {string} [props.variant] - Table variant
 * @param {number} [props.tableRowLimit] - Number of rows per page
 * @param {boolean} [props.printExpansion] - Flag to print only the expanded card (when expanded), otherwise nothing
 * @example
 * ```jsx
 * <Table
 *   renderer={rendererFunction}
 *   data={dataArray}
 *   isLoading={false}
 *   pageNumber={1}
 *   setPageNumber={setPageNumberFunction}
 *   visibleColumns={6}
 *   ResponsiveCard={ResponsiveCardComponent}
 *   variant="stripedActionExpand"
 *   tableRowLimit={10}
 *   printExpansion={true}
 * />
 * ```
 */
const Table = ({
	renderer,
	data,
	isLoading,
	pageNumber = 1,
	setPageNumber = () => {},
	visibleColumns,
	ResponsiveCard,
	variant = "stripedActionExpand",
	tableRowLimit = trl?.DEFAULT,
	printExpansion = true,
}) => {
	const [, setHasNoMoreItems] = useState(false);
	const router = useRouter();
	const [isSmallScreen] = useMediaQuery("only screen and (max-width: 860px)");
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
				<TableContainer
					borderRadius="10px 10px 0 0"
					mt={{ base: "20px", "2xl": "10px" }}
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

			{!(tableDataSize < tableRowLimit && pageNumber === 1) && (
				<Pagination
					className="pagination-bar"
					currentPage={pageNumber}
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
