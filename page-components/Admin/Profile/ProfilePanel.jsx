import { Box, Flex } from "@chakra-ui/react";
import {
	AddressPane,
	CompanyPane,
	ContactPane,
	DocPane,
	PersonalPane,
} from ".";
/**
 * A <Profile> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Profile></Profile>`
 */
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
