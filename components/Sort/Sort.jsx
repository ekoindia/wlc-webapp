import React, { useEffect, useState } from "react";

import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
	Box,
	Button,
	Text,
} from "@chakra-ui/react";

/**
 * A <Sort> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Sort></Sort>`
 */
const Sort = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Box>
			<Menu>
				<MenuButton
					w="220px"
					h="48px"
					border=" 1px solid #D2D2D2"
					borderRadius="10px"
					bg="#FFFFFF"
					opacity={1}
					as={Button}
					rightIcon={<img src="/icons/profiledropdown.svg" />}
				>
					<Text>Recenty Added</Text>
				</MenuButton>
				<MenuList>
					<MenuItem>Recent Added</MenuItem>
					<MenuItem>Status: Active</MenuItem>
					<MenuItem>Status: Inactive</MenuItem>
				</MenuList>
			</Menu>
		</Box>
	);
};

export default Sort;
