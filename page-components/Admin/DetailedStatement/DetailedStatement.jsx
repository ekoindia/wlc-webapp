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
import useRequest from "hooks/useRequest";
import { formatDate } from "libs/dateFormat";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DetailedStatementTable } from ".";

/**
 * A DetailedStatement page-component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatement></DetailedStatement>`
 */
const DetailedStatement = () => {
	const [search, setSearch] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [dateText, setDateText] = useState({
		from: "",
		to: "DD/MM/YYYY",
	});

	const router = useRouter();
	const { cellnumber } = router.query;

	const handleApply = () => {
		if (dateText.to === "YYYY/MM/DD" && dateText.from === "YYYY/MM/DD") {
			console.log("No date selected");
		} else {
			mutate(
				process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
				headers
			);
		}
	};

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents/transaction_history/recent_transaction/account_statement?page_number=${pageNumber}&record_count=10&search_recent=${search}&search_value=${cellnumber}&transaction_date_from=${dateText.from}&transaction_date_to=${dateText.to}`,
		"tf-req-method": "GET",
	};

	const { data, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
	});

	useEffect(() => {
		mutate(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
			headers
		);
	}, [search, pageNumber]);

	const detailedStatementData = data?.data?.account_statement_details ?? [];
	const detailTable = data?.data ?? [];
	const agentName = detailTable?.agent_name ?? [];
	const currBalance = detailTable.saving_balance ?? [];
	const totalRecords = data?.data?.totalRecords;

	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() - 1);

	const oneYearAgoDate = new Date(currentDate);
	oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);

	const onDateChange = (e, type) => {
		if (type === "from") {
			if (!e.target.value)
				setDateText((prev) => {
					return {
						...prev,
						from: "DD/MM/YYYY",
					};
				});
			else
				setDateText((prev) => {
					return {
						...prev,
						from: e.target.value,
					};
				});
		} else {
			if (!e.target.value)
				setDateText((prev) => {
					return {
						...prev,
						to: "DD/MM/YYYY",
					};
				});
			else
				setDateText((prev) => {
					return {
						...prev,
						to: e.target.value,
					};
				});
		}
	};

	return (
		<>
			<Headings title="Detailed Statement" />
			<Flex direction="column" px={{ base: "20px", md: "0px" }}>
				<Flex
					w="100%"
					direction="column"
					bg="white"
					display={{ base: "none", md: "flex" }}
					p="30px"
					borderRadius="10px"
					mb="24px"
				>
					<Flex
						w="100%"
						justifyContent={"space-between"}
						direction={{ base: "column", md: "row" }}
					>
						<Text fontWeight="semibold" color="light" fontSize="xs">
							Account information
						</Text>
						<Text color="accent.DEFAULT" fontSize="sm">
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
								color="accent.DEFAULT"
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
						placeholder="Search by transaction ID or amount"
						value={search}
						setSearch={setSearch}
					/>

					<Flex
						direction={{ base: "column", md: "row" }}
						align={{ base: "flex-start", md: "center" }}
						mt={{ base: "24px", md: "0px" }}
					>
						<InputLabel
							htmlFor="calendar-flex"
							whiteSpace="nowrap"
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
									maxDate={formatDate(
										currentDate,
										"yyyy-MM-dd"
									)}
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
									onChange={(e) => onDateChange(e, "from")}
									value={dateText.from}
									required
								/>
								<Calenders
									minDate={formatDate(
										oneYearAgoDate,
										"yyyy-MM-dd"
									)}
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
									onChange={(e) => onDateChange(e, "to")}
									value={dateText.to}
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
