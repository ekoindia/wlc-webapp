import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Filter, SearchBar, Sort } from "..";
import NetworkTable from "./NetworkTable";

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
			<Box display={"flex"} alignItems={"center"}>
				<Text fontSize={"30px"} fontWeight={"semibold"}>
					My Network
				</Text>
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
				<NetworkTable />
			</Box>
		</Box>
	);
};

export default Network;
