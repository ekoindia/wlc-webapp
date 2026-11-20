import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react";
import { UPI_CASH_MERCHANT_ROLE } from "page-components/products/upi-cash-withdrawal/constants";
import { useUpiCashWithdrawalStatus } from "page-components/products/upi-cash-withdrawal/hooks/useUpiCashWithdrawalStatus";

const mockUseUser = jest.fn();
const mockUseFeatureFlag = jest.fn();

jest.mock("contexts", () => ({
	useUser: () => mockUseUser(),
}));
jest.mock("hooks/useFeatureFlag", () => ({
	__esModule: true,
	default: () => mockUseFeatureFlag(),
}));

describe("useUpiCashWithdrawalStatus", () => {
	beforeEach(() => {
		mockUseFeatureFlag.mockReturnValue([true, jest.fn()]);
	});
	afterEach(() => jest.clearAllMocks());

	it("reports not-registered when the merchant role is a pending onboarding step", () => {
		mockUseUser.mockReturnValue({
			loading: false,
			userData: {
				details: {
					onboarding_steps: [
						{ role: UPI_CASH_MERCHANT_ROLE, label: "KYC" },
					],
				},
			},
		});

		const { result } = renderHook(() => useUpiCashWithdrawalStatus());

		expect(result.current.isRegistered).toBe(false);
		expect(result.current.isEnabled).toBe(true);
		expect(result.current.isLoading).toBe(false);
	});

	it("reports registered when no merchant onboarding step is pending", () => {
		mockUseUser.mockReturnValue({
			loading: false,
			userData: { details: { onboarding_steps: [{ role: 99999 }] } },
		});

		const { result } = renderHook(() => useUpiCashWithdrawalStatus());

		expect(result.current.isRegistered).toBe(true);
	});

	it("treats a missing onboarding_steps list as registered", () => {
		mockUseUser.mockReturnValue({ loading: false, userData: {} });

		const { result } = renderHook(() => useUpiCashWithdrawalStatus());

		expect(result.current.isRegistered).toBe(true);
	});

	// AC-5.1 — enablement comes from the feature flag (on top of the backend menu).
	it("reflects the feature flag in isEnabled", () => {
		mockUseFeatureFlag.mockReturnValue([false, jest.fn()]);
		mockUseUser.mockReturnValue({ loading: false, userData: {} });

		const { result } = renderHook(() => useUpiCashWithdrawalStatus());

		expect(result.current.isEnabled).toBe(false);
	});

	it("passes through the profile loading flag", () => {
		mockUseUser.mockReturnValue({ loading: true, userData: {} });

		const { result } = renderHook(() => useUpiCashWithdrawalStatus());

		expect(result.current.isLoading).toBe(true);
	});
});
