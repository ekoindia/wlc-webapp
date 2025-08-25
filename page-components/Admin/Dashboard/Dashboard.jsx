import { Flex, Text } from "@chakra-ui/react";
import { PillTab } from "components";
import { useSession } from "contexts";
import { Home } from "page-components"; // Non-Admin Homepage
import { useState } from "react";
import {
	AnnouncementsDashboard,
	BusinessDashboard,
	DashboardProvider,
	OnboardingDashboard,
} from ".";

/**
 * A Dashboard page component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Dashboard></Dashboard>`
 */
const Dashboard = () => {
	const { isAdmin, isLoggedIn } = useSession();
	const [currTab, setCurrTab] = useState(0);

	const list = isAdmin
		? [
				{ label: "Business", component: <BusinessDashboard /> },
				{ label: "Onboarding", component: <OnboardingDashboard /> },
			]
		: [
				{
					label: "Home",
					component: <Home mt={{ base: "12px", md: "30px" }} />,
				},
				{ label: "Business", component: <BusinessDashboard /> },
			];

	if (isAdmin && process.env.NEXT_PUBLIC_ADMIN_ANNOUNCEMENT_EMBED_URL) {
		list.push({
			label: "Announcements",
			component: <AnnouncementsDashboard />,
		});
	}

	const onClick = (idx) => setCurrTab(idx);

	const getComp = (idx) => list[idx].component;

	if (!isLoggedIn) {
		return null;
	}

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
							Dashboard
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
