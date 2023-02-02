import { Box, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Buttons, Cards, Icon, SearchBar, Tags } from "../../..";
import { DetailedStatementTable } from "./DetailedStatementTable";

const DetailedStatement = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required
	const [isMobileScreen] = useMediaQuery("(max-width: 440px)");

	function onChangeHandler(e) {
		setSearchValue(e);
	}

	return (
		<>
			{!isMobileScreen && (
				<Box
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
						marginTop={{ base: "1rem", md: "1.5rem" }}
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
									as on 04/01/2023
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
										Saurabh Mullick
									</Text>
								</Flex>
								<Flex
									gap={{
										base: "20px",
										lg: "8px",
										"2xl": "15px",
									}}
									align={"center"}
									justifyContent={{
										base: "space-between",
										md: "init",
									}}
									w={{ base: "100%", sm: "initial" }}
								>
									<Flex
										direction={"column"}
										gap={{
											base: "0px",
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
											Account Number
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
											000300000517693
										</Text>
									</Flex>
									<Tags
										size={{
											base: "sm",
											md: "sm",
											lg: "sm",
											"2xl": "lg",
										}}
									/>
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
											md: "10px",
											lg: "12px",
											"2xl": "16px",
										}}
										color={"light"}
									>
										Bank Name
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
										ICICI Bank
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
											md: "10px",
											lg: "12px",
											"2xl": "16px",
										}}
										color={"light"}
									>
										Account Type
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
										Current ECP
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
											<Icon name="rupee" width="100%" />
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
											15,893.00
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					</Cards>
				</Box>
			)}

			<Box>
				<SearchBar
					onChangeHandler={onChangeHandler}
					value={searchValue}
				/>
			</Box>
			<Box>
				<DetailedStatementTable />
			</Box>
		</>
	);
};

export default DetailedStatement;
