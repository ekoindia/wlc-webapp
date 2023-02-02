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
	MenuItemOption,
	MenuList,
	MenuOptionGroup,
	Radio,
} from "@chakra-ui/react";
import { Filter, Icon } from "..";

const Sort = ({ className = "", ...props }) => {
	return (
		<>
			<Box
				display={{ base: "none", sm: "flex" }}
				my={"1vw"}
				h={{
					base: "8.5vw",
					sm: "5.5vw",
					md: "4vw",
					lg: "3vw",
					xl: "2.5vw",
					"2xl": "2vw",
				}}
			>
				<Menu
					autoSelect={false}
					matchWidth={"false"}
					// w={{
					// 	base: "5vw",
					// 	sm: "5vw",
					// 	md: "5vw",
					// 	lg: "13vw",
					// 	xl: "10vw",
					// 	"2xl": "14vw",
					// }}
				>
					{({ isOpen }) => (
						<Box
							display="flex"
							alignItems="center"
							justifyContent={"space-evenly"}
							gap="15px"
							w={{
								base: "5vw",
								sm: "35vw",
								md: "30vw",
								lg: "20vw",
								xl: "20vw",
								"2xl": "18vw",
							}}
						>
							<Box
								fontSize={{
									base: "5px",
									sm: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "xl",
								}}
								color="dark"
								fontWeight={"medium"}
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
									"2xl": "12vw",
								}}
								h={{
									base: "8.5vw",
									sm: "5vw",
									md: "4vw",
									lg: "3vw",
									xl: "2.5vw",
									"2xl": "2vw",
								}}
								fontSize={{
									base: "5px",
									sm: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "xl",
								}}
								fontWeight={"medium"}
								textAlign="start"
								borderRadius="6px"
								border=" 1px solid #D2D2D2"
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
											name="drop-down"
											width="16px"
											color="#555555"
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
								minW={{
									base: "5vw",
									sm: "5vw",
									md: "5vw",
									lg: "13vw",
									xl: "10vw",
									"2xl": "12vw",
								}}
								fontSize={{
									base: "5px",
									sm: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "xl",
								}}
								border="1px solid #D2D2D2"
							>
								<MenuItem
									fontWeight={"medium"}
									color="dark"
									_hover={{
										bg: "white",
									}}
								>
									Recently Added
								</MenuItem>
								<MenuDivider margin="auto" />
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
								<MenuDivider margin="auto" />
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

			<Box display={{ sm: "none" }} w={"100%"} overflow={"hidden"}>
				<Menu autoSelect={false} matchWidth={"false"} flip={"true"}>
					<MenuButton
						aria-label="Options"
						w={"100%"}
						h={"15vw"}
						fontWeight={"semibold"}
						border={"none"}
						fontSize={"18px"}
						borderRadius={"0px"}
						bg="white"
						color="accent.DEFAULT"
						as={Button}
						leftIcon={
							<Icon name="sort-by" width="24px" height="21px" />
						}
						_active={{
							bg: "white",
						}}
						_hover={{
							bg: "white",
						}}
					>
						Sort By
					</MenuButton>

					<MenuList borderTopRadius={"15px"} minW={"100%"}>
						<MenuOptionGroup
							defaultValue="reca"
							title="Sort by"
							type="radio"
							fontSize={"16px"}
						>
							<MenuItemOption value="reca" fontSize={"12px"}>
								Recently Added
							</MenuItemOption>
							<MenuItemOption value="ac" fontSize={"12px"}>
								Status: Active
							</MenuItemOption>
							<MenuItemOption value="inac" fontSize={"12px"}>
								Status: Inactive
							</MenuItemOption>
						</MenuOptionGroup>
					</MenuList>
				</Menu>
			</Box>
		</>
	);
};

export default Sort;

export const ResSortAndFilter = () => {
	return (
		<Flex
			display={{ base: "flex", sm: "none" }}
			position={"absolute"}
			w={"100%"}
			h={"15vw"}
			bottom={"0%"}
			left={"0%"}
			zIndex={"999999"}
			boxShadow={"0px -3px 10px #0000001A"}
		>
			<Box w={"50%"} h={"100%"} bg={"white"}>
				<Sort />
			</Box>
			<Box w={"50%"} h={"100%"}>
				<Filter />
			</Box>
		</Flex>
	);
};
