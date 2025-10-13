import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useCallback } from "react";

/**
 * Form submission data structure
 */
interface FormSubmissionData {
	id: number;
	form_data: Record<string, any>;
	success_message?: string;
}

/**
 * Onboarding state interface for API submission
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
	setLastStepResponse: (_response: any) => void;
	setAadhaarAccessKey: (_key: string) => void;
	setAadhaarUserCode: (_code: string) => void;
	setAadhaarNumber: (_number: string) => void;
	setRole: (_role: number) => void;
}

/**
 * Props for useOnboardingApiSubmission hook
 */
interface UseOnboardingApiSubmissionProps {
	state?: OnboardingState;
	actions: OnboardingActions;
	mobile: string;
	getInteractionTypeId: (_data: FormSubmissionData) => number;
	processFormData: (_data: FormSubmissionData) => FormSubmissionData;
	onSuccess?: (
		_data: any,
		_bodyData: FormSubmissionData
	) => Promise<void> | void;
	onError?: (_error: any) => void;
}

/**
 * Return type for useOnboardingApiSubmission hook
 */
interface UseOnboardingApiSubmissionReturn {
	submit: (_data: FormSubmissionData) => Promise<void>;
	isSubmitting: boolean;
}

/**
 * Base hook for handling onboarding API submissions
 * Provides core API submission logic with optional success/error callbacks
 * @param {UseOnboardingApiSubmissionProps} props - Configuration object for the hook
 * @returns {UseOnboardingApiSubmissionReturn} Object containing submission methods
 */
export const useOnboardingApiSubmission = ({
	actions,
	mobile,
	getInteractionTypeId,
	processFormData,
	onSuccess,
	onError,
}: UseOnboardingApiSubmissionProps): UseOnboardingApiSubmissionReturn => {
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	/**
	 * Handles successful API submission
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

			// Call optional success callback
			if (typeof onSuccess === "function") {
				await onSuccess(data, bodyData);
			}
		},
		[toast, actions, onSuccess]
	);

	/**
	 * Handles API submission errors
	 */
	const handleSubmissionError = useCallback(
		(error: any) => {
			const errorMessage =
				error.message ||
				"Something went wrong, please try again later!";

			toast({
				title: errorMessage,
				status: "error",
				duration: 2000,
			});

			actions.setLastStepResponse(error);

			// Call optional error callback
			if (onError) {
				onError(error);
			}
		},
		[toast, actions, onError]
	);

	/**
	 * Main API submission function
	 */
	const submit = useCallback(
		async (data: FormSubmissionData) => {
			const processedData = processFormData(data);
			const interactionTypeId = getInteractionTypeId(data);

			actions.setApiInProgress(true);

			try {
				const response = await fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.TRANSACTION,
					{
						token: accessToken,
						body: {
							interaction_type_id: interactionTypeId,
							user_id: mobile,
							csp_id: mobile,
							...processedData.form_data,
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
			actions,
			accessToken,
			mobile,
			generateNewToken,
			handleSubmissionSuccess,
			handleSubmissionError,
			toast,
		]
	);

	return {
		submit,
		isSubmitting: false, // Could track submission state if needed
	};
};
