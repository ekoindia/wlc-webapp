import {
	Box,
	Button,
	Center,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { Icon } from "..";

const Sort = ({ className = "", ...props }) => {
	return (
		<Box
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
	);
};

export default Sort;
