import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { PillTab } from "components";
import { useSession } from "contexts";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { parseEnvBoolean } from "utils/envUtils";
import { DashboardProvider } from ".";

const Home = dynamic(
	() =>
		import("page-components/Home").then((mod) => ({
			default: mod.Home,
		})),
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

// Dynamically load dashboard components for better performance
const AnnouncementsDashboard = dynamic(
	() => import("./AnnouncementsDashboard"),
	{
		ssr: false,
		loading: () => <DashboardSkeleton />,
	}
);

/**
 * The Dashboard page component.
 * Originally used only for Admins, but now also for Non-Admins (if ADMIN_DASHBOARD_FOR_SUBNETWORK feature flag is enabled)
 */
const Dashboard = () => {
	const { isAdmin, isLoggedIn } = useSession();
	const [currTab, setCurrTab] = useState(0); // Current active tab index
	const [list, setList] = useState([]); // List of tabs/pages

	// Define the list of tabs/pages based on user role (Admin or Non-Admin)
	// and environment variable settings to hide/show specific dashboards
	// Note: We use `parseEnvBoolean` to convert env string values to boolean
	// (i.e. "true" -> true, "false" -> false, undefined -> false)
	// This allows us to control the visibility of each dashboard tab via env variables
	// For example, setting NEXT_PUBLIC_HIDE_ADMIN_BUSINESS_DASHBOARD=true will hide the Business tab for Admins
	useEffect(() => {
		const _list = isAdmin
			? [
					// Admin Homepage
					{
						label: "Business",
						component: <BusinessDashboard />,
						// disableEnv: "NEXT_PUBLIC_HIDE_ADMIN_BUSINESS_DASHBOARD", // Hide, if this env is `true`
						visible: !parseEnvBoolean(
							process?.env
								?.NEXT_PUBLIC_HIDE_ADMIN_BUSINESS_DASHBOARD
						),
					},
					{
						label: "Onboarding",
						component: <OnboardingDashboard />,
						// disableEnv: "NEXT_PUBLIC_HIDE_ADMIN_ONBOARDING_DASHBOARD", // Hide, if this env is `true`
						visible: !parseEnvBoolean(
							process?.env
								?.NEXT_PUBLIC_HIDE_ADMIN_ONBOARDING_DASHBOARD
						),
					},
				]
			: [
					// Non-Admin Homepage
					{
						label: "Home",
						component: <Home mt={{ base: "12px", md: "30px" }} />,
						// disableEnv: "NEXT_PUBLIC_HIDE_USER_HOME_DASHBOARD", // Hide, if this env is `true`
						visible: !parseEnvBoolean(
							process?.env?.NEXT_PUBLIC_HIDE_USER_HOME_DASHBOARD
						),
					},
					{
						label: "Business",
						component: <BusinessDashboard />,
						// disableEnv: "NEXT_PUBLIC_HIDE_USER_BUSINESS_DASHBOARD",
						visible: !parseEnvBoolean(
							process?.env
								?.NEXT_PUBLIC_HIDE_USER_BUSINESS_DASHBOARD
						),
					},
					{
						label: "Onboarding",
						component: <OnboardingDashboard />,
						// disableEnv: "NEXT_PUBLIC_HIDE_USER_ONBOARDING_DASHBOARD", // Hide, if this env is `true`
						visible: !parseEnvBoolean(
							process?.env
								?.NEXT_PUBLIC_HIDE_USER_ONBOARDING_DASHBOARD
						),
					},
				];

		// Add Announcements tab for Admins only, if the embed URL is set in env variables
		if (isAdmin && process.env.NEXT_PUBLIC_ADMIN_ANNOUNCEMENT_EMBED_URL) {
			list.push({
				label: "Announcements",
				component: <AnnouncementsDashboard />,
			});
		}

		setList(_list.filter((item) => item.visible));
		setCurrTab(0); // Reset to first tab whenever the list changes
	}, [isAdmin]);

	const onClick = (idx) => setCurrTab(idx);

	const getComp = useCallback((idx) => list[idx].component, [list]);

	if (!list?.length) {
		return null;
	}

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
