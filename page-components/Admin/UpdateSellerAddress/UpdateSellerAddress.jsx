import { useEffect, useState } from "react";

import {
	Box,
	Button,
	Divider,
	Flex,
	HStack,
	Select,
	Text,
} from "@chakra-ui/react";
import { Buttons, Icon, Input, Switch } from "components";
import { PermanentAddress, NewAddress } from ".";
/**
 * A <UpdateSellerAddress> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdateSellerAddress></UpdateSellerAddress>`
 */

const UpdateSellerAddress = ({ className = "", ...props }) => {
	const test = true;
	const [visible, setVisible] = useState(test);
	const [formCount, setFormCount] = useState(0);
	const [formData, setFormData] = useState({
		AddressLine1: "",
		AddressLine2: "",
		PostalCode: "",
		City: "",
		State: "",
		Country: "",
		OwnershipType: "",
	});

	useEffect(() => {
		setFormData({
			address1: "B-373 Second Floor Sector",
			address2: "B-373 Second Floor Sector - 20",
			PostalCode: 201301,
			City: "Noida",
			State: "Uttarpradesh",
			Country: "India",
			OwnershipType: "123123",
		});

		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	function handleAddNewAddress() {
		setFormCount((prevCount) => prevCount + 1);
	}

	//  Add new Address form render
	function renderForms() {
		const forms = [];

		for (let i = 1; i <= formCount; i++) {
			forms.push(
				<div key={i}>
					<Box>
						<Text
							fontSize={"20px"}
							fontWeight="semibold"
							mt="4.688rem"
						>
							New Address {i === 1 ? "" : i}
						</Text>
					</Box>

					<NewAddress />
				</div>
			);
		}

		return forms;
	}

	//  Edit Input value
	function handleInputChange(event) {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	}

	return (
		<Flex
			w="full"
			h="auto"
			p={{ base: "0px", md: "20px", "2xl": "14px 30px 30px 30px" }}
			direction={"column"}
			border={{ base: "", md: "card" }}
			borderRadius={{ base: "0", md: "10" }}
			boxShadow={{ base: "none", md: "0px 5px 15px #0000000D;" }}
			bg={{ base: "none", md: "white" }}
		>
			<Flex direction={"column"}>
				<Box
					bg={{ base: "white", "2xl": "none" }}
					alignItems={{ base: "center", "2xl": "none" }}
					borderBottom={{ base: "1px solid #D2D2D2", md: "none" }}
				>
					<Flex
						direction={"column"}
						p={{ base: "12px", md: "0px" }}
						boxShadow={{
							base: "0px 5px 15px #0000000D",
							md: "none",
						}}
						gap={{ base: "5px", md: "0px" }}
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
			</Flex>

			<Flex
				direction={"column"}
				bg={"white"}
				w={{ base: "93%", md: "100%" }}
				mt={{ base: "18px", md: "0px" }}
				mb={"20px"}
				mx={{ base: "16px", md: "0px" }}
				borderRadius={{ base: "10px", md: "0", "2xl": "none" }}
				border={{ base: "1px solid #D2D2D2", md: "0" }}
				boxShadow={{ base: "0px 5px 15px #0000000D", md: "none" }}
			>
				{/* Current Address */}
				<Flex
					direction={"column"}
					p={{ base: "15px", md: "px" }}
					mt={{ base: "0rem", md: "1rem", "2xl": "2.8rem" }}
				>
					<HStack
						justifyContent={"space-between"}
						// w={{ base: "100%", xl: "73%", "2xl": "66%" }}
						w={{
							base: "100%",
							lg: "736px",
							xl: "824px",
							"2xl": "1020px",
						}}
					>
						<Text
							fontSize={{ base: "md", md: "xl" }}
							fontWeight="semibold"
						>
							Current Address
						</Text>
						<Text color="error">* Mandatory</Text>
					</HStack>

					<Flex
						rowGap={{ base: "2.8rem", sm: "2.5rem" }}
						direction="column"
					>
						<Flex
							wrap={"wrap"}
							gap={{
								md: "1.7rem",
								lg: "2rem",
								xl: "1.5rem",
								"2xl": "1.2rem",
							}}
							mt={{ base: "2.25rem", md: "1.2rem" }}
							direction={"row"}
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "350px",
									xl: "400px",
									"2xl": "500px",
								}}
							>
								<Input
									label="Address Line 1"
									// defaultvalue={item.AddressLine1}
									name="address1"
									value={formData.address1}
									onChange={handleInputChange}
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
										h: { base: "3rem" },
										w: "100%",
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
								}}
								w={{
									base: "100%",
									md: "48%",
									lg: "350px",
									xl: "400px",
									"2xl": "500px",
								}}
							>
								<Input
									label=" Address Line 2"
									value={formData.address2}
									onChange={handleInputChange}
									// invalid={true}
									// errorMsg={"Please enter"}
									labelStyle={{
										fontSize: { base: "md" },
										color: "inputlabel",
										pl: "0",
										fontWeight: "600",
										mb: { base: 2.5, "2xl": "0.8rem" },
									}}
									inputContStyle={{
										h: { base: "3rem", "2xl": "3rem" },
										w: "100%",
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
								md: "1.7rem",
								lg: "2rem",
								xl: "1.5rem",
								"2xl": "1.2rem",
							}}
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "350px",
									xl: "400px",
									"2xl": "500px",
								}}
							>
								<Input
									label="Postal Code"
									name="PostalCode"
									value={formData.PostalCode}
									onChange={handleInputChange}
									// invalid={true}
									// errorMsg={"Please enter"}
									// mb={{ base: 10, "2xl": "4.35rem" }}

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
										w: "100%",
										pos: "relative",
										alignItems: "center",
									}}
								/>
							</Box>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "350px",
									xl: "400px",
									"2xl": "500px",
								}}
								mt={{
									base: "2.8rem",
									md: "0",
								}}
							>
								<Input
									label=" City"
									value={formData.City}
									name="City"
									onChange={handleInputChange}
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

										w: "100%",
										pos: "relative",
										alignItems: "center",
									}}
								/>
							</Box>
						</Flex>
						<Flex
							gap={{
								md: "1.7rem",
								lg: "2rem",
								xl: "1.5rem",
								"2xl": "1.2rem",
							}}
							wrap={"wrap"}
							alignContent="center"
						>
							<Box
								w={{
									base: "100%",
									md: "48%",
									lg: "350px",
									xl: "400px",
									"2xl": "500px",
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
											// lg: "34vw",
											// xl: "28vw",
											// "2xl": "25vw",
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
								}}
								w={{
									base: "100%",
									md: "48%",
									lg: "350px",
									xl: "400px",
									"2xl": "500px",
								}}
							>
								<Input
									label=" Country"
									name="Country"
									required="true"
									value={formData.Country}
									onChange={handleInputChange}
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
										w: "100%",

										pos: "relative",
										alignItems: "center",
									}}
								/>
							</Box>
						</Flex>

						<Box
							w={{
								base: "100%",
								md: "48%",
								lg: "350px",
								xl: "400px",
								"2xl": "500px",
							}}
						>
							<Flex mb={{ base: 2.5, "2xl": "0.8rem" }}>
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
									Ownership Type
								</Text>
							</Flex>

							<Box
								w={{
									base: "100%",
									// md: "48%",
									lg: "350px",
									xl: "400px",
									"2xl": "500px",
								}}
							>
								<Select
									placeholder="Permanent"
									w={{
										base: "100%",
										// 		xl: "25vw",
										// 		lg: "350px",
										// xl: "400px",
										// "2xl": "500px",
									}}
									h={"3rem"}
									borderRadius="10px"
									icon={<Icon name="caret-down" />}
								>
									<option value="Permanent"></option>
								</Select>
							</Box>
						</Box>
					</Flex>
					{/* switch */}
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
							<Switch
								setVisible={setVisible}
								initialValue={test}
							/>
						</Box>
					</Flex>
				</Flex>

				{/* Permanent Address */}

				<Flex display={{ base: "none", md: "flex" }} direction="column">
					{!visible ? <PermanentAddress /> : ""}
				</Flex>

				{/* New Address */}
				<Flex display={{ base: "none", md: "flex" }} direction="column">
					{renderForms()}
				</Flex>

				<Flex
					gap={{ md: "70px" }}
					mt="30px"
					p={{ base: "20px", md: "0px" }}
					direction="column"
				>
					<Flex display={{ base: "none", md: "flex" }}>
						<Buttons
							w="15rem"
							h="3.5rem"
							bg="white"
							_hover="none"
							border="1px solid #11299E"
							boxShadow="0px 3px 10px #11299E33"
							onClick={handleAddNewAddress}
						>
							<Text
								color={"accent.DEFAULT"}
								fontSize="20px"
								fontWeight={"bold"}
							>
								+&nbsp; Add New Address
							</Text>
						</Buttons>
					</Flex>
					<Flex
						direction={{ base: "column", sm: "row" }}
						alignItems="center"
						gap={{ base: "2.1rem", md: "4.8rem", "2xl": "4.8rem" }}
					>
						<Buttons
							h="3.5rem"
							title="Save Changes"
							fontSize="20px"
							fontWeight="bold"
							w={{
								base: "100%",
								sm: "10rem",
								md: "12.2rem",
							}}
						/>

						<Button
							color={"accent.DEFAULT"}
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
		</Flex>
	);
};
export default UpdateSellerAddress;
