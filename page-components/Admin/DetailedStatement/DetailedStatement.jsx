import { Flex, Text } from "@chakra-ui/react";
import {
	Button,
	Calenders,
	Currency,
	DateView,
	Headings,
	InputLabel,
	SearchBar,
} from "components";
import { Endpoints } from "constants/EndPoints";
import useRequest from "hooks/useRequest";
import { formatDate } from "libs/dateFormat";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DetailedStatementTable } from ".";

const currentDate = new Date();
// currentDate.setDate(currentDate.getDate() - 1); //as of now currentDate is having yesterday's date

const oneYearAgoDate = new Date(currentDate);
oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1); // one year ago date from yesterday's date

/**
 * A DetailedStatement page-component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatement></DetailedStatement>`
 */
const DetailedStatement = () => {
	const [search, setSearch] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [minDate, setMinDate] = useState(
		formatDate(oneYearAgoDate, "yyyy-MM-dd")
	);
	const [maxDate, setMaxDate] = useState(
		formatDate(currentDate, "yyyy-MM-dd")
	);

	const router = useRouter();
	const { mobile } = router.query;

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents/transaction_history/recent_transaction/account_statement?page_number=${pageNumber}&record_count=10&search_recent=${search}&search_value=${mobile}&transaction_date_from=${fromDate}&transaction_date_to=${toDate}`,
		"tf-req-method": "GET",
	};

	const { data, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		headers: { ...headers },
	});

	useEffect(() => {
		mutate();
	}, [search, pageNumber]);

	useEffect(() => {
		if (fromDate) {
			setMinDate(fromDate);
		}
		if (toDate) {
			setMaxDate(toDate);
		}
	}, [fromDate, toDate]);

	const handleApply = () => {
		mutate();
	};

	const detailedStatementData = data?.data?.account_statement_details ?? [];
	const detailTable = data?.data ?? [];
	const agentName = detailTable?.agent_name ?? [];
	const currBalance = detailTable.saving_balance ?? [];
	const totalRecords = data?.data?.totalRecords;

	return (
		<>
			<Headings title="Detailed Statement" />
			<Flex direction="column" px={{ base: "20px", md: "0px" }} gap="4">
				<Flex
					display={{ base: "none", md: "flex" }}
					w="100%"
					direction="column"
					bg="white"
					p="30px"
					borderRadius="10px"
				>
					<Flex
						w="100%"
						justifyContent={"space-between"}
						direction={{ base: "column", md: "row" }}
					>
						<Text fontWeight="semibold" color="light" fontSize="xs">
							Account information
						</Text>
						<Text color="primary.DEFAULT" fontSize="sm">
							as on &thinsp;
							<span>
								<DateView date={currentDate} />
							</span>
						</Text>
					</Flex>

					<Flex w="100%" justifyContent="space-between">
						<Flex direction="column">
							<Text fontSize="xs" color="light">
								Account Holder
							</Text>
							<Text
								fontSize="sm"
								color="dark"
								fontWeight="medium"
							>
								{agentName}
							</Text>
						</Flex>

						<Flex direction="column">
							<Text fontSize="xs" color="light">
								Current Balance
							</Text>
							<Flex
								fontSize="sm"
								color="primary.DEFAULT"
								fontWeight="semibold"
							>
								<Currency amount={currBalance} />
							</Flex>
						</Flex>
					</Flex>
				</Flex>

				<Flex
					direction={{ base: "column", md: "row" }}
					justify="space-between"
					gap={{ base: "0", md: "2" }}
				>
					<SearchBar
						numbersOnly={true}
						minSearchLimit={2}
						maxSearchLimit={10}
						placeholder="Search by Transaction ID "
						value={search}
						setSearch={setSearch}
					/>

					<Flex
						direction={{ base: "column", md: "row" }}
						align={{ base: "flex-start", md: "center" }}
						mt={{ base: "24px", md: "0px" }}
						mb={{
							base: "24px",
							md: "0px",
						}}
					>
						<InputLabel
							htmlFor="calendar-flex"
							whiteSpace="nowrap"
							mb="0px"
							required
						>
							Filter by date:&thinsp;
						</InputLabel>
						<Flex
							w="100%"
							direction={{ base: "column", md: "row" }}
							gap={{ base: "6", md: "2" }}
						>
							<Flex
								id="calendar-flex"
								direction={{ base: "column", md: "row" }}
								gap={{ base: "4", md: "0" }}
							>
								<Calenders
									minDate={formatDate(
										oneYearAgoDate,
										"yyyy-MM-dd"
									)}
									maxDate={maxDate}
									w="100%"
									placeholder="From"
									inputContStyle={{
										w: {
											base: "100%",
											md: "190px",
											xl: "200px",
											"2xl": "274px",
										},
										borderRadius: {
											base: "10px",
											md: "10px 0px 0px 10px",
										},
										borderRight: {
											base: "flex",
											md: "none",
										},
										h: "48px",
									}}
									onChange={(event) =>
										setFromDate(event.target.value)
									}
									value={fromDate}
									required
								/>
								<Calenders
									minDate={minDate}
									maxDate={formatDate(
										currentDate,
										"yyyy-MM-dd"
									)}
									placeholder="To"
									w="100%"
									inputContStyle={{
										w: {
											base: "100%",
											md: "180px",
											xl: "200px",
											"2xl": "274px",
										},

										borderRadius: {
											base: "10px",
											md: "0px 10px 10px 0px",
										},
										h: "48px",
									}}
									onChange={(event) =>
										setToDate(event.target.value)
									}
									value={toDate}
									required
								/>
							</Flex>
							<Button
								w={{
									base: "100%",
									md: "130px",
								}}
								h="48px"
								onClick={handleApply}
							>
								Filter
							</Button>
						</Flex>
					</Flex>
				</Flex>
				<DetailedStatementTable
					detailedStatementData={detailedStatementData}
					setPageNumber={setPageNumber}
					pageNumber={pageNumber}
					totalRecords={totalRecords}
				/>
			</Flex>
		</>
	);
};

export default DetailedStatement;
