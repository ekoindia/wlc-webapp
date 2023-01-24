import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { Icon } from "..";

/**
 * A <Headings> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Headings></Headings>`
 */
const Headings = (props) => {
	const { hasIcon = true, title } = props;
	return (
		<Box display={"flex"} alignItems={"center"}>
			{hasIcon ? (
				<Icon name="arrow-back" width="18px" height="15px" />
			) : null}
			<Text fontSize={"30px"} fontWeight={"semibold"} marginLeft={"1rem"}>
				{title}
			</Text>
		</Box>
	);
};

export default Headings;
