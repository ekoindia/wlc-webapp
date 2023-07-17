import {
	Box,
	Divider,
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { Button, Headings } from "components";
import { useRouter } from "next/router";

import { useState } from "react";
import {
	MoveAgents,
	PromoteSellerToDistributor,
	TransferSeller,
	UpgradeSellerToIseller,
} from ".";

/**
 * A <ChangeRole> component
 * TODO: Write more description here
 * @example	`<ChangeRole></ChangeRole>`
 */

const ChangeRole = () => {
	const [isShowSelectAgent, setIsShowSelectAgent] = useState(false);
	const [scspFromValue, setScspFromValue] = useState("");
	const [selectedEkocspidsCR, setSelectedEkocspidsCR] = useState([]);
	console.log("selectedEkocspidsCR", selectedEkocspidsCR);
	const tab = +useRouter().query.tab;

	const handleScspFromChange = (value) => {
		setScspFromValue(value);
	};

	const tabs = [
		{
			id: 1,
			label: "Transfer Sellers",
			comp: (
				<TransferSeller
					setIsShowSelectAgent={setIsShowSelectAgent}
					onScspFromChange={handleScspFromChange}
				/>
			),
		},
		{
			id: 2,
			label: "Promote Seller To Distributor",
			comp: <PromoteSellerToDistributor />,
		},
		// {
		// 	id: 3,
		// 	label: "Demote Distributor",
		// 	comp: "Coming Soon...",
		// },
		{
			id: 4,
			label: "Upgrade Seller To iSeller",
			comp: <UpgradeSellerToIseller />,
		},
	];

	return !isShowSelectAgent ? (
		<>
			<Headings title="Change Role" />
			<Flex
				direction="column"
				borderRadius={{ base: "0", md: "10px 10px 0 0" }}
				w="100%"
				bg="white"
				p={{ base: "16px", md: "30px 30px 20px" }}
				gap="4"
				fontSize="sm"
			>
				<Flex direction="column" gap="2">
					<Text
						fontSize="2xl"
						color="accent.DEFAULT"
						fontWeight="semibold"
					>
						{/* {agentData?.agent_name} */} Cool Name
					</Text>
					<span>
						Click Cancel to return to Client HomePage without
						submitting information.
					</span>
				</Flex>
				<Divider display={{ base: "none", md: "block" }} />
			</Flex>
			<Tabs
				defaultIndex={tab || 0}
				borderRadius={{ base: "10px", md: "0 0 10px 10px" }}
				p={{ base: "20px", md: "0 30px 30px" }}
				mt={{ base: "20px", md: "0" }}
				w="100%"
				bg="white"
				fontSize="sm"
				isLazy
			>
				<TabList
					color="light"
					css={{
						"&::-webkit-scrollbar": {
							display: "none",
						},
						"&::-moz-scrollbar": {
							display: "none",
						},
						"&::scrollbar": {
							display: "none",
						},
					}}
				>
					{tabs.map(({ id, label }) => (
						<Tab key={id}>{label}</Tab>
					))}
				</TabList>

				<TabPanels mt="5">
					{tabs.map(({ id, comp }) => (
						<TabPanel key={id}>{comp}</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</>
	) : (
		<Box>
			{/* Move button for mobile responsive */}
			<MoveAgents
				options={scspFromValue}
				setSelectedEkocspidsCR={setSelectedEkocspidsCR}
			/>
			<Flex
				display={{ base: "flex", md: "none" }}
				position={"fixed"}
				w={"100%"}
				h={"15vw"}
				maxH={"80px"}
				bottom={"0%"}
				left={"0%"}
				zIndex={"99"}
				boxShadow={"0px -3px 10px #0000001A"}
			>
				<Button
					variant="ghost"
					w={"50%"}
					h={"100%"}
					bg={"white"}
					fontSize="18px"
					color="accent.DEFAULT"
					onClick={() => setIsShowSelectAgent(false)}
				>
					Go Back
				</Button>
				<Button
					w={"50%"}
					h={"100%"}
					fontSize="18px"
					borderRadius="none"
				>
					Move Now
				</Button>
			</Flex>
		</Box>
	);
};

export default ChangeRole;
