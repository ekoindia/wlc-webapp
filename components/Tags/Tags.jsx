import { Button } from "@chakra-ui/react";
import React from "react";

/**
 * A <Tags> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Tags></Tags>`
 */

const statusChecker = {
	Active: "#00C341",
	Pending: "#FE9F00",
	Inactive: "#FF4081",
	Other: "#71797E",
};

const Tags = ({ className = "", status = "Active", ...props }) => {
	const sts = statusChecker[status];
	return (
		<Button
			variant={"outline"}
			border={"1px"}
			borderRadius={"28"}
			colorScheme={sts}
			color={sts}
			px={"22px"}
		>
			{status}
		</Button>
	);
};

export default Tags;
