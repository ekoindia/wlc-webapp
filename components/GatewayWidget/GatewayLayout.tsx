import { Box, Flex } from "@chakra-ui/react";
import { OrgLogo } from "components";

const GatewayLayout = ({ children, orgDetail }) => {
	return (
		<Flex direction="column" minH="100vh">
			<Flex px="1em" align="center" h="56px" shadow="lg">
				<OrgLogo
					size="md"
					dark={orgDetail?.metadata?.theme?.navstyle === "light"}
				/>
			</Flex>

			<Flex bg="bg" flex="1">
				<Box
					maxW={{ base: "100%", md: "800px" }}
					w="full"
					mx="auto"
					pt={6}
				>
					{children}
				</Box>
			</Flex>
		</Flex>
	);
};

export default GatewayLayout;
