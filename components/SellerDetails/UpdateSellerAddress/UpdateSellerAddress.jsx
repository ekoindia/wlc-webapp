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
			// w={{ base: "	", xl: "100%", "2xl": "100%" }}
			w="100%"
			// h="full"
			// h={{ base: "", "2xl": "" }}
			// bg={{ base: "none", "2xl": "white" }}
			// p={{ base: "0", xl: "1", "2xl": "1.875rem	" }}
			p={{
				base: "",
				sm: "0px",
				md: "0px",
				lg: "20px",
				xl: "20px",
				"2xl": "30px",
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
				xl: "white",
				"2xl": "white",
			}}
		>
			<Flex direction={"column"}>
				<Box
					bg={{ base: "#FFFFFF", "2xl": "none" }}
					// w={{ base: "98vw", md: "83vw", xl: "100%", "2xl": "51vw" }}
					alignItems={{ base: "center", "2xl": "none" }}
					//
				>
					<Flex
						direction={"column"}
						p={{ base: "10px", md: "0px 2px 0px 2px", lg: "0px" }}
						border={{
							base: "1px solid #D2D2D2",
							xl: "0",
							lg: "0",
							"2xl": "0",
						}}
						boxShadow={{
							base: "0px 5px 15px #0000000D",
							lg: "none",
							xl: "none",
							"2xl": "none",
						}}
					>
						<Heading
							// fontSize={"1.5em"}
							fontSize={{ base: "1.2em", "2xl": "1.5em" }}
							color={"#11299E"}
							// mt={"24px"}
							fontWeight="semibold"
							// m={{ base: "10px", "2xl": "0px" }}
						>
							Angel Tech Private Limited
						</Heading>
						<Text
							fontSize={{ base: "0.9em", "2xl": "1em" }}
							// m={{ base: "8px", "2xl": "0px" }}
							color="#0F0F0F"
						>
							Edit the fields below and click Preview. Click
							Cancel to return to Client HomePage without
							submitting information.
						</Text>
					</Flex>
				</Box>
				{!isTablet && (
					<Divider
						mt="15px"
						// m={{
						// 	base: "1rem",
						// 	md: "1rem",
						// 	xl: "0",
						// 	"2xl": "0.6rem",
						// }}
						color="#D2D2D2"
						// w={{ base: "none", md: "80%", xl: "", "2xl": "100%" }}
					/>
				)}
			</Flex>

			<Flex
				direction={"column"}
				bg={{ base: "#FFFFFF" }}
				w={{
					base: "89vw",
					md: "90%",
					lg: "100%",
					xl: "100%",
					"2xl": "full",
				}}
				// p={{ base: "20px", "2xl": "0" }}
				m={{ base: "1rem", lg: "0px" }}
				borderRadius={{ base: "10px", xl: "0", "2xl": "none" }}
				border={{
					base: "1px solid #D2D2D2",
					lg: "0",
					xl: "0",
					"2xl": "none",
				}}
				boxShadow={{
					base: "0px 5px 15px #0000000D",
					xl: "0",
					lg: "0",
					"2xl": "none",
				}}
			>
				<HStack
					justifyContent={"space-between"}
					w={{
						base: "100%",
						md: "90%",
						lg: "97%",
						xl: "70%",
						"2xl": "63%",
					}}
					// mb={{ base: "2.2rem", "2xl": "0" }}
					mt="2rem"
					p={{ base: "10px", "2xl": "0px" }}
				>
					<Text
						fontSize={{ base: "md", "2xl": "xl" }}
						fontWeight="semibold"
					>
						Current Address
					</Text>
					<Text color="#FF4081">* Mandatory</Text>
				</HStack>
				<Flex
					rowGap={{ base: "2.8rem", sm: "2.5rem", "2xl": "2.5rem" }}
					// mt={{ base: "0px", "2xl": "1.2rem" }}
					p={{
						base: "0px 0px 0px 20px",
						md: "0px 0px 0px 60px",
						lg: "0px",
					}}
					direction="column"
				>
					<Flex
						wrap={"wrap"}
						gap={{
							base: "",
							xl: "1.5rem",
							lg: "3rem",
							"2xl": "1.2rem",
						}}
						mt="1.2rem"
						// m={{ base: "" }}
						direction={"row"}
					>
						<Box>
							<Input
								label="Address Line 1"
								placeholder={"B-373 Second Floor Sector - 20"}
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
										base: "17rem",
										sm: "55vw",
										md: "70vw",
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
								lg: "0",
								xl: "0",
								"2xl": "0",
							}}
						>
							<Input
								label=" Address Line 2"
								placeholder={"B-373 Second Floor Sector - 20"}
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
										base: "17rem",
										sm: "55vw",
										md: "70vw",
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
							base: "",
							lg: "3rem",
							xl: "1.5rem",
							"2xl": "1.2rem",
						}}
					>
						<Box>
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
										base: "17rem",
										sm: "55vw",
										md: "70vw",
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
										base: "17rem",
										sm: "55vw",
										md: "70vw",
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
							base: "",
							lg: "3rem",
							xl: "1.5rem",
							"2xl": "1.2rem",
						}}
						wrap={"wrap"}
						alignContent="center"
					>
						<Box mt={{ base: 2.5, lg: "10px", "2xl": "1rem" }}>
							<Flex>
								<Text as="span" color="error">
									*
								</Text>
								&nbsp;{" "}
								<Text
									as="b"
									style={{
										fontSize: { base: "sm", "2xl": "lg" },
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
									icon={<Icon name="Inputdropdown" />}
									h={{ base: "3rem", "2xl": "3rem" }}
									w={{
										base: "17rem",
										sm: "55vw",
										md: "70vw",
										lg: "37vw",
										xl: "28vw",
										"2xl": "25vw",
									}}
									borderRadius={{ base: 10, "2xl": 10 }}
								>
									<option value="option1">
										MadhyaPradesh
									</option>
									<option value="option2">Delhi</option>
								</Select>
							</Box>
						</Box>
						<Box
							mt={{
								base: "2.8rem",
								lg: "0",
								xl: "0",
								"2xl": "0",
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
										base: "17rem",
										sm: "55vw",
										md: "70vw",
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

					<Box mt={{ base: 2.5, lg: "0", "2xl": "1rem" }}>
						<Text
							as="b"
							style={{
								fontSize: { base: "sm", "2xl": "lg" },
								color: "inputlabe",
								pl: "0",
								fontWeight: "600",
							}}
						>
							Ownership Type
						</Text>

						<Box>
							<Select
								placeholder="-- Select --"
								icon={<Icon name="Inputdropdown" />}
								h={{ base: "3rem", "2xl": "3rem" }}
								w={{
									base: "17rem",
									sm: "55vw",
									md: "70vw",
									lg: "37vw",
									xl: "28vw",
									"2xl": "25vw",
								}}
								borderRadius={{ base: 10, "2xl": 10 }}
							></Select>
						</Box>
					</Box>
				</Flex>

				<Flex
					mt={{ base: "2.8rem", lg: "3rem", "2xl": "3rem" }}
					gap={{ base: "0px", lg: "3rem", "2xl": "2rem" }}
					p={{ base: "5px", md: "0px" }}
				>
					<Box>
						<Text
							fontSize={{ base: "13px", md: "16px" }}
							fontWeight="bold"
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

			{!isTablet && (
				<Flex
					rowGap={{ base: "2.8rem", sm: "2.5rem", "2xl": "2.5rem" }}
					// mt={{ base: "0px", "2xl": "1.2rem" }}
					direction="column"
					bg="white"
					// p={{ base: "20px", "2xl": "0" }}
				>
					<Box>
						<Text fontSize={"20px"} fontWeight="bold" mt="4.5rem">
							Permanent Address
						</Text>
					</Box>
					<Flex
						wrap={"wrap"}
						gap={{
							base: "",
							xl: "1.5rem",
							lg: "3rem",
							"2xl": "1.2rem",
						}}
						m={{ base: "" }}
					>
						<Box>
							<Input
								label="Address Line 1"
								placeholder={"B-373 Second Floor Sector - 20"}
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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
								lg: "0",
								xl: "0",
								"2xl": "0",
							}}
						>
							<Input
								label=" Address Line 2"
								placeholder={"B-373 Second Floor Sector - 20"}
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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
							base: "",
							xl: "1.5rem",
							lg: "3rem",
							"2xl": "1.2rem",
						}}
					>
						<Box>
							<Input
								label="Postal Code"
								placeholder={"201301"}
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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
							base: "",
							xl: "1.5rem",
							lg: "3rem",
							"2xl": "1.2rem",
						}}
						wrap={"wrap"}
						alignContent="center"
					>
						<Box mt={{ base: 2.5, lg: "10px", "2xl": "1rem" }}>
							<Text
								as="b"
								style={{
									fontSize: { base: "sm", "2xl": "lg" },
									color: "inputlabe",
									pl: "0",
									fontWeight: "600",
								}}
							>
								State
							</Text>

							<Box>
								<Select
									placeholder="Uttarpradesh"
									icon={<Icon name="Inputdropdown" />}
									h={{ base: "3rem", "2xl": "3rem" }}
									w={{
										base: "19rem",
										sm: "55vw",
										md: "50vw",
										lg: "37vw",
										xl: "28vw",
										"2xl": "25vw",
									}}
									borderRadius={{ base: 10, "2xl": 10 }}
								>
									<option value="option1">
										MadhyaPradesh
									</option>
									<option value="option2">Delhi</option>
								</Select>
							</Box>
						</Box>
						<Box
							mt={{
								base: "2.8rem",
								lg: "0",
								xl: "0",
								"2xl": "0",
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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

					<Box mt={{ base: 2.5, lg: "0", "2xl": "1rem" }}>
						<Text
							as="b"
							style={{
								fontSize: { base: "sm", "2xl": "lg" },
								color: "inputlabe",
								pl: "0",
								fontWeight: "600",
							}}
						>
							Ownership Type
						</Text>

						<Box>
							<Select
								placeholder="-- Select --"
								icon={<Icon name="Inputdropdown" />}
								h={{ base: "3rem", "2xl": "3rem" }}
								w={{
									base: "19rem",
									sm: "55vw",
									md: "50vw",
									lg: "37vw",
									xl: "28vw",
									"2xl": "25vw",
								}}
								borderRadius={{ base: 10, "2xl": 10 }}
							></Select>
						</Box>
					</Box>
				</Flex>
			)}

			{!isTablet && (
				<Flex
					rowGap={{ base: "2.8rem", sm: "2.5rem", "2xl": "2.5rem" }}
					// mt={{ base: "0px", "2xl": "1.2rem" }}
					direction="column"
					bg="white"
					// p={{ base: "20px", "2xl": "0px" }}
				>
					<Box>
						<Text fontSize={"20px"} fontWeight="bold" mt="4.5rem">
							New Address
						</Text>
					</Box>

					<Box mt={{ base: 2.5, lg: "0", "2xl": "0px" }}>
						<Text
							as="b"
							style={{
								fontSize: { base: "sm", "2xl": "lg" },
								color: "inputlabe",
								pl: "0",
								fontWeight: "medium",
							}}
						>
							Address Type
						</Text>

						<Box>
							<Select
								placeholder="-- Select --"
								icon={<Icon name="Inputdropdown" />}
								h={{ base: "3rem", "2xl": "3rem" }}
								w={{
									base: "19rem",
									sm: "55vw",
									md: "50vw",
									lg: "37vw",
									xl: "28vw",
									"2xl": "25vw",
								}}
								borderRadius={{ base: 10, "2xl": 10 }}
							></Select>
						</Box>
					</Box>
					<Flex
						wrap={"wrap"}
						gap={{
							base: "",
							xl: "1.5rem",
							lg: "3rem",
							"2xl": "1.2rem",
						}}
						// m={{ base: "" }}
					>
						<Box>
							<Input
								label="Address Line 1"
								placeholder={"B-373 Second Floor Sector - 20"}
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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
								lg: "0",
								xl: "0",
								"2xl": "0",
							}}
						>
							<Input
								label=" Address Line 2"
								placeholder={"B-373 Second Floor Sector - 20"}
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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
							base: "",
							xl: "1.5rem",
							lg: "3rem",
							"2xl": "1.2rem",
						}}
					>
						<Box>
							<Input
								label="Postal Code"
								placeholder={"201301"}
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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
							base: "",
							xl: "1.5rem",
							lg: "3rem",
							"2xl": "1.2rem",
						}}
						wrap={"wrap"}
						alignContent="center"
					>
						<Box mt={{ base: 2.5, lg: "10px", "2xl": "1rem" }}>
							<Text
								as="b"
								style={{
									fontSize: { base: "sm", "2xl": "lg" },
									color: "inputlabe",
									pl: "0",
									fontWeight: "600",
								}}
							>
								State
							</Text>

							<Box>
								<Select
									placeholder="Uttarpradesh"
									icon={<Icon name="Inputdropdown" />}
									h={{ base: "3rem", "2xl": "3rem" }}
									w={{
										base: "19rem",
										sm: "55vw",
										md: "50vw",
										lg: "37vw",
										xl: "28vw",
										"2xl": "25vw",
									}}
									borderRadius={{ base: 10, "2xl": 10 }}
								>
									<option value="option1">
										MadhyaPradesh
									</option>
									<option value="option2">Delhi</option>
								</Select>
							</Box>
						</Box>
						<Box
							mt={{
								base: "2.8rem",
								lg: "0",
								xl: "0",
								"2xl": "0",
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
										base: "19rem",
										sm: "55vw",
										md: "50vw",
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

					<Box mt={{ base: 2.5, lg: "0", "2xl": "1rem" }}>
						<Text
							as="b"
							style={{
								fontSize: { base: "sm", "2xl": "lg" },
								color: "inputlabe",
								pl: "0",
								fontWeight: "600",
							}}
						>
							Ownership Type
						</Text>

						<Box>
							<Select
								placeholder="-- Select --"
								icon={<Icon name="Inputdropdown" />}
								h={{ base: "3rem", "2xl": "3rem" }}
								w={{
									base: "19rem",
									sm: "55vw",
									md: "50vw",
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
							<Text color={"#11299E"}>
								+&nbsp; Add New Address
							</Text>
						</Buttons>
					</Box>
				</Flex>
			)}

			<Flex direction={"column"}>
				<Flex
					alignItems="center"
					gap={{ base: "2.1rem", "2xl": "3.8rem" }}
					mt="4.2rem"
					wrap="wrap"
				>
					<Box>
						<Buttons
							h="4rem"
							title="Save Changes"
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
						ml={{ base: "5.5rem", "2xl": "0" }}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default UpdateSellerAddress;
