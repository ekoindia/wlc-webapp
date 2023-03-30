import { Box, Divider, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { Buttons, Cards, Icon, Tags } from "components";
import { apisHelper } from "helpers/apisHelper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AccountStatementTable } from ".";

/**
 * A <AccountStatement> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<AccountStatement></AccountStatement>`
 */

const AccountStatement = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required
	const [isMobileScreen] = useMediaQuery("(max-width: 767px)");
	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);
    const accountapi = apisHelper("accountStatement");
    const { data } = accountapi?.data ?? {};
    const acctabledata = data?.account_statement_details ?? [];
    const agentname = data?.agent_name ?? [];
    const saving_balance = data?.saving_balance ?? [];


	const router = useRouter();
    /*redirect to detiled statement*/
    const handleClick = (e) => {
		router.push(
			"/admin/transaction-history/account-statement/detailed-statement"
		);
	};
    /*getting mobile number as a quey param*/
    const dataquery = router.query;
    console.log('dataquery', dataquery)
    /*current date*/
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
	return (
		<>
			<Box
				px={{ base: "16px", md: "initial" }}
				marginTop={{ base: "26px", md: "0px" }}
			>
				<Box
					w={{ base: "100%", md: "100%" }}
					maxH={{
						base: "120vh",
						md: "20vw",
						lg: "12vw",
						"2xl": "10vw",
					}}
					margin={"auto"}
				>
					<Cards w={"100%"} h={"100%"}>
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
								gap={{ base: "8px", sm: "0px" }}
							>
								{!isMobileScreen && (
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
								)}
								
								<Flex direction={{ base: "column", md: "row" }}>
									<Flex
										direction={"column"}
										gap={{
											base: "5px",
											md: "0px",
											"2xl": "5px",
										}}
										pr={{ base: "", md: "20px" }}
									>
										<Text
											fontSize={{
												base: "14px",
												md: "9px",
												lg: "12px",
												"2xl": "16px",
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
											<Box
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
											>
												<Icon
													name="rupee"
													width="100%"
												/>
											</Box>
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
												{saving_balance}
											</Text>
										</Flex>
									</Flex>

									{isMobileScreen && (
										<Box my={"5vw"}>
											<Text
												as={"Button"}
												cursor={"pointer"}
												fontSize={"18px"}
												color={"primary.DEFAULT"}
												fontWeight={"bold"}
											>
												+ Show More
											</Text>
										</Box>
									)}
									<Buttons
										m={{ base: "auto", sm: "initial" }}
										onClick={handleClick}
										title={"View Detailed Statement"}
										w={{
											base: "100%",
											md: "15vw",
											lg: "12vw",
											"2xl": "12vw",
										}}
										h={{
											base: "54px",
											sm: "48px",
											md: "4.5vw",
											lg: "3.5vw",
											"2xl": "3vw",
										}}
										fontSize={{
											base: "14px",
											md: "8px",
											lg: "0.8vw",
											"2xl": "0.8vw",
										}}
										fontWeight={"bold"}
									></Buttons>
								</Flex>
							</Flex>
						</Flex>
					</Cards>
				</Box>
				<Box marginTop={{ base: "20px", lg: "0rem" }}>
					<AccountStatementTable acctabledata={acctabledata}/>
				</Box>
			</Box>
		</>
	);
};

export default AccountStatement;
