import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Filter, SearchBar, Sort, Tables } from "..";

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
			<Box
				fontSize={"36px"}
				color={"dark"}
				font="normal 600 30px/36px Inter;"
				opacity={1}
				mt="40px"
			>
				My Network
			</Box>
			<Box
				display={"flex"}
				justifyContent={"space-between"}
				w={"85vw"}
				mt="20px"
			>
				<SearchBar />
				<Flex gap="50px">
					<Box>
						<Filter />
					</Box>
					<Box>
						<Sort />
					</Box>
				</Flex>
			</Box>
			<Box mt={"10px"}>
				<Tables />
			</Box>
		</Box>
	);
};

export default Network;
