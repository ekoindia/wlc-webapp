import { Center, useToken } from "@chakra-ui/react";
import {
	createRoleSelectionStep,
	visibleAgentTypes,
} from "constants/OnboardingSteps";
import dynamic from "next/dynamic";
import { useOnboardingState, useRoleFormSubmission } from "./hooks";

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
	selectedRole,
	setSelectedRole,
	assistedAgentDetails,
}) => {
	// Get theme primary color
	const [primaryColor, accentColor] = useToken("colors", [
		"primary.DEFAULT",
		"accent.DEFAULT",
	]);

	const mobile = isAssistedOnboarding
		? assistedAgentDetails?.user_detail?.mobile
		: userData?.userDetails?.signup_mobile;

	const { state, actions } = useOnboardingState();
	console.log("[AgentOnboarding] userData", userData);

	const roleSubmission = useRoleFormSubmission({
		state,
		actions,
		mobile,
		selectedRole,
		onSuccess: (data, _bodyData) => {
			// Check if role selection was successful and transition to KYC
			if (data?.response_type_id === 1566) {
				setStep("KYC_FLOW");
			}
		},
	});

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
				handleSubmit={(value) => {
					setSelectedRole(value);

					// Submit role selection via API
					roleSubmission.submitRole({
						id: 0,
						form_data: {
							applicant_type: value - 1,
						},
					});
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
