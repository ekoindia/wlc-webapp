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
import { Endpoints } from "constants/EndPoints";
import {
	getArrowStyle,
	getLocationStyle,
	getModalStyle,
	getNameStyle,
	getStatusStyle,
	getAccordian,
} from "helpers";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import { AccountStatementCard } from "page-components/Admin/AccountStatement";
import { BusinessDashboardCard } from "page-components/Admin/Dashboard/BusinessDashboard";
import { OnboardingDashboardCard } from "page-components/Admin/Dashboard/OnboardingDashboard";
import { DetailedStatementCard } from "page-components/Admin/DetailedStatement";
import { NetworkCard } from "page-components/Admin/Network";
import { TransactionHistoryCard } from "page-components/Admin/TransactionHistory";
import { BusinessDashboardCard } from "page-components/Admin/Dashboard/BusinessDashboard";
import { OnboardingDashboardCard } from "page-components/Admin/Dashboard/OnboardingDashboard";
import { TransactionCard } from "page-components/NonAdmin/Transaction";
import { useEffect, useMemo, useState } from "react";
import { Cards, Icon, IconButtons, Pagination, Buttons } from "..";

const Table = (props) => {
	const {
		pageLimit: PageSize = 10,
		data: tableData,
		renderer,
		variant,
		tableName,
		isScrollrequired = false,
		accordian = false,
	} = props;
	const router = useRouter();
	const [currentSort, setCurrentSort] = useState("default");
	const [isSmallerThan860] = useMediaQuery("(max-width: 860px)");
	const [currentPage, setCurrentPage] = useState(1);
	// const [tableData, setTableData] = useState([]);
	const [pageNumber, setPageNumber] = useState(null);

	/* API CALLING */
	let data = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		headers: {
			"tf-req-uri-root-path": "/ekoicici/v1",
			"tf-req-uri":
				"/network/agents/transaction_history?initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_value=9911572989",
			"tf-req-method": "GET",
		},
	});

	// useEffect(() => {
	// 	setPageNumber(data?.data?.data?.page_number);
	// 	setTableData(data?.data?.data?.agent_details);
	// 	localStorage.setItem(
	// 		"network_data",
	// 		JSON.stringify(data?.data?.data?.agent_details)
	// 	);
	// }, [data]);

	console.log("data", data);

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

	const onRowClick = () => {
		switch (tableName) {
			case "Network":
				variant;
				router.push(`my-network/profile/`);
				break;
			case "Transaction":
				router.push(`transaction-history/account-statement/`);
				break;
		}
	};

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
				<>
					<Tr
						key={index}
						onClick={onRowClick}
						fontSize={{ md: "10px", xl: "12px", "2xl": "16px" }}
					>
						{renderer.map((r, rIndex) => {
							return (
								<Td
									onClick={() => handleRowClick(index)}
									p={{ md: ".5em", xl: "1em" }}
									key={rIndex}
								>
									{prepareCol(
										item,
										r,
										index,
										index +
											currentPage * PageSize -
											(PageSize - 1)
									)}
								</Td>
							);
						})}
					</Tr>

					{/* <============================= ExpandRow Data Item============================> */}

					{accordian && (
						<Tr>
							{expandedRow === index && (
								<Td colSpan={8} expandedRow={expandedRow}>
									<Flex justifyContent={"space-between"}>
										<Flex
											justifyContent={"space-evenly"}
											w="50%"
										>
											<Flex direction={"column"}>
												<Text
													fontSize={{
														lg: "10px",
														xl: "12px",
														"2xl": "14px",
													}}
													color="light"
												>
													Customer Charges{" "}
												</Text>
												<Text
													fontSize={{
														lg: "12px",
														xl: "14px",
														"2xl": "16px",
													}}
													fontWeight="semibold"
												>
													10
												</Text>
											</Flex>
											<Flex direction={"column"}>
												<Text
													fontSize={{
														lg: "10px",
														xl: "12px",
														"2xl": "14px",
													}}
													color="light"
												>
													Commission Earned
												</Text>
												<Text
													fontSize={{
														lg: "12px",
														xl: "14px",
														"2xl": "16px",
													}}
													fontWeight="semibold"
												>
													{" "}
													1.80{" "}
												</Text>
											</Flex>
											<Flex direction={"column"}>
												<Text
													fontSize={{
														lg: "10px",
														xl: "12px",
														"2xl": "14px",
													}}
													color="light"
												>
													Balance Amount{" "}
												</Text>
												<Text
													fontSize={{
														lg: "12px",
														xl: "14px",
														"2xl": "16px",
													}}
													fontWeight="semibold"
												>
													48,375.00{" "}
												</Text>
											</Flex>
										</Flex>
										<Flex>
											<Buttons
												w={{
													lg: "80%",
													xl: "90%",
													"2xl": "100%",
												}}
												h={{
													lg: "35px",
													xl: "40px",
													"2xl": "47px",
												}}
												onClick={setExpandedRow}
											>
												<Text
													fontSize={{
														lg: "10px",
														xl: "12",
														"2xl": "14px",
													}}
												>
													Repeat Transaction
												</Text>
											</Buttons>
										</Flex>
									</Flex>
								</Td>
							)}
						</Tr>
					)}
				</>
			);
		});
	};

	const prepareCol = (item, column, index, serialNo) => {
		switch (column?.show) {
			case "Tag":
				return getStatusStyle(item[column.name], tableName);
			case "Modal":
				return getModalStyle();
			case "Accordian":
				return (
					<Box
						bg="primary.DEFAULT"
						minH={{ base: "24px", xl: "24px", "2xl": "24px" }}
						minW={{ base: "24px", xl: "24px", "2xl": "24px" }}
						width={{ base: "24px", xl: "24px", "2xl": "24px" }}
						height={{ base: "24px", xl: "24px", "2xl": "324px0px" }}
						borderRadius="30px"
						display={"flex"}
						justifyContent={"center"}
						alignItems="center"
						cursor={"pointer"}
					>
						<Box alignItems={"center"}>
							<Icon
								name={expandedRow === index ? "remove" : "add"}
								width="15px"
								color="white"
							/>
						</Box>
					</Box>
				);

			case "IconButton":
				return getLocationStyle(item[column.name]);
			case "Avatar":
				return getNameStyle(item[column.name]);
			case "Arrow":
				return getArrowStyle();
			default:
				if (column?.field === "Sr. No.") {
					return serialNo;
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
			} else if (tableName === "Transactions") {
				return (
					<>
						<Box
							bg="white"
							key={index}
							width="100%"
							height="auto"
							p="0px"
							borderRadius=" 10px"
						>
							<TransactionCard item={item} />
						</Box>
						{/* {index !== currentTableData.length - 1 && (
							<Divider border="1px solid #D2D2D2" />
						)} */}
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
						<Flex justify={"flex-end"}>
							<Pagination
								className="pagination-bar"
								currentPage={currentPage}
								totalCount={tableData.length}
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
