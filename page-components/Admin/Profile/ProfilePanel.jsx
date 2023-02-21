import { Box, Flex } from "@chakra-ui/react";
import {
	AddressPane,
	CompanyPane,
	ContactPane,
	DocPane,
	PersonalPane,
} from ".";

const ProfilePanel = ({ className = "", ...props }) => {
	return (
		<Box pb={{ base: "20px", sm: "initial" }}>
			<Flex
				gap={{ base: "20px", md: "30" }}
				wrap={"wrap"}
				mt={{ base: "26px", md: "5" }}
				px={{ base: "16px", md: "initial" }}
			>
				<CompanyPane />
				<AddressPane />
				<DocPane />
				<PersonalPane />
				<ContactPane />
			</Flex>
		</Box>
	);
};

export default ProfilePanel;
