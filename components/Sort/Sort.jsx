import {
	Box,
	Button,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";

const Sort = ({ className = "", ...props }) => {
	return (
		<Box>
			<Menu>
				{({ isOpen }) => (
					<Box display="flex" alignItems="center" gap="20px">
						<Box fontSize="18px" fontWeight="600" color="dark">
							Sort By :
						</Box>
						<MenuButton
							textAlign="start"
							isActive={isOpen}
							w="220px"
							h="48px"
							border=" 1px solid #D2D2D2"
							borderRadius="10px"
							bg="white"
							opacity={1}
							as={Button}
							rightIcon={<img src="/icons/profiledropdown.svg" />}
							_active={{
								bg: "white",
							}}
							_hover={{
								bg: "white",
							}}
						>
							{isOpen ? "Recently Added" : "Data Added"}
						</MenuButton>
						<MenuList p="0 4px">
							<MenuItem
								color="dark"
								fontWeight="semibold"
								_active={{
									bg: "white",
								}}
								_hover={{
									bg: "none",
								}}
							>
								Recently Added
							</MenuItem>
							<MenuDivider w="90%" margin="auto" />
							<MenuItem
								color="light"
								fontWeight="semibold"
								_active={{
									bg: "white",
								}}
								_hover={{
									bg: "none",
								}}
							>
								Status:
								<Box as="span" color="dark">
									&nbsp; Active
								</Box>
							</MenuItem>
							<MenuDivider w="90%" margin="auto" />
							<MenuItem
								color="light"
								fontWeight="semibold"
								_active={{
									bg: "white",
								}}
								_hover={{
									bg: "none",
								}}
							>
								Status:
								<Box as="span" color="dark">
									&nbsp; Inactive
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
