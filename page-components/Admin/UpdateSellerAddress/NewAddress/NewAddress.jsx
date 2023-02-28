import React, { useEffect, useState } from "react";
import { Icon, Input, Buttons } from "components";
import { Box, Flex, Select, Text } from "@chakra-ui/react";

/**
 * A <NewAddress> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NewAddress></NewAddress>`
 */
const NewAddress = ({ className = "", ...props }) => {
	// TODO: Edit state as required

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
		<Box>
			<Box mt={{ base: 2.5, lg: "15px" }}>
				<Box mb={{ base: 2.5, "2xl": "" }}>
					<Text
						as="b"
						style={{
							fontSize: "md",
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
							lg: "48%",
							xl: "34.5%",
							"2xl": "32%",
						}}
					>
						<Select
							placeholder="--Select--"
							w={{
								base: "100%",
								md: "43vw",
								lg: "34vw",
								xl: "28vw",
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
						md: "1.7rem",
						xl: "1.5rem",
						lg: "3.1rem",
						"2xl": "1.2rem",
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
							defaultvalue={item.AddressLine1}
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
									lg: "34vw",
									xl: "28vw",
									"2xl": "25vw",
								},
								pos: "relative",
								alignItems: "center",
							}}
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
							lg: "46%",
							xl: "34.5%",
							"2xl": "31%",
						}}
					>
						<Input
							label=" Address Line 2"
							defaultvalue={item.AddressLine2}
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
									lg: "34vw",
									xl: "28vw",
									"2xl": "25vw",
								},
								pos: "relative",
								alignItems: "center",
							}}
						/>
					</Box>
				</Flex>
				<Flex
					wrap={"wrap"}
					gap={{
						md: "1.5rem",
						lg: "3.1rem",
						xl: "1.5rem",
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
							defaultvalue={item.PostalCode}
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
									lg: "34vw",
									xl: "28vw",
									"2xl": "25vw",
								},
								pos: "relative",
								alignItems: "center",
							}}
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
						}}
					>
						<Input
							label=" City"
							defaultvalue={item.City}
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
									lg: "34vw",
									xl: "28vw",
									"2xl": "25vw",
								},
								pos: "relative",
								alignItems: "center",
							}}
						/>
					</Box>
				</Flex>
				<Flex
					gap={{
						md: "1.5rem",
						lg: "3.1rem",
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
									lg: "34vw",
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
							required="true"
							defaultvalue={item.Country}
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
									lg: "37vw",
									xl: "28vw",
									"2xl": "25vw",
								},
								pos: "relative",
								alignItems: "center",
							}}
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
								md: "43vw",
								lg: "34vw",
								xl: "28vw",
								"2xl": "25vw",
							}}
							borderRadius={{ base: 10, "2xl": 10 }}
						></Select>
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};

export default NewAddress;
