import React from "react";
import {
	Box,
	Button,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
const Menus = (props) => {
	const { width } = props;

	return (
		<Box>
			<Menu autoSelect={false}></Menu>
		</Box>
	);
};

export default Menus;
