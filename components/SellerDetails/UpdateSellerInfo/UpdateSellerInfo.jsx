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
import Router from "next/router";
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
			w="full"
			h="auto"
			bg={{
				base: "none",
				md: "none",
				lg: "white",
				xl: "white",
				"2xl": "white",
			}}
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
			p={{
				base: "0px",

				md: "0px",
				lg: "20px",

				"2xl": "14px 30px 30px 30px",
			}}
			mt="20px"
		>
			{" "}
			<Box
				bg={{ base: "#FFFFFF", "2xl": "white" }}
				w={{ base: "full", lg: "100%" }}
				p={{ base: "12px", lg: "0px" }}
				borderRadius={{ base: "10px", md: "none" }}
				border={{ base: "1px solid #D2D2D2", md: "none" }}
			>
				<Flex direction={"column"}>
					<Heading
						fontSize={{ base: "18px", md: "1.2em", lg: "2xl" }}
						color={"#11299E"}
						fontWeight="semibold"
					>
						Angel Tech Private Limited
					</Heading>
					<Text
						fontSize={{ base: "12px", lg: "md" }}
						pt={{ base: "5px", md: "initial" }}
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
					mt={{ base: "", md: "1rem", "2xl": "1.2rem" }}
					color="#D2D2D2"
				/>
			)}
			<Flex
				bg="#FFFFFF"
				h="auto"
				direction={"column"}
				p={{
					base: "20px",
					sm: "20px",
					md: "20px",
					lg: "0px",
					xl: "0px",
				}}
				// m={{ base: "20px", md: "20px", lg: "0px" }}
				mt={{ base: "10px", lg: "0" }}
				mb={"20px"}
				borderRadius={{
					base: "10px",
					md: "10px",
					lg: "0px",
					xl: "0px",
				}}
				boxShadow={{
					base: "0px 5px 15px #0000000D",
					lg: "none",
					"2xl": "none",
				}}
				border={{
					base: " 1px solid #D2D2D2",
					md: "1px solid #D2D2D2",
					"2xl": "none",
					xl: "none",
					lg: "none",
				}}
				alignContent="center"
			>
				<Box mt={{ base: "0", sm: "", lg: "2rem", "2xl": "3.1rem" }}>
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
									md: "100%",
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
							<Text fontSize="sm">Created By</Text> :{"   "}
							&nbsp;
							<Text fontSize={"md"} fontWeight={"semibold"}>
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
					<Box
						w={{
							base: "100%",
							md: "100%",
							lg: "46%",
							xl: "34.5%",
							"2xl": "32%",
						}}
					>
						<Text
							fontSize={"md"}
							fontWeight="semibold"
							mb={{ base: "0.3rem", md: "", "2xl": "0.6rem" }}
						>
							Parent
						</Text>
						<Select
							placeholder="Vijay Kumar -- 9711217911 --21809910"
							w={{
								base: "100%",
								md: "100%",
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
					gap={{ base: "0", lg: "1.2rem" }}
					justifyContent={{ base: "space-between", lg: "flex-start" }}
				>
					<Text fontSize={"md"} fontWeight="semibold">
						Is he trained?
					</Text>
					<Box>
						{" "}
						<Switch colorScheme="green" size="lg" />
					</Box>
				</Flex>
				<Flex mt={"2.5rem"}>
					{" "}
					<Box
						w={{
							base: "100%",
							md: "100%",
							xl: "25vw",
							lg: "35vw",
							"2xl": "25vw",
						}}
					>
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
									base: "100%",
									md: "100%",
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
					</Box>
				</Flex>
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
							onClick={() =>
								Router.push(
									"/admin/my-network/profile/up-sell-info/preview-sell-info"
								)
							}
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

export default UpdateSellerInfo;
