import { Action, DigiKhataState, initialState } from "./types";

/**
 * Pure reducer for DigiKhata state transitions.
 * @param state
 * @param action
 */
export const digiKhataReducer = (
	state: DigiKhataState,
	action: Action
): DigiKhataState => {
	switch (action.type) {
		case "SET_STEP":
			return { ...state, step: action.step, error: null };

		case "SET_WALLET_DATA":
			return {
				...state,
				walletData: {
					...action.payload,
					lastUpdatedAt: new Date().toISOString(),
				},
				otpRefId: null,
				hasFetchedWallet: true,
				isLoading: false,
				error: null,
			};

		case "SET_OTP_REF_ID":
			return { ...state, otpRefId: action.payload };

		case "SET_CONSENT_ID":
			return { ...state, consentId: action.payload };

		case "SET_CONSENT_LANG_ID":
			return { ...state, consentLangId: action.payload };

		case "SET_AADHAAR_NUMBER":
			return { ...state, aadhaarNumber: action.payload };

		case "SET_RECIPIENTS":
			return { ...state, recipients: action.payload };

		case "ADD_RECIPIENT":
			return {
				...state,
				recipients: [
					{ ...action.payload, isNew: true },
					...state.recipients,
				],
			};

		case "SET_SELECTED_RECIPIENT":
			return { ...state, selectedRecipient: action.payload };

		case "SET_LOADING":
			return { ...state, isLoading: action.payload };

		case "SET_ERROR":
			return { ...state, error: action.payload, isLoading: false };

		case "RESET_ERROR":
			return { ...state, error: null };

		default:
			return state;
	}
};

export { initialState };
