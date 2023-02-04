import {
	Box,
	IconButton,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { Icon } from "..";

const Menus = (props) => {
	const menulist = [
		{
			item: "Proceed",
		},
		{
			item: "Mark Inactive",
		},
		{
			item: "Mark Pending",
		},
		{
			item: "Change Role",
		},
	];

	const { width, type = "everted" } = props;

	return (
		<Box color={type === "inverted" ? "primary.DEFAULT" : "white"}>
			<Menu autoSelect={false}>
				<MenuButton
					h="30px"
					minW="30px"
					cursor="pointer"
					as={IconButton}
					icon={<Icon name="more-vert" height="18px" width="4px" />}
					bg={type === "inverted" ? "white" : "primary.DEFAULT"}
					_hover={{
						bg: type === "inverted" ? "white" : "primary.DEFAULT",
					}}
					_active={{
						bg: type === "inverted" ? "white" : "primary.DEFAULT",
					}}
				/>
				<MenuList>
					{menulist.map((item, index) => {
						return (
							<>
								<MenuItem color="dark" key={index}>
									{item.item}
								</MenuItem>
								{index !== menulist.length - 1 && (
									<MenuDivider />
								)}
							</>
						);
					})}
				</MenuList>
			</Menu>
		</Box>
	);
};

export default Menus;
