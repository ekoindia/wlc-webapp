import React, { useEffect, useState } from "react";
import {
	Box,
	Text,
	Heading,
	Divider,
	Flex,
	useMediaQuery,
	Select,
	Button,
	Switch,
} from "@chakra-ui/react";
import { Buttons, Input, Icon, IconButtons } from "../../";
import { redirect } from "next/dist/server/api-utils";
/**
 * A <UpdateSellerInfo> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdateSellerInfo></UpdateSellerInfo>`
 */
const UpdateSellerInfo = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0);
	const [isTablet] = useMediaQuery("(max-width: 820px)"); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Flex
			w={{ base: "", xl: "100%", "2xl": "100%" }}
			h={{ base: "950px", md: "full", "2xl": "39.5vw" }}
			bg={{ base: "#F5F6F8", "2xl": "white" }}
			border={{
				base: "",
				sm: "",
				xl: "1px solid #D2D2D2",
				"2xl": "1px solid #D2D2D2",
			}}
			borderRadius={{
				base: "",
				md: "10px",
				md: "10px",
				xl: "10px",
				"2xl": "10px",
			}}
			boxShadow={{
				base: "",
				xl: "0px 5px 15px #0000000D",
				"2xl": "0px 5px 15px #0000000D",
			}}
			direction="column"

			// p="20px"
		>
			{" "}
			<Box
				bg={{ base: "#FFFFFF", "2xl": "white" }}
				w={{ base: "full", lg: "100%", xl: "99.9%", "2xl": "60vw" }}
				m={{ base: "0px", sm: "0px", "2xl": "1.5rem 0 1rem 1.9rem" }}
				alignItems={{ base: "center", "2xl": "none" }}
				p={{ base: "0px", lg: "20px", "2xl": "0px" }}
			>
				<Flex direction={"column"}>
					<Heading
						fontSize={{ base: "1.1rem", "2xl": "1.5em" }}
						color={"#11299E"}
						mt={"24px"}
						fontWeight="semibold"
						m={{
							base: "7px 0px 0px 10px",
							sm: "0px",
							"2xl": "0px",
						}}
					>
						Angel Tech Private Limited
					</Heading>
					<Text
						fontSize={{ base: "0.8em", "2xl": "1em" }}
						m={{
							base: "6px 0px 0px 10px",
							sm: "0px",
							md: "8px",
							lg: "5px",
							"2xl": "0px",
						}}
						color="#0F0F0F"
					>
						Edit the fields below and click Preview. Click Cancel to
						return to Client HomePage without submitting
						information.
					</Text>
				</Flex>
			</Box>
			{!isTablet && (
				<Divider
					ml={{
						md: "1rem",
						xl: "0",
						"2xl": "1.8rem",
					}}
					color="#D2D2D2"
					w={{ base: "none", md: "80%", xl: "", "2xl": "96%" }}
				/>
			)}
			<Box
				bg="#FFFFFF"
				w={{
					base: "85vw",
					lg: "100%",
					md: "90%",
					xl: "100%",
					"2xl": "51vw",
				}}
				m={{
					base: "1.1rem 0px 0px 10px",
					md: "1.1rem 0px 0px 0px",
					"2xl": "0px 0px 0px 1.875rem",
					sm: "0px",
					lg: "0",
					md: "2rem",
					xl: "0px",
				}}
				borderRadius={{
					base: "10px",
					md: "10px",
					lg: "0px",
					xl: "0px",
				}}
				boxShadow={{
					base: "0px 5px 15px #0000000D",
					"2xl": "none",
					lg: "0px 5px 15px #0000000D",
				}}
				border={{
					base: " 1px solid #D2D2D2",
					md: "1px solid #D2D2D2",
					"2xl": "none",
					xl: "none",
					lg: "none",
				}}
				p={{
					base: "15px",
					md: "1.1rem 0 1rem 7rem",
					lg: "1.1rem 0 1rem 1rem",
					xl: "2rem",
					"2xl": "0px",
				}}
				alignContent="center"
			>
				<Box mt={{ base: "0", sm: "", "2xl": "3.1rem" }}>
					<Text
						fontWeight="bold"
						fontSize={{ base: "15px", "2xl": "20px" }}
					>
						Membership related information
					</Text>
				</Box>
				<Flex
					mt={{ base: "2.5rem", "2xl": "20px" }}
					wrap="wrap"
					direction="column"
				>
					<Box>
						<Text
							fontSize={{ base: "0.9rem", "2xl": "1rem" }}
							fontWeight="semibold"
							mb={{ base: "0.3rem", md: "", "2xl": "0.6rem" }}
						>
							Network Manager Assigned
						</Text>
					</Box>
					<Flex
						direction={{
							base: "column",
							md: "column",
							xl: "row",
							lg: "row",
							"2xl": "row",
						}}
						gap={{
							base: "",
							xl: "3.7rem",
							lg: "3.7rem",
							"2xl": "3.7rem",
						}}
						alignItems={{
							base: "none",
							md: "none",
							lg: "center",
							xl: "center",
							"2xl": "center",
						}}
					>
						<Flex>
							<Select
								placeholder="--Select--"
								w={{
									base: "17rem",
									md: "50vw",
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

						<Flex
							display={"flex"}
							mt={{
								base: "2.5rem",
								lg: "0rem",
								xl: "0",
								"2xl": "0",
							}}
						>
							<Text fontSize="0.9rem">Created By</Text> :{"   "}
							&nbsp;
							<Text fontSize={"1rem"} fontWeight={"semibold"}>
								Default ERO
							</Text>
						</Flex>
					</Flex>
				</Flex>

				<Flex
					mt={{ base: "2.5rem", "2xl": "2.8rem" }}
					alignItems="center"
					wrap="wrap"
				>
					<Box>
						<Text fontSize={"16px"} fontWeight="semibold">
							Parent
						</Text>
						<Select
							placeholder="Vijay Kumar -- 9711217911 --21809910"
							w={{
								base: "17rem",
								md: "50vw",
								lg: "35vw",
								xl: "25vw",
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
				</Flex>
				<Flex
					mt={{ base: "3rem", "2xl": "2.8rem" }}
					gap={{ base: "7.3rem", "2xl": "1.4rem" }}
				>
					<Text fontSize={"16px"} fontWeight="semibold">
						Is he trained?
					</Text>
					<Box>
						{" "}
						<Switch colorScheme="green" size="lg" />
					</Box>
				</Flex>
				<Flex mt={"2.5rem"}>
					{" "}
					<Input
						label="Trained on"
						placeholder={""}
						type="date"
						dateFormat="DD/MM/yyyy"
						icon={<Icon name="celender" />}
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
							w: {
								base: "17rem",
								md: "50vw",
								lg: "35vw",
								xl: "25vw",
								"2xl": "25vw",
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
				</Flex>

				<Flex
					alignItems="center"
					gap={{ base: "2.1rem", "2xl": "3.8rem" }}
					mt="4.3rem"
					wrap="wrap"
				>
					<Box>
						<Buttons
							h="3.5rem"
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
						ml={{ base: "5.5rem", "2xl": "0" }}
					>
						Cancel
					</Button>
				</Flex>
			</Box>
		</Flex>
	);
};

export default UpdateSellerInfo;
