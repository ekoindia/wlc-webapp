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
	getArrowStyle,
	getLocationStyle,
	getModalStyle,
	getNameStyle,
	getStatusStyle,
} from "helpers";
import { useRouter } from "next/router";
import { AccountStatementCard } from "page-components/Admin/AccountStatement";
import { BusinessDashboardCard } from "page-components/Admin/Dashboard/BusinessDashboard";
import { OnboardingDashboardCard } from "page-components/Admin/Dashboard/OnboardingDashboard";
import { DetailedStatementCard } from "page-components/Admin/DetailedStatement";
import { NetworkCard } from "page-components/Admin/Network";
import { TransactionHistoryCard } from "page-components/Admin/TransactionHistory";
import { useEffect, useMemo, useState } from "react";
import { Cards, Icon, IconButtons, Pagination } from "..";

const Table = (props) => {
	const {
		pageLimit: PageSize = 10,
		data: tableData,
		renderer,
		variant,
		tableName,
		isScrollrequired = false,
		onRowClick,
	} = props;
	const router = useRouter();
	const [currentSort, setCurrentSort] = useState("default");
	const [isSmallerThan860] = useMediaQuery("(max-width: 860px)");
	const [currentPage, setCurrentPage] = useState(1);
	// const [tableData, setTableData] = useState([]);
	const [pageNumber, setPageNumber] = useState(null);
	/* API CALLING */
	// const transaction = apisHelper('transaction');
	console.log("tableDatatableDatatableDatatableDatatableData", tableData);
	// console.log(tableName, "tableNametableNametableNametableName");
	// console.log(transaction, "transaction");
	useEffect(() => {
		if (router.query.page && +router.query.page !== currentPage) {
			setCurrentPage(+router.query.page);
			console.log("Table : useEffect Page", router.query.page);
		}
	}, [router.query.page]);

	const currentTableData = useMemo(() => {
		const firstPageIndex = (currentPage - 1) * PageSize;
		const lastPageIndex = firstPageIndex + PageSize;
		return tableData.slice(firstPageIndex, lastPageIndex);
	}, [currentPage]);

	// const ekoCodes = tableData.map(item => item.eko_code);
	// console.log(ekoCodes);

	const getTh = () => {
		return renderer.map((item, index) => {
			if (item.sorting) {
				return (
					<Th
						key={index}
						p={{ md: ".5em", xl: "1em" }}
						fontSize={{ md: "10px", xl: "11px", "2xl": "16px" }}
					>
						<Flex gap={2}>
							{item.field}
							<Box as="span" onClick={onSortChange}>
								<Icon
									//name={sortIcon[currentSort]} // uncomment this to have interative sort
									name="sort"
									width="6px"
									height="13px"
								/>
							</Box>
						</Flex>
					</Th>
				);
			} else {
				return (
					<Th
						key={index}
						p={{ md: ".5em", xl: "1em" }}
						fontSize={{ md: "10px", xl: "12px", "2xl": "16px" }}
					>
						{item.field}
					</Th>
				);
			}
		});
	};
	const getTr = () => {
		return currentTableData.map((item, index) => {
			return (
				<Tr
					key={index}
					onClick={() => onRowClick(tableData[index])}
					fontSize={{ md: "10px", xl: "12px", "2xl": "16px" }}
				>
					{renderer.map((r, rIndex) => {
						return (
							<Td p={{ md: ".5em", xl: "1em" }} key={rIndex}>
								{prepareCol(
									item,
									r,
									index +
										currentPage * PageSize -
										(PageSize - 1)
								)}
							</Td>
						);
					})}
				</Tr>
			);
		});
	};

	const prepareCol = (item, column, index) => {
		switch (column?.show) {
			case "Tag":
				return getStatusStyle(item[column.name]);
			case "Modal":
				return getModalStyle();
			case "IconButton":
				return getLocationStyle(item[column.name]);
			case "Avatar":
				return getNameStyle(item[column.name]);
			case "Arrow":
				return getArrowStyle();
			default:
				if (column?.field === "Sr. No.") {
					return index;
				} else {
					return item[column.name];
				}
		}
	};

	/* For Responsive */
	const prepareCard = () => {
		return currentTableData.map((item, index) => {
			if (tableName === "Network") {
				return (
					<Cards
						key={index}
						w="100%"
						h="auto"
						p="16px"
						onClick={onRowClick}
					>
						<NetworkCard item={item} />
					</Cards>
				);
			} else if (tableName === "Transaction") {
				return (
					<Cards
						key={index}
						w="100%"
						h="auto"
						p="15px"
						onClick={onRowClick}
					>
						<TransactionHistoryCard item={item} />
					</Cards>
				);
			} else if (tableName === "Account") {
				return (
					<>
						<Box
							bg="white"
							key={index}
							width="100%"
							height="auto"
							p="20px 16px"
						>
							<AccountStatementCard item={item} />
						</Box>
						{index !== currentTableData.length - 1 && (
							<Divider border="1px solid #D2D2D2" />
						)}
					</>
				);
			} else if (tableName === "Detailed") {
				return (
					<>
						<Box
							bg="white"
							key={index}
							width="100%"
							height="auto"
							p="20px 16px"
						>
							<DetailedStatementCard item={item} />
						</Box>
						{index !== currentTableData.length - 1 && (
							<Divider border="1px solid #D2D2D2" />
						)}
					</>
				);
			} else if (tableName === "Business") {
				return (
					<>
						<Box
							bg="white"
							key={index}
							width="100%"
							height="auto"
							p="0px"
						>
							<BusinessDashboardCard item={item} />
						</Box>
						{index !== currentTableData.length - 1 && (
							<Divider border="1px solid #D2D2D2" />
						)}
					</>
				);
			} else if (tableName === "Onboarding") {
				return (
					<>
						<Box
							bg="white"
							key={index}
							width="100%"
							height="auto"
							p="0px"
						>
							<OnboardingDashboardCard item={item} />
						</Box>
						{index !== currentTableData.length - 1 && (
							<Divider border="1px solid #D2D2D2" />
						)}
					</>
				);
			}
		});
	};
	/* for sort icon & icon change */
	const sortIcon = {
		ascending: "caret-up",
		descending: "caret-down",
		default: "sort",
	};
	const onSortChange = () => {
		let nextSort;

		if (currentSort === "ascending") {
			nextSort = "descending";
		} else if (currentSort === "descending") {
			nextSort = "default";
		} else {
			nextSort = "ascending";
		}

		setCurrentSort(nextSort);
	};

	return (
		<>
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
								},
								"&::-webkit-scrollbar-track": {
									height: "0.8vw",
								},
								"&::-webkit-scrollbar-thumb": {
									background: "#D2D2D2",
									borderRadius: "5px",
								},

								"&::-webkit-scrollbar": {
									width: "7px",
								},
								"&::-webkit-scrollbar-track": {
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
									position="sticky"
									top="0"
									zIndex="sticky"
								>
									<Tr>{getTh()}</Tr>
								</Thead>
								<Tbody>{getTr()}</Tbody>
							</ChakraTable>
						</TableContainer>
						{/* Pagination */}
						<Flex justify={"flex-end"}>
							<Pagination
								className="pagination-bar"
								currentPage={currentPage}
								totalCount={tableData.length || 40}
								pageSize={PageSize}
								onPageChange={(page) => {
									console.log(page);
									router.query.page = page;
									console.log("Page", page);
									router.replace(router);
									setCurrentPage(page);
								}}
							/>
						</Flex>
					</>
				) : (
					<>
						<Flex
							direction="column"
							alignItems="center"
							borderRadius="10px 10px 0 0"
							mt="16px"
							boxShadow={
								tableName === "Account" ||
								tableName === "Detailed"
									? "0px 5px 15px #0000000D"
									: ""
							}
							border={
								tableName === "Account" ||
								tableName === "Detailed"
									? "1px solid #D2D2D2"
									: ""
							}
							gap={
								tableName === "Account" ||
								tableName === "Detailed"
									? 0
									: 4
							}
							bg={
								tableName === "Account" ||
								tableName === "Detailed"
									? "white"
									: ""
							}
						>
							{tableName === "Account" ||
							tableName === "Detailed" ? (
								<Text
									color="light"
									width="100%"
									p="16px 16px 0"
									fontWeight="semibold"
								>
									Recent Transaction
								</Text>
							) : (
								""
							)}
							{prepareCard()}
						</Flex>

						<Flex
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
										height: "24px",
										width: "24px",
									}}
								/>
							</Flex>
						</Flex>
					</>
				)}
			</Box>
		</>
	);
};

export default Table;
