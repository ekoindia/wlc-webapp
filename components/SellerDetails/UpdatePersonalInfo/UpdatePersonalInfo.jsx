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
	Input as CInput,
} from "@chakra-ui/react";
import { Buttons, Input, Icon, IconButtons } from "../../";
import Router from "next/router";
/**
 * A <UpdatePersonalInfo> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdatePersonalInfo></UpdatePersonalInfo>`
 */
const UpdatePersonalInfo = ({ className = "", ...props }) => {
	const [value, setValue] = useState();
	const [files, setFiles] = useState(null);
	const inputRef = useRef();
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");
	const EnterRef = useRef();
	const [values, setValues] = React.useState("1");
	// const [isSmallerThan500] = useMediaQuery("(max-width: 1400px)");
	const [isTablet] = useMediaQuery("(max-width: 770px)");

	const [count, setCount] = useState(0); // TODO: Edit state as required
	const handleDragOver = (event) => {
		event.preventDefault();
	};

	const item = {
		Name: "Saurabh",
		LastName: "Mullick",
		ShopName: "Alam Store",
	};

	const handleDrop = (event) => {
		event.preventDefault();

		setFiles(event.dataTransfer.files);
		console.log(event);
	};
	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Box p={{ base: "16px", lg: "initial" }}>
			<Flex
				direction={"column"}
				w="full"
				h="auto"
				bg={{
					base: "none",

					md: "white",
				}}
				borderRadius="10px"
				boxShadow={{
					base: "none",

					md: "0px 5px 15px #0000000D",
				}}
				border={{
					base: "none",

					md: "1px solid #D2D2D2",
				}}
				p={{
					base: "0px",

					md: "20px",

					"2xl": "14px 30px 30px 30px",
				}}
				mt={{ base: "0px", md: "30px" }}
				// mx={{base:"16px", lg:"0"}}

				//
			>
				<Box
					w={{
						base: "100%",

						lg: "97%",
						xl: "70vw",
						"2xl": "51vw",
					}}
					alignItems={{ base: "center", "2xl": "none" }}
				>
					<Flex
						direction={"column"}
						// borderRadius={{ base: "10px" }}
						// border={{ base: "1px solid #D2D2D2", lg: "none" }}
						borderBottom={{ base: "1px solid #D2D2D2", md: "none" }}
						p={{ base: "12px", md: "0px" }}
						bg={"white"}
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

				<Flex display={{ base: "none", md: "flex" }}>
					<Divider color="hint" mt="15px" />
				</Flex>
				<Box
					bg="white"
					h="full"
					p={{
						base: "20px",

						md: "0px",
					}}
					borderRadius={{ base: "10px", md: "0" }}
					boxShadow={{
						base: "0px 5px 15px #0000000D",

						md: "none",
					}}
					border={{
						base: " 1px solid #D2D2D2",

						md: "none",
					}}
					mt={{ base: "18px", md: "40px" }}
					mb={"20px"}
					mx={{ base: "16px", md: "0px" }}
				>
					<VStack align={{ base: "none", "2xl": "" }}>
						<HStack
							justifyContent={"space-between"}
							mt={{ base: "0px", lg: "3.1rem" }}
							w={{
								base: "100%",

								lg: "80vw",
								xl: "65vw",
								"2xl": "54.5vw",
							}}
						>
							<Text
								fontSize={{
									base: "sm",
									md: "md",
								}}
								fontWeight="semibold"
							>
								Merchant information
							</Text>
							<Text
								color="error"
								fontSize={{
									base: "sm",
									md: "md",
								}}
							>
								* Mandatory
							</Text>
						</HStack>
						{!isTablet && (
							<Flex
								w={{
									base: "100%",
									md: "100%vw",

									xl: "66vw",
									"2xl": "54.5vw",
								}}
								p="20px"
								h={"9.375em"}
								bg="bg"
								alignItems={"center"}
								direction={{ base: "column", md: "row" }}
								borderRadius="10px"
								onDragOver={handleDragOver}
								onDrop={handleDrop}
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
										Drag and drop new image or click browse
										to change your photograph
									</Text>
								</Flex>
								<CInput
									type="file"
									onChange={(event) =>
										setFiles(event.target.files)
									}
									hidden
									ref={inputRef}
								/>

								<Flex>
									<Buttons
										w="8.125rem"
										h="3rem"
										title="Browse"
										onClick={() => inputRef.current.click()}
									/>
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
							<Flex
								gap={{
									base: "2.5rem",

									xl: "1rem",
									"2xl": "2.8rem",
								}}
								mt="2.4rem"
								wrap="wrap"
							>
								<Box
									w={{
										base: "100%",

										md: "46%",
										xl: "26.5%",
										"2xl": "20%",
									}}
								>
									<Input
										label="First Name"
										placeholder={"Saurabh"}
										required="true"
										value={item.Name}
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

												lg: "18.5rem",
												"2xl": "20.6875rem",
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

										md: "46%",
										xl: "26.5%",
										"2xl": "20%",
									}}
								>
									<Input
										label="Middle Name"
										placeholder={""}
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

												lg: "18.5rem",
												"2xl": "20.6875rem",
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

										md: "46%",
										xl: "30.5%",
										"2xl": "20%",
									}}
								>
									<Input
										label="Last Name"
										placeholder={"Mullick"}
										value={item.LastName}
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

												lg: "18.5rem",
												"2xl": "20.6875rem",
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

										md: "46%",
										xl: "26.5%",
										"2xl": "31%",
									}}
								>
									<Input
										label="Date of birth"
										placeholder={""}
										type="date"
										dateFormat="DD/MM/YYYY"
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

												lg: "25.5rem",
												"2xl": "20.6875rem",
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

									md: "46%",
									xl: "26.5%",
									"2xl": "31%",
								}}
							>
								<Box
									w={{
										base: "100%",

										lg: "18.5rem",
										xl: "26.5%",
										"2xl": "63%",
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
											Martial Status
										</Text>
									</Box>
									<Select
										placeholder="--Select--"
										h={{ base: "3rem", "2xl": "3rem" }}
										w={{
											base: "100%",

											lg: "25rem",
											"2xl": "20.6875rem",
										}}
										mt={{ base: "0.7rem", "2xl": "0" }}
										position="relative"
										borderRadius={{ base: 10, "2xl": 10 }}
										border="1px solid #D2D2D2;"
										_focus={{
											bg: "focusbg",
											boxShadow: "0px 3px 6px #0000001A",
											borderColor: "hint",
											transition:
												"box-shadow 0.3s ease-out",
										}}
										icon={
											<Icon
												name="caret-down"
												width="17px"
											/>
										}
									>
										<option value="option1">Married</option>
										<option value="option2">
											UnMarried
										</option>
									</Select>
								</Box>
							</Flex>
							<Flex
								mt="2.5rem"
								gap={{
									base: "2.5rem",
									xl: "1rem",
									"2xl": "2.8rem",
								}}
								wrap={"wrap"}
								alignItems={{ base: "", "2xl": "center" }}
							>
								<Box
									w={{
										base: "100%",

										md: "46%",
										xl: "26.5%",
										"2xl": "20%",
									}}
								>
									<Input
										label="Shop Name"
										placeholder={"Alam Store"}
										value={item.ShopName}
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

												lg: "18.5rem",
												"2xl": "20.6875rem",
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

										md: "46%",
										xl: "26.5%",
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

											lg: "18.5rem",

											"2xl": "20.6875rem",
										}}
										mt={{ base: "0.7rem", "2xl": "0" }}
										position="relative"
										borderRadius={{ base: 10, "2xl": 10 }}
										border="1px solid #D2D2D2;"
										_focus={{
											bg: "focusbg",
											boxShadow: "0px 3px 6px #0000001A",
											borderColor: "hint",
											transition:
												"box-shadow 0.3s ease-out",
										}}
										icon={
											<Icon
												name="caret-down"
												width="17px"
											/>
										}
									>
										<option value="option1">
											Option 1
										</option>
										<option value="option2">
											Option 2
										</option>
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
							}}
						>
							<Box
								w={{
									base: "100%",

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

										lg: "8.75rem",
									}}
									fontSize="md"
									fontWeight="bold"
								/>
							</Box>
							<Button
								color={"accent.DEFAULT"}
								fontSize="md"
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
				</Box>
			</Flex>
		</Box>
	);
};

export default UpdatePersonalInfo;
