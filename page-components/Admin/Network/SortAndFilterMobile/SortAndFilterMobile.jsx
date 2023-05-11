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
			pb={{ base: "20vw", sm: "15vw" }}
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
				{/* <Flex  h={"100%"} bg={"white"} w="100%">
					<NetworkSort setSort={setSort} />
				</Flex> */}
				<Flex h={"100%"} w="100%">
					<NetworkFilter setFilter={setFilter} />
				</Flex>
			</Flex>
		</Box>
	);
};

export default SortAndFilterMobile;
