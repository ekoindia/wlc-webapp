import React, { useEffect, useState, useRef } from "react";
import {
	Box,
	Text,
	Heading,
	Divider,
	Avatar,
	Circle,
	Flex,
	Radio,
	RadioGroup,
	Select,
	Stack,
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
import { redirect } from "next/dist/server/api-utils";
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
	const [isTablet] = useMediaQuery("(max-width: 770px)");

	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Flex
			direction={"column"}
			w="full"
			h="auto"
			bg={{
				base: "none",
				md: "none",
				lg: "white",
				xl: "white",
				"2xl": "white",
			}}
			borderRadius="10px"
			boxShadow={{
				base: "none",
				md: "none",
				xl: "0px 5px 15px #0000000D",
				"2xl": "0px 5px 15px #0000000D",
			}}
			border={{
				base: "none",
				md: "none",
				xl: "1px solid #D2D2D2",
				lg: "1px solid #D2D2D2",
				"2xl": "1px solid #D2D2D2",
			}}
			p={{
				base: "0px",

				md: "0px",
				lg: "20px",
				xl: "20px",
				"2xl": "14px 30px 30px 30px",
			}}
			mt="20px"

			//
		>
			<Box
				bg={{ base: "#FFFFFF", "2xl": "white" }}
				w={{
					base: "100%",
					md: "100%",
					lg: "97%",
					xl: "70vw",
					"2xl": "51vw",
				}}
				alignItems={{ base: "center", "2xl": "none" }}
			>
				<Flex direction={"column"} p={{ base: "5px" }}>
					<Heading
						fontSize={{ base: "1rem", "2xl": "1.5em" }}
						color={"#11299E"}
						fontWeight="semibold"
					>
						Angel Tech Private Limited
					</Heading>
					<Text
						fontSize={{ base: "0.8em", "2xl": "1em" }}
						color="#0F0F0F"
					>
						Edit the fields below and click Preview. Click Cancel to
						return to Client HomePage without submitting
						information.
					</Text>
				</Flex>
			</Box>

			{!isTablet && <Divider color="#D2D2D2" mt="10px" />}
			<Box
				bg="#FFFFFF"
				h="full"
				p={{
					base: "20px",
					sm: "20px",
					md: "20px",
					lg: "0px",
					xl: "0px",
				}}
				borderRadius={{ base: "10px", lg: "0", xl: "0" }}
				boxShadow={{
					base: "0px 5px 15px #0000000D",
					xl: "none",
					lg: "none",
					"2xl": "none",
				}}
				border={{
					base: " 1px solid #D2D2D2",
					xl: "none",
					lg: "none",
					"2xl": "none",
				}}
				m={{ base: "1rem", lg: "0px" }}
			>
				<VStack align={{ base: "none", "2xl": "" }}>
					<HStack
						justifyContent={"space-between"}
						mt={{ base: "0px", lg: "3.1rem" }}
						w={{
							base: "100%",

							lg: "80vw",
							xl: "80vw",
							"2xl": "51vw",
						}}
					>
						<Text
							fontSize={{
								base: "sm",
								md: "md",
								xl: "md",
								"2xl": "md",
							}}
							fontWeight="semibold"
						>
							Merchant information
						</Text>
						<Text
							color="#FF4081"
							fontSize={{
								base: "sm",
								md: "md",
								xl: "md",
								"2xl": "md",
							}}
						>
							* Mandatory
						</Text>
					</HStack>
					{!isTablet && (
						<Flex
							w={{
								base: "100	%",
								md: "81vw",
								lg: "80vw",
								xl: "80vw",
								"2xl": "51vw",
							}}
							p="20px"
							h={"9.375em"}
							bg="#F5F6F8"
							alignItems={"center"}
							direction={{ base: "column", md: "row" }}
							borderRadius="10px"
						>
							<Flex>
								<Circle bg="divider" size={28}>
									<Avatar
										w="90"
										h="90"
										src="/images/seller_logo.jpg"
									/>
								</Circle>
							</Flex>
							<Flex w="100%" display={"flex"}>
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
							</Flex>
							<Flex>
								<Buttons w="8.125rem" h="3rem" title="Browse" />
							</Flex>
						</Flex>
					)}
					{isTablet && (
						<Flex
							w={{
								base: "100%",
								md: "100%",
								lg: "70vw",
								"2xl": "51vw",
							}}
							h={"9.375em"}
							bg="white"
							justifyContent={"center"}
							alignItems={"center"}
							direction={{ base: "column", md: "Column" }}
							borderRadius="10px"
						>
							<Circle bg="divider" size={28}>
								<Avatar
									w="90"
									h="90"
									src="/images/seller_logo.jpg"
								/>
							</Circle>
							<Box
								ml={{ base: "3.6rem", md: "3.6rem" }}
								marginTop="-2rem"
							>
								<IconButtons
									iconName="camera"
									iconStyle={{
										h: "12.53px",
										width: "14px",
									}}
								/>
							</Box>
						</Flex>
					)}
				</VStack>

				<Flex direction={"column"}>
					<Box>
						<Flex gap={"2rem"} mt="2.4rem" wrap="wrap">
							<Box
								w={{
									base: "100%",
									md: "100%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "20%",
								}}
							>
								<Input
									label="First Name"
									placeholder={"Saurabh"}
									required="true"
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
										mb: { base: 2.5, "2xl": "0.3rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",
											md: "100%",
											lg: "20rem",
											"2xl": "15.75vw",
										},
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
							<Box
								w={{
									base: "100%",
									md: "100%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "20%",
								}}
							>
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
										mb: { base: 2.5, "2xl": "0.3rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",
											md: "100%",
											lg: "20rem",
											"2xl": "15.75vw",
										},
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
							<Box
								w={{
									base: "100%",
									md: "100%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "20%",
								}}
							>
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
										mb: { base: 2.5, "2xl": "0.3rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",
											md: "100%",
											lg: "20rem",
											"2xl": "15.75vw",
										},
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
							<Box
								w={{
									base: "100%",
									md: "100%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label="Date of birth"
									placeholder={""}
									type="date"
									dateFormat="DD/MM/yyyy"
									required="true"
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
										mb: { base: 2.5, "2xl": "0.3rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",
											md: "100%",
											lg: "20rem",
											"2xl": "15.75vw",
										},
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

						<Flex mt={"2.5rem"} direction="column">
							<Text
								style={{
									fontSize: { base: "sm", "2xl": "lg" },
									color: "inputlabe",
									pl: "0",
									fontWeight: "600",
								}}
							>
								<Text as="span" color="error">
									*
								</Text>
								Gender
							</Text>
							<RadioGroup
								onChange={setValue}
								value={value}
								mt="0.8rem"
							>
								<Stack
									direction="row"
									gap={{ base: "6rem", "2xl": "3.7rem" }}
								>
									<Radio size="lg" value="1">
										Male
									</Radio>
									<Radio size="lg" value="2">
										Female
									</Radio>
								</Stack>
							</RadioGroup>
						</Flex>

						<Flex
							mt="2.5rem"
							direction={"column"}
							w={{
								base: "100%",
								md: "100%",
								lg: "46%",
								xl: "34.5%",
								"2xl": "31%",
							}}
						>
							<Text
								fontSize={{ base: "sm", "2xl": "md" }}
								mb={{ base: 2.5, "2xl": "0.3rem" }}
								color="inputlabe"
								pl="0"
								fontWeight="600"
							>
								Marital Status
							</Text>
							<Menu>
								<MenuButton
									h={{ base: "3rem", "2xl": "3rem" }}
									w={{
										base: "100%",
										md: "100%",
										lg: "20rem",
										"2xl": "15.75vw",
									}}
									fontSize="md"
									fontWeight="normal"
									textAlign="start"
									borderRadius="10px"
									border=" 1px solid #D2D2D2"
									bg="white"
									as={Button}
									rightIcon={
										<Icon
											name="caret-down"
											width="13"
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
								<MenuList w={{ base: "18rem", "2xl": "25vw" }}>
									<MenuItem></MenuItem>
									<MenuItem></MenuItem>
								</MenuList>
							</Menu>
						</Flex>
						<Flex
							mt="2.5rem"
							gap="2rem"
							wrap={"wrap"}
							alignItems={{ base: "", "2xl": "center" }}
						>
							<Box
								w={{
									base: "100%",
									md: "100%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "20%",
								}}
							>
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
										mb: { base: 2.5, "2xl": "0.3rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",
											md: "100%",
											lg: "20rem",
											"2xl": "15.75vw",
										},
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
							<Box
								w={{
									base: "100%",
									md: "100%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "20%",
								}}
							>
								<Box mb={{ base: 2.5, "2xl": "0.7rem" }}>
									<Text
										style={{
											fontSize: { base: "16px" },
											color: "inputlabel",

											fontWeight: "600",
										}}
									>
										Shop Type
									</Text>
								</Box>
								<Select
									placeholder="General"
									h={{ base: "3rem", "2xl": "3rem" }}
									w={{
										base: "100%",
										md: "100%",
										lg: "20rem",
										"2xl": "15.75vw",
									}}
									mt={{ base: "0.7rem", "2xl": "0" }}
									position="relative"
									borderRadius={{ base: 10, "2xl": 10 }}
									border="1px solid #D2D2D2;"
									_focus={{
										bg: "focusbg",
										boxShadow: "0px 3px 6px #0000001A",
										borderColor: "hint",
										transition: "box-shadow 0.3s ease-out",
									}}
									icon={
										<Icon name="caret-down" width="17px" />
									}
								>
									<option value="option1">Option 1</option>
									<option value="option2">Option 2</option>
								</Select>
							</Box>
						</Flex>
					</Box>

					<Flex
						alignItems="center"
						gap="1.5rem"
						mt="3.3rem"
						wrap="wrap"
						flexDirection={{
							base: "column",
							lg: "row",
							xl: "row",
							"2xl": "row",
						}}
					>
						<Box
							w={{
								base: "100%",
								md: "100%",
								lg: "20%",
								xl: "15%",
								"2xl": "10%",
							}}
						>
							<Buttons
								h="3.5rem"
								title="Preview"
								w={{
									base: "100%",
									md: "100%",
									lg: "8.75rem",
									xl: "8.75rem",

									"2xl": "8.75rem",
								}}
								fontSize="20px"
								fontWeight="bold"
							/>
						</Box>
						<Button
							color="#11299E"
							fontSize="1.2rem"
							fontWeight="bold"
							background={"none"}
							onClick={redirect}
						>
							Cancel
						</Button>
					</Flex>
				</Flex>
			</Box>
		</Flex>
	);
};

export default UpdatePersonalInfo;
