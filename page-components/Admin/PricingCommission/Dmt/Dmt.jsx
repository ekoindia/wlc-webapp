import {
	Box,
	Flex,
	HStack,
	Input,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Buttons, Icon } from "components";
import React, { useRef } from "react";

/**
 * A <Dmt> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Dmt></Dmt>`
 */

const Dmt = ({ className = "", ...props }) => {
	const focusRef = useRef(null);

	const popBoxHandle = (boxStateFlag) => {
		if (boxStateFlag) {
			focusRef.current.style.opacity = "1";
		} else {
			focusRef.current.style.opacity = "0";
		}
	};

	return (
		<Stack w={"100%"} minH={"100%"} gap={"10"}>
			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{
							base: "sm",
							md: "sm",
							lg: "sm",
							xl: "sm",
							"2xl": "lg",
						}}
						fontWeight={"semibold"}
					>
						Select commissions for
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup w={"100%"}>
						<Stack
							direction="row"
							gap={{ base: "5px", sm: "20px", md: "60px" }}
							flexWrap={"wrap"}
						>
							<Radio
								size={{
									base: "sm",
									md: "sm",
									lg: "md",
									"2xl": "lg",
								}}
								value="1"
							>
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Individuals
								</Text>
							</Radio>

							<Radio
								size={{
									base: "sm",
									md: "sm",
									lg: "md",
									"2xl": "lg",
								}}
								value="2"
							>
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Distributors
								</Text>
							</Radio>
							<Radio
								size={{
									base: "sm",
									md: "sm",
									lg: "md",
									"2xl": "lg",
								}}
								value="3"
							>
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Products
								</Text>
							</Radio>
						</Stack>
					</RadioGroup>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Select Distributors
					</Text>
				</Box>
				<HStack
					justifyContent={{ base: "center", sm: "flex-start" }}
					w={"100%"}
				>
					<Select
						placeholder="-- Select --"
						w={{
							base: "100%",
							sm: "280px",
							md: "280px",
							lg: "300px",
							xl: "380px",
							"2xl": "500px",
						}}
						h={{
							base: "40px",
							sm: "35px",
							md: "35px",
							lg: "33px",
							xl: "38px",
							"2xl": "48px",
						}}
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						focusBorderColor={"#D2D2D2"}
						_focus={{
							border: "1px solid #D2D2D2",
							boxShadow: "none",
						}}
						icon={<Icon name="caret-down" />}
					>
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
						<option value="option3">Option 3</option>
					</Select>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Select Slab
					</Text>
				</Box>
				<HStack
					justifyContent={{ base: "center", sm: "flex-start" }}
					w={"100%"}
				>
					<Select
						placeholder="-- Select --"
						w={{
							base: "100%",
							sm: "280px",
							md: "280px",
							lg: "300px",
							xl: "380px",
							"2xl": "500px",
						}}
						h={{
							base: "40px",
							sm: "35px",
							md: "35px",
							lg: "33px",
							xl: "38px",
							"2xl": "48px",
						}}
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						focusBorderColor={"#D2D2D2"}
						_focus={{
							border: "1px solid #D2D2D2",
							boxShadow: "none",
						}}
						icon={<Icon name="caret-down" />}
					>
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
						<option value="option3">Option 3</option>
					</Select>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{
							base: "sm",
							md: "sm",
							lg: "sm",
							xl: "sm",
							"2xl": "lg",
						}}
						fontWeight={"semibold"}
					>
						Select Commission Type
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup w={"100%"}>
						<Stack
							direction="row"
							gap={{ base: "5px", sm: "20px", md: "60px" }}
							flexWrap={"wrap"}
						>
							<Radio
								size={{
									base: "sm",
									md: "sm",
									lg: "md",
									"2xl": "lg",
								}}
								value="1"
							>
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Percentage (%)
								</Text>
							</Radio>

							<Radio
								size={{
									base: "sm",
									md: "sm",
									lg: "md",
									"2xl": "lg",
								}}
								value="2"
							>
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Fixed
								</Text>
							</Radio>
						</Stack>
					</RadioGroup>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"} h={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Define Commission
					</Text>
				</Box>
				<HStack
					justifyContent={"flex-start"}
					w={"100%"}
					h={{ base: "150px", md: "183px" }}
					direction={{ base: "column", md: "row" }}
				>
					<Flex
						h={"100%"}
						direction={"column"}
						justifyContent={"space-between"}
						// w={"100%"}
						// bg={"red"}
						mr={"30px"}
					>
						<Flex
							w={{
								base: "100%",
								sm: "280px",
								md: "280px",
								lg: "300px",
								xl: "380px",
								"2xl": "500px",
							}}
							h={{
								base: "40px",
								sm: "35px",
								md: "35px",
								lg: "36px",
								xl: "37px",
								"2xl": "50px",
							}}
							border={"card"}
							borderRadius={{ base: "5px", xl: "8px" }}
							pr={"15px"}
						>
							<Input
								placeholder="Commission Percentage"
								defaultValue={"2.5"}
								type={"number"}
								w={"100%"}
								h={"100%"}
								border={"none"}
								min={"0"}
								focusBorderColor={"transparent"}
								fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
								onClick={() => {
									popBoxHandle(true);
								}}
								onBlur={() => {
									popBoxHandle(false);
								}}
							/>
							<Icon
								name="rupee_bg"
								width="23px"
								h="20px"
								color={"#11299E"}
							/>
						</Flex>
						<Flex
							gap={{ base: "5", sm: "0", xl: "5" }}
							align={"center"}
						>
							<Buttons
								w={{
									base: "100%",
									sm: "150px",
									md: "150px",
									lg: "130px",
									xl: "160px",
									"2xl": "249px",
								}}
								h={{
									base: "40px",
									sm: "40px",
									md: "40px",
									lg: "38px",
									xl: "45px",
									"2xl": "64px",
								}}
								fontSize={{
									base: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "lg",
								}}
								borderRadius={{ base: "5px", xl: "10px" }}
								title="Save Commissions"
								fontWeight={"bold"}
							/>
							<Buttons
								w={{
									base: "100%",
									sm: "150px",
									md: "150px",
									lg: "130px",
									xl: "160px",
									"2xl": "249px",
								}}
								h={{
									base: "40px",
									sm: "40px",
									md: "40px",
									lg: "38px",
									xl: "45px",
									"2xl": "64px",
								}}
								fontSize={{
									base: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "lg",
								}}
								borderRadius={{ base: "5px", xl: "10px" }}
								title="Cancel"
								variant={"link"}
								color={"accent.DEFAULT"}
								fontWeight={"bold"}
							/>
						</Flex>
					</Flex>

					<Box
						position={"relative"}
						bg={"#FFFBF3"}
						border={"1px solid #FE9F00"}
						w={"sm"}
						h={"100%"}
						borderRadius={"10px"}
						transition={"ease"}
						display={{ base: "none", md: "block" }}
						opacity={"0"}
						ref={focusRef}
					>
						<Box w={"100%"} h={"15px"}>
							<Box
								width={"15px"}
								height={"15px"}
								borderBottom={"1px solid #FE9F00"}
								borderLeft={"1px solid #FE9F00"}
								borderRadius={"2px"}
								transform={"rotate(45deg)"}
								mt={"15px"}
								ml={"-4px"}
								bg={"#FFFBF3"}
							></Box>

							<Box
								top={"0%"}
								bg={"#FFFBF3"}
								borderRadius={"10px"}
								left={"0%"}
								width={"100%"}
								h={"100%"}
								position={"absolute"}
								px={"11px"}
								py={"10px"}
							>
								<HStack
									justify={"space-between"}
									color={"white"}
									borderRadius={"6px"}
									h={"31px"}
									w={"100%"}
									bg={"primary.DEFAULT"}
									px={"15px"}
									py={"8px"}
								>
									<Text fontSize={"12px"}>
										Benchmark Transaction
									</Text>
									<Flex align={"center"} gap={"5px"}>
										<Box width="7px" height="9px">
											<Icon name="rupee" />
										</Box>
										<Text fontSize={"12px"}>5000.00</Text>
									</Flex>
								</HStack>
								<Flex
									w={"100%"}
									h={"calc( 100% - 31px)"}
									p={"7px"}
									py={"14px"}
									direction={"column"}
									gap={"25px"}
								>
									<Flex w={"100%"}>
										<Flex
											direction={"column"}
											width={"50%"}
											h={"50%"}
										>
											<Text
												fontSize={"12px"}
												color="#0F0F0F"
											>
												Fixed charges
											</Text>
											<Flex
												w={"100%"}
												gap={"5px"}
												align={"center"}
											>
												<Box
													width={"8px"}
													height={"9px"}
												>
													<Icon name="rupee" />
												</Box>
												<Text
													fontSize={"14px"}
													fontWeight={"semibold"}
												>
													1.80
												</Text>
											</Flex>
										</Flex>

										<Flex
											direction={"column"}
											width={"50%"}
											h={"50%"}
										>
											<Text fontSize={"12px"}>Taxes</Text>
											<Flex
												w={"100%"}
												gap={"5px"}
												align={"center"}
											>
												<Box
													width={"8px"}
													height={"9px"}
												>
													<Icon name="rupee" />
												</Box>
												<Text
													fontSize={"14px"}
													fontWeight={"semibold"}
												>
													0.80
												</Text>
											</Flex>
										</Flex>
									</Flex>
									<Flex w={"100%"}>
										<Flex
											direction={"column"}
											width={"50%"}
											h={"50%"}
										>
											<Text
												fontSize={"12px"}
												color="#0F0F0F"
											>
												Fixed charges
											</Text>
											<Flex
												w={"100%"}
												gap={"5px"}
												align={"center"}
											>
												<Box
													width={"8px"}
													height={"9px"}
												>
													<Icon name="rupee" />
												</Box>
												<Text
													fontSize={"14px"}
													fontWeight={"semibold"}
												>
													1.80
												</Text>
											</Flex>
										</Flex>

										<Flex
											direction={"column"}
											width={"50%"}
											h={"50%"}
										>
											<Text fontSize={"12px"}>Taxes</Text>
											<Flex
												w={"100%"}
												gap={"5px"}
												align={"center"}
											>
												<Box
													width={"8px"}
													height={"9px"}
												>
													<Icon name="rupee" />
												</Box>
												<Text
													fontSize={"14px"}
													fontWeight={"semibold"}
												>
													0.80
												</Text>
											</Flex>
										</Flex>
									</Flex>
								</Flex>
							</Box>
						</Box>
					</Box>
				</HStack>
			</VStack>
		</Stack>
	);
};

export default Dmt;
