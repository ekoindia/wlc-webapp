import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Cards, Headings, Icon, SearchBar, Tags } from "../../..";
import { DetailedStatementTable } from "./DetailedStatementTable";

const DetailedStatement = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<>
			<Headings title={"Detailed Statement"} marginLeft={"1rem"} />
			<Cards w="1610px" h="160px" marginTop={"1.5rem"}>
				<Flex flexDirection={"column"} gap="1rem">
					<Box display={"flex"} justifyContent={"space-between"}>
						<Text
							fontWeight={"semibold"}
							color={"light"}
							fontSize={18}
						>
							Account information
						</Text>
						<Text color={"accent.DEFAULT"} fontSize={16}>
							as on 04/01/2023
						</Text>
					</Box>
					<Box display={"flex"} justifyContent={"space-between"}>
						<Box>
							<Text fontSize={14} color={"light"}>
								Account Holder
							</Text>
							<Text
								fontSize={16}
								color={"dark"}
								fontWeight={"medium"}
							>
								Saurabh Mullick
							</Text>
						</Box>
						<Box display={"flex"}>
							<Box>
								<Text fontSize={14} color={"light"}>
									Account Number
								</Text>
								<Text
									fontSize={16}
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
							<Text fontSize={14} color={"light"}>
								Bank Name
							</Text>
							<Text
								fontSize={16}
								color={"dark"}
								fontWeight={"medium"}
							>
								ICICI Bank
							</Text>
						</Box>
						<Box>
							<Text fontSize={14} color={"light"}>
								Account Type
							</Text>
							<Text
								fontSize={16}
								color={"dark"}
								fontWeight={"medium"}
							>
								Current ECP
							</Text>
						</Box>
						<Box>
							<Text fontSize={14} color={"light"}>
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
					</Box>
				</Flex>
			</Cards>
			<Box marginTop={"2.5rem"}>
				<SearchBar />
			</Box>
			<Box>
				<DetailedStatementTable />
			</Box>
		</>
	);
};

export default DetailedStatement;
