import {
	Box,
	Divider,
	Flex,
	Table as ChakraTable,
	TableContainer,
	Tbody,
	Text,
	Thead,
	useMediaQuery,
} from "@chakra-ui/react";
import { tableRowLimit as trl } from "constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Th, Tr } from ".";
import { Pagination } from "..";

/**
 * A Table component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Table></Table>` TODO: Fix example
 */
const Table = ({
	renderer,
	data,
	totalRecords,
	pageNumber = 1,
	setPageNumber = () => {},
	visibleColumns,
	tableName,
	onRowClick,
	ResponsiveCard,
	defaultCardStyle = true,
	variant = "striped",
	tableRowLimit = trl?.DEFAULT,
}) => {
	const [hasNoMoreItems, setHasNoMoreItems] = useState(false);
	console.log("hasNoMoreItems", hasNoMoreItems);
	const router = useRouter();
	const [isSmallScreen] = useMediaQuery("(max-width: 860px)");
	// const isSmallScreen = useBreakpointValue({ base: true, lg: false });

	const tableDataListLength = data?.length;

	useEffect(() => {
		if (router.query.page && +router.query.page !== pageNumber) {
			setPageNumber(+router.query.page);
		}
	}, [router.query.page]);

	const prepareCard = () => {
		return data?.map((item, index) => (
			<Box
				bg="white"
				width="100%"
				height="auto"
				p={defaultCardStyle ? "16px" : "20px 16px"}
				borderRadius={defaultCardStyle ? "10px" : null}
				onClick={onRowClick}
				key={index}
			>
				<ResponsiveCard item={item} />
				{!defaultCardStyle && index !== data.length - 1 && (
					<Divider border="1px solid #D2D2D2" />
				)}
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
				>
					<ChakraTable variant={variant} bg="white">
						<Thead bg="hint">
							<Th {...{ renderer, visibleColumns }} />
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
								}}
							/>
						</Tbody>
					</ChakraTable>
				</TableContainer>
			) : (
				<Flex
					direction="column"
					align="center"
					borderRadius="10px 10px 0 0"
					mt="16px"
					boxShadow={
						!defaultCardStyle ? "0px 5px 15px #0000000D" : null
					}
					border={!defaultCardStyle ? "1px solid #D2D2D2" : null}
					bg={!defaultCardStyle ? "white" : null}
					gap={defaultCardStyle ? 4 : null}
				>
					{!defaultCardStyle ? (
						<Text
							color="light"
							width="100%"
							p="16px 16px 0"
							fontWeight="semibold"
						>
							Recent Transaction
						</Text>
					) : null}
					{prepareCard()}
				</Flex>
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
		</Box>
	);
};

export default Table;
