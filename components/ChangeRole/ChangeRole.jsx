import {
	Box,
	Divider,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";

/**
 * A <ChangeRole> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<ChangeRole></ChangeRole>`
 */
const ChangeRole = ({ className = "", ...props }) => {
	return (
		<Box
			bg="white"
			mt="7.5"
			boxShadow="0px 5px 15px #0000000D;"
			border="card"
			borderRadius="10"
			px="7.5"
			pt="3.5"
		>
			<Box>
				<Text
					as="h1"
					color="accent.DEFAULT"
					fontWeight="bold"
					fontSize="2xl"
				>
					Angel Tech Private Limited
				</Text>
				<Text fontSize="md">
					Edit the fields below and click Preview. Click Cancel to
					return to Client HomePage without submitting information.
				</Text>
			</Box>

			<Divider color="divider" my="5" />

			<Tabs defaultIndex={0}>
				<TabList color="light">
					<Tab>Transfer CSPs</Tab>
					<Tab>Promote Csp To Scsp</Tab>
					<Tab>Demote Distributor</Tab>
					<Tab>Upgrade Merchant To I-Merchant</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<p>one!</p>
					</TabPanel>
					<TabPanel>
						<p>two!</p>
					</TabPanel>
					<TabPanel>
						<p>three!</p>
					</TabPanel>
					<TabPanel>
						<p>three!</p>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

export default ChangeRole;
