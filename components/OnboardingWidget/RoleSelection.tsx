import { Center, useToken } from "@chakra-ui/react";
import {
	createRoleSelectionStep,
	visibleAgentTypes,
} from "constants/OnboardingSteps";
import dynamic from "next/dynamic";

const ExternalSelectionScreen = dynamic(
	() => import("@ekoindia/oaas-widget").then((mod) => mod.SelectionScreen),
	{ ssr: false }
) as any;

const RoleSelection = ({
	setStep,
	logo,
	appName,
	orgName,
	userData,
	updateUserInfo,
	isAssistedOnboarding,
	setSelectedRole,
}) => {
	// Get theme primary color
	const [primaryColor, accentColor] = useToken("colors", [
		"primary.DEFAULT",
		"accent.DEFAULT",
	]);

	const forAgentTypes = isAssistedOnboarding
		? visibleAgentTypes.assistedOnboarding
		: visibleAgentTypes.selfOnboarding;

	// Example: Custom user type labels from org_metadata (in the future from orgDetail)
	// const customUserTypeLabels = {
	// 	1: "Partner", // Custom label for Distributor
	// 	2: "Agent", // Custom label for I_MERCHANT
	// 	23: "API Partner", // Custom label for Enterprise
	// };

	// const onboardingRoleStep = createRoleSelectionStep(visibleAgentTypes, {
	// 	userTypeLabel: customUserTypeLabels,
	// });

	const onboardingRoleStep = createRoleSelectionStep(forAgentTypes);
	console.log("[AgentOnboarding] onboardingRoleStep", onboardingRoleStep);

	return (
		<Center>
			<ExternalSelectionScreen
				primaryColor={primaryColor}
				accentColor={accentColor}
				stepData={onboardingRoleStep}
				handleSubmit={() => {
					setSelectedRole();
					setStep("KYC_FLOW");
				}}
				logo={logo} // check if needed
				appName={appName} // check if needed
				orgName={orgName} // check if needed
				userData={userData} // check if needed
				updateUserInfo={updateUserInfo} // check if needed
			/>
		</Center>
	);
};

export default RoleSelection;
