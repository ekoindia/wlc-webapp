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
