import { Box, Flex, Select, Text } from "@chakra-ui/react";
import { Icon, Input } from "components";

/**
 * A <NewAddress> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NewAddress></NewAddress>`
 */
const NewAddress = () => {
	const item = {
		AddressLine1: "B-373 Second Floor Sector - 20",
		AddressLine2: "B-373 Second Floor Sector - 20",
		PostalCode: 201301,
		City: "Noida",
		State: "Uttarpradesh",
		Country: "India",
		OwnershipType: "123123",
	};

	return (
		<Box>
			<Box
				mt={{ base: 2.5, lg: "15px" }}
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
						Address Type
					</Text>
				</Flex>

				<Box>
					<Select
						placeholder="Permanent"
						w="100%"
						h={"3rem"}
						borderRadius="10px"
						icon={<Icon name="caret-down" />}
					>
						<option value="option1">Local</option>
					</Select>
				</Box>
			</Box>
			<Flex rowGap="2.5rem" direction="column">
				<Flex
					wrap={"wrap"}
					gap={{
						md: "1.7rem",
						xl: "1.5rem",
						lg: "2rem",
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
							defaultvalue={item.AddressLine1}
							// invalid={true}
							// errorMsg={"Please enter"}
							// mb={{ base: 10, "2xl": "4.35rem" }}
							// onChange={onChangeHandler}
							required="true"
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
					>
						<Input
							label="Address Line 2"
							defaultvalue={item.AddressLine2}
							// invalid={true}
							// errorMsg={"Please enter"}
							// mb={{ base: 10, "2xl": "4.35rem" }}
							// onChange={onChangeHandler}
						/>
					</Box>
				</Flex>
				<Flex
					wrap={"wrap"}
					gap={{
						md: "1.5rem",
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
							defaultvalue={item.PostalCode}
							// invalid={true}
							// errorMsg={"Please enter"}
							// mb={{ base: 10, "2xl": "4.35rem" }}
							// onChange={onChangeHandler}
							required="true"
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
					>
						<Input
							label="City"
							defaultvalue={item.City}
							// invalid={true}
							// errorMsg={"Please enter"}
							// mb={{ base: 10, "2xl": "4.35rem" }}
							// onChange={onChangeHandler}
						/>
					</Box>
				</Flex>
				<Flex
					gap={{
						md: "1.5rem",
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
								placeholder="UttarPradesh"
								w="100%"
								h={"3rem"}
								borderRadius="10px"
								icon={<Icon name="caret-down" />}
							>
								<option value="Delhi"></option>
							</Select>
						</Box>
					</Box>

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
							label="Country"
							required="true"
							defaultvalue={item.Country}
							// invalid={true}
							// errorMsg={"Please enter"}
							// mb={{ base: 10, "2xl": "4.35rem" }}
							// onChange={onChangeHandler}
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

export default NewAddress;
