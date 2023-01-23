import React, { useEffect, useState } from "react";
import { Text, Box, Flex, Center, Spacer } from "@chakra-ui/react";
import { Cards, Tags, Buttons, Icon } from "../..";
import { useRouter } from "next/router";
/**
 * A <AccountStatement> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<AccountStatement></AccountStatement>`
 */
const AccountStatement = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	const router = useRouter();
	const handleClick = (e) => {
		router.push(
			"/admin/transaction-history/account-statement/detailed-statement"
		);
	};

	return (
		<>
			<Box display={"flex"} alignItems={"center"}>
				<Icon name="arrow-back" width="18px" height="15px" />
				<Text
					fontSize={"30px"}
					fontWeight={"semibold"}
					marginLeft={"1rem"}
				>
					Account Statement
				</Text>
			</Box>
			<Cards w="1610px" h="160px" marginTop={"1.5rem"}>
				<Flex flexDirection={"column"} gap="1rem">
					<Box display={"flex"} justifyContent={"space-between"}>
						<Text
							fontWeight={"semibold"}
							color={"light"}
							fontSize={"18px"}
						>
							Account information
						</Text>
						<Text color={"accent.DEFAULT"} fontSize={"16px"}>
							as on 04/01/2023
						</Text>
					</Box>
					<Box display={"flex"} justifyContent={"space-between"}>
						<Box>
							<Text fontSize={"14px"} color={"light"}>
								Account Holder
							</Text>
							<Text
								fontSize={"16px"}
								color={"dark"}
								fontWeight={"medium"}
							>
								Saurabh Mullick
							</Text>
						</Box>
						<Box display={"flex"}>
							<Box>
								<Text fontSize={"14px"} color={"light"}>
									Account Number
								</Text>
								<Text
									fontSize={"16px"}
									color={"dark"}
									fontWeight={"medium"}
								>
									000300000517693
								</Text>
							</Box>
							<Box
								marginLeft={"1rem"}
								display={"flex"}
								marginTop={".3rem"}
							>
								<Tags></Tags>
							</Box>
						</Box>
						<Box>
							<Text fontSize={"14px"} color={"light"}>
								Bank Name
							</Text>
							<Text
								fontSize={"16px"}
								color={"dark"}
								fontWeight={"medium"}
							>
								ICICI Bank
							</Text>
						</Box>
						<Box>
							<Text fontSize={"14px"} color={"light"}>
								Account Type
							</Text>
							<Text
								fontSize={"16px"}
								color={"dark"}
								fontWeight={"medium"}
							>
								Current ECP
							</Text>
						</Box>
						<Box>
							<Text fontSize={"14px"} color={"light"}>
								Current Balance
							</Text>
							<Box
								display={"flex"}
								alignItems={"center"}
								color={"accent.DEFAULT"}
							>
								<Icon
									name="rupee"
									width="12.25px"
									height="16.34px"
								/>
								<Text
									display={"flex"}
									alignItems={"center"}
									fontSize={20}
									color={"accent.DEFAULT"}
									marginLeft={".5rem"}
									fontWeight={"medium"}
								>
									15,893.00
								</Text>
							</Box>
						</Box>
						<Buttons
							onClick={handleClick}
							title={"View Detailed Statement"}
							w={"258px"}
							h={"60px"}
							fontSize={"16px"}
							fontWeight={"bold"}
						></Buttons>
					</Box>
				</Flex>
			</Cards>
		</>
	);
};

export default AccountStatement;
