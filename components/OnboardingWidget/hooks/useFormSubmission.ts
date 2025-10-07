import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import type { OnboardingStep } from "constants/OnboardingSteps";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useCallback } from "react";
import { createPintwinFormat } from "../../../utils/pintwinFormat";
import { getMobileFromData, type UnifiedUserData } from "../utils";

/**
 * Form submission data structure
 */
interface FormSubmissionData {
	id: number;
	form_data: Record<string, any>;
	success_message?: string;
}

/**
 * Onboarding state interface for form submission
 */
interface OnboardingState {
	latLong: string;
	aadhaar: {
		userCode: string;
		accessKey: string;
		number: string;
	};
	pintwin: {
		bookletKeys: any[];
		bookletNumber: {
			is_pintwin_user?: boolean;
			booklet_serial_number?: string;
		};
	};
	digilocker: {
		data?: {
			requestId?: string;
		};
	};
}

/**
 * Onboarding actions interface
 */
interface OnboardingActions {
	setApiInProgress: (_inProgress: boolean) => void;
	setAadhaarNumber: (_number: string) => void;
	setRole: (_role: number) => void;
	setLastStepResponse: (_response: any) => void;
	setAadhaarAccessKey: (_key: string) => void;
	setAadhaarUserCode: (_code: string) => void;
	setIsLoading: (_loading: boolean) => void;
	setStepperData: (_data: OnboardingStep[]) => void;
}

/**
 * Props for useFormSubmission hook
 */
interface UseFormSubmissionProps {
	userData: UnifiedUserData;
	state: OnboardingState;
	actions: OnboardingActions;
	isAssistedOnboarding: boolean;
	assistedAgentMobile: string | null;
	roleSelectionStep?: OnboardingStep;
	refreshApiCall: () => Promise<any>;
	initialStepSetter: (_userData: any) => void;
}

/**
 * Return type for useFormSubmission hook
 */
interface UseFormSubmissionReturn {
	submitForm: (_data: FormSubmissionData) => void;
	isSubmitting: boolean;
}

/**
 * Custom hook for handling form submission logic
 * Handles different form types with proper validation and API communication
 * @param {UseFormSubmissionProps} props - Configuration object for the hook
 * @param {UnifiedUserData} props.userData - User data containing details and mobile info
 * @param {OnboardingState} props.state - Current onboarding state including location and integration data
 * @param {OnboardingActions} props.actions - State management actions for updating onboarding state
 * @param {boolean} props.isAssistedOnboarding - Whether this is an assisted onboarding flow
 * @param {string | null} props.assistedAgentMobile - Mobile number of the assisted agent
 * @param {OnboardingStep} [props.roleSelectionStep] - Optional role selection step configuration
 * @param {() => Promise<any>} props.refreshApiCall - Function to refresh API data
 * @param {(userData: any) => void} props.initialStepSetter - Function to set initial onboarding steps
 * @returns {UseFormSubmissionReturn} Object containing form submission methods
 */
export const useFormSubmission = ({
	userData,
	state,
	actions,
	isAssistedOnboarding,
	assistedAgentMobile,
	roleSelectionStep,
	refreshApiCall,
	initialStepSetter,
}: UseFormSubmissionProps): UseFormSubmissionReturn => {
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	const user_id = getMobileFromData(userData);

	/**
	 * Determines the interaction type ID based on form data
	 */
	const getInteractionTypeId = useCallback(
		(data: FormSubmissionData): number => {
			switch (data.id) {
				case 0:
					return TransactionIds.USER_ONBOARDING_ROLE;
				case 5:
					return TransactionIds.USER_AADHAR_CONSENT;
				case 6:
					return TransactionIds.USER_AADHAR_NUMBER_CONFIRM;
				case 7:
					return TransactionIds.USER_AADHAR_OTP_CONFIRM;
				case 9:
					return TransactionIds.USER_ONBOARDING_BUSINESS;
				case 10:
					return TransactionIds.USER_ONBOARDING_SECRET_PIN;
				case 12:
					return TransactionIds.USER_ONBOARDING_SUBMIT_SIGN_AGREEMENT;
				case 16:
					return TransactionIds.USER_ONBOARDING_PAN_VERIFICATION;
				case 20:
					return TransactionIds.USER_AADHAR_OTP_CONFIRM;
				default:
					return TransactionIds.USER_ONBOARDING_GEO_LOCATION_CAPTURE;
			}
		},
		[]
	);

	/**
	 * Processes form data based on form type
	 */
	const processFormData = useCallback(
		(data: FormSubmissionData) => {
			const bodyData = { ...data };

			switch (data.id) {
				case 0: // Role selection
					if (roleSelectionStep) {
						const applicantData =
							roleSelectionStep.form_data.roles.find(
								(role: any) =>
									role.merchant_type ===
									parseInt(data.form_data.merchant_type)
							)?.applicant_type;

						bodyData.form_data.applicant_type = applicantData;
						bodyData.form_data.csp_id = getMobileFromData(userData);
					}
					break;

				case 5: // Aadhaar consent
					bodyData.form_data.company_name =
						getMobileFromData(userData);
					bodyData.form_data.latlong = state.latLong;
					break;

				case 6: // Aadhaar number confirmation
				case 7: // Aadhaar OTP confirmation
					bodyData.form_data.caseId = state.aadhaar.userCode;
					bodyData.form_data.hold_timeout = "";
					bodyData.form_data.access_key = state.aadhaar.accessKey;

					if (data.id === 6) {
						actions.setAadhaarNumber(bodyData.form_data.aadhar);
					} else {
						bodyData.form_data.aadhar = state.aadhaar.number;
					}
					break;

				case 9: // Business details
					bodyData.form_data.latlong = state.latLong;
					bodyData.form_data.csp_id = getMobileFromData(userData);
					bodyData.form_data.communication = 1;
					break;

				case 10: // Pintwin secret PIN
					// Process first OKE key
					if (
						data.form_data?.first_okekey &&
						state.pintwin.bookletKeys[
							state.pintwin.bookletKeys?.length - 2
						]
					) {
						bodyData.form_data.first_okekey = createPintwinFormat(
							data.form_data.first_okekey,
							state.pintwin.bookletKeys[
								state.pintwin.bookletKeys.length - 2
							]
						);
					}

					// Process second OKE key
					if (
						data.form_data?.second_okekey &&
						state.pintwin.bookletKeys[
							state.pintwin.bookletKeys?.length - 1
						]
					) {
						bodyData.form_data.second_okekey = createPintwinFormat(
							data.form_data.second_okekey,
							state.pintwin.bookletKeys[
								state.pintwin.bookletKeys.length - 1
							]
						);
					}

					bodyData.form_data.is_pintwin_user =
						state.pintwin.bookletNumber?.is_pintwin_user ?? false;
					bodyData.form_data.booklet_serial_number =
						state.pintwin.bookletNumber?.booklet_serial_number ??
						"";
					bodyData.form_data.latlong = state.latLong;
					break;

				case 16: // PAN verification
					bodyData.form_data.csp_id = getMobileFromData(userData);
					break;

				case 20: // Digilocker OTP confirmation
					bodyData.form_data.is_consent = "Y";
					bodyData.form_data.token_id =
						state.digilocker.data?.requestId;
					break;

				default:
					// No special processing needed
					break;
			}

			return bodyData;
		},
		[userData, state, roleSelectionStep, actions]
	);

	/**
	 * Handles successful form submission
	 */
	const handleSubmissionSuccess = useCallback(
		async (data: any, bodyData: FormSubmissionData) => {
			toast({
				title: bodyData.success_message || "Success",
				status: "success",
				duration: 2000,
			});

			// Handle specific form responses
			if (bodyData.id === 5) {
				actions.setAadhaarAccessKey(data?.data?.access_key);
				actions.setAadhaarUserCode(data?.data?.user_code);
			}

			if (bodyData.id === 2) {
				actions.setRole(
					parseInt(bodyData?.form_data?.merchant_type) || 0
				);
			}

			actions.setLastStepResponse(data);

			// Refresh API and handle role selection step initialization
			const refreshResult = await refreshApiCall();
			if (bodyData.id === 0) {
				initialStepSetter(refreshResult);
			}
		},
		[toast, actions, refreshApiCall, initialStepSetter]
	);

	/**
	 * Handles form submission errors
	 */
	const handleSubmissionError = useCallback(
		(error: any) => {
			toast({
				title:
					error.message ||
					"Something went wrong, please try again later!",
				status: "error",
				duration: 2000,
			});
			actions.setLastStepResponse(error);
		},
		[toast, actions]
	);

	/**
	 * Main form submission function
	 */
	const submitForm = useCallback(
		async (data: FormSubmissionData) => {
			const processedData = processFormData(data);
			const interactionTypeId = getInteractionTypeId(data);

			const cspId = isAssistedOnboarding
				? { csp_id: assistedAgentMobile }
				: {};

			actions.setApiInProgress(true);

			try {
				const response = await fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.TRANSACTION,
					{
						token: accessToken,
						body: {
							interaction_type_id: interactionTypeId,
							user_id,
							...processedData.form_data,
							...cspId,
						},
						timeout: 30000,
					},
					generateNewToken
				);

				const success =
					response?.status === 0 &&
					!(Object.keys(response?.invalid_params || {}).length > 0);

				if (success) {
					await handleSubmissionSuccess(response, processedData);
				} else {
					toast({
						title: response.message,
						status: "error",
						duration: 2000,
					});
					actions.setLastStepResponse(response);
				}
			} catch (error: any) {
				handleSubmissionError(error);
			} finally {
				actions.setApiInProgress(false);
			}
		},
		[
			processFormData,
			getInteractionTypeId,
			isAssistedOnboarding,
			assistedAgentMobile,
			actions,
			accessToken,
			user_id,
			generateNewToken,
			handleSubmissionSuccess,
			handleSubmissionError,
			toast,
		]
	);

	return {
		submitForm,
		isSubmitting: false, // Could track submission state if needed
	};
};
