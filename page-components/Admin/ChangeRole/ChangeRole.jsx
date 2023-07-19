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
import { ChangeRoleMenuList, Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	MoveAgents,
	PromoteSellerToDistributor,
	TransferSeller,
	UpgradeSellerToIseller,
} from ".";

/**
 * A ChangeRole page-component
 * TODO: Write more description here
 * @example	`<ChangeRole></ChangeRole>`
 */
const ChangeRole = () => {
	const [agentData, setAgentData] = useState();
	const [isShowSelectAgent, setIsShowSelectAgent] = useState(false);
	const [scspFromValue, setScspFromValue] = useState("");
	const [selectedEkocspidsCR, setSelectedEkocspidsCR] = useState([]);
	const { accessToken } = useSession();
	const [showOrgChangeRoleView, setShowOrgChangeRoleView] = useState(false);
	console.log("selectedEkocspidsCR", selectedEkocspidsCR);
	const router = useRouter();
	const { mobile, tab } = router.query;

	const handleScspFromChange = (value) => {
		setScspFromValue(value);
	};

	useEffect(() => {
		const storedData = JSON.parse(
			localStorage.getItem("network_seller_details")
		);
		if (mobile) {
			if (storedData?.agent_mobile === mobile) {
				setAgentData(storedData);
			} else {
				fetchAgentDataViaCellNumber(mobile);
			}
		} else {
			setShowOrgChangeRoleView(true);
		}
	}, [mobile]);

	const fetchAgentDataViaCellNumber = (mobile) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents?record_count=1&search_value=${mobile}`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((res) => {
				let _agentDetails = res?.data?.agent_details[0];
				if (_agentDetails) {
					setAgentData(_agentDetails);
					localStorage.setItem(
						"network_seller_details",
						JSON.stringify(_agentDetails)
					);
				} else {
					setShowOrgChangeRoleView(true);
				}
			})
			.catch((error) => {
				console.error("[ChangeRole] Get Agent Detail Error:", error);
			});
	};

	/**
	 * Maps slugs to the corresponding components for the ChangeRole tabs.
	 */
	const slugTabMapping = {
		"transfer-retailer": (
			<TransferSeller
				setIsShowSelectAgent={setIsShowSelectAgent}
				onScspFromChange={handleScspFromChange}
			/>
		),
		"retailer-to-distributor": <PromoteSellerToDistributor />,
		"retailer-to-imerchant": <UpgradeSellerToIseller />,
	};

	return !isShowSelectAgent ? (
		<>
			<Headings title="Change Role" />

			<Flex
				direction="column"
				borderRadius={{ base: "0", md: "10px 10px 0 0" }}
				w="100%"
				bg="white"
				p={{
					base: "16px",
					md: !showOrgChangeRoleView ? "30px 30px 20px" : "16px",
				}}
				gap="4"
				fontSize="sm"
			>
				{!showOrgChangeRoleView && (
					<>
						<Flex direction="column" gap="2">
							<Text
								fontSize="2xl"
								color="accent.DEFAULT"
								fontWeight="semibold"
							>
								{agentData?.agent_name}
							</Text>
							<span>{agentData?.agent_type}</span>
						</Flex>
						<Divider display={{ base: "none", md: "block" }} />
					</>
				)}
			</Flex>
			<Tabs
				defaultIndex={+tab || 0}
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
					{ChangeRoleMenuList?.map(
						({ slug, label }) =>
							slugTabMapping[slug] && (
								<Tab key={slug}>{label}</Tab>
							)
					)}
				</TabList>

				<TabPanels mt="5">
					{ChangeRoleMenuList?.map(({ slug }) => (
						<TabPanel key={slug}>{slugTabMapping[slug]}</TabPanel>
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
