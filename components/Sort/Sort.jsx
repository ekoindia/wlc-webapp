import {
	Box,
	Button,
	Center,
	Flex,
	Menu,
	MenuButton,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuList,
	Radio,
	RadioGroup,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Filter, Icon } from "..";

const Sort = ({ className = "", ...props }) => {
	return (
		<>
			<Box
				display={{ base: "none", md: "flex" }}
				// mt={{ base: "1vw", "2xl": ".5vw" }}
				h={{
					base: "8.5vw",
					sm: "5.5vw",
					md: "4vw",
					lg: "3vw",
					xl: "2.6vw",
					"2xl": "2.2vw",
				}}
			>
				<Menu autoSelect={false} matchWidth={"false"}>
					{({ isOpen }) => (
						<Box
							display="flex"
							alignItems="center"
							// justifyContent={"space-between"}
							columnGap="10px"
						>
							<Box
								fontSize={{
									base: "5px",
									sm: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "lg",
								}}
								color="dark"
								fontWeight={"bold"}
							>
								Sort By :
							</Box>
							<MenuButton
								w={{
									base: "5vw",
									sm: "20vw",
									md: "20vw",
									lg: "13vw",
									xl: "14vw",
									"2xl": "11vw",
								}}
								h={{
									base: "3rem",
									md: "2.5rem",
									"2xl": "3rem",
								}}
								fontSize={{
									base: "5px",
									sm: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "md",
								}}
								fontWeight={"medium"}
								textAlign="start"
								borderRadius="6px"
								boxShadow="0px 5px 15px #0000001A"
								border="card"
								isActive={isOpen}
								bg="white"
								as={Button}
								rightIcon={
									<Center
										width={{
											base: "10px",
											sm: "10px",
											md: "12px",
											lg: "13px",
											xl: "14px",
											"2xl": "20px",
										}}
										height={{
											base: "10px",
											sm: "10px",
											md: "12px",
											lg: "13px",
											xl: "14px",
											"2xl": "20px",
										}}
									>
										<Icon
											name="caret-down"
											width="16px"
											color="light"
										/>
									</Center>
								}
								_active={{
									bg: "white",
								}}
								_hover={{
									bg: "white",
								}}
							>
								{isOpen ? "Recently Added" : "Data Added"}
							</MenuButton>

							<MenuList
								p="5px"
								minW={{
									base: "5vw",
									sm: "5vw",
									md: "5vw",
									lg: "13vw",
									xl: "10vw",
									"2xl": "11vw",
								}}
								fontSize={{
									base: "5px",
									sm: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "md",
								}}
								border="card"
							>
								<MenuItem
									fontWeight={"medium"}
									color="dark"
									_hover={{
										bg: "white",
									}}
									pt="10px"
								>
									Recently Added
								</MenuItem>
								<MenuDivider margin="auto" mx="10px" />
								<MenuItem
									color="light"
									_hover={{
										bg: "white",
									}}
								>
									Status:
									<Box
										as="span"
										color="dark"
										fontWeight={"medium"}
									>
										&nbsp;Active
									</Box>
								</MenuItem>
								<MenuDivider margin="auto" mx="10px" />
								<MenuItem
									color="light"
									_hover={{
										bg: "white",
									}}
								>
									Status:
									<Box
										as="span"
										color="dark"
										fontWeight={"medium"}
									>
										&nbsp;Inactive
									</Box>
								</MenuItem>
							</MenuList>
						</Box>
					)}
				</Menu>
			</Box>

			<Box
				display={{ md: "none" }}
				w={"100%"}
				overflow={"hidden"}
				h={"100%"}
			>
				<Menu autoSelect={false} matchWidth={"false"} flip={"true"}>
					<MenuButton
						as={Button}
						aria-label="Options"
						w={"100%"}
						bg="white"
						h={"100%"}
						borderRadius={"0px"}
						color="accent.DEFAULT"
						_active={{
							bg: "white",
						}}
						_hover={{
							bg: "white",
						}}
					>
						<Text
							color="accent.DEFAULT"
							fontSize={"18px"}
							lineHeight={"0"}
							fontWeight={"semibold"}
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							gap={"10px"}
						>
							<Icon name="sort-by" width="24px" height="21px" />
							Sort by
						</Text>
					</MenuButton>

					<MenuList
						borderRadius={"15px 15px 0px 0px"}
						border="0"
						minW={"100%"}
						boxShadow="0px -10px 30px #0000001A"
					>
						<MenuGroup title="Sort by" fontSize={"18px"}>
							<RadioGroup mx={"16px"} my="16px">
								<Stack
									divider={
										<StackDivider borderColor="gray.200" />
									}
									direction="column"
									fontWeight={"medium"}
								>
									<MenuItem p={"0px"} bgColor={"white"}>
										<Radio value="1" size={"lg"}>
											<Text fontSize="sm">
												Recently Added
											</Text>
										</Radio>
									</MenuItem>

									<MenuItem p={"0px"} bgColor={"white"}>
										<Radio value="2" size={"lg"}>
											<Text
												as={"span"}
												fontWeight={"normal"}
												fontSize="sm"
											>
												Status: Active
											</Text>
										</Radio>
									</MenuItem>

									<MenuItem p={"0px"} bgColor={"white"}>
										<Radio value="3" size={"lg"}>
											<Text
												as={"span"}
												fontWeight={"normal"}
												fontSize="sm"
											>
												Status: Inactive
											</Text>
										</Radio>
									</MenuItem>
								</Stack>
							</RadioGroup>
						</MenuGroup>
					</MenuList>
				</Menu>
			</Box>
		</>
	);
};

export default Sort;

export const ResSortAndFilter = () => {
	return (
		<Box
			display={{ base: "flex", md: "none" }}
			pb={{ base: "20vw", sm: "15vw", md: "0px" }}
		>
			<Flex
				position={"fixed"}
				w={"100%"}
				h={"15vw"}
				bottom={"0%"}
				left={"0%"}
				zIndex={"99"}
				boxShadow={"0px -3px 10px #0000001A"}
			>
				<Box w={"50%"} h={"100%"} bg={"white"}>
					<Sort />
				</Box>
				<Box w={"50%"} h={"100%"}>
					<Filter />
				</Box>
			</Flex>
		</Box>
	);
};
