import {
	Divider,
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import TransferCSP from "./TransferCSP";

/**
 * A <ChangeRole> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<ChangeRole></ChangeRole>`
 */
const ChangeRole = ({ className = "", ...props }) => {
	return (
		<Flex
			my="7.5"
			boxShadow="0px 5px 15px #0000000D;"
			border={{ base: "", md: "card" }}
			borderRadius={{ base: "0", md: "10" }}
			bg={{ base: "transparent", md: "white" }}
			align={{ base: "center", md: "flex-start" }}
			direction="column"
			rowGap={{ base: "10px", md: "0" }}
			pb={{ base: "0", md: "40px" }}
		>
			<Flex
				w="100%"
				pt="3.5"
				px={{ base: "4", md: "7.5" }}
				pb={{ base: "3.5", md: "5" }}
				bg="white"
				borderTopLeftRadius={{ base: "0", md: "10" }}
				borderTopRightRadius={{ base: "0", md: "10" }}
				borderBottom={{ base: "card", md: "0" }}
				direction="column"
				rowGap={{ base: "10px", md: "0" }}
			>
				<Text
					as="h1"
					color="accent.DEFAULT"
					fontWeight="bold"
					fontSize={{ base: "lg", md: "2xl" }}
				>
					Angel Tech Private Limited
				</Text>
				<Text fontSize={{ base: "xs", md: "md" }}>
					Edit the fields below and click Preview.
					<Text display={{ base: "block", md: "inline" }}>
						{" "}
						Click Cancel to return to Client HomePage without
						submitting information.
					</Text>
				</Text>
			</Flex>

			<Divider
				w={{ base: "0", md: "calc(100% - 60px)" }}
				mx="auto"
				color="divider"
			/>

			<Tabs
				position="relative"
				defaultIndex={0}
				variant="colorful"
				//Responsive style
				bg={{ base: "#FFFFFF", md: "transparent" }}
				border={{ base: "card", md: "none" }}
				px={{ base: "0", md: "7.5" }}
				pt={{ base: "3", md: "10.5" }}
				w={{ base: "92%", md: "80%" }}
				boxShadow={{ base: "0px 5px 15px #0000000D", md: "none" }}
				borderRadius={{ base: "10px", md: "none" }}
			>
				<TabList color="light">
					<Tab>Transfer CSPs</Tab>
					<Tab>Promote Csp To Scsp</Tab>
					<Tab>Demote Distributor</Tab>
					<Tab>Upgrade Merchant To I-Merchant</Tab>
				</TabList>

				<TabPanels
					px={{ base: "18px", md: "0" }}
					mt={{ base: "23px", md: "46px" }}
				>
					<TabPanel>
						<TransferCSP />
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
		</Flex>
	);
};

export default ChangeRole;
