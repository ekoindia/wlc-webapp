import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { PillTab } from "components";
import { useSession } from "contexts";
import dynamic from "next/dynamic";
import { Home } from "page-components"; // Non-Admin Homepage
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardProvider } from ".";

// Dynamically load dashboard components for better performance
const AnnouncementsDashboard = dynamic(
	() => import("./AnnouncementsDashboard"),
	{
		ssr: false,
		loading: () => <DashboardSkeleton />,
	}
);

const BusinessDashboard = dynamic(
	() =>
		import("./BusinessDashboard").then((mod) => ({
			default: mod.BusinessDashboard,
		})),
	{
		ssr: false,
		loading: () => <DashboardSkeleton />,
	}
);

const OnboardingDashboard = dynamic(
	() =>
		import("./OnboardingDashboard").then((mod) => ({
			default: mod.OnboardingDashboard,
		})),
	{
		ssr: false,
		loading: () => <DashboardSkeleton />,
	}
);

/**
 * The Dashboard page component
 */
const Dashboard = () => {
	const { isAdmin, isLoggedIn } = useSession();
	const [currTab, setCurrTab] = useState(0);
	const { t } = useTranslation("dashboard");

	const list = isAdmin
		? [
				{ label: t("tabs.business"), component: <BusinessDashboard /> },
				{
					label: t("tabs.onboarding"),
					component: <OnboardingDashboard />,
				},
			]
		: [
				{
					label: t("tabs.home"),
					component: <Home mt={{ base: "12px", md: "30px" }} />,
				},
				{ label: "Business", component: <BusinessDashboard /> },
			];

	if (isAdmin && process.env.NEXT_PUBLIC_ADMIN_ANNOUNCEMENT_EMBED_URL) {
		list.push({
			label: t("tabs.announcements"),
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

/**
 * Skeleton component for a typical dashboard page load animation
 */
const DashboardSkeleton = () => {
	return (
		<Flex direction="column" gap="2em" p="6" overflow="hidden">
			<Skeleton height="100px" borderRadius="10px" />
			<Skeleton height="300px" borderRadius="10px" />
		</Flex>
	);
};

export default Dashboard;
