import type { OnboardingStep } from "constants/OnboardingSteps";
import { useReducer } from "react";

export interface AadhaarState {
	number: string | null;
	accessKey: string | null;
	userCode: string | null;
}

export interface SignUrlData {
	pipe?: number;
	short_url?: string;
	document_id?: string;
}

export interface PintwinState {
	bookletNumber: any;
	bookletKeys: Array<{ pintwin_key: any; key_id: any }>;
}

export interface EsignState {
	status: "loading" | "ready" | "failed";
	signUrlData: SignUrlData | null;
}

export interface DigilockerState {
	data: any;
	isLoading: boolean;
}

export interface UIState {
	isLoading: boolean;
	apiInProgress: boolean;
}

export interface OnboardingState {
	// Core flow state
	selectedRole: number | null;
	currentStep: number;
	latLong: string | null;
	lastStepResponse: any;
	stepperData: OnboardingStep[];

	// Feature-specific state
	aadhaar: AadhaarState;
	esign: EsignState;
	pintwin: PintwinState;
	digilocker: DigilockerState;

	// UI state
	ui: UIState;
}

export type OnboardingAction =
	| { type: "SET_ROLE"; payload: number | null }
	| { type: "SET_CURRENT_STEP"; payload: number }
	| { type: "SET_LOCATION"; payload: string }
	| { type: "SET_LAST_STEP_RESPONSE"; payload: any }
	| { type: "SET_STEPPER_DATA"; payload: OnboardingStep[] }
	| { type: "UPDATE_AADHAAR"; payload: Partial<AadhaarState> }
	| { type: "SET_AADHAAR_NUMBER"; payload: string }
	| { type: "SET_AADHAAR_ACCESS_KEY"; payload: string }
	| { type: "SET_AADHAAR_USER_CODE"; payload: string }
	| { type: "UPDATE_ESIGN_STATUS"; payload: "loading" | "ready" | "failed" }
	| { type: "SET_SIGN_URL_DATA"; payload: SignUrlData | null }
	| { type: "SET_BOOKLET_NUMBER"; payload: any }
	| { type: "ADD_BOOKLET_KEY"; payload: { pintwin_key: any; key_id: any } }
	| { type: "SET_DIGILOCKER_DATA"; payload: any }
	| { type: "SET_DIGILOCKER_LOADING"; payload: boolean }
	| { type: "SET_IS_LOADING"; payload: boolean }
	| { type: "SET_API_IN_PROGRESS"; payload: boolean }
	| { type: "STEP_COMPLETED"; payload: { step: number; response: any } }
	| { type: "RESET_STATE" };

export interface OnboardingStateHook {
	state: OnboardingState;
	dispatch: (_action: OnboardingAction) => void;
	// Convenience action creators
	actions: {
		setRole: (_role: number | null) => void;
		setLocation: (_latLong: string) => void;
		updateAadhaar: (_updates: Partial<AadhaarState>) => void;
		setAadhaarNumber: (_number: string) => void;
		setAadhaarAccessKey: (_accessKey: string) => void;
		setAadhaarUserCode: (_userCode: string) => void;
		updateEsignStatus: (_status: "loading" | "ready" | "failed") => void;
		setSignUrlData: (_data: SignUrlData | null) => void;
		setBookletNumber: (_number: any) => void;
		addBookletKey: (_key: { pintwin_key: any; key_id: any }) => void;
		setDigilockerData: (_data: any) => void;
		setDigilockerLoading: (_loading: boolean) => void;
		setIsLoading: (_loading: boolean) => void;
		setApiInProgress: (_inProgress: boolean) => void;
		setLastStepResponse: (_response: any) => void;
		setStepperData: (_data: OnboardingStep[]) => void;
		completeStep: (_step: number, _response: any) => void;
		resetState: () => void;
	};
}

const initialState: OnboardingState = {
	// Core flow state
	selectedRole: null,
	currentStep: 0,
	latLong: null,
	lastStepResponse: undefined,
	stepperData: [],

	// Feature-specific state
	aadhaar: {
		number: null,
		accessKey: null,
		userCode: null,
	},
	esign: {
		status: "loading",
		signUrlData: null,
	},
	pintwin: {
		bookletNumber: null,
		bookletKeys: [],
	},
	digilocker: {
		data: null,
		isLoading: false,
	},

	// UI state
	ui: {
		isLoading: true,
		apiInProgress: false,
	},
};

/**
 * Reducer function for managing onboarding state transitions
 * @param {OnboardingState} state - Current state
 * @param {OnboardingAction} action - Action to apply
 * @returns {OnboardingState} New state
 */
function onboardingReducer(
	state: OnboardingState,
	action: OnboardingAction
): OnboardingState {
	switch (action.type) {
		case "SET_ROLE":
			return {
				...state,
				selectedRole: action.payload,
			};

		case "SET_CURRENT_STEP":
			return {
				...state,
				currentStep: action.payload,
			};

		case "SET_LOCATION":
			return {
				...state,
				latLong: action.payload,
			};

		case "SET_LAST_STEP_RESPONSE":
			return {
				...state,
				lastStepResponse: action.payload,
			};

		case "SET_STEPPER_DATA":
			return {
				...state,
				stepperData: action.payload,
			};

		case "UPDATE_AADHAAR":
			return {
				...state,
				aadhaar: {
					...state.aadhaar,
					...action.payload,
				},
			};

		case "SET_AADHAAR_NUMBER":
			return {
				...state,
				aadhaar: {
					...state.aadhaar,
					number: action.payload,
				},
			};

		case "SET_AADHAAR_ACCESS_KEY":
			return {
				...state,
				aadhaar: {
					...state.aadhaar,
					accessKey: action.payload,
				},
			};

		case "SET_AADHAAR_USER_CODE":
			return {
				...state,
				aadhaar: {
					...state.aadhaar,
					userCode: action.payload,
				},
			};

		case "UPDATE_ESIGN_STATUS":
			return {
				...state,
				esign: {
					...state.esign,
					status: action.payload,
				},
			};

		case "SET_SIGN_URL_DATA":
			return {
				...state,
				esign: {
					...state.esign,
					signUrlData: action.payload,
				},
			};

		case "SET_BOOKLET_NUMBER":
			return {
				...state,
				pintwin: {
					...state.pintwin,
					bookletNumber: action.payload,
				},
			};

		case "ADD_BOOKLET_KEY":
			return {
				...state,
				pintwin: {
					...state.pintwin,
					bookletKeys: [...state.pintwin.bookletKeys, action.payload],
				},
			};

		case "SET_DIGILOCKER_DATA":
			return {
				...state,
				digilocker: {
					...state.digilocker,
					data: action.payload,
				},
			};

		case "SET_DIGILOCKER_LOADING":
			return {
				...state,
				digilocker: {
					...state.digilocker,
					isLoading: action.payload,
				},
			};

		case "SET_IS_LOADING":
			return {
				...state,
				ui: {
					...state.ui,
					isLoading: action.payload,
				},
			};

		case "SET_API_IN_PROGRESS":
			return {
				...state,
				ui: {
					...state.ui,
					apiInProgress: action.payload,
				},
			};

		case "STEP_COMPLETED":
			return {
				...state,
				currentStep: action.payload.step,
				lastStepResponse: action.payload.response,
			};

		case "RESET_STATE":
			return initialState;

		default:
			return state;
	}
}

/**
 * Custom hook for managing onboarding widget state using useReducer
 * Provides better state organization, type safety, and predictable state transitions
 * @returns {OnboardingStateHook} State, dispatch function, and convenience action creators
 */
export const useOnboardingState = (): OnboardingStateHook => {
	const [state, dispatch] = useReducer(onboardingReducer, initialState);

	// Convenience action creators
	const actions = {
		setRole: (role: number | null) => {
			dispatch({ type: "SET_ROLE", payload: role });
		},

		setLocation: (latLong: string) => {
			dispatch({ type: "SET_LOCATION", payload: latLong });
		},

		updateAadhaar: (updates: Partial<AadhaarState>) => {
			dispatch({ type: "UPDATE_AADHAAR", payload: updates });
		},

		setAadhaarNumber: (number: string) => {
			dispatch({ type: "SET_AADHAAR_NUMBER", payload: number });
		},

		setAadhaarAccessKey: (accessKey: string) => {
			dispatch({ type: "SET_AADHAAR_ACCESS_KEY", payload: accessKey });
		},

		setAadhaarUserCode: (userCode: string) => {
			dispatch({ type: "SET_AADHAAR_USER_CODE", payload: userCode });
		},

		updateEsignStatus: (status: "loading" | "ready" | "failed") => {
			dispatch({ type: "UPDATE_ESIGN_STATUS", payload: status });
		},

		setSignUrlData: (data: SignUrlData | null) => {
			dispatch({ type: "SET_SIGN_URL_DATA", payload: data });
		},

		setBookletNumber: (number: any) => {
			dispatch({ type: "SET_BOOKLET_NUMBER", payload: number });
		},

		addBookletKey: (key: { pintwin_key: any; key_id: any }) => {
			dispatch({ type: "ADD_BOOKLET_KEY", payload: key });
		},

		setDigilockerData: (data: any) => {
			dispatch({ type: "SET_DIGILOCKER_DATA", payload: data });
		},

		setDigilockerLoading: (loading: boolean) => {
			dispatch({ type: "SET_DIGILOCKER_LOADING", payload: loading });
		},

		setIsLoading: (loading: boolean) => {
			dispatch({ type: "SET_IS_LOADING", payload: loading });
		},

		setApiInProgress: (inProgress: boolean) => {
			dispatch({ type: "SET_API_IN_PROGRESS", payload: inProgress });
		},

		setLastStepResponse: (response: any) => {
			dispatch({ type: "SET_LAST_STEP_RESPONSE", payload: response });
		},

		setStepperData: (data: OnboardingStep[]) => {
			dispatch({ type: "SET_STEPPER_DATA", payload: data });
		},

		completeStep: (step: number, response: any) => {
			dispatch({
				type: "STEP_COMPLETED",
				payload: { step, response },
			});
		},

		resetState: () => {
			dispatch({ type: "RESET_STATE" });
		},
	};

	return {
		state,
		dispatch,
		actions,
	};
};
