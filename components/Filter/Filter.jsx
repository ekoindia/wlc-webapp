import React from "react";

import {
	Box,
	Button,
	Center,
	Checkbox,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	HStack,
	Input,
	Stack,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { Buttons, Icon, IconButtons } from "..";

function Filter() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	return (
		<>
			<Box display={{ base: "none", md: "initial" }}>
				<Button
					// mt={{ base: "1vw", "2xl": ".5vw" }}
					display={"flex"}
					justifyContent={"space-evenly"}
					alignItems={"center"}
					ref={btnRef}
					onClick={onOpen}
					h={{
						base: "8.5vw",
						sm: "5vw",
						md: "4vw",
						lg: "3vw",
						xl: "2.6vw",
						"2xl": "2.2vw",
					}}
					w={{
						base: "8vw",
						sm: "12vw",
						md: "10vw",
						lg: "7vw",
						xl: "7vw",
						"2xl": "6vw",
					}}
					bg="#FFFFFF"
					color="#11299E"
					border="1px solid #11299E"
					boxShadow=" 0px 3px 10px #11299E1A"
					borderRadius={{
						base: "10px",
						md: "8px",
						lg: "10px",
						"2xl": "10px",
					}}
					_hover={{
						bg: "white",
					}}
					_active={{
						bg: "white",
					}}
				>
					<Center
						width={{
							base: "10px",
							sm: "12px",
							md: "12px",
							lg: "14px",
							xl: "16px",
							"2xl": "20px",
						}}
						height={{
							base: "10px",
							sm: "12px",
							md: "12px",
							lg: "14px",
							xl: "16px",
							"2xl": "20px",
						}}
						mr={"2px"}
					>
						<Icon name="filter" />
					</Center>
					<Text
						as="span"
						color="#11299E"
						fontSize={{
							base: "5px",
							sm: "xs",
							md: "xs",
							lg: "xs",
							xl: "sm",
							"2xl": "xl",
						}}
						lineHeight={1}
					>
						Filter
					</Text>
				</Button>
			</Box>

			<Box display={{ base: "initial", md: "none" }}>
				<Button
					display={"flex"}
					gap={"10px"}
					ref={btnRef}
					onClick={onOpen}
					w={"100%"}
					h={"100%"}
					bg="primary.DEFAULT"
					color="#11299E"
					borderRadius={"0px"}
					boxShadow=" 0px 3px 10px #11299E1A"
				>
					<Icon name="filter" width="25px" color="white" />
					<Text
						as="span"
						color="white"
						fontSize={"18px"}
						lineHeight={"0"}
						fontWeight={"semibold"}
					>
						Filter
					</Text>
				</Button>
			</Box>

			<Drawer
				isOpen={isOpen}
				placement="right"
				onClose={onClose}
				finalFocusRef={btnRef}
				size={{
					base: "full",
					sm: "xs",
					md: "sm",
					lg: "xs",
					xl: "sm",
					"2xl": "md",
				}}
			>
				<DrawerOverlay
					bg="#e9edf1b3"
					backdropFilter="blur(6px)"
					width={"100%"}
					h={"100%"}
				/>
				<DrawerContent
					borderTopRadius={{ base: "20px", sm: "0px" }}
					mt={{ base: "8", sm: "0px" }}
					p={"10px"}
				>
					<DrawerHeader>
						<Box
							display={"flex"}
							justifyContent={"space-between"}
							w={"100%"}
							py={{
								base: "5px",
								sm: "0px",
								"2xl": ".5vw",
							}}
							px={{
								base: "3px",
								sm: "0px",
								md: "0px",
								lg: "0px",
								xl: "0px",
								"2xl": "1.2vw",
							}}
						>
							<Box
								display={"flex"}
								alignItems={"center"}
								gap={"10px"}
								fontWeight={"semibold"}
							>
								<Center
									w={{
										base: "15px",
										sm: "15px",
										md: "20px",
										lg: "20px",
										xl: "20px",
										"2xl": "25px",
									}}
								>
									<Icon name="filter" width="100%" />
								</Center>
								<Text
									fontSize={{
										base: "md",
										sm: "md",
										md: "sm",
										lg: "md",
										xl: "md",
										"2xl": "2xl",
									}}
									fontWeight={"semibold"}
								>
									Filter
								</Text>
							</Box>
							<Box
								display={"flex"}
								gap={"3px"}
								alignItems={"center"}
								onClick={onClose}
								fontSize="18px"
								cursor={"pointer"}
								color={"light"}
								lineHeight="0px"
							>
								<Center
									w={{
										base: "15px",
										sm: "15px",
										md: "20px",
										lg: "20px",
										xl: "16px",
										"2xl": "25px",
									}}
								>
									<Icon name="close-outline" width="100%" />
								</Center>
								<Text
									fontSize={{
										base: "sm",
										sm: "xs",
										md: "sm",
										lg: "sm",
										xl: "sm",
										"2xl": "xl",
									}}
								>
									Close
								</Text>
							</Box>
						</Box>
					</DrawerHeader>

					<DrawerBody>
						<Stack
							gap={{ base: "5vw", sm: "5vw" }}
							py={{
								base: "1",
								sm: "8",
								md: "0px",
								lg: "1px",
								xl: "3",
								"2xl": "1.3vw",
							}}
							px={{
								base: "2",
								sm: "0",
								md: "0px",
								lg: "0px",
								xl: "0px",
								"2xl": "1.2vw",
							}}
						>
							<VStack
								w={"100%"}
								gap={{
									base: "6",
									lg: "6",
									xl: "8",
									"2xl": "17",
								}}
							>
								<VStack
									align={"flex-start"}
									w={"full"}
									gap={{
										base: "px",
										sm: "px",
										md: "0.5",
										lg: "0.5",
										xl: "0.5",
										"2xl": "2.5",
									}}
								>
									<Text
										as={"span"}
										fontSize={{
											base: "sm",
											sm: "sm",
											md: "sm",
											lg: "sm",
											xl: "md",
											"2xl": "lg",
										}}
										fontWeight={"semibold"}
									>
										Filter by profile type
									</Text>
									<HStack
										w={"100%"}
										gap={{ base: "3px", md: "10px" }}
									>
										<Box w={"fit-content"} h={"100%"}>
											<Checkbox
												variant="rounded"
												spacing={"2"}
												size={{
													base: "sm",
													sm: "sm",
													md: "sm",
													lg: "sm",
													xl: "sm",
													"2xl": "lg",
												}}
											>
												iMerchant
											</Checkbox>
										</Box>
										<Box
											w={"fit-content"}
											h={"100%"}
											px={{
												base: "0px",
												md: "5px",
												xl: "20px",
												"2xl": "30px",
											}}
										>
											<Checkbox
												spacing={"2"}
												variant="rounded"
												size={{
													base: "sm",
													sm: "sm",
													md: "sm",
													lg: "sm",
													xl: "sm",
													"2xl": "lg",
												}}
											>
												Seller
											</Checkbox>
										</Box>
										<Box w={"fit-content"} h={"100%"}>
											<Checkbox
												spacing={"2"}
												variant="rounded"
												size={{
													base: "sm",
													sm: "sm",
													md: "sm",
													lg: "sm",
													xl: "sm",
													"2xl": "lg",
												}}
											>
												Distributer
											</Checkbox>
										</Box>
									</HStack>
								</VStack>
								<VStack
									align={"flex-start"}
									w={"full"}
									gap={{
										base: "px",
										sm: "px",
										md: "0.5",
										lg: "0.5",
										xl: "0.5",
										"2xl": "2.5",
									}}
								>
									<Text
										as={"span"}
										fontSize={{
											base: "sm",
											sm: "sm",
											md: "sm",
											lg: "sm",
											xl: "md",
											"2xl": "lg",
										}}
										fontWeight={"semibold"}
									>
										Filter by account status
									</Text>
									<HStack w={"100%"}>
										<Box w={"50%"}>
											<Checkbox
												variant="rounded"
												spacing={"2"}
												size={{
													base: "sm",
													sm: "sm",
													md: "sm",
													lg: "sm",
													xl: "sm",
													"2xl": "lg",
												}}
											>
												Active
											</Checkbox>
										</Box>
										<Box w={"50%"} h={"100%"}>
											<Checkbox
												spacing={"2"}
												variant="rounded"
												size={{
													base: "sm",
													sm: "sm",
													md: "sm",
													lg: "sm",
													xl: "sm",
													"2xl": "lg",
												}}
											>
												Inactive
											</Checkbox>
										</Box>
									</HStack>
								</VStack>
								<VStack
									align={"flex-start"}
									w={"full"}
									gap={{
										base: "px",
										sm: "px",
										md: "0.5",
										lg: "0.5",
										xl: "0.5",
										"2xl": "2.5",
									}}
								>
									<Text
										as={"span"}
										fontSize={{
											base: "sm",
											sm: "sm",
											md: "sm",
											lg: "sm",
											xl: "md",
											"2xl": "lg",
										}}
										fontWeight={"semibold"}
									>
										Filter by activation date range
									</Text>
									<Flex
										w={"100%"}
										justifyContent={"space-between"}
										direction={{
											base: "column",
											// md: "row",
										}}
										gap={{
											base: "3",
											sm: "2",
											md: "1",
											lg: "1.5",
											xl: "2",
											"2xl": "2.5",
										}}
									>
										<Flex
											align={"center"}
											gap={"5px"}
											h={{
												base: "11vw",
												sm: "30px",
												md: "30px",
												lg: "30px",
												xl: "35px",
												"2xl": "45px",
											}}
											w={{ base: "100%", md: "80%" }}
											border={"1px solid #D2D2D2"}
											borderRadius={"8px"}
											overflow={"hidden"}
										>
											<HStack
												h={"100%"}
												bg={"bg"}
												w={"25%"}
												pl={"15px"}
											>
												<Text>From:</Text>
											</HStack>
											<Box w={"70%"}>
												<Input
													size="sm"
													type="date"
													border={"none"}
													focusBorderColor={
														"transparent"
													}
												/>
											</Box>
										</Flex>
										<Flex
											align={"center"}
											gap={"5px"}
											h={{
												base: "11vw",
												sm: "30px",
												md: "30px",
												lg: "30px",
												xl: "35px",
												"2xl": "45px",
											}}
											w={{ base: "100%", md: "80%" }}
											border={"1px solid #D2D2D2"}
											borderRadius={"8px"}
											overflow={"hidden"}
										>
											<HStack
												h={"100%"}
												bg={"bg"}
												w={"25%"}
												pl={"15px"}
											>
												<Text>To:</Text>
											</HStack>
											<Box w={"70%"}>
												<Input
													size="sm"
													type="date"
													border={"none"}
													focusBorderColor={
														"transparent"
													}
												/>
											</Box>
										</Flex>
									</Flex>
								</VStack>
							</VStack>

							<Flex
								justifyContent={"flex-end"}
								gap={{
									base: "7",
									sm: "6",
									md: "10",
									lg: "8",
									xl: "12",
									"2xl": "14",
								}}
							>
								<IconButtons
									hasIcon={false}
									title={"Clear All"}
									variant={"accent"}
									textStyle={{ fontWeight: "bold" }}
									size={{
										base: "lg",
										sm: "sm",
										md: "sm",
										lg: "sm",
										xl: "md",
										"2xl": "lg",
									}}
								/>

								<Buttons
									size={{
										base: "lg",
										sm: "sm",
										md: "sm",
										lg: "sm",
										xl: "md",
										"2xl": "lg",
									}}
									title={"Apply"}
									fontWeight={"bold"}
									fontSize={"xl"}
									borderRadius={"4px"}
								/>
							</Flex>
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
export default Filter;
