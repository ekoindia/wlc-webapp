import { Flex, Text } from "@chakra-ui/react";
import { PillTab } from "components";
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
	const [currTab, setCurrTab] = useState(0);

	const list = [
		{ label: "Business", component: <BusinessDashboard /> },
		{ label: "Onboarding", component: <OnboardingDashboard /> },
	];

	if (process.env.NEXT_PUBLIC_ADMIN_ANNOUNCEMENT_EMBED_URL) {
		list.push({
			label: "Announcements",
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
