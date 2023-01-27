import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Box>
			<Flex gap={30} wrap={"wrap"} mt={5}>
				<CompanyPane />
				<AddressPane />
				<DocPane />
				<PersonalPane />
				<ContactPane />
			</Flex>
			{/* <Flex gap={30} align={"center"} wrap={"wrap"} mt={12}>
            </Flex> */}
		</Box>
	);
};

export default ProfilePanel;
