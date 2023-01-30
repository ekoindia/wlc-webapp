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
} from "@chakra-ui/react";
import { Buttons, Input, Icon } from "../../";
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

	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Flex
			direction={"column"}
			// bg="white"
			bg={"pink"}
			// height="67.5rem"
			width={"100%"}
			// width="100.625rem"
		>
			<Box ml="1.875em">
				<Flex direction={"column"}>
					<Heading
						fontSize={"1.5em"}
						color={"#11299E"}
						font={"normal normal bold 24px/18px Inter"}
						mt={"24px"}
						fontWeight="semibold"
					>
						Angel Tech Private Limited
					</Heading>
					<Text fontSize={"md"} mt={"0.4rem"}>
						Edit the fields below and click Preview. Click Cancel to
						return to Client HomePage without submitting
						information.
					</Text>
				</Flex>
				<Divider mt={"1rem"} />
				<Flex display={"flex"} mt="4.438rem" gap="45rem">
					<Text
						fontSize={"xl"}
						font={"normal normal medium 20px/18px Inter"}
					>
						Merchant information
					</Text>
					<Text color="#FF4081">* Mandatory</Text>
				</Flex>
				<Flex
					w={"63.75em"}
					h={"9.375em"}
					bg="#F5F6F8"
					alignItems={"center"}
				>
					<Circle bg="divider" size={28} ml="20px">
						<Avatar w="90" h="90" src="/images/seller_logo.jpg" />
					</Circle>
					<Text color="#555555" pl="30px" fontSize={"md"}>
						Drag and drop new image or click browse to change your
						photograph
					</Text>
					<Box pl="10rem">
						<Buttons w="8.125rem" h="3rem" title="Browse" />
					</Box>
				</Flex>
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
								w: { base: "19.688rem" },
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
								w: { base: "19.688rem" },
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
								w: { base: "19.688rem" },
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
							w: { base: "31.25rem" },
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
					<RadioGroup onChange={setValue} value={value} mt="0.8rem">
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
							w="31.25rem"
							h="3rem"
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
						<MenuList w="31.25rem">
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
								w: { base: "19.688rem" },
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
								w="19.688rem"
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

				<Flex alignItems="center" gap="2rem" mt="2rem">
					<Box>
						<Buttons w="8.75rem" h="4rem" title="Preview" />
					</Box>
					<Button
						color="#11299E"
						fontSize={"1.2rem"}
						fontWeight="semibold"
						background={"none"}
					>
						Cancel
					</Button>
				</Flex>
			</Box>
		</Flex>
	);
};

export default UpdatePersonalInfo;
