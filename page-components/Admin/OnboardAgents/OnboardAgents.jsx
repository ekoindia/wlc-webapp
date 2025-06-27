import { Box } from "@chakra-ui/react";
import { PageTitle, Tabs } from "components";
import { UserTypeLabel } from "constants/UserTypes";
import { useSession } from "contexts";
import { useMemo } from "react";
import { OnboardViaFile, OnboardViaForm } from ".";
import { getOnboardingPermissions } from "./OnboardingPermissions";

/**
 * A OnboardAgents page-component
 * @example	`<OnboardAgents></OnboardAgents>` TODO: Fix example
 */
const OnboardAgents = () => {
	const { isAdmin, userType } = useSession();

	// Get permissions based on user role
	const permissions = useMemo(() => {
		return getOnboardingPermissions(isAdmin, userType);
	}, [isAdmin, userType]);

	// based on the permissions.allowedAgentTypes, page title & tabs label will get updated
	// if permissions.allowedAgentTypes length is greater than 1, then tabs label will be "Onboard Agents"
	// if permissions.allowedAgentTypes length is 1, then tabs label will be "Onboard <Agent Type>"
	const onboardingTitle =
		permissions.allowedAgentTypes.length > 1
			? "Onboard Agents"
			: `Onboard ${UserTypeLabel[permissions.allowedAgentTypes[0]]}`;

	const tabList = [
		{
			label: onboardingTitle,
			comp: <OnboardViaForm permissions={permissions} />,
		}, // form based onboarding
		{
			label: "Bulk Onboarding (Using File)",
			comp: <OnboardViaFile permissions={permissions} />,
		}, // file based onboarding
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
