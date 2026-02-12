import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { PageTitle, ResponseCard, Tabs } from "components";
import { AGENT_VIEW_TABS, Endpoints, ORG_VIEW_TABS } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
			localStorage.getItem("oth_last_selected_agent")
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
		let relevantTabs = [];

		if (showOrgChangeRoleView) {
			relevantTabs = ORG_VIEW_TABS;
		} else {
			const userTypeId = Number(agentData?.user_type_id);
			relevantTabs = AGENT_VIEW_TABS.filter((tab) =>
				tab.allowedUserTypes.includes(userTypeId)
			);
		}

		const tempTabList = relevantTabs
			.filter(({ slug }) => slugTabMapping[slug])
			.map(({ slug, label, transferConfig }) => ({
				label,
				comp: slugTabMapping[slug],
				transferConfig: transferConfig,
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
						"oth_last_selected_agent",
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
				agentData={agentData}
				setResponseDetails={setResponseDetails}
				showOrgChangeRoleView={showOrgChangeRoleView}
			/>
		),
		"transfer-fos": (
			<TransferSeller
				agentData={agentData}
				setResponseDetails={setResponseDetails}
				showOrgChangeRoleView={showOrgChangeRoleView}
			/>
		),
		"retailer-to-distributor": (
			<PromoteSellerToDistributor
				agentData={agentData}
				setResponseDetails={setResponseDetails}
				showOrgChangeRoleView={showOrgChangeRoleView}
			/>
		),
		"retailer-to-iretailer": (
			<UpgradeSellerToIseller
				agentData={agentData}
				setResponseDetails={setResponseDetails}
				showOrgChangeRoleView={showOrgChangeRoleView}
			/>
		),
		"demote-distributor": (
			<DemoteDistributor
				agentData={agentData}
				setResponseDetails={setResponseDetails}
				showOrgChangeRoleView={showOrgChangeRoleView}
			/>
		),
	};

	return (
		<>
			<PageTitle
				title={showOrgChangeRoleView ? "Change Roles" : "Change Role"}
			/>

			{responseDetails === undefined ? (
				<Flex
					direction="column"
					w="100%"
					gap={{ base: "4", md: "0" }}
					fontSize="sm"
					mt={{
						base: showOrgChangeRoleView ? "8" : "-10px",
						md: "initial",
					}}
					mb="32"
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
						{tabList?.length > 0 && (
							<Tabs defaultIndex={+tab || 0}>
								{tabList.map(
									(
										{ label, comp, transferConfig },
										index
									) => (
										<div
											key={`${index}-${label}`}
											label={label}
										>
											{React.cloneElement(comp, {
												...(transferConfig ?? {}),
											})}
										</div>
									)
								)}
							</Tabs>
						)}
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
