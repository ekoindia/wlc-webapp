import {
	Box,
	Divider,
	Flex,
	Table as ChakraTable,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useMediaQuery,
} from "@chakra-ui/react";
import {
	getAccordianIcon,
	getAmountStyle,
	getArrowStyle,
	getDescriptionStyle,
	getLocationStyle,
	getModalStyle,
	getNameStyle,
	getStatusStyle,
} from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Icon, Pagination } from "..";

/**
 * A Table component that renders a table with a header and rows.
 */
const Table = ({
	pageLimit: PageSize = 10,
	data,
	totalRecords,
	pageNumber,
	setPageNumber,
	renderer,
	rendererExpandedRow,
	variant,
	tableName,
	isScrollrequired = false,
	accordian = false,
	onRowClick = () => {},
	isPaginationRequired = true,
	ResponsiveCard,
	defaultCardStyle = true,
}) => {
	const router = useRouter();
	const [isSmallerThan860] = useMediaQuery("(max-width: 860px)");

	const [expandedRow, setExpandedRow] = useState(null);
	const handleRowClick = (index) => {
		if (index === expandedRow) {
			// If the clicked row is already expanded, collapse it
			setExpandedRow(null);
		} else {
			// Otherwise, expand the clicked row
			setExpandedRow(index);
		}
	};

	useEffect(() => {
		if (router.query.page && +router.query.page !== pageNumber) {
			// setCurrentPage(+router.query.page);
			setPageNumber(+router.query.page);
			// console.log("router.query.page", router.query.page);
		}
	}, [router.query.page]);

	const getTh = () => {
		return renderer.map((item, index) => (
			<Th
				key={index}
				p={{ base: ".5em", xl: "1em" }}
				fontSize={{ base: "10px", xl: "11px", "2xl": "16px" }}
			>
				<Flex gap={2} align="center">
					{item.field}
					{item.sorting && <Icon name="sort" size="8px" />}
				</Flex>
			</Th>
		));
	};

	const getTr = () => {
		return data?.map((item, index) => (
			<>
				<Tr
					onClick={() => onRowClick(data[index])}
					fontSize={{ base: "10px", xl: "12px", "2xl": "16px" }}
					style={{
						backgroundColor:
							accordian &&
							(index % 2 === 0 ? "#F6F6F6" : "#F5F6FF"),
					}}
				>
					{renderer.map((r, rIndex) => (
						<Td
							onClick={() => handleRowClick(index)}
							p={{ base: ".5em", xl: "1em" }}
							key={rIndex}
						>
							{prepareCol(
								item,
								r,
								index,
								index + pageNumber * PageSize - (PageSize - 1)
							)}
						</Td>
					))}
				</Tr>
				{/* For Expanded Row */}
				{accordian && expandedRow === index && (
					<Tr
						style={{
							backgroundColor:
								accordian &&
								(index % 2 === 0 ? "#F6F6F6" : "#F5F6FF"),
						}}
					>
						<Td
							colSpan={renderer.length}
							pr="16px"
							pl={{
								base: "42px",
								xl: "60px",
								"2xl": "100px",
							}}
						>
							<Flex justify="space-between">
								<Flex
									w="88%"
									gap={{ base: "6", xl: "8", "2xl": "10" }}
									wrap="wrap"
									key={index}
									fontSize={{
										base: "10px",
										xl: "12px",
										"2xl": "16px",
									}}
								>
									{prepareExpandedRow(item)}
								</Flex>
								<Button
									w={{
										base: "120px",
										xl: "150px",
										"2xl": "170px",
									}}
									h={{
										base: "36px",
										xl: "42px",
										"2xl": "48px",
									}}
									fontSize={{
										base: "10px",
										xl: "12px",
										"2xl": "14px",
									}}
									disabled
								>
									Repeat Transaction
								</Button>
							</Flex>
						</Td>
					</Tr>
				)}
			</>
		));
	};

	const prepareCol = (item, column, index, serialNo) => {
		const account_status = item?.account_status;
		const eko_code = item?.profile?.eko_code ?? [];
		switch (column?.show) {
			case "Tag":
				return getStatusStyle(item[column.name], tableName);
			case "Modal":
				return getModalStyle(eko_code, account_status);
			case "Accordian":
				return getAccordianIcon(expandedRow, index);
			case "IconButton":
				return getLocationStyle(
					item[column.name],
					item?.address_details?.lattitude,
					item?.address_details?.longitude
				);
			case "Avatar":
				return getNameStyle(item[column.name]);
			case "Arrow":
				return getArrowStyle();
			case "Amount":
				return getAmountStyle(item[column.name], item.trx_type);
			case "Description":
				return getDescriptionStyle(item[column.name]);
			default:
				if (column?.field === "Sr. No.") {
					return serialNo;
				} else {
					return item[column.name];
					// return (
					// 	<Text whiteSpace="normal" overflowWrap="break-word">
					// 		{item[column.name]}
					// 	</Text>
					// );
				}
		}
	};

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

	/* For Expanded Colomn */
	const prepareExpandedRow = (row) => {
		return rendererExpandedRow?.map((item, index) => {
			return (
				row[item.name] /* prepareCol(row[item.name], item) */ && (
					<Flex key={index} direction="column">
						<Text textColor="light">{item.field}</Text>
						<Text fontWeight="bold">{row[item.name]}</Text>
					</Flex>
				)
			);
		});
	};

	return (
		<Box w="100%">
			{!isSmallerThan860 ? (
				<>
					<TableContainer
						borderRadius="10px 10px 0 0"
						mt={{ base: "20px", "2xl": "10px" }}
						border="1px solid #E9EDF1"
						maxH={isScrollrequired ? "1000px" : "auto"}
						overflowY={isScrollrequired ? "auto" : "initial"}
						css={{
							"&::-webkit-scrollbar": {
								height: "0.8vw",
								width: "7px",
							},
							"&::-webkit-scrollbar-track": {
								height: "0.8vw",
								width: "7px",
							},
							"&::-webkit-scrollbar-thumb": {
								background: "#555555",
								borderRadius: "5px",
								border: "1px solid #707070",
							},
						}}
					>
						<ChakraTable variant={variant} bg="white">
							<Thead
								bg="hint"
								position={isScrollrequired ? "sticky" : ""}
								top={isScrollrequired ? "0" : ""}
								zIndex={isScrollrequired ? "sticky" : ""}
							>
								<Tr>{getTh()}</Tr>
							</Thead>
							<Tbody>{getTr()}</Tbody>
						</ChakraTable>
					</TableContainer>
					{/* Pagination */}
					{isPaginationRequired && (
						<Flex justify="flex-end">
							<Pagination
								className="pagination-bar"
								currentPage={pageNumber}
								totalCount={totalRecords || 10}
								pageSize={PageSize}
								onPageChange={(page) => {
									router.query.page = page;
									router.replace(router);
									setPageNumber(page);
								}}
							/>
						</Flex>
					)}
				</>
			) : (
				<>
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

					{/* Show More */}
					{/* <Flex
						align="center"
						justifyContent="center"
						w="100%"
						h="94px"
					>
						<Flex
							align="center"
							justifyContent="center"
							w="220px"
							h="54px"
							border="1px solid #11299E"
							borderRadius="10px"
							opacity="1"
							cursor="pointer"
						>
							<IconButtons
								variant="accent"
								title="Show More"
								hasBG={false}
								iconPos="left"
								iconName="refresh"
								textStyle={{
									fontSize: "18px",
									fontWeight: "bold",
								}}
								iconStyle={{
									size: "24px",
								}}
							/>
						</Flex>
					</Flex> */}
				</>
			)}
		</Box>
	);
};

export default Table;
