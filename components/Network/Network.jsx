import React, { useEffect, useState } from "react";
import { SearchBar } from "components/SearchBar";
import { Filter, Sort } from "..";
import { Tables, Table1 } from ".";
import { Box, Flex } from "@chakra-ui/react";

/**
 * A <Network> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Network></Network>`
 */
const Network = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Box className={`${className}`} {...props}>
			<Box display={"flex"} justifyContent={"space-between"} w={"80vw"}>
				<SearchBar />
				<Flex>
					<Filter />
					<Sort />
				</Flex>
			</Box>
		</Box>
	);
};

export default Network;
