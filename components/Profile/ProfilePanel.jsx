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
		<Box pb={{ base: "15px", sm: "initial" }}>
			<Flex gap={30} wrap={"wrap"} mt={5}>
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
