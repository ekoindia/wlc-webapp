import { TransactionIds } from "constants/EpsTransactions";
import { ONBOARDING_STEP_IDS } from "constants/OnboardingSteps";
import { useCallback } from "react";
import { createPintwinFormat } from "../../../utils/pintwinFormat";
import { useOnboardingApiSubmission } from "./useOnboardingApiSubmission";

/**
 * Determines the interaction type ID based on form data (excluding role selection)
 * @param {FormSubmissionData} data - The form submission data
 * @returns {number} The interaction type ID
 */
const getKycInteractionTypeId = (data: FormSubmissionData): number => {
	switch (data.id) {
		case ONBOARDING_STEP_IDS.AADHAAR_CONSENT:
			return TransactionIds.USER_AADHAR_CONSENT;
		case ONBOARDING_STEP_IDS.CONFIRM_AADHAAR_NUMBER:
			return TransactionIds.USER_AADHAR_NUMBER_CONFIRM;
		case ONBOARDING_STEP_IDS.AADHAAR_NUMBER_OTP_VERIFY:
			return TransactionIds.USER_AADHAR_OTP_CONFIRM;
		case ONBOARDING_STEP_IDS.BUSINESS:
			return TransactionIds.USER_ONBOARDING_BUSINESS;
		case ONBOARDING_STEP_IDS.SECRET_PIN:
			return TransactionIds.USER_ONBOARDING_SECRET_PIN;
		case ONBOARDING_STEP_IDS.SIGN_AGREEMENT:
			return TransactionIds.USER_ONBOARDING_SUBMIT_SIGN_AGREEMENT;
		case ONBOARDING_STEP_IDS.PAN_VERIFICATION_DISTRIBUTOR:
			return TransactionIds.USER_ONBOARDING_PAN_VERIFICATION;
		case ONBOARDING_STEP_IDS.DIGILOCKER_REDIRECTION:
			return TransactionIds.USER_AADHAR_OTP_CONFIRM;
		case ONBOARDING_STEP_IDS.ADD_BANK_ACCOUNT:
			return TransactionIds.ADD_BANK_ACCOUNT;
		default:
			return TransactionIds.USER_ONBOARDING_GEO_LOCATION_CAPTURE;
	}
};

/**
 * Form submission data structure
 */
interface FormSubmissionData {
	id: number;
	form_data: Record<string, any>;
	success_message?: string;
}

/**
 * Onboarding state interface for KYC submission
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
 * Props for useKycFormSubmission hook
 */
interface UseKycFormSubmissionProps {
	state: OnboardingState;
	actions: OnboardingActions;
	mobile: string;
	selectedRole?: string | number;
	agreementId?: string | number;
	onSuccess?: (
		_response: any,
		_data: FormSubmissionData
	) => Promise<void> | void;
	onError?: (_error: any, _data: FormSubmissionData) => Promise<void> | void;
}

/**
 * Return type for useKycFormSubmission hook
 */
interface UseKycFormSubmissionReturn {
	submitForm: (_data: FormSubmissionData) => Promise<void>;
	isSubmitting: boolean;
}

/**
 * Custom hook for handling KYC form submission logic
 * Handles different KYC form types with proper validation and API communication
 * @param {UseKycFormSubmissionProps} props - Configuration object for the hook
 * @returns {UseKycFormSubmissionReturn} Object containing form submission methods
 */
export const useKycFormSubmission = ({
	state,
	actions,
	mobile,
	agreementId,
	onSuccess,
	onError,
}: UseKycFormSubmissionProps): UseKycFormSubmissionReturn => {
	/**
	 * Gets interaction type ID for KYC forms
	 */
	const getInteractionTypeId = useCallback(
		(data: FormSubmissionData): number => {
			return getKycInteractionTypeId(data);
		},
		[]
	);

	/**
	 * Processes form data based on KYC form type
	 */
	const processFormData = useCallback(
		(data: FormSubmissionData): FormSubmissionData => {
			const bodyData = { ...data };
			bodyData.form_data.csp_id = mobile;
			bodyData.form_data.user_id = mobile;
			// console.log("[AgentOnboarding] processFormData data", bodyData);

			switch (data.id) {
				case ONBOARDING_STEP_IDS.AADHAAR_CONSENT:
					bodyData.form_data.company_name = mobile;
					bodyData.form_data.latlong = state.latLong;
					break;

				case ONBOARDING_STEP_IDS.CONFIRM_AADHAAR_NUMBER:
				case ONBOARDING_STEP_IDS.AADHAAR_NUMBER_OTP_VERIFY:
					bodyData.form_data.caseId = state.aadhaar.userCode;
					bodyData.form_data.hold_timeout = "";
					bodyData.form_data.access_key = state.aadhaar.accessKey;

					if (
						data.id === ONBOARDING_STEP_IDS.CONFIRM_AADHAAR_NUMBER
					) {
						actions.setAadhaarNumber(bodyData.form_data.aadhar);
					} else {
						bodyData.form_data.aadhar = state.aadhaar.number;
					}
					break;

				case ONBOARDING_STEP_IDS.BUSINESS:
					bodyData.form_data.latlong = state.latLong;
					bodyData.form_data.communication = 1;
					break;

				case ONBOARDING_STEP_IDS.SECRET_PIN:
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

				case ONBOARDING_STEP_IDS.SIGN_AGREEMENT:
					bodyData.form_data.agreement_id = agreementId || "";
					bodyData.form_data.latlong = state.latLong;
					break;

				case ONBOARDING_STEP_IDS.DIGILOCKER_REDIRECTION:
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
		[state, mobile, agreementId, actions]
	);

	const baseSubmission = useOnboardingApiSubmission({
		state,
		actions,
		getInteractionTypeId,
		processFormData,
		onSuccess,
		onError,
	});

	return {
		submitForm: baseSubmission.submit,
		isSubmitting: baseSubmission.isSubmitting,
	};
};
