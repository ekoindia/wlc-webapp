import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { PageTitle, Tabs } from "components";
import { useRouter } from "next/router";
import { useAgentDetails } from "page-components/Admin/Network/hooks";
import { useEffect, useState } from "react";
import PromoteSellerToDistributor from "./PromoteSellerToDistributor";
import { TransferSeller } from "./TransferSeller";
import UpgradeSellerToIseller from "./UpgradeSellerToIseller";
import useChangeRoleOptions from "./useChangeRoleOptions";

/**
 * Mapping of slugs to their corresponding role change components.
 */
const CHANGE_ROLE_COMPONENTS = {
	"transfer-retailer": TransferSeller,
	"transfer-fos": TransferSeller,
	"retailer-to-distributor": PromoteSellerToDistributor,
	"retailer-to-iretailer": UpgradeSellerToIseller,
};

/**
 * A ChangeRole page-component
 * @example	`<ChangeRole></ChangeRole>`
 */
const ChangeRole = () => {
	const { ORG_VIEW_TABS, AGENT_VIEW_TABS } = useChangeRoleOptions();
	const [showOrgChangeRoleView, setShowOrgChangeRoleView] = useState(false);
	const router = useRouter();
	const { mobile, tab } = router.query;
	const [tabList, setTabList] = useState([]);

	// Use the agent details hook with session caching
	const { agent: agentData } = useAgentDetails(mobile);

	useEffect(() => {
		if (!mobile) {
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

		// Modified to use CHANGE_ROLE_COMPONENTS
		const tempTabList = relevantTabs
			.filter(({ slug }) => CHANGE_ROLE_COMPONENTS[slug])
			.map(({ slug, label, transferConfig }) => ({
				label,
				Component: CHANGE_ROLE_COMPONENTS[slug],
				transferConfig: transferConfig,
			}));

		setTabList(tempTabList);
	}, [mobile, showOrgChangeRoleView, agentData]);

	return (
		<>
			<PageTitle
				title={showOrgChangeRoleView ? "Change Roles" : "Change Role"}
			/>
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
						md: showOrgChangeRoleView ? "10px" : "0 0 10px 10px",
					}}
					mx={{ base: "4", md: "0" }}
				>
					{tabList?.length > 0 && (
						<Tabs defaultIndex={+tab || 0}>
							{tabList.map(
								(
									{ label, Component, transferConfig },
									index
								) => (
									<div
										key={`${index}-${label}`}
										label={label}
									>
										<Component
											agentData={agentData}
											showOrgChangeRoleView={
												showOrgChangeRoleView
											}
											{...(transferConfig ?? {})}
										/>
									</div>
								)
							)}
						</Tabs>
					)}
				</Box>
			</Flex>
		</>
	);
};

export default ChangeRole;
