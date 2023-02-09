import React, { useEffect, useState } from "react";

import {
	Flex,
	Text,
	Heading,
	Box,
	Divider,
	useMediaQuery,
	Switch,
	Menu,
	MenuButton,
	Button,
	MenuItem,
	MenuList,
	Select,
	HStack,
} from "@chakra-ui/react";
import { Buttons, Input, Icon, IconButtons } from "../..";
/**
 * A <UpdateSellerAddress> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdateSellerAddress></UpdateSellerAddress>`
 */
const UpdateSellerAddress = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0);
	const [isTablet] = useMediaQuery("(max-width: 820px)"); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Flex
			w="100%"
			p={{
				base: "",
				sm: "0px",
				md: "0px",
				lg: "20px",
				xl: "20px",
				"2xl": "14px 30px 30px 30px",
			}}
			direction={"column"}
			border={{
				base: "none",
				lg: "1px solid #D2D2D2",
				xl: "1px solid #D2D2D2",
				"2xl": "1px solid #D2D2D2",
			}}
			boxShadow={{
				base: "none",
				lg: "0px 5px 15px #0000000D",
				"2xl": "0px 5px 15px #0000000D",
			}}
			borderRadius={{
				base: "none",
				md: "10px",
				lg: "10px",
				xl: "10px",
				"2xl": "10px",
			}}
			bg={{
				base: "none",
				md: "none",
				lg: "white",
			}}
			mt={{ base: "10px", md: "30px" }}
		>
			<Flex direction={"column"}>
				<Box
					bg={{ base: "#FFFFFF", "2xl": "none" }}
					alignItems={{ base: "center", "2xl": "none" }}
					borderRadius={{ base: "10px", lg: "none" }}
					border={{ base: "1px solid #D2D2D2", lg: "none" }}
				>
					<Flex
						direction={"column"}
						p={{ base: "12px", lg: "0px" }}
						// border={{
						// 	base: "1px solid #D2D2D2",

						// 	lg: "0",
						// }}
						boxShadow={{
							base: "0px 5px 15px #0000000D",
							lg: "none",
							xl: "none",
							"2xl": "none",
						}}
					>
						<Text
							as="h1"
							color="accent.DEFAULT"
							fontWeight="bold"
							fontSize={{ base: "lg", md: "2xl" }}
						>
							Angel Tech Private Limited
						</Text>
						<Text fontSize={{ base: "xs", md: "md" }}>
							Edit the fields below and click Preview.
							<Text
								as="span"
								display={{ base: "block", md: "inline" }}
							>
								{" "}
								Click Cancel to return to Client HomePage
								without submitting information.
							</Text>
						</Text>
					</Flex>
				</Box>
				{!isTablet && <Divider mt="15px" color="#D2D2D2" />}
			</Flex>

			<Flex
				direction={"column"}
				bg={"white"}
				//  bg="green"
				w={{
					base: "100%",
					md: "100%",
					lg: "100%",
					xl: "100%",
					"2xl": "full",
				}}
				m={{ base: "0rem", lg: "0px" }}
				mt={{ base: "18px", lg: "0px" }}
				mb={"20px"}
				borderRadius={{ base: "10px", xl: "0", "2xl": "none" }}
				border={{
					base: "1px solid #D2D2D2",
					lg: "0",
					xl: "0",
					"2xl": "none",
				}}
				boxShadow={{
					base: "0px 5px 15px #0000000D",
					xl: "none",
					lg: "none",
					"2xl": "none",
				}}
				p={{ base: "0px", md: "20px", lg: "0px" }}
			>
				<Flex
					direction={"column"}
					p={{ base: "15px", md: "px" }}
					mt={{ base: "0rem", md: "1rem", "2xl": "2.8rem" }}
				>
					<HStack
						justifyContent={"space-between"}
						w={{
							base: "100%",

							lg: "97%",
							xl: "70%",
							"2xl": "63%",
						}}
					>
						<Text
							fontSize={{ base: "md", md: "xl" }}
							fontWeight="semibold"
						>
							Current Address
						</Text>
						<Text color="#FF4081">* Mandatory</Text>
					</HStack>
					<Flex
						rowGap={{
							base: "2.8rem",
							sm: "2.5rem",
							"2xl": "2.5rem",
						}}
						direction="column"
					>
						<Flex
							wrap={"wrap"}
							gap={{
								md: "1.5rem",
								xl: "1.5rem",
								lg: "1rem",
								"2xl": "1.2rem",
								// base:"1rem"
							}}
							mt={{ base: "2.25rem", md: "1.2rem" }}
							direction={"row"}
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label="Address Line 1"
									placeholder={
										"B-373 Second Floor Sector - 20"
									}
									// value={value}
									// invalid={true}
									// errorMsg={"Please enter"}
									// mb={{ base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									required="true"
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
								mt={{
									base: "2.8rem",
									md: "0",
									lg: "0",
									xl: "0",
									"2xl": "0",
								}}
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label=" Address Line 2"
									placeholder={
										"B-373 Second Floor Sector - 20"
									}
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
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
						</Flex>
						<Flex
							wrap={"wrap"}
							gap={{
								md: "1.5rem",
								xl: "1.5rem",
								lg: "1rem",
								"2xl": "1.2rem",
							}}
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label="Postal Code"
									placeholder={"201301"}
									// value={value}
									// invalid={true}
									// errorMsg={"Please enter"}
									// mb={{ base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									required="true"
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
								mt={{
									base: "2.8rem",
									md: "0",
									lg: "0",
									xl: "0",
									"2xl": "0",
								}}
							>
								<Input
									label=" City"
									placeholder={"Noida"}
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
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
						</Flex>
						<Flex
							gap={{
								md: "1.5rem",
								xl: "1.5rem",
								lg: "1rem",
								"2xl": "1.2rem",
							}}
							wrap={"wrap"}
							alignContent="center"
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Flex mb={{ base: 2.5, "2xl": "0.8rem" }}>
									<Text as="span" color="error">
										*
									</Text>
									&nbsp;{" "}
									<Text
										as="b"
										style={{
											fontSize: {
												base: "sm",
												"2xl": "lg",
											},
											color: "inputlabe",
											pl: "0",
											fontWeight: "600",
										}}
									>
										State
									</Text>
								</Flex>

								<Box>
									<Select
										placeholder="Uttarpradesh"
										w={{
											base: "100%",
											md: "38vw",
											xl: "25vw",
											lg: "35vw",
											"2xl": "25vw",
										}}
										h={"3rem"}
										borderRadius="10px"
										icon={<Icon name="caret-down" />}
									>
										<option value="option1">Delhi</option>
										<option value="option2">Punjab</option>
									</Select>
								</Box>
							</Box>

							<Box
								mt={{
									base: "2.8rem",
									md: "0",
									xl: "0",
									"2xl": "0",
								}}
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label=" Country"
									placeholder={"India"}
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
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
						</Flex>

						<Box mt={{ base: 2.5, md: "0" }}>
							<Box mb={{ base: 2.5, "2xl": "0.8rem" }}>
								<Text
									fontSize={{ base: "md" }}
									color="inputlabel"
									pl="0"
									fontWeight="600"
								>
									Ownership Type
								</Text>
							</Box>
							<Box>
								<Select
									placeholder="--Select--"
									w={{
										base: "100%",
										md: "38vw",
										xl: "25vw",
										lg: "35vw",
										"2xl": "25vw",
									}}
									h={"3rem"}
									borderRadius="10px"
									icon={<Icon name="caret-down" />}
								>
									<option value="option1">Option 1</option>
									<option value="option2">Option 2</option>
								</Select>
							</Box>
						</Box>
					</Flex>

					<Flex
						mt={{ base: "2.8rem", md: "3rem", "2xl": "3rem" }}
						gap={{ base: "1rem", md: "4rem", "2xl": "2rem" }}
						p={{ base: "5px", md: "0px" }}
					>
						<Box>
							<Text
								fontSize={{ base: "14px", md: "16px" }}
								fontWeight="semibold"
							>
								Is your permanent address is same as above ?
							</Text>
						</Box>
						<Box>
							{" "}
							<Switch colorScheme="pink" size="lg" />
						</Box>
					</Flex>
				</Flex>
				<Flex display={{ base: "none", md: "flex" }} direction="column">
					<Box>
						<Text
							fontSize={"20px"}
							fontWeight="semibold"
							mt="4.688rem"
						>
							Permanent Address
						</Text>
					</Box>
					<Flex
						rowGap={{
							base: "2.8rem",
							sm: "2.5rem",
							"2xl": "2.5rem",
						}}
						direction="column"
					>
						<Flex
							wrap={"wrap"}
							gap={{
								md: "1.5rem",
								xl: "1.5rem",
								lg: "1rem",
								"2xl": "1.2rem",
								// base:"1rem"
							}}
							mt={{ base: "2.25rem", md: "1.2rem" }}
							direction={"row"}
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label="Address Line 1"
									placeholder={
										"B-373 Second Floor Sector - 20"
									}
									// value={value}
									// invalid={true}
									// errorMsg={"Please enter"}
									// mb={{ base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									required="true"
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
								mt={{
									base: "2.8rem",
									md: "0",
									lg: "0",
									xl: "0",
									"2xl": "0",
								}}
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label=" Address Line 2"
									placeholder={
										"B-373 Second Floor Sector - 20"
									}
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
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
						</Flex>
						<Flex
							wrap={"wrap"}
							gap={{
								md: "1.5rem",
								xl: "1.5rem",
								lg: "1rem",
								"2xl": "1.2rem",
							}}
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label="Postal Code"
									placeholder={"201301"}
									// value={value}
									// invalid={true}
									// errorMsg={"Please enter"}
									// mb={{ base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									required="true"
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
								mt={{
									base: "2.8rem",
									md: "0",
									lg: "0",
									xl: "0",
									"2xl": "0",
								}}
							>
								<Input
									label=" City"
									placeholder={"Noida"}
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
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
						</Flex>
						<Flex
							gap={{
								md: "1.5rem",
								xl: "1.5rem",
								lg: "1rem",
								"2xl": "1.2rem",
							}}
							wrap={"wrap"}
							alignContent="center"
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Flex mb={{ base: 2.5, "2xl": "0.8rem" }}>
									<Text as="span" color="error">
										*
									</Text>
									&nbsp;{" "}
									<Text
										as="b"
										style={{
											fontSize: {
												base: "sm",
												"2xl": "lg",
											},
											color: "inputlabe",
											pl: "0",
											fontWeight: "600",
										}}
									>
										State
									</Text>
								</Flex>

								<Box>
									<Select
										placeholder="-- Select --"
										icon={<Icon name="caret-down" />}
										h={{ base: "3rem", "2xl": "3rem" }}
										w={{
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
										}}
										borderRadius={{
											base: 10,
											"2xl": 10,
										}}
									></Select>
								</Box>
							</Box>

							<Box
								mt={{
									base: "2.8rem",
									md: "0",
									xl: "0",
									"2xl": "0",
								}}
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label=" Country"
									placeholder={"India"}
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
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
						</Flex>

						<Box mt={{ base: 2.5, md: "0" }}>
							<Box mb={{ base: 2.5, "2xl": "0.8rem" }}>
								<Text
									fontSize={{ base: "md" }}
									color="inputlabel"
									pl="0"
									fontWeight="600"
								>
									Ownership Type
								</Text>
							</Box>
							<Box>
								<Select
									placeholder="-- Select --"
									icon={<Icon name="caret-down" />}
									h={{ base: "3rem", "2xl": "3rem" }}
									w={{
										base: "100%",

										md: "38vw",
										lg: "37vw",
										xl: "28vw",
										"2xl": "25vw",
									}}
									borderRadius={{ base: 10, "2xl": 10 }}
								></Select>
							</Box>
						</Box>
					</Flex>
				</Flex>
				<Flex display={{ base: "none", md: "flex" }} direction="column">
					<Box>
						<Text
							fontSize={"20px"}
							fontWeight="semibold"
							mt="4.688rem"
						>
							New Address
						</Text>
					</Box>
					<Box mt={{ base: 2.5, lg: "0", "2xl": "0px" }}>
						<Box mb={{ base: 2.5, "2xl": "" }}>
							<Text
								as="b"
								style={{
									fontSize: { base: "md" },
									color: "inputlabel",
									pl: "0",
									fontWeight: "600",
								}}
							>
								Address Type
							</Text>
						</Box>

						<Box>
							<Flex
								w={{
									base: "100%",
									md: "100%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "32%",
								}}
							>
								<Select
									placeholder="--Select--"
									w={{
										base: "100%",
										md: "38vw",
										xl: "25vw",
										lg: "35vw",
										"2xl": "25vw",
									}}
									h={"3rem"}
									borderRadius="10px"
									icon={<Icon name="caret-down" />}
								>
									<option value="option1">Option 1</option>
									<option value="option2">Option 2</option>
								</Select>
							</Flex>
						</Box>
					</Box>
					<Flex
						rowGap={{
							base: "2.8rem",
							sm: "2.5rem",
							"2xl": "2.5rem",
						}}
						direction="column"
					>
						<Flex
							wrap={"wrap"}
							gap={{
								md: "1.5rem",
								xl: "1.5rem",
								lg: "1rem",
								"2xl": "1.2rem",
								// base:"1rem"
							}}
							mt={{ base: "2.25rem", md: "1.2rem" }}
							direction={"row"}
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label="Address Line 1"
									placeholder={
										"B-373 Second Floor Sector - 20"
									}
									// value={value}
									// invalid={true}
									// errorMsg={"Please enter"}
									// mb={{ base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									required="true"
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
								mt={{
									base: "2.8rem",
									md: "0",
									lg: "0",
									xl: "0",
									"2xl": "0",
								}}
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label=" Address Line 2"
									placeholder={
										"B-373 Second Floor Sector - 20"
									}
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
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
						</Flex>
						<Flex
							wrap={"wrap"}
							gap={{
								md: "1.5rem",
								xl: "1.5rem",
								lg: "1rem",
								"2xl": "1.2rem",
							}}
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label="Postal Code"
									placeholder={"201301"}
									// value={value}
									// invalid={true}
									// errorMsg={"Please enter"}
									// mb={{ base: 10, "2xl": "4.35rem" }}
									// onChange={onChangeHandler}
									required="true"
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
								mt={{
									base: "2.8rem",
									md: "0",
									lg: "0",
									xl: "0",
									"2xl": "0",
								}}
							>
								<Input
									label=" City"
									placeholder={"Noida"}
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
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
						</Flex>
						<Flex
							gap={{
								md: "1.5rem",
								xl: "1.5rem",
								lg: "1rem",
								"2xl": "1.2rem",
							}}
							wrap={"wrap"}
							alignContent="center"
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Flex mb={{ base: 2.5, "2xl": "0.8rem" }}>
									<Text as="span" color="error">
										*
									</Text>
									&nbsp;{" "}
									<Text
										as="b"
										style={{
											fontSize: {
												base: "sm",
												"2xl": "lg",
											},
											color: "inputlabe",
											pl: "0",
											fontWeight: "600",
										}}
									>
										State
									</Text>
								</Flex>

								<Box>
									<Select
										placeholder="-- Select --"
										icon={<Icon name="caret-down" />}
										h={{ base: "3rem", "2xl": "3rem" }}
										w={{
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
										}}
										borderRadius={{
											base: 10,
											"2xl": 10,
										}}
									></Select>
								</Box>
							</Box>

							<Box
								mt={{
									base: "2.8rem",
									md: "0",
									xl: "0",
									"2xl": "0",
								}}
								w={{
									base: "100%",
									md: "48%",
									lg: "46%",
									xl: "34.5%",
									"2xl": "31%",
								}}
							>
								<Input
									label=" Country"
									placeholder={"India"}
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
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: {
											base: "100%",

											md: "38vw",
											lg: "37vw",
											xl: "28vw",
											"2xl": "25vw",
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
						</Flex>

						<Box mt={{ base: 2.5, md: "0" }}>
							<Box mb={{ base: 2.5, "2xl": "0.8rem" }}>
								<Text
									fontSize={{ base: "md" }}
									color="inputlabel"
									pl="0"
									fontWeight="600"
								>
									Ownership Type
								</Text>
							</Box>
							<Box>
								<Select
									placeholder="-- Select --"
									icon={<Icon name="caret-down" />}
									h={{ base: "3rem", "2xl": "3rem" }}
									w={{
										base: "100%",

										md: "38vw",
										lg: "37vw",
										xl: "28vw",
										"2xl": "25vw",
									}}
									borderRadius={{ base: 10, "2xl": 10 }}
								></Select>
							</Box>
						</Box>
						<Box>
							<Buttons
								w="15rem"
								h="3.5rem"
								bg="white"
								_hover="none"
								border="1px solid #11299E"
								boxShadow="0px 3px 10px #11299E33"
							>
								<Text
									color={"#11299E"}
									fontSize="20px"
									fontWeight={"bold"}
								>
									+&nbsp; Add New Address
								</Text>
							</Buttons>
						</Box>
					</Flex>
				</Flex>
				<Flex
					alignItems="center"
					gap={{ base: "2.1rem", md: "4.8rem", "2xl": "4.8rem" }}
					mt="4.2rem"
					w={{
						base: "100%",
						md: "48%",
						lg: "46%",
						xl: "14.5%",
						"2xl": "",
					}}
					p={{ base: "20px", md: "0px" }}
					direction={{ base: "column", md: "row" }}
				>
					<Box w="100%">
						<Buttons
							h="3.5rem"
							title="Save Changes"
							fontSize="20px"
							fontWeight="bold"
							w={{
								base: "100%",
								md: "12.2rem",
							}}
						/>
					</Box>
					<Button
						color="#11299E"
						fontSize={"20px"}
						fontWeight="bold"
						bg="white"
						_focus={{
							bg: "white",
						}}
						_hover="none"
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default UpdateSellerAddress;
