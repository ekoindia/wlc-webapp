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
import { Headings } from "components";
import { ChangeRoleMenuList, Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	PromoteSellerToDistributor,
	TransferSeller,
	UpgradeSellerToIseller,
} from ".";

/**
 * A ChangeRole page-component
 * @example	`<ChangeRole></ChangeRole>`
 */
const ChangeRole = () => {
	const [agentData, setAgentData] = useState();
	const { accessToken } = useSession();
	const [showOrgChangeRoleView, setShowOrgChangeRoleView] = useState(false);
	const router = useRouter();
	const { mobile, tab } = router.query;

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
		"transfer-retailer": <TransferSeller />,
		"retailer-to-distributor": <PromoteSellerToDistributor />,
		"retailer-to-iretailer": <UpgradeSellerToIseller />,
	};

	return (
		<>
			<Headings
				title={showOrgChangeRoleView ? "Change Roles" : "Change Role"}
			/>

			<Flex
				direction="column"
				borderRadius={{ base: "0", md: "10px 10px 0 0" }}
				w="100%"
				bg="white"
				p={{
					base: !showOrgChangeRoleView ? "16px" : "0px",
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
	);
};

export default ChangeRole;
