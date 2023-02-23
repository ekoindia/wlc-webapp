import {
	Box,
	Button,
	Divider,
	Flex,
	Select,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Buttons, Icon, Input, Switch } from "components";
import Router from "next/router";
import { useEffect, useState } from "react";
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
				md: "white",
			}}
			border={{
				base: "",

				md: "1px solid #D2D2D2",
			}}
			borderRadius={{
				base: "",
				md: "10px",
			}}
			boxShadow={{
				base: "none",
				md: "0px 5px 15px #0000000D",
			}}
			direction="column"
			p={{
				base: "0px",
				md: "20px",
				"2xl": "14px 30px 30px 30px",
			}}
			// mt={{ base: "0px", md: "30px" }}
		>
			{" "}
			<Box
				bg={{ base: "#FFFFFF", "2xl": "white" }}
				w={{ base: "100%" }}
				borderBottom={{ base: "1px solid #D2D2D2", md: "none" }}
			>
				<Flex direction={"column"} p={{ base: "12px", md: "0px" }}>
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
							Click Cancel to return to Client HomePage without
							submitting information.
						</Text>
					</Text>
				</Flex>
			</Box>
			<Flex display={{ base: "none", md: "flex" }}>
				<Divider color="hint" mt="15px" />
			</Flex>
			<Flex
				bg="white"
				h="auto"
				direction={"column"}
				p={{
					base: "20px",

					md: "0px",
				}}
				mx={{ base: "16px", md: "0px" }}
				mt={{ base: "18px", lg: "0" }}
				mb={"20px"}
				borderRadius={{
					base: "10px",

					md: "0px",
				}}
				boxShadow={{
					base: "0px 5px 15px #0000000D",
					md: "none",
				}}
				border={{
					base: " 1px solid #D2D2D2",
					md: "none",
				}}
				alignContent="center"
			>
				<Box mt={{ base: "0", sm: "", lg: "2rem", "2xl": "3.1rem" }}>
					<Text
						fontWeight="bold"
						fontSize={{ base: "15px", md: "20px" }}
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
							fontSize={{ base: "0.9rem", md: "1rem" }}
							fontWeight="semibold"
							mb={{ base: "0.3rem", md: "", md: "0.6rem" }}
						>
							Network Manager Assigned
						</Text>
					</Box>
					<Flex
						direction={{
							base: "column",
							md: "row",
						}}
						gap={{
							base: "",
							md: "3.7rem",
						}}
						alignItems={{
							base: "none",
							md: "center",
						}}
					>
						<Flex
							w={{
								base: "100%",
								md: "60%",
								lg: "46%",
								xl: "34.5%",
								"2xl": "32%",
							}}
						>
							<Select
								placeholder="--Select--"
								w={{
									base: "100%",
									md: "55vw",
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
								md: "0rem",
							}}
							alignItems={"center"}
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
							md: "60%",
							lg: "46%",
							xl: "34.5%",
							"2xl": "32%",
						}}
					>
						<Text
							fontSize={"md"}
							fontWeight="semibold"
							mb={{ base: "0.3rem", md: "", md: "0.6rem" }}
						>
							Parent
						</Text>
						<Select
							placeholder="Vijay Kumar -- 9711217911 --21809910"
							w={{
								base: "100%",
								md: "55vw",
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
					gap={{ base: "0", md: "5rem", lg: "1.2rem" }}
					justifyContent={{ base: "space-between", md: "flex-start" }}
				>
					<Text fontSize={"md"} fontWeight="semibold">
						Is he trained?
					</Text>
					<Box>
						<Switch />
					</Box>
				</Flex>
				<Flex mt={"2.5rem"}>
					{" "}
					<Box
						w={{
							base: "100%",

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
									md: "55vw",
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
					gap={{
						base: "2.1rem",
						md: "4.8rem",
						"2xl": "4.8rem",
					}}
					mt="4.2rem"
					justifyContent={"flex-start"}
					direction={{ base: "column", sm: "row" }}
				>
					<Buttons
						onClick={() =>
							Router.push(
								"/admin/my-network/profile/up-sell-info/preview-sell-info"
							)
						}
						h="3.5rem"
						title="Preview"
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
	);
};

export default UpdateSellerInfo;
