import {
	Box,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
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
		<Stack w={"100%"} gap={"10.5"}>
			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "md", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Select commissions for
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup w={"100%"}>
						<Stack direction="row" gap={"60px"}>
							<Radio
								size={{ base: "sm", md: "md", "2xl": "lg" }}
								value="1"
							>
								Individuals
							</Radio>
							<Radio
								size={{ base: "sm", md: "md", "2xl": "lg" }}
								value="2"
							>
								Distributors
							</Radio>
							<Radio
								size={{ base: "sm", md: "md", "2xl": "lg" }}
								value="3"
							>
								Products
							</Radio>
						</Stack>
					</RadioGroup>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"11px"}>
				<Box w={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "md", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Select Distributors
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<Select placeholder="-- Select --" w={"25vw"} h={"2.4vw"}>
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
						<option value="option3">Option 3</option>
					</Select>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"11px"}>
				<Box w={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "md", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Select Slab
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<Select placeholder="-- Select --" w={"25vw"} h={"2.4vw"}>
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
						<option value="option3">Option 3</option>
					</Select>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "md", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Select commissions for
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup w={"100%"}>
						<Stack direction="row" gap={"60px"}>
							<Radio
								size={{ base: "sm", md: "md", "2xl": "lg" }}
								value="1"
							>
								Percentage (%)
							</Radio>
							<Radio
								size={{ base: "sm", md: "md", "2xl": "lg" }}
								value="2"
							>
								Fixed
							</Radio>
						</Stack>
					</RadioGroup>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"11px"}>
				<Box w={"100%"} h={"100%"}>
					<Text
						fontSize={{ base: "sm", md: "md", "2xl": "lg" }}
						fontWeight={"semibold"}
					>
						Define Commission
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"} h={"9.15vw"}>
					<Flex
						h={"100%"}
						direction={"column"}
						justifyContent={"space-between"}
						mr={"20px"}
					>
						{/* <InputGroup w={"25vw"} h={"2.5vw"}>
							<Input
								placeholder="Commission Percentage"
								defaultValue={"2.5"}
								type={"number"}
								w={"100%"}
								h={"100%"}
							/>
							<InputRightElement
								children={
									<Icon
										name="rupee_bg"
										width="23px"
										h="20px"
										color={"#11299E"}
									/>
								}
								h={"100%"}
								pr={"5"}
							/>
						</InputGroup> */}

						<Flex gap={"16"}>
							<Buttons size={"lg"} title={"Save Commissions"} />
							<Buttons
								variant={"link"}
								color={"accent.DEFAULT"}
								size={"lg"}
								title={"Cancel"}
							/>
						</Flex>
					</Flex>
					{/* <Box
						bg={"green"}
						w={"sm"}
						h={"100%"}
						borderRadius={"10px"}
					></Box> */}
				</HStack>
			</VStack>
		</Stack>
	);
};

export default Dmt;
