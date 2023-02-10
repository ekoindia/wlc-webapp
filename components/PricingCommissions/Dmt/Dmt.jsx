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
import { Buttons } from "components/Buttons";
import { Icon } from "components/Icon";
import React from "react";

const Dmt = ({ className = "", ...props }) => {
	return (
		<Stack w={"100%"} gap={"10"} minH={"100%"}>
			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Select commissions for
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup w={"100%"}>
						<Stack
							direction="row"
							gap={{ base: "4px", sm: "20px", md: "60px" }}
							flexWrap={"wrap"}
						>
							<Radio
								size={{ base: "sm", md: "sm", "2xl": "lg" }}
								value="1"
							>
								Individuals
							</Radio>
							<Radio
								size={{ base: "sm", md: "sm", "2xl": "lg" }}
								value="2"
							>
								Distributors
							</Radio>
							<Radio
								size={{ base: "sm", md: "sm", "2xl": "lg" }}
								value="3"
							>
								Products
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
						w={{ base: "80vw", sm: "60vw", md: "50vw", lg: "25vw" }}
						h={{
							base: "10vw",
							sm: "8vw",
							md: "6vw",
							lg: "2.7vw",
							"2xl": "2.3vw",
						}}
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						focusBorderColor={"#D2D2D2"}
						_focus={{
							border: "1px solid #D2D2D2",
							boxShadow: "none",
						}}
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
						w={{ base: "80vw", sm: "60vw", md: "50vw", lg: "25vw" }}
						h={{
							base: "10vw",
							sm: "8vw",
							md: "6vw",
							lg: "2.7vw",
							"2xl": "2.3vw",
						}}
						fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
						focusBorderColor={"#D2D2D2"}
						_focus={{
							border: "1px solid #D2D2D2",
							boxShadow: "none",
						}}
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
						Select commissions for
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup w={"100%"}>
						<Stack
							direction="row"
							gap={{ base: "40px", sm: "60px" }}
							flexWrap={"wrap"}
						>
							<Radio
								size={{ base: "sm", md: "sm", "2xl": "lg" }}
								value="1"
							>
								Percentage (%)
							</Radio>
							<Radio
								size={{ base: "sm", md: "sm", "2xl": "lg" }}
								value="2"
							>
								Fixed
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
					minH={"9.15vw"}
					direction={{ base: "column", md: "row" }}
				>
					<Flex
						h={"100%"}
						direction={"column"}
						justifyContent={"space-between"}
						mr={"20px"}
					>
						<Flex
							w={{
								base: "80vw",
								sm: "60vw",
								md: "50vw",
								lg: "25vw",
							}}
							h={{
								base: "11vw",
								sm: "9vw",
								md: "6.5vw",
								lg: "2.7vw",
								"2xl": "2.3vw",
							}}
							border={"card"}
							borderRadius={{ base: "5px", md: "10px" }}
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
							/>
							<Icon
								name="rupee_bg"
								width="23px"
								h="20px"
								color={"#11299E"}
							/>
						</Flex>
						<Flex gap={{ base: "10", sm: "16" }} mt={"50px"}>
							<Buttons
								size={{
									base: "sm",
									sm: "md",
									md: "md",
									lg: "sm",
									"2xl": "lg",
								}}
								title={"Save Commissions"}
								py={{ base: "30px", md: "22px", "2xl": "30px" }}
								borderRadius={"8px"}
							/>
							<Buttons
								variant={"link"}
								color={"accent.DEFAULT"}
								size={{
									base: "md",
									sm: "md",
									md: "md",
									"2xl": "lg",
								}}
								title={"Cancel"}
								py={{ base: "30px", md: "22px", "2xl": "30px" }}
							/>
						</Flex>
					</Flex>
				</HStack>
			</VStack>
		</Stack>
	);
};

export default Dmt;

const PopupBox = () => {
	return (
		<Box
			position={"relative"}
			bg={"#FFFBF3"}
			border={"1px solid #FE9F00"}
			w={"sm"}
			h={"100%"}
			borderRadius={"10px"}
		>
			<Box w={"100%"} h={"15px"}>
				<Box
					width={"15px"}
					height={"15px"}
					borderBottom={"1px solid #FE9F00"}
					borderLeft={"1px solid #FE9F00"}
					borderRadius={"2px"}
					transform={"rotate(45deg)"}
					mt={"10px"}
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
						<Text fontSize={"12px"}>Benchmark Transaction</Text>
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
							<Flex direction={"column"} width={"50%"} h={"50%"}>
								<Text fontSize={"12px"} color="#0F0F0F">
									Fixed charges
								</Text>
								<Flex w={"100%"} gap={"5px"} align={"center"}>
									<Box width={"8px"} height={"9px"}>
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

							<Flex direction={"column"} width={"50%"} h={"50%"}>
								<Text fontSize={"12px"}>Taxes</Text>
								<Flex w={"100%"} gap={"5px"} align={"center"}>
									<Box width={"8px"} height={"9px"}>
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
							<Flex direction={"column"} width={"50%"} h={"50%"}>
								<Text fontSize={"12px"} color="#0F0F0F">
									Fixed charges
								</Text>
								<Flex w={"100%"} gap={"5px"} align={"center"}>
									<Box width={"8px"} height={"9px"}>
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

							<Flex direction={"column"} width={"50%"} h={"50%"}>
								<Text fontSize={"12px"}>Taxes</Text>
								<Flex w={"100%"} gap={"5px"} align={"center"}>
									<Box width={"8px"} height={"9px"}>
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
	);
};
