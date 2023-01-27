import {
	Box,
	Button,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { Icon } from "..";

const Sort = ({ className = "", ...props }) => {
	return (
		<Box>
			<Menu width="220px" autoSelect={false}>
				{({ isOpen }) => (
					<Box display="flex" alignItems="center" gap="15px">
						<Box fontSize="lg" fontWeight="semibold" color="dark">
							Sort By :
						</Box>
						<MenuButton
							px={5}
							w="220px"
							h="48px"
							fontSize="md"
							fontWeight="normal"
							textAlign="start"
							borderRadius="6px"
							border=" 1px solid #D2D2D2"
							isActive={isOpen}
							bg="white"
							as={Button}
							rightIcon={
								<Icon
									name="drop-down"
									width="16px"
									color="#555555"
								/>
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
							minWidth="220px"
							px={5}
							py="none"
							border="1px solid #D2D2D2"
							top="0px"
							transform="translate(1672px, 275px)"
							fontSize="md"
							fontWeight="normal"
						>
							<MenuItem
								pt={4}
								pb={3}
								px="0px"
								color="dark"
								fontWeight="normal"
								// _active={{
								//     bg: "white",
								// }}
								_hover={{
									bg: "white",
								}}
							>
								Recently Added
							</MenuItem>
							<MenuDivider margin="auto" />
							<MenuItem
								pt={4}
								pb={3}
								px="0px"
								color="light"
								fontWeight="normal"
								// _active={{
								//     bg: "white",
								// }}
								_hover={{
									bg: "white",
								}}
							>
								Status:
								<Box as="span" color="dark">
									&nbsp;Active
								</Box>
							</MenuItem>
							<MenuDivider margin="auto" />
							<MenuItem
								pt={4}
								pb={5}
								px="0px"
								color="light"
								fontWeight="normal"
								// _active={{
								//     bg: "white",
								// }}
								_hover={{
									bg: "white",
								}}
							>
								Status:
								<Box as="span" color="dark">
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
