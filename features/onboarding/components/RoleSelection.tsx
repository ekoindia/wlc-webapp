import { useToast, useToken } from "@chakra-ui/react";
import { useSession } from "contexts";
import { useRefreshToken, useUserTypes } from "hooks";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import {
	createRoleSelectionStep,
	masterOnboardingSteps,
	ONBOARDING_API_STATUS,
	ONBOARDING_STEP_IDS,
	ONBOARDING_STEP_STATUS,
	visibleAgentTypes,
} from "../constants";
import { useOnboardingState } from "../hooks";
import { executePipeline } from "../utils";

const ExternalSelectionScreen = dynamic(
	() => import("@ekoindia/oaas-widget").then((mod) => mod.SelectionScreen),
	{ ssr: false }
) as any;

/**
 * RoleSelection component for selecting user role during onboarding
 * @param {object} props - Properties passed to the component
 * @param {Function} props.setStep - Function to set the current step in the onboarding process
 * @param {object} props.userData - User data object
 * @param {boolean} props.isAssistedOnboarding - Flag indicating if it's assisted onboarding
 * @param {Function} props.setSelectedRole - Function to set the selected role
 * @param {object} [props.assistedAgentDetails] - Details of the assisted agent (if any)
 * @param {number[]} [props.allowedMerchantTypes] - Optional list of allowed merchant types for the onboarding process. Eg: [1,3] for Retailer and Distributor only.
 * @param {Function} props.refreshAgentProfile - Function to refresh the agent profile data
 * @returns {JSX.Element} The rendered RoleSelection component
 */
const RoleSelection = ({
	setStep,
	userData,
	isAssistedOnboarding,
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
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	// Get the role selection step config from masterOnboardingSteps
	const roleStepConfig = masterOnboardingSteps.find(
		(step) => step.id === ONBOARDING_STEP_IDS.SELECTION_SCREEN
	);

	/**
	 * Submit role selection using the pipeline executor
	 */
	const submitRoleSelection = useCallback(
		async (applicantType: string | number) => {
			if (!roleStepConfig) {
				console.error(
					"[RoleSelection] Role selection step config not found"
				);
				return;
			}

			actions.setApiInProgress(true);

			try {
				await executePipeline({
					stepConfig: roleStepConfig,
					formData: {
						id: ONBOARDING_STEP_IDS.SELECTION_SCREEN,
						form_data: {
							applicant_type: applicantType,
							csp_id: mobile,
						},
					},
					mobile: String(mobile || ""),
					accessToken,
					generateNewToken,
					sharedState: {
						mobile: String(mobile || ""),
						latLong: state.latLong,
					},
					onSuccess: async (response) => {
						console.log(
							"[RoleSelection] Pipeline success:",
							response
						);
						// Check if role selection was successful (response_type_id 1566)
						if (response?.response_type_id === 1566) {
							await refreshAgentProfile();
							setStep("KYC_FLOW");
						}
					},
					onError: async (error) => {
						console.error("[RoleSelection] Pipeline error:", error);
						toast({
							title: error?.message || "Failed to submit role",
							status: "error",
							duration: 3000,
						});
					},
				});
			} catch (error) {
				console.error("[RoleSelection] Submission error:", error);
				toast({
					title: "Something went wrong",
					status: "error",
					duration: 3000,
				});
			} finally {
				actions.setApiInProgress(false);
			}
		},
		[
			roleStepConfig,
			actions,
			mobile,
			accessToken,
			generateNewToken,
			state.latLong,
			refreshAgentProfile,
			setStep,
			toast,
		]
	);

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
	// console.log("[AgentOnboarding] onboardingRoleStep", onboardingRoleStep);

	return (
		<ExternalSelectionScreen
			primaryColor={primaryColor}
			accentColor={accentColor}
			stepData={onboardingRoleStep}
			constants={{
				apiStatus: ONBOARDING_API_STATUS,
				stepIds: ONBOARDING_STEP_IDS,
				stepStatus: ONBOARDING_STEP_STATUS,
			}}
			handleSubmit={(value) => {
				const { form_data } = value ?? {};
				const _applicantType = form_data?.applicant_type ?? "";

				// Update selected role state
				setSelectedRole(_applicantType);

				// Submit role selection via pipeline executor
				submitRoleSelection(_applicantType);
			}}
		/>
	);
};

export default RoleSelection;
