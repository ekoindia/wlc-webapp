import React, { useEffect, useState, useRef } from "react";
import {
	SimpleGrid,
	Box,
	Text,
	Heading,
	Divider,
	Avatar,
	Circle,
	Flex,
	Center,
	Inputs,
	Radio,
	RadioGroup,
	Stack,
	Select,
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	HStack,
	useMediaQuery,
	VStack,
} from "@chakra-ui/react";
import { Buttons, Input, Icon, IconButtons } from "../../";
/**
 * A <UpdatePersonalInfo> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdatePersonalInfo></UpdatePersonalInfo>`
 */
const UpdatePersonalInfo = ({ className = "", ...props }) => {
	const [value, setValue] = useState();
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");
	const EnterRef = useRef();
	const [values, setValues] = React.useState("1");
	// const [isSmallerThan500] = useMediaQuery("(max-width: 1400px)");
	const [isTablet] = useMediaQuery("(max-width: 820px)");

	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Flex
			direction={"column"}
			// height="67.5rem"
			w="full"
			h="auto"
			bg={{ base: "#F5F6F8", "2xl": "white" }}
			// width="100.625rem"
		>
			<Box>
				<Box
					bg={{ base: "#FFFFFF", "2xl": "white" }}
					w={{ base: "95vw", "2xl": "60vw" }}
					m={{ base: "5px", "2xl": "1.875em" }}
					alignItems={{ base: "center", "2xl": "none" }}
				>
					<Flex direction={"column"}>
						<Heading
							// fontSize={"1.5em"}
							fontSize={{ base: "1.2em", "2xl": "1.5em" }}
							color={"#11299E"}
							font={"normal normal bold 24px/18px Inter"}
							mt={"24px"}
							fontWeight="semibold"
							m={{ base: "10px", "2xl": "none" }}
						>
							Angel Tech Private Limited
						</Heading>
						<Text
							fontSize={{ base: "0.9em", "2xl": "1em" }}
							mt={"0.4rem"}
							m={{ base: "10px", "2xl": "none" }}
							color="#0F0F0F"
						>
							Edit the fields below and click Preview. Click
							Cancel to return to Client HomePage without
							submitting information.
						</Text>
					</Flex>
				</Box>
				<Divider mt={"1rem"} />
				<Box
					bg="#FFFFFF"
					w={{ base: "85vw", lg: "70vw", "2xl": "51vw" }}
					h="full"
					ml={{ base: "20px", md: "50px", "2xl": "1.875em" }}
					borderRadius="10px"
					boxShadow={{
						base: "0px 5px 15px #0000000D",
						"2xl": "none",
					}}
					border={{ base: " 1px solid #D2D2D2", "2xl": "none" }}
				>
					<VStack>
						<HStack
							justifyContent={"space-between"}
							mt={"2.5vw"}
							w={"90%"}
						>
							<Text
								fontSize={{ base: "md", "2xl": "xl" }}
								font={"normal normal medium 20px/18px Inter"}
							>
								Merchant information
							</Text>
							<Text color="#FF4081">* Mandatory</Text>
						</HStack>
						{!isTablet && (
							<Flex
								w={{ base: "90vw", lg: "70vw", "2xl": "51vw" }}
								h={"9.375em"}
								bg="#F5F6F8"
								alignItems={"center"}
								direction={{ base: "column", md: "row" }}
								borderRadius="10px"
							>
								<Circle bg="divider" size={28} m={"20px"}>
									<Avatar
										w="90"
										h="90"
										src="/images/seller_logo.jpg"
									/>
								</Circle>
								<Text
									color="#555555"
									pl={{
										base: "10px",
										md: "20px",
										"2xl": "30px",
									}}
									fontSize={"md"}
								>
									Drag and drop new image or click browse to
									change your photograph
								</Text>
								<Box
									pl={{
										base: "10px",
										md: "20px",
										"2xl": "8.75vw",
									}}
								>
									<Buttons
										w="8.125rem"
										h="3rem"
										title="Browse"
									/>
								</Box>
							</Flex>
						)}
						{isTablet && (
							<Box
								w={{ base: "84vw", lg: "70vw", "2xl": "51vw" }}
								h={"9.375em"}
								bg="white"
								alignItems={"center"}
								direction={{ base: "column", md: "row" }}
								borderRadius="10px"
							>
								<Circle
									bg="divider"
									size={28}
									mt="20px"
									ml={{ base: "100px", md: "250px" }}
								>
									<Avatar
										w="90"
										h="90"
										src="/images/seller_logo.jpg"
									/>
								</Circle>
								<Box
									ml={{ base: "10.6rem", md: "310px" }}
									marginTop="-2rem"
								>
									<IconButtons
										iconName="camera"
										iconStyle={{ h: "12.53px", w: "14px" }}
									/>
								</Box>
							</Box>
						)}
					</VStack>
					<Box p={{ base: "15px", "2xl": "0px" }}>
						<Flex gap={"2.3rem"} mt={"2.5rem"} wrap="wrap">
							<Box>
								<Input
									label="First Name"
									placeholder={"Saurabh"}
									// value={value}
									// invalid={true}
									// errorMsg={"Please enter"}
									// mb={{ base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: { base: "18rem", "2xl": "15.75vw" },
										pos: "relative",
										alignItems: "center",
									}}
									// isNumInput={true}
									// inputProps={{ maxLength: 12 }}
									// onFocus={() => {
									// 	setInvalid(false);
									// }}
									// onKeyDown={onkeyHandler}
								/>
							</Box>
							<Box>
								<Input
									label="Middle Name"
									placeholder={""}
									// value={value}
									// invalid={invalid}
									// errorMsg={errorMsg}
									// mb={{ base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: { base: "18rem", "2xl": "15.75vw" },
										pos: "relative",
									}}
									// isNumInput={true}
									// inputProps={{ maxLength: 12 }}
									// onFocus={() => {
									// 	setInvalid(false);
									// }}
									// onKeyDown={onkeyHandler}
								/>
							</Box>
							<Box>
								<Input
									label="Last Name"
									placeholder={"Mullick"}
									// value={value}
									// invalid={invalid}
									// errorMsg={errorMsg}
									// mb={{	 base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: { base: "18rem", "2xl": "15.75vw" },
										pos: "relative",
									}}
									// isNumInput={true}
									// inputProps={{ maxLength: 12 }}
									// onFocus={() => {
									// 	setInvalid(false);
									// }}
									// onKeyDown={onkeyHandler}
								/>
							</Box>
						</Flex>
						<Flex mt={"2.5rem"}>
							{" "}
							<Input
								label="Date of birth"
								placeholder={""}
								type="date"
								dateFormat="DD/MM/yyyy"
								// value={value}
								// invalid={invalid}
								// errorMsg={errorMsg}
								// mb={{ base: 10, "2xl": "4.35rem" }}
								// onChange={onChangeHandler}
								labelStyle={{
									fontSize: { base: "md" },
									color: "inputlabel",
									pl: "0",
									fontWeight: "600",
									mb: { base: 2.5, "2xl": "0.8rem" },
								}}
								inputContStyle={{
									h: { base: "3rem", "2xl": "3rem" },
									w: { base: "18rem", "2xl": "25vw" },
									pos: "relative",
								}}
								// isNumInput={true}
								// inputProps={{ maxLength: 12 }}
								// onFocus={() => {
								// 	setInvalid(false);
								// }}
								// onKeyDown={onkeyHandler}
							/>
						</Flex>

						<Flex mt={"2.5rem"} direction="column">
							<Text
								style={{
									fontSize: { base: "sm", "2xl": "lg" },
									color: "inputlabe",
									pl: "0",
									fontWeight: "600",
								}}
							>
								Gender
							</Text>
							<RadioGroup
								onChange={setValue}
								value={value}
								mt="0.8rem"
							>
								<Stack direction="row" gap="2rem">
									<Radio value="1">Male</Radio>
									<Radio value="2">Female</Radio>
								</Stack>
							</RadioGroup>
						</Flex>

						<Flex mt="2.5rem" direction={"column"}>
							<Text
								style={{
									fontSize: { base: "sm", "2xl": "lg" },
									color: "inputlabe",
									pl: "0",
									fontWeight: "600",
								}}
							>
								Marital Status
							</Text>
							<Menu>
								<MenuButton
									h={{ base: "3rem", "2xl": "3rem" }}
									w={{ base: "18rem", "2xl": "25vw" }}
									fontSize="md"
									fontWeight="normal"
									textAlign="start"
									borderRadius="10px"
									border=" 1px solid #D2D2D2"
									bg="white"
									as={Button}
									rightIcon={
										<Icon
											name="drop-down"
											width="16px"
											color="#555555"
										/>
									}
									_active={{
										bg: "white",
									}}
									_hover={{
										bg: "white",
									}}
								>
									{"-- Select --"}
								</MenuButton>
								<MenuList w={"100%"}>
									<MenuItem></MenuItem>
									<MenuItem></MenuItem>
								</MenuList>
							</Menu>
						</Flex>
						<Flex mt="2.5rem" gap="2.2rem" wrap={"wrap"}>
							<Box>
								<Input
									label="Shop Name"
									placeholder={"Alam Store"}
									// value={value}
									// invalid={invalid}
									// errorMsg={errorMsg}
									// mb={{	 base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									labelStyle={{
										fontSize: { base: "16px" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: { base: "18rem" },
										pos: "relative",
									}}
									// isNumInput={true}
									// inputProps={{ maxLength: 12 }}
									// onFocus={() => {
									// 	setInvalid(false);
									// }}
									// onKeyDown={onkeyHandler}
								/>
							</Box>
							<Box>
								<Text
									style={{
										fontSize: { base: "sm", "2xl": "lg" },
										color: "inputlabe",
										pl: "0",
										fontWeight: "600",
									}}
								>
									Shop Type
								</Text>
								<Menu>
									<MenuButton
										w="18rem"
										h="3rem"
										fontSize="md"
										fontWeight="normal"
										textAlign="start"
										borderRadius="10px"
										border=" 1px solid #D2D2D2"
										bg="white"
										mt="10px"
										as={Button}
										rightIcon={
											<Icon
												name="drop-down"
												width="16px"
												color="#555555"
											/>
										}
										_active={{
											bg: "white",
										}}
										_hover={{
											bg: "white",
										}}
									>
										{"Kirana"}
									</MenuButton>
								</Menu>
							</Box>
						</Flex>

						<Flex
							alignItems="center"
							gap="2rem"
							mt="4.3rem"
							wrap="wrap"
						>
							<Box>
								<Buttons
									h="4rem"
									title="Preview"
									w={{
										base: "75vw",
										sm: "8.75rem",
										"2xl": "8.75rem",
									}}
								/>
							</Box>
							<Button
								color="#11299E"
								fontSize={"1.2rem"}
								fontWeight="semibold"
								background={"none"}
								ml={{ base: "5.4rem" }}
							>
								Cancel
							</Button>
						</Flex>
					</Box>
				</Box>
			</Box>
		</Flex>
	);
};

export default UpdatePersonalInfo;
