import { Box, Flex } from "@chakra-ui/react";
import { NetworkFilter } from "..";

/**
 * A <SortAndFilterMobile> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<SortAndFilterMobile></SortAndFilterMobile>`
 */
const SortAndFilterMobile = ({ setFilter /*, setSort */ }) => {
	return (
		<Box
			display={{ base: "flex", md: "none" }}
			pb={{ base: "20vw", sm: "15vw", md: "0px" }}
		>
			<Flex
				position={"fixed"}
				w={"100%"}
				h={"15vw"}
				bottom={"0%"}
				left={"0%"}
				zIndex={"99"}
				boxShadow={"0px -3px 10px #0000001A"}
			>
				{/* <Box w={"50%"} h={"100%"} bg={"white"}>
					<NetworkSort setSort={setSort} />
				</Box> */}
				<Box w={"50%"} h={"100%"}>
					<NetworkFilter setFilter={setFilter} />
				</Box>
			</Flex>
		</Box>
	);
};

export default SortAndFilterMobile;
