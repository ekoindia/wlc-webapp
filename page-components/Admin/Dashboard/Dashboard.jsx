import { Flex, Text } from "@chakra-ui/react";
import { PillTab } from "components";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import {
	AnnouncementsDashboard,
	BusinessDashboard,
	DashboardProvider,
	OnboardingDashboard,
} from ".";

/**
 * A Dashboard page component
 * @returns {JSX.Element} Dashboard component
 * @example	`<Dashboard></Dashboard>`
 */
const Dashboard = () => {
	const { t } = useTranslation("dashboard");
	const [currTab, setCurrTab] = useState(0);

	const list = [
		{ label: t("tabs.business"), component: <BusinessDashboard /> },
		{ label: t("tabs.onboarding"), component: <OnboardingDashboard /> },
	];

	if (process.env.NEXT_PUBLIC_ADMIN_ANNOUNCEMENT_EMBED_URL) {
		list.push({
			label: t("tabs.announcements"),
			component: <AnnouncementsDashboard />,
		});
	}

	const onClick = (idx) => setCurrTab(idx);

	const getComp = (idx) => list[idx].component;

	return (
		<DashboardProvider>
			<div>
				<Flex
					bg={{ base: "white", md: "none" }}
					pb={{ base: "10px", md: "0px" }}
					borderRadius="0px 0px 20px 20px"
				>
					<Flex
						direction={{ base: "column", md: "row" }}
						align={{ base: "flex-start", md: "center" }}
						gap={{ base: "2", md: "8" }}
						w="100%"
						m={{ base: "20px", md: "0px" }}
						fontSize="sm"
						justify="space-between"
					>
						<Text fontWeight="semibold" fontSize="2xl">
							{t("title")}
						</Text>
						<PillTab {...{ list, onClick, currTab }} />
					</Flex>
				</Flex>
				{getComp(currTab)}
			</div>
		</DashboardProvider>
	);
};

export default Dashboard;
