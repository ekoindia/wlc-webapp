import React, { useEffect, useState } from "react";
import { Icon, Input } from "components";
import { Box, Flex, Select, Text } from "@chakra-ui/react";

/**
 * A <PermanentAddress> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PermanentAddress></PermanentAddress>`
 */
const PermanentAddress = (props) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	const item = {
		AddressLine1: "B-373 Second Floor Sector - 20",
		AddressLine2: "B-373 Second Floor Sector - 20",
		PostalCode: 201301,
		City: "Noida",
		State: "Uttarpradesh",
		Country: "India",
		OwnershipType: "123123",
	};

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Box mx={{ base: "16px", md: "0px" }}>
			<Box>
				<Text fontSize={"20px"} fontWeight="semibold" mt="4.688rem">
					Permanent Address
				</Text>
			</Box>
			<Flex rowGap="2.5rem" direction="column">
				<Flex
					wrap={"wrap"}
					gap={{
						md: "1.7rem",
						lg: "2rem",
						xl: "1.5rem",
						"2xl": "1.2rem",
					}}
					mt="1.2rem"
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
							// value={formData.address1}
							// onChange={handleInputChange}
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
							label=" Address Line 2"
							// value={formData.address2}
							// onChange={handleInputChange}
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
							// value={formData.PostalCode}
							// onChange={handleInputChange}
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
							// value={formData.City}
							// name="City"
							// onChange={handleInputChange}
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
								w="100%"
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
							// required="true"
							// value={formData.Country}
							// onChange={handleInputChange}
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
							w="100%"
							h={"3rem"}
							borderRadius="10px"
							icon={<Icon name="caret-down" />}
						>
							<option value="Permanent"></option>
						</Select>
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};

export default PermanentAddress;
