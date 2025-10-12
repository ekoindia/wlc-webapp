import { Center, useToken } from "@chakra-ui/react";
import {
	createRoleSelectionStep,
	visibleAgentTypes,
} from "constants/OnboardingSteps";
import { useUserTypes } from "hooks";
import dynamic from "next/dynamic";
import { useOnboardingState, useRoleFormSubmission } from "./hooks";

const ExternalSelectionScreen = dynamic(
	() => import("@ekoindia/oaas-widget").then((mod) => mod.SelectionScreen),
	{ ssr: false }
) as any;

/**
 * RoleSelection component for selecting user role during onboarding
 * @param {object} props - Properties passed to the component
 * @param {Function} props.setStep - Function to set the current step in the onboarding process
 * @param {string} props.logo - URL of the logo to be displayed
 * @param {string} props.appName - Name of the application
 * @param {string} props.orgName - Name of the organization
 * @param {object} props.userData - User data object
 * @param {Function} props.updateUserInfo - Function to update user information
 * @param {boolean} props.isAssistedOnboarding - Flag indicating if it's assisted onboarding
 * @param {string} props.selectedRole - Currently selected role
 * @param {Function} props.setSelectedRole - Function to set the selected role
 * @param {object} [props.assistedAgentDetails] - Details of the assisted agent (if any)
 * @param {number[]} [props.allowedMerchantTypes] - Optional list of allowed merchant types for the onboarding process. Eg: [1,3] for Retailer and Distributor only.
 * @param props.refreshAgentProfile
 * @returns {JSX.Element} The rendered RoleSelection component
 */
const RoleSelection = ({
	setStep,
	userData,
	isAssistedOnboarding,
	selectedRole,
	setSelectedRole,
	assistedAgentDetails,
	allowedMerchantTypes,
	refreshAgentProfile,
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
				refreshAgentProfile().then(() => {
					setStep("KYC_FLOW");
				});
			}
		},
	});

	const { userTypeLabels } = useUserTypes();

	const forAgentTypes = isAssistedOnboarding
		? visibleAgentTypes.assistedOnboarding
		: allowedMerchantTypes || visibleAgentTypes.selfOnboarding;

	// Example: Custom user type labels from org_metadata (in the future from orgDetail)
	// const customUserTypeLabels = {
	// 	1: "Partner", // Custom label for Distributor
	// 	2: "Agent", // Custom label for I_MERCHANT
	// 	23: "API Partner", // Custom label for Enterprise
	// };

	// const onboardingRoleStep = createRoleSelectionStep(visibleAgentTypes, {
	// 	userTypeLabel: customUserTypeLabels,
	// });

	const onboardingRoleStep = createRoleSelectionStep(forAgentTypes, {
		userTypeLabel: userTypeLabels,
	});
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
			/>
		</Center>
	);
};

export default RoleSelection;
