import { Box } from "@chakra-ui/react";
import { PageTitle, Tabs } from "components";
import { UserTypeLabel } from "constants/UserTypes";
import { useSession } from "contexts";
import { useMemo } from "react";
import { OnboardViaFile, OnboardViaForm } from ".";
import { getOnboardingPermissions } from "./OnboardingPermissions";

// API needs this mapping for applicant_type to work
const agentTypeValueToApi = {
	1: "2",
	2: "0",
};

/**
 * Main component for agent onboarding that provides both individual and bulk onboarding options.
 * The component dynamically adjusts available options based on user permissions and shows appropriate tabs
 * for onboarding via form (individual) or file upload (bulk).
 * @returns {JSX.Element} Component with tabs for different onboarding methods
 * @example
 * ```jsx
 * <OnboardAgents />
 * ```
 */
const OnboardAgents = () => {
	const { isAdmin, userType } = useSession();

	// Get permissions based on user role - determines which agent types the user can onboard
	const permissions = useMemo(() => {
		return getOnboardingPermissions(isAdmin, userType);
	}, [isAdmin, userType]);

	// Dynamically generate page title based on allowed agent types
	// If multiple agent types are allowed, title is generic "Onboard Agents"
	// If only one type is allowed, title is specific "Onboard [Agent Type]"
	const onboardingTitle =
		permissions.allowedAgentTypes.length > 1
			? "Onboard Agents"
			: `Onboard ${UserTypeLabel[permissions.allowedAgentTypes[0]]}`;

	// Convert agent types from permissions to a format usable by form components
	// This creates an array of {label, value} objects for dropdowns and other inputs
	const agentTypeList = permissions.allowedAgentTypes.map((type) => ({
		label: UserTypeLabel[type],
		value: `${type}`,
	}));

	// Define the tabs for different onboarding methods
	const tabList = [
		{
			label: onboardingTitle,
			comp: (
				<OnboardViaForm
					permissions={permissions}
					agentTypeList={agentTypeList}
					agentTypeValueToApi={agentTypeValueToApi}
				/>
			),
		}, // Individual agent onboarding via form
		{
			label: "Bulk Onboarding (Using File)",
			comp: (
				<OnboardViaFile
					permissions={permissions}
					agentTypeList={agentTypeList}
					agentTypeValueToApi={agentTypeValueToApi}
				/>
			),
		}, // Multiple agent onboarding via file upload
	];
	return (
		<>
			<PageTitle title={onboardingTitle} hideBackIcon />
			<Box
				bg="white"
				borderRadius="10px"
				border="card"
				boxShadow="basic"
				mx={{ base: "4", md: "0" }}
				mb={{ base: "16", md: "0" }}
			>
				<Tabs>
					{tabList.map(({ label, comp }, index) => (
						<div key={`${index}-${label}`} label={label}>
							{comp}
						</div>
					))}
				</Tabs>
			</Box>
		</>
	);
};

export default OnboardAgents;
