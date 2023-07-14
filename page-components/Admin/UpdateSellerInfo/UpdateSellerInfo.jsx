import { Box, Divider, Flex, Select, Text } from "@chakra-ui/react";
import { Button, Calenders, Headings, Icon, Switch } from "components";
import Router from "next/router";
import { useState } from "react";
/**
 * A <UpdateSellerInfo> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<UpdateSellerInfo></UpdateSellerInfo>`
 */

const UpdateSellerInfo = () => {
	const test = true;
	const [visible, setVisible] = useState(test);
	console.log("visible", visible); //TODO confirm with deepak why use test here??

	return (
		<>
			<Headings title="Update Agent Information" />
			<Flex
				pb={{ base: "0", md: "40px" }}
				bg={{ base: "none", md: "white" }}
				direction="column"
				rowGap={{ base: "10px", md: "0" }}
				border={{ base: "", md: "card" }}
				borderRadius={{ base: "0", md: "10" }}
				boxShadow={{ base: "none", md: "0px 5px 15px #0000000D;" }}
				overflow={"hidden"}
				w="full"
				h="auto"
			>
				<Flex
					w="100%"
					pt="3.5"
					px={{ base: "4", md: "7.5" }}
					pb={{ base: "3.5", md: "5" }}
					bg="white"
					direction="column"
					rowGap={{ base: "10px", md: "0" }}
					borderBottom={{ base: "1px solid #D2D2D2", md: "none" }}
				>
					{" "}
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
							Click Cancel to return to Client HomePage without
							submitting information.
						</Text>
					</Text>
				</Flex>
				<Divider
					w={{ base: "0", md: "calc(100% - 60px)" }}
					mx="auto"
					color="divider"
				/>
				<Flex
					bg="white"
					h="auto"
					direction={"column"}
					px={{ base: "16px", md: "7.5" }}
					mx={{ base: "16px", md: "0px" }}
					mt={{ base: "18px", lg: "0" }}
					mb={"20px"}
					borderRadius={{ base: "10px", md: "0px" }}
					boxShadow={{ base: "0px 5px 15px #0000000D", md: "none" }}
					border={{ base: "1px solid #D2D2D2", md: "none" }}
					alignContent="center"
				>
					<Box mt={{ base: "16px", lg: "2rem", "2xl": "3.1rem" }}>
						<Text
							fontWeight={"semibold"}
							fontSize={{ base: "15px", md: "20px" }}
						>
							Membership related information
						</Text>
					</Box>
					<Flex direction="column">
						<Flex mt={{ base: "30px", "2xl": "20px" }} wrap="wrap">
							<Text
								color="#0C243B"
								fontSize={{ base: "sm", md: "md" }}
								fontWeight="semibold"
								mb="2.5"
							>
								Network Manager Assigned
							</Text>
						</Flex>
						<Flex
							direction={{ base: "column", md: "row" }}
							gap={{ base: "40px", md: "60px" }}
							alignItems={{ base: "none", md: "center" }}
						>
							<Flex
								w={{
									base: "100%",
									md: "400px",
									lg: "400px",
									xl: "500px",
								}}
							>
								{/* TODO: Use our own custom <Select> component */}
								<Select
									placeholder="--Select--"
									w="100%"
									h={"3rem"}
									borderRadius="10px"
									icon={
										<Icon
											name="caret-down"
											w="14px"
											h="10px"
										/>
									}
								>
									<option value="option1">Option 1</option>
									<option value="option2">Option 2</option>
								</Select>
							</Flex>
							<Flex>
								<Text fontSize="sm">Created By</Text> :{"   "}
								&nbsp;
								<Text fontSize={"md"} fontWeight={"semibold"}>
									Default ERO
								</Text>
							</Flex>
						</Flex>
					</Flex>
					<Flex direction="column" mt="40px" wrap="wrap">
						<Flex>
							<Text
								color="#0C243B"
								fontSize={{ base: "sm", md: "md" }}
								fontWeight="semibold"
								mb="2.5"
							>
								Parent
							</Text>
						</Flex>
						<Flex>
							<Flex
								w={{
									base: "100%",
									md: "400px",
									lg: "400px",
									xl: "500px",
								}}
							>
								{/* TODO: Use our own custom <Select> component */}
								<Select
									placeholder="--Select--"
									w="100%"
									h={"3rem"}
									borderRadius="10px"
									icon={
										<Icon
											name="caret-down"
											w="14px"
											h="10px"
										/>
									}
								>
									<option value="option1">Option 1</option>
									<option value="option2">Option 2</option>
								</Select>
							</Flex>
						</Flex>
					</Flex>
					<Flex
						mt={{ base: "3rem", "2xl": "2.8rem" }}
						gap={{ base: "0", md: "5rem", lg: "1.2rem" }}
						justifyContent={{
							base: "space-between",
							md: "flex-start",
						}}
					>
						<Text
							color="#0C243B"
							fontSize={{ base: "sm", md: "md" }}
							fontWeight="semibold"
						>
							Is he trained?
						</Text>
						<Box>
							<Switch
								setVisible={setVisible}
								initialValue={test}
							/>
						</Box>
					</Flex>
					<Flex mt={{ base: "3rem", "2xl": "2.8rem" }}>
						<Box w="100%">
							<Calenders
								label="Trained on"
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
									w: {
										base: "100%",
										md: "400px",
										lg: "400px",
										xl: "500px",
									},
									pos: "relative",
								}}
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
						<Button
							onClick={() =>
								Router.push(
									"/admin/my-network/profile/up-sell-info/preview-sell-info"
								)
							}
							h="3.5rem"
							fontSize="20px"
							fontWeight="bold"
							w={{
								base: "100%",
								sm: "10rem",
								md: "12.2rem",
							}}
						>
							Preview
						</Button>

						<Button
							color={"red"}
							fontSize={"20px"}
							fontWeight="bold"
							_focus={{
								bg: "white",
							}}
							variant="ghost"
							onClick={() => Router.back()}
						>
							Cancel
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</>
	);
};
export default UpdateSellerInfo;
