import { Box, Flex, Text } from "@chakra-ui/react";
import {
	Button,
	Calenders,
	Cards,
	Headings,
	Icon,
	SearchBar,
} from "components";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DetailedStatementTable } from ".";

/**
 * A <DetailedStatement> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatement></DetailedStatement>`
 */

const DetailedStatement = () => {
	const router = useRouter();
	const { cellnumber } = router.query;
	const [search, setSearch] = useState("");
	const [dateText, setDateText] = useState({
		from: "",
		to: "DD/MM/YYYY",
	});
	console.log("dateText", dateText);

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
	/* API CALLING */

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents/transaction_history/recent_transaction/account_statement?initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_recent=${search}&search_value=${cellnumber}&transaction_date_from=${dateText.from}&transaction_date_to=${dateText.to}`,
		"tf-req-method": "GET",
	};

	const { data, error, isLoading, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
	});

	useEffect(() => {
		mutate(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
			headers
		);
	}, [search]);
	console.log("data", data);
	const detiledData = data?.data?.account_statement_details ?? [];
	const detailTable = data?.data ?? [];
	const agentname = detailTable?.agent_name ?? [];
	const currentbalance = detailTable.saving_balance ?? [];

	const current = new Date();
	const date = `${current.getDate()}/${
		current.getMonth() + 1
	}/${current.getFullYear()}`;
	/*calander */

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
			<Box
				px={{ base: "16px", md: "initial" }}
				marginTop={{ base: "26px", md: "0px" }}
			>
				<Box
					display={{ base: "none", md: "flex" }}
					w={{ base: "90%", md: "100%" }}
					maxH={{
						base: "120vh",
						md: "20vw",
						lg: "12vw",
						"2xl": "10vw",
					}}
					margin={"auto"}
				>
					<Cards
						// marginTop={{
						// 	base: "1rem",
						// 	md: "1.5rem",
						// 	"2xl": "0.8rem",
						// }}
						w={"100%"}
						h={"100%"}
					>
						<Flex
							flexDirection={"column"}
							justifyContent={"center"}
							h={"100%"}
							gap={{
								base: "10px",
								md: "6px",
								lg: "5px",
								"2xl": "15px",
							}}
							px={{ base: "3vw", md: "0" }}
						>
							<Flex
								justifyContent={"space-between"}
								direction={{ base: "column", md: "row" }}
							>
								<Text
									fontWeight={"semibold"}
									color={"light"}
									fontSize={{
										base: "16px",
										md: "11px",
										lg: "11px",
										"2xl": "18px",
									}}
								>
									Account information
								</Text>
								<Text
									color={"accent.DEFAULT"}
									fontSize={{
										base: "14px",
										md: "10px",
										lg: "9px",
										"2xl": "16px",
									}}
								>
									as on {date}
								</Text>
							</Flex>

							<Flex
								w={"100%"}
								align={{ base: "flex-start", md: "center" }}
								justifyContent={"space-between"}
								direction={{ base: "column", md: "row" }}
								gap={{ base: "15px", sm: "0px" }}
							>
								<Flex
									direction={"column"}
									gap={{
										base: "5px",
										md: "0px",
										"2xl": "5px",
									}}
								>
									<Text
										fontSize={{
											base: "14px",
											md: "10px",
											lg: "12px",
											"2xl": "16px",
										}}
										color={"light"}
									>
										Account Holder
									</Text>
									<Text
										fontSize={{
											base: "16px",
											md: "11px",
											lg: "13px",
											"2xl": "18px",
										}}
										color={"black"}
										fontWeight={"medium"}
									>
										{" "}
										{agentname}
									</Text>
								</Flex>

								<Flex
									direction={"column"}
									gap={{
										base: "5px",
										md: "0px",
										"2xl": "5px",
									}}
								>
									<Text
										fontSize={{
											base: "14px",
											md: "9px",
											lg: "12px",
											"2xl": "14px",
										}}
										color={"light"}
									>
										Current Balance
									</Text>
									<Flex
										align={"center"}
										color={"accent.DEFAULT"}
										gap={"5px"}
									>
										<Icon
											name="rupee"
											w={{
												base: "10px",
												md: "8px",
												lg: "9.5px",
												"2xl": "12px",
											}}
											h={{
												base: "12px",
												md: "10px",
												lg: "11px",
												"2xl": "15px",
											}}
										/>
										<Text
											fontSize={{
												base: "16px",
												md: "12px",
												lg: "14px",
												"2xl": "20px",
											}}
											color={"accent.DEFAULT"}
											fontWeight={"bold"}
										>
											{currentbalance}
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					</Cards>
				</Box>
				<Flex
					paddingTop={{ md: "24px" }}
					justifyContent={{ base: "", md: "space-between" }}
					direction={{ base: "column", md: "row" }}
				>
					<Flex>
						<SearchBar
							minSearchLimit={2}
							maxSearchLimit={10}
							placeholder="Search by transaction ID or amount"
							value={search}
							setSearch={setSearch}
							inputContProps={{
								h: { base: "3rem", md: "2.5rem", xl: "3rem" },
								width: {
									base: "100%",
									md: "200px",
									xl: "400px",
									"2xl": "600px",
								},
							}}
						/>
					</Flex>

					<Flex
						alignItems={{ base: "initial", md: "center" }}
						direction={{ base: "column", md: "row" }}
						gap={{ base: "20px", md: "0" }}
						mt={{ base: "30px", md: "0px" }}
					>
						<Box pr={{ md: "5px", xl: "10px" }}>
							<Text
								fontWeight={"semibold"}
								fontSize={{
									md: "10px",
									lg: "12px",
									xl: "16px",
								}}
							>
								Filter by date:
							</Text>
						</Box>
						<Flex>
							<Calenders
								// label="Filter by activation date range"
								minDate={"2016-01-20"}
								maxDate={"2020-01-20"}
								w="100%"
								placeholder="From"
								labelStyle={{
									fontSize: "lg",
									fontWeight: "semibold",
									mb: "1.2rem",
								}}
								inputContStyle={{
									w: "100%",
									h: "48px",
									borderRadius: {
										base: "10px",
										md: "10px 0px 0px 10px",
									},
									borderRight: {
										base: "flex",
										md: "none",
									},
								}}
								onChange={(e) => onDateChange(e, "from")}
								value={dateText.from}
							/>
						</Flex>
						<Flex>
							<Calenders
								// label="Filter by activation date range"
								minDate={"2016-01-20"}
								maxDate={"2020-01-20"}
								w="100%"
								placeholder="to"
								labelStyle={{
									fontSize: "lg",
									fontWeight: "semibold",
									mb: "1.2rem",
								}}
								inputContStyle={{
									w: "100%",
									h: "48px",
									borderRadius: {
										base: "10px",
										md: "10px 0px 0px 10px",
									},
									borderRight: {
										base: "flex",
										md: "none",
									},
								}}
								onChange={(e) => onDateChange(e, "to")}
								value={dateText.to}
							/>
						</Flex>
						<Flex pl={{ md: "5px", xl: "10px" }}>
							<Button
								h={{ base: "3rem", md: "2.5em", xl: "3rem" }}
								fontSize={{ base: "", lg: "15px", xl: "20px" }}
								fontWeight="bold"
								w={{
									base: "100%",
									sm: "10rem",
									md: "5rem",
									xl: "6.5rem",
									"2xl": "7.375rem",
								}}
								onClick={handleApply}
							>
								Apply
							</Button>
						</Flex>
					</Flex>
				</Flex>

				<Box>
					<DetailedStatementTable detiledData={detiledData} />
				</Box>
			</Box>
		</>
	);
};

export default DetailedStatement;
