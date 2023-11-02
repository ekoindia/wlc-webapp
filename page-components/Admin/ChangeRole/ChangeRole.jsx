import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { Headings, ResponseCard, Tabs } from "components";
import { ChangeRoleMenuList, Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	DemoteDistributor,
	PromoteSellerToDistributor,
	TransferSeller,
	UpgradeSellerToIseller,
} from ".";

/**
 * A ChangeRole page-component
 * @example	`<ChangeRole></ChangeRole>`
 */
const ChangeRole = () => {
	const [agentData, setAgentData] = useState(null);
	const { accessToken } = useSession();
	const [showOrgChangeRoleView, setShowOrgChangeRoleView] = useState(false);
	const [responseDetails, setResponseDetails] = useState();
	const router = useRouter();
	const { mobile, tab } = router.query;
	const [tabList, setTabList] = useState([]);

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

	useEffect(() => {
		const tempTabList = ChangeRoleMenuList?.filter(
			({ slug, visibleString, global }) =>
				slugTabMapping[slug] &&
				((showOrgChangeRoleView && global) ||
					visibleString.includes(agentData?.agent_type))
		).map(({ slug, label }) => ({
			label,
			comp: slugTabMapping[slug],
		}));
		setTabList(tempTabList);
	}, [mobile, showOrgChangeRoleView, agentData]);

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

	const handleClickResponseCard = () => router.push("/admin/my-network");

	/**
	 * Maps slugs to the corresponding components for the ChangeRole tabs.
	 */
	const slugTabMapping = {
		"transfer-retailer": (
			<TransferSeller
				{...{ agentData, setResponseDetails, showOrgChangeRoleView }}
			/>
		),
		"retailer-to-distributor": (
			<PromoteSellerToDistributor
				{...{ agentData, setResponseDetails, showOrgChangeRoleView }}
			/>
		),
		"retailer-to-iretailer": (
			<UpgradeSellerToIseller
				{...{ agentData, setResponseDetails, showOrgChangeRoleView }}
			/>
		),
		"demote-distributor": (
			<DemoteDistributor
				{...{ agentData, setResponseDetails, showOrgChangeRoleView }}
			/>
		),
	};

	return (
		<>
			<Headings
				title={showOrgChangeRoleView ? "Change Roles" : "Change Role"}
			/>

			{responseDetails === undefined ? (
				<Flex
					direction="column"
					w="100%"
					gap={{ base: "4", md: "0" }}
					fontSize="sm"
					mt={{
						base: showOrgChangeRoleView ? "initial" : "-10px",
						md: "initial",
					}}
				>
					{!showOrgChangeRoleView && (
						<>
							<Flex
								direction="column"
								gap="2"
								bg="white"
								p={{ base: "16px", md: "20px 30px" }}
								borderRadius={{
									base: "0",
									md: "10px 10px 0 0",
								}}
							>
								<Text
									fontSize="2xl"
									color="primary.DEFAULT"
									fontWeight="semibold"
								>
									{agentData?.agent_name}
								</Text>
								<span>{agentData?.agent_type}</span>
							</Flex>
							<Divider display={{ base: "none", md: "block" }} />
						</>
					)}
					<Box
						bg="white"
						borderRadius={{
							base: "10px",
							md: showOrgChangeRoleView
								? "10px"
								: "0 0 10px 10px",
						}}
						mx={{ base: "4", md: "0" }}
					>
						<Tabs defaultIndex={+tab || 0}>
							{tabList?.map(({ label, comp }, index) => (
								<div key={`${index}-${label}`} label={label}>
									{comp}
								</div>
							))}
						</Tabs>
					</Box>
				</Flex>
			) : (
				<Box
					mt={{ base: "8", md: "2.5" }}
					px={{ base: "16px", md: "initial" }}
				>
					<ResponseCard
						status={responseDetails.status}
						message={responseDetails.message}
						onClick={handleClickResponseCard}
					/>
				</Box>
			)}
		</>
	);
};

export default ChangeRole;
