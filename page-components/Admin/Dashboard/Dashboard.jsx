import {
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { Button, Calenders, Icon, IconButtons, PaddingBox } from "components";
import { useRef, useState } from "react";
import { BusinessDashboard, OnboardingDashboard } from ".";

/**
 * A <Dashboard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Dashboard></Dashboard>`
 */

const Dashboard = () => {
	return (
		<div>
			<PaddingBox>
				<DashboardHeadingFilter />
			</PaddingBox>
		</div>
	);
};

export default Dashboard;

// <===================Custom Dashboard Heading & Filters==============>

const DashboardHeadingFilter = () => {
	const [selectedDashboard, setSelectedDashboard] = useState("business");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const handleDashboardSelect = (dashboard) => {
		setSelectedDashboard(dashboard);
	};
	const initialRef = useRef();
	const today = new Date();
	const lastSevenDays = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() - 7
	);
	const fromDate = lastSevenDays.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
	const toDate = today.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});

	const [dateText, setDateText] = useState({
		fromDate,
		toDate,
	});
	{
		console.log("dateText", dateText);
	}
	const onDateChange = (e, type) => {
		if (type === "fromDate") {
			if (!e.target.value)
				setDateText((prev) => {
					return {
						...prev,
						fromDate: "DD/MM/YYYY",
					};
				});
			else
				setDateText((prev) => {
					return {
						...prev,
						fromDate: e.target.value,
					};
				});
		} else {
			if (!e.target.value)
				setDateText((prev) => {
					return {
						...prev,
						toDate: "DD/MM/YYYY",
					};
				});
			else
				setDateText((prev) => {
					return {
						...prev,
						toDate: e.target.value,
					};
				});
		}
	};

	return (
		<>
			<Flex
				py="25px"
				justifyContent={"space-between"}
				w={"100%"}
				wrap={"wrap"}
				bg={{ base: "white", md: "none" }}
				px={{ base: "16px", md: "initial" }}
				mb={{ base: "20px", md: "initial" }}
			>
				<Flex w={{ md: "50%", xl: "66%", "2xl": "50%" }}>
					<Menu>
						{({ isOpen }) => (
							<>
								<MenuButton isActive={isOpen}>
									<Flex alignItems={"baseline"}>
										<Flex
											direction="column"
											textAlign={"left"}
										>
											<Text
												fontSize={{
													base: "xl",

													md: "22px",

													xl: "2xl",
													"2xl": "3xl",
												}}
												fontWeight="semibold"
											>
												{selectedDashboard ===
												"onboarding"
													? "Onboarding Dashboard"
													: "Business Dashboard"}
											</Text>
											<Text
												fontSize={{
													base: "11px",
													md: "xs",
													xl: "sm",
													"2xl": "md",
												}}
											>
												{" "}
												{`${dateText.fromDate} - ${dateText.toDate}`}
											</Text>
										</Flex>
										{/* <Flex> */}
										<Icon
											pl="10px"
											h={{
												base: "14px",
												md: "14px",
												lg: "14px",
												"2xl": "13px",
											}}
											w={{
												base: "14px",
												md: "10px",
												lg: "12px",
												"2xl": "18px",
											}}
											name="arrow-drop-down"
											// transform={
											// 	isOpen
											// 		? "rotate(180deg)"
											// 		: "rotate(0)"
											// }
											// transform-origin="center"
										/>
									</Flex>
								</MenuButton>

								<MenuList
									w={{
										md: "250px",
										xl: "300px",
										"2xl": "350px",
									}}
								>
									<MenuItem
										onClick={() =>
											handleDashboardSelect("business")
										}
										justifyContent={"space-between"}
									>
										Business Dashboard
										{selectedDashboard === "business" && (
											<Icon
												name="check"
												width="14px"
												height="14px"
												ml={2}
											/>
										)}
									</MenuItem>
									<MenuItem
										onClick={() =>
											handleDashboardSelect("onboarding")
										}
										justifyContent={"space-between"}
									>
										Onboarding Dashboard
										{selectedDashboard === "onboarding" && (
											<Icon
												name="check"
												width="14px"
												ml={2}
											/>
										)}
									</MenuItem>
								</MenuList>
							</>
						)}
					</Menu>
				</Flex>

				{selectedDashboard === "business" ? (
					<Flex
						justifyContent={"space-between"}
						alignItems={"center"}
						w={{
							base: "100%",
							md: "50%",
							xl: "34%",
							"2xl": "28%",
						}}
						mt={{ base: "20px", md: "initial" }}
					>
						<Flex
							w={{ base: "155px", md: "97px" }}
							h="40px"
							bg="white"
							borderRadius={"10px"}
							border="card"
							alignItems={"center"}
							justifyContent={"center"}
						>
							<Text fontSize={"sm"}>Last 7 Days</Text>
						</Flex>
						<Flex display={{ base: "none", md: "flex" }}>
							<Text fontSize={"sm"}>Last 30 Days</Text>
						</Flex>
						<Flex>
							<IconButtons
								iconName="calender"
								iconPos="left"
								title="Date Range"
								onClick={onOpen}
								iconStyle={{
									width: "14px",
									height: "14px",
								}}
								textStyle={{
									fontSize: "md",
								}}
							/>
						</Flex>

						<Modal
							onClose={onClose}
							isOpen={isOpen}
							size={{ base: "xs", md: "xl" }}
							motionPreset="scale"
							initialFocusRef={initialRef}
						>
							<ModalContent
								ref={initialRef}
								position="absolute"
								left={{
									md: "23%",
									lg: "42%",
									xl: "58%",
									"2xl": "67.5%",
								}}
								top={{
									base: "23%",
									md: "10%",
									lg: "12%",
									xl: "10%",
									"2xl": "15%",
								}}
							>
								<ModalBody mt="20px">
									<Flex direction={"column"} w="100%">
										<Text
											fontSize={{
												base: "",
												md: "md",
												"2xl": "lg",
											}}
											fontWeight="semibold"
											mb="20px"
										>
											Select date range
										</Text>
										<Flex
											alignItems={"center"}
											direction={{
												base: "column",
												md: "row",
											}}
											gap={{ base: "20px", md: "0px" }}
										>
											<Flex w="100%">
												<Calenders
													// minDate={"2016-01-20"}
													// maxDate={"2020-01-20"}
													// label="Filter by activation date range"
													w="100%"
													placeholder="From"
													labelStyle={{
														fontSize: "lg",
														fontWeight: "semibold",
														mb: "1.2rem",
													}}
													inputContStyle={{
														w: "100%",
														h: "48px",
														borderRadius: {
															base: "10px",
															md: "10px 0px 0px 10px",
														},
														borderRight: {
															base: "flex",
															md: "none",
														},
													}}
													onChange={(e) =>
														onDateChange(
															e,
															"fromDate"
														)
													}
													value={dateText.fromDate}
												/>
											</Flex>
											<Flex w="100%">
												<Calenders
													// minDate={"2016-01-20"}
													// maxDate={"2020-01-20"}
													w="100%"
													placeholder="To"
													labelStyle={{
														fontSize: "lg",
														fontWeight: "semibold",
														mb: "1.2rem",
													}}
													inputContStyle={{
														w: "100%",
														h: "48px",
														borderRadius: {
															base: "10px",
															md: "0px 10px 10px 0px",
														},
													}}
													onChange={(e) =>
														onDateChange(
															e,
															"toDate"
														)
													}
													value={dateText.toDate}
												/>
											</Flex>
										</Flex>
									</Flex>
								</ModalBody>
								<ModalFooter>
									<Button
										onClick={onClose}
										h={{
											base: "37px",
											md: "54px",
											lg: "64px",
										}}
										w={{
											base: "71px",
											md: "100px",
											lg: "118px",
										}}
										fontSize={{
											base: "sm",
											md: "xl",
											"2xl": "2xl",
										}}
										mr="auto"
									>
										Apply
									</Button>
								</ModalFooter>
							</ModalContent>
						</Modal>
					</Flex>
				) : (
					""
				)}
			</Flex>

			{selectedDashboard === "business" ? (
				<BusinessDashboard />
			) : (
				<OnboardingDashboard />
			)}
		</>
	);
};
