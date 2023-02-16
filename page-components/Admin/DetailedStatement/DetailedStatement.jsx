import { Box, Center, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { Buttons, Cards, Icon, SearchBar, Tags } from "components";
import { useRef, useState } from "react";
import { DetailedStatementTable } from ".";

/**
 * A <DetailedStatement> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DetailedStatement></DetailedStatement>`
 */

const DetailedStatement = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required
	// const [isMobileScreen] = useMediaQuery("(max-width: 440px)");
	const [dateText, setDateText] = useState({
		from: "DD/MM/YYYY",
		to: "DD/MM/YYYY",
	});

	const fromRef = useRef(null);
	const toRef = useRef(null);

	const handleClickForInput = (type) => {
		if (type == "to") {
			toRef.current.click();
		} else {
			fromRef.current.click();
		}
	};

	function onChangeHandler(e) {
		setSearchValue(e);
	}
	return (
		<>
			<Box
				px={{ base: "16px", md: "initial" }}
				marginTop={{ base: "26px", md: "24px" }}
			>
				<Box
					display={{ base: "none", md: "flex" }}
					w={{ base: "90%", md: "100%" }}
					maxH={{
						base: "120vh",
						md: "20vw",
						lg: "12vw",
						"2xl": "10vw",
					}}
					margin={"auto"}
				>
					<Cards
						marginTop={{
							base: "1rem",
							md: "1.5rem",
							"2xl": "0.8rem",
						}}
						w={"100%"}
						h={"100%"}
					>
						<Flex
							flexDirection={"column"}
							justifyContent={"center"}
							h={"100%"}
							gap={{
								base: "10px",
								md: "6px",
								lg: "5px",
								"2xl": "15px",
							}}
							px={{ base: "3vw", md: "0" }}
						>
							<Flex
								justifyContent={"space-between"}
								direction={{ base: "column", md: "row" }}
							>
								<Text
									fontWeight={"semibold"}
									color={"light"}
									fontSize={{
										base: "16px",
										md: "11px",
										lg: "11px",
										"2xl": "18px",
									}}
								>
									Account information
								</Text>
								<Text
									color={"accent.DEFAULT"}
									fontSize={{
										base: "14px",
										md: "10px",
										lg: "9px",
										"2xl": "16px",
									}}
								>
									as on 04/01/2023
								</Text>
							</Flex>

							<Flex
								w={"100%"}
								align={{ base: "flex-start", md: "center" }}
								justifyContent={"space-between"}
								direction={{ base: "column", md: "row" }}
								gap={{ base: "15px", sm: "0px" }}
							>
								<Flex
									direction={"column"}
									gap={{
										base: "5px",
										md: "0px",
										"2xl": "5px",
									}}
								>
									<Text
										fontSize={{
											base: "14px",
											md: "10px",
											lg: "12px",
											"2xl": "16px",
										}}
										color={"light"}
									>
										Account Holder
									</Text>
									<Text
										fontSize={{
											base: "16px",
											md: "11px",
											lg: "13px",
											"2xl": "18px",
										}}
										color={"black"}
										fontWeight={"medium"}
									>
										{" "}
										Saurabh Mullick
									</Text>
								</Flex>
								<Flex
									gap={{
										base: "20px",
										lg: "8px",
										"2xl": "15px",
									}}
									align={"center"}
									justifyContent={{
										base: "space-between",
										md: "init",
									}}
									w={{ base: "100%", sm: "initial" }}
								>
									<Flex
										direction={"column"}
										gap={{
											base: "0px",
											md: "0px",
											"2xl": "5px",
										}}
									>
										<Text
											fontSize={{
												base: "14px",
												md: "10px",
												lg: "12px",
												"2xl": "16px",
											}}
											color={"light"}
										>
											Account Number
										</Text>
										<Text
											fontSize={{
												base: "16px",
												md: "11px",
												lg: "13px",
												"2xl": "18px",
											}}
											color={"black"}
											fontWeight={"medium"}
										>
											000300000517693
										</Text>
									</Flex>
									<Tags
										size={{
											base: "sm",
											md: "sm",
											lg: "sm",
											"2xl": "lg",
										}}
									/>
								</Flex>

								<Flex
									direction={"column"}
									gap={{
										base: "5px",
										md: "0px",
										"2xl": "5px",
									}}
								>
									<Text
										fontSize={{
											base: "14px",
											md: "10px",
											lg: "12px",
											"2xl": "16px",
										}}
										color={"light"}
									>
										Bank Name
									</Text>
									<Text
										fontSize={{
											base: "16px",
											md: "11px",
											lg: "13px",
											"2xl": "18px",
										}}
										color={"black"}
										fontWeight={"medium"}
									>
										ICICI Bank
									</Text>
								</Flex>
								<Flex
									direction={"column"}
									gap={{
										base: "5px",
										md: "0px",
										"2xl": "5px",
									}}
								>
									<Text
										fontSize={{
											base: "14px",
											md: "10px",
											lg: "12px",
											"2xl": "16px",
										}}
										color={"light"}
									>
										Account Type
									</Text>
									<Text
										fontSize={{
											base: "16px",
											md: "11px",
											lg: "13px",
											"2xl": "18px",
										}}
										color={"black"}
										fontWeight={"medium"}
									>
										Current ECP
									</Text>
								</Flex>
								<Flex
									direction={"column"}
									gap={{
										base: "5px",
										md: "0px",
										"2xl": "5px",
									}}
								>
									<Text
										fontSize={{
											base: "14px",
											md: "9px",
											lg: "12px",
											"2xl": "16px",
										}}
										color={"light"}
									>
										Current Balance
									</Text>
									<Flex
										align={"center"}
										color={"accent.DEFAULT"}
										gap={"5px"}
									>
										<Box
											w={{
												base: "10px",
												md: "8px",
												lg: "9.5px",
												"2xl": "12px",
											}}
											h={{
												base: "12px",
												md: "10px",
												lg: "11px",
												"2xl": "15px",
											}}
										>
											<Icon name="rupee" width="100%" />
										</Box>
										<Text
											fontSize={{
												base: "16px",
												md: "12px",
												lg: "14px",
												"2xl": "20px",
											}}
											color={"accent.DEFAULT"}
											fontWeight={"bold"}
										>
											15,893.00
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					</Cards>
				</Box>

				<Box>
					<SearchBar
						onChangeHandler={onChangeHandler}
						value={searchValue}
					/>
				</Box>

				{/* Mobile Date Filter */}
				<VStack
					display={{ base: "flex", md: "none" }}
					w={"100%"}
					my={"30px"}
					gap={"20px"}
					mb={"50px"}
				>
					<VStack align={"flex-start"} w={"full"}>
						<Text
							as={"span"}
							fontSize={"16px"}
							fontWeight={"semibold"}
						>
							Filter by date
						</Text>
						<Flex
							w={"100%"}
							justifyContent={"space-between"}
							direction={{ base: "column", sm: "row" }}
							gap={"20px"}
						>
							<Flex
								align={"center"}
								px={"2"}
								h={"48px"}
								w={{ base: "100%", sm: "50%" }}
								border={"1px solid #D2D2D2"}
								borderRadius={"10px"}
								overflow={"hidden"}
								onClick={(e) => handleClickForInput("from")}
								bg={"white"}
							>
								<Flex w={"100%"} align={"center"} h={"100%"}>
									<Flex
										onClick={(e) =>
											handleClickForInput("from")
										}
										pr={"3vw"}
										align={"center"}
										w={{ base: "20%", sm: "30%" }}
										h={"100%"}
										justifyContent={"end"}
									>
										<Text as={"span"}>From:</Text>
									</Flex>
									<Flex
										w={{ base: "60%", sm: "50%" }}
										h={"100%"}
									>
										<Box
											w={"100%"}
											h={"100%"}
											position={"relative"}
											display={"flex"}
											alignItems={"center"}
										>
											<Text as={"button"}>
												{dateText.from}
											</Text>
											<Input
												w={"2px"}
												size="xs"
												type="date"
												height={"100%"}
												ref={fromRef}
												onChange={(e) => {
													if (!e.target.value) {
														setDateText((prev) => {
															return {
																...prev,
																from: "DD/MM/YYYY",
															};
														});
													} else {
														setDateText((prev) => {
															return {
																...prev,
																from: e.target
																	.value,
															};
														});
													}
												}}
												border={"none"}
												focusBorderColor={"transparent"}
											/>
										</Box>
									</Flex>
									<Center w={"20%"} h={"100%"}>
										<Icon
											name="calender"
											width="23px"
											height="'24px"
										/>
									</Center>
								</Flex>
							</Flex>

							<Flex
								align={"center"}
								px={"2"}
								h={"48px"}
								w={{ base: "100%", sm: "50%" }}
								border={"1px solid #D2D2D2"}
								borderRadius={"10px"}
								overflow={"hidden"}
								bg={"white"}
								onClick={(e) => handleClickForInput("to")}
							>
								<Flex w={"100%"} align={"center"} h={"100%"}>
									<Flex
										pr={"3vw"}
										align={"center"}
										w={{ base: "15%", sm: "25%" }}
										h={"100%"}
										justifyContent={"end"}
									>
										<Text as={"span"}>To:</Text>
									</Flex>
									<Flex
										w={{ base: "65%", sm: "55%" }}
										h={"100%"}
									>
										<Box
											w={"100%"}
											h={"100%"}
											position={"relative"}
											display={"flex"}
											alignItems={"center"}
										>
											<Text as={"button"}>
												{dateText.to}
											</Text>
											<Input
												w={"2px"}
												size="xs"
												type="date"
												height={"100%"}
												ref={toRef}
												onChange={(e) => {
													if (!e.target.value) {
														setDateText((prev) => {
															return {
																...prev,
																to: "DD/MM/YYYY",
															};
														});
													} else {
														setDateText((prev) => {
															return {
																...prev,
																to: e.target
																	.value,
															};
														});
													}
												}}
												border={"none"}
												focusBorderColor={"transparent"}
											/>
										</Box>
									</Flex>
									<Center w={"20%"} h={"100%"}>
										<Icon
											name="calender"
											width="23px"
											height="'24px"
										/>
									</Center>
								</Flex>
							</Flex>
						</Flex>
					</VStack>
					<Buttons
						title={"Filter"}
						w={"100%"}
						h={{ base: "54px", sm: "50px" }}
					/>
				</VStack>

				<Box>
					<DetailedStatementTable />
				</Box>
			</Box>
		</>
	);
};

export default DetailedStatement;
