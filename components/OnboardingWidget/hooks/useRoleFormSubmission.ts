import { TransactionIds } from "constants/EpsTransactions";
import { useCallback } from "react";
import { useOnboardingApiSubmission } from "./useOnboardingApiSubmission";

/**
 * Form submission data structure
 */
interface FormSubmissionData {
	id: number;
	form_data: Record<string, any>;
	success_message?: string;
}

/**
 * Onboarding state interface for role submission
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
 * Props for useRoleFormSubmission hook
 */
interface UseRoleFormSubmissionProps {
	state: OnboardingState;
	actions: OnboardingActions;
	mobile: string;
	selectedRole: string | number;
	onSuccess?: (
		_data: any,
		_bodyData: FormSubmissionData
	) => Promise<void> | void;
	onError?: (_error: any) => void;
}

/**
 * Return type for useRoleFormSubmission hook
 */
interface UseRoleFormSubmissionReturn {
	submitRole: (_data: FormSubmissionData) => Promise<void>;
	isSubmitting: boolean;
}

/**
 * Custom hook for handling role selection form submission
 * Specialized for role selection (form ID 0) with step transition logic
 * @param {UseRoleFormSubmissionProps} props - Configuration object for the hook
 * @returns {UseRoleFormSubmissionReturn} Object containing role submission methods
 */
export const useRoleFormSubmission = ({
	state,
	actions,
	mobile,
	selectedRole,
	onSuccess,
	onError,
}: UseRoleFormSubmissionProps): UseRoleFormSubmissionReturn => {
	/**
	 * Determines the interaction type ID for role submission
	 */
	const getInteractionTypeId = useCallback(
		(_data: FormSubmissionData): number => {
			return TransactionIds.USER_ONBOARDING_ROLE;
		},
		[]
	);

	/**
	 * Processes form data for role submission
	 */
	const processFormData = useCallback(
		(data: FormSubmissionData): FormSubmissionData => {
			const bodyData = { ...data };
			console.log("[AgentOnboarding] bodyData", bodyData);

			// Role selection specific processing
			bodyData.form_data.applicant_type =
				bodyData.form_data.applicant_type;
			bodyData.form_data.csp_id = mobile;

			return bodyData;
		},
		[selectedRole, mobile]
	);

	const baseSubmission = useOnboardingApiSubmission({
		state,
		actions,
		mobile,
		getInteractionTypeId,
		processFormData,
		onSuccess,
		onError,
	});

	return {
		submitRole: baseSubmission.submit,
		isSubmitting: baseSubmission.isSubmitting,
	};
};
