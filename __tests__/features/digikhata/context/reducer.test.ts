import { digiKhataReducer } from "features/digikhata/context/reducer";
import {
	Action,
	DigiKhataState,
	initialState,
	Recipient,
	WalletData,
} from "features/digikhata/context/types";

const mockWalletData: WalletData = {
	walletAcOpened: true,
	walletAcOpeningInProgress: false,
	walletHolderName: "Test Agent",
	accountStatus: "ACTIVE",
	walletToBankLimitAvailable: 50000,
	walletToBankLimitConsumed: 10000,
	token: "mock-token",
	walletCurrentBalance: 2500,
	walletKYCDocStatus: { aadharVerified: true, pancardVerified: true },
	lastUpdatedAt: "",
};

const mockRecipient: Recipient = {
	beneficiary_id: 1,
	name: "John Doe",
	accountNumber: "12345678",
	ifsc: "HDFC0001234",
	bankName: "HDFC Bank",
};

describe("digiKhataReducer", () => {
	describe("SET_STEP", () => {
		it("updates the step", () => {
			const action: Action = {
				type: "SET_STEP",
				step: "aadhaar-consent",
			};
			const state = digiKhataReducer(initialState, action);
			expect(state.step).toBe("aadhaar-consent");
		});
	});

	describe("SET_WALLET_DATA", () => {
		it("stores wallet data, sets hasFetchedWallet, and stamps lastUpdatedAt", () => {
			const action: Action = {
				type: "SET_WALLET_DATA",
				payload: mockWalletData,
			};
			const state = digiKhataReducer(initialState, action);
			expect(state.walletData?.walletHolderName).toBe("Test Agent");
			expect(state.hasFetchedWallet).toBe(true);
			expect(state.walletData?.lastUpdatedAt).toBeTruthy();
			expect(typeof state.walletData?.lastUpdatedAt).toBe("string");
		});
	});

	describe("SET_CONSENT_ID", () => {
		it("stores the consentId", () => {
			const action: Action = {
				type: "SET_CONSENT_ID",
				payload: "consent-123",
			};
			const state = digiKhataReducer(initialState, action);
			expect(state.consentId).toBe("consent-123");
		});
	});

	describe("SET_CONSENT_LANG_ID", () => {
		it("stores the consentLangId", () => {
			const action: Action = {
				type: "SET_CONSENT_LANG_ID",
				payload: "en",
			};
			const state = digiKhataReducer(initialState, action);
			expect(state.consentLangId).toBe("en");
		});
	});

	describe("SET_AADHAAR_NUMBER", () => {
		it("stores the Aadhaar number", () => {
			const action: Action = {
				type: "SET_AADHAAR_NUMBER",
				payload: "123456789012",
			};
			const state = digiKhataReducer(initialState, action);
			expect(state.aadhaarNumber).toBe("123456789012");
		});
	});

	describe("SET_RECIPIENTS", () => {
		it("replaces recipients list", () => {
			const action: Action = {
				type: "SET_RECIPIENTS",
				payload: [mockRecipient],
			};
			const state = digiKhataReducer(initialState, action);
			expect(state.recipients).toHaveLength(1);
			expect(state.recipients[0].name).toBe("John Doe");
		});

		it("can set an empty list", () => {
			const action: Action = { type: "SET_RECIPIENTS", payload: [] };
			const state = digiKhataReducer(
				{ ...initialState, recipients: [mockRecipient] },
				action
			);
			expect(state.recipients).toHaveLength(0);
		});
	});

	describe("ADD_RECIPIENT", () => {
		it("prepends the new recipient with isNew flag", () => {
			const existingState: DigiKhataState = {
				...initialState,
				recipients: [mockRecipient],
			};
			const newRecipient: Recipient = {
				beneficiary_id: 2,
				name: "Jane Doe",
				accountNumber: "87654321",
				ifsc: "SBI00001234",
				bankName: "SBI",
			};
			const action: Action = {
				type: "ADD_RECIPIENT",
				payload: newRecipient,
			};
			const state = digiKhataReducer(existingState, action);
			expect(state.recipients).toHaveLength(2);
			expect(state.recipients[0].name).toBe("Jane Doe");
			expect(state.recipients[0].isNew).toBe(true);
		});
	});

	describe("SET_SELECTED_RECIPIENT", () => {
		it("stores the selected recipient", () => {
			const action: Action = {
				type: "SET_SELECTED_RECIPIENT",
				payload: mockRecipient,
			};
			const state = digiKhataReducer(initialState, action);
			expect(state.selectedRecipient?.name).toBe("John Doe");
		});

		it("can clear the selected recipient to null", () => {
			const existingState: DigiKhataState = {
				...initialState,
				selectedRecipient: mockRecipient,
			};
			const action: Action = {
				type: "SET_SELECTED_RECIPIENT",
				payload: null,
			};
			const state = digiKhataReducer(existingState, action);
			expect(state.selectedRecipient).toBeNull();
		});
	});

	describe("SET_LOADING", () => {
		it("sets isLoading to true", () => {
			const action: Action = { type: "SET_LOADING", payload: true };
			const state = digiKhataReducer(initialState, action);
			expect(state.isLoading).toBe(true);
		});

		it("sets isLoading to false", () => {
			const existingState: DigiKhataState = {
				...initialState,
				isLoading: true,
			};
			const action: Action = { type: "SET_LOADING", payload: false };
			const state = digiKhataReducer(existingState, action);
			expect(state.isLoading).toBe(false);
		});
	});

	describe("SET_ERROR", () => {
		it("stores an error message", () => {
			const action: Action = { type: "SET_ERROR", payload: "Test error" };
			const state = digiKhataReducer(initialState, action);
			expect(state.error).toBe("Test error");
		});
	});

	describe("RESET_ERROR", () => {
		it("clears the error", () => {
			const existingState: DigiKhataState = {
				...initialState,
				error: "Some error",
			};
			const action: Action = { type: "RESET_ERROR" };
			const state = digiKhataReducer(existingState, action);
			expect(state.error).toBeNull();
		});
	});

	describe("initialState", () => {
		it("starts with initial step = 'initial'", () => {
			expect(initialState.step).toBe("initial");
		});

		it("starts with no wallet data", () => {
			expect(initialState.walletData).toBeNull();
		});

		it("starts with hasFetchedWallet = false", () => {
			expect(initialState.hasFetchedWallet).toBe(false);
		});
	});
});
