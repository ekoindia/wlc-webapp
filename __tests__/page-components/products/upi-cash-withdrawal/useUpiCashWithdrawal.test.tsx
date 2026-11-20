import { act, renderHook } from "@testing-library/react";

// Geolocation + API are mocked; the maintenance-window check is forced OFF so the
// suite is deterministic regardless of wall-clock time.
const geo = {
	latitude: 28.61 as number | null,
	longitude: 77.2 as number | null,
	isLoading: false,
	error: null as string | null,
	requestLocation: jest.fn(),
};
jest.mock("hooks/useGeolocation", () => ({
	__esModule: true,
	default: () => geo,
}));

const initiateCall = jest.fn();
jest.mock("hooks/useApiFetch", () => ({
	__esModule: true,
	default: () => [initiateCall, false],
}));

jest.mock(
	"page-components/products/upi-cash-withdrawal/utils/withdrawalUtils",
	() => {
		const actual = jest.requireActual(
			"page-components/products/upi-cash-withdrawal/utils/withdrawalUtils"
		);
		return { ...actual, isWithdrawalMaintenanceWindow: () => false };
	}
);

import { useUpiCashWithdrawal } from "page-components/products/upi-cash-withdrawal/hooks/useUpiCashWithdrawal";

const OK_RESPONSE = {
	data: {
		response_status_id: 0,
		data: {
			tid: "TID-123",
			qr_string: "QRBASE64PNG",
			qr_expiry_in: 60,
			status_check_start_in: 5,
			status_check_gap: 3,
			status_check_attempts: 10,
			commission: 2,
			tds: 0,
		},
	},
};

describe("useUpiCashWithdrawal", () => {
	beforeEach(() => {
		geo.latitude = 28.61;
		geo.longitude = 77.2;
		geo.error = null;
		initiateCall.mockReset().mockResolvedValue(OK_RESPONSE);
	});

	// AC-3.1 — Generate is gated on a valid amount.
	it("only allows generate for a valid in-range multiple-of-100 amount (AC-3.1)", () => {
		const { result } = renderHook(() => useUpiCashWithdrawal());
		act(() => result.current.setAmount("150"));
		expect(result.current.canGenerate).toBe(false);
		act(() => result.current.setAmount("500"));
		expect(result.current.canGenerate).toBe(true);
	});

	// AC-3.2 — the request carries the device's real location.
	it("sends interaction 1108 with the real location (AC-3.2)", async () => {
		const { result } = renderHook(() => useUpiCashWithdrawal());
		act(() => result.current.setAmount("500"));
		await act(async () => {
			await result.current.generate();
		});
		expect(initiateCall).toHaveBeenCalledWith({
			body: {
				interaction_type_id: 1108,
				amount: 500,
				latitude: 28.61,
				longitude: 77.2,
			},
		});
	});

	// AC-3.2 — never submit without a real fix.
	it("blocks generate and surfaces a message when location is missing (AC-3.2)", async () => {
		geo.latitude = null;
		geo.longitude = null;
		const { result } = renderHook(() => useUpiCashWithdrawal());
		act(() => result.current.setAmount("500"));
		expect(result.current.canGenerate).toBe(false);
		await act(async () => {
			await result.current.generate();
		});
		expect(initiateCall).not.toHaveBeenCalled();
		expect(result.current.message).toBeTruthy();
	});

	it("renders a QR with the poll schedule and countdown on success", async () => {
		const { result } = renderHook(() => useUpiCashWithdrawal());
		act(() => result.current.setAmount("500"));
		await act(async () => {
			await result.current.generate();
		});
		expect(result.current.qr).toMatchObject({
			tid: "TID-123",
			qrString: "QRBASE64PNG",
			amount: 500,
			expirySeconds: 60,
			schedule: { startIn: 5, gap: 3, attempts: 10 },
		});
		expect(result.current.secondsLeft).toBe(60);
	});

	// AC-3.4 — a new amount means a new QR: changing the amount clears the old QR.
	it("clears the QR when the amount changes (AC-3.4)", async () => {
		const { result } = renderHook(() => useUpiCashWithdrawal());
		act(() => result.current.setAmount("500"));
		await act(async () => {
			await result.current.generate();
		});
		expect(result.current.qr).not.toBeNull();

		act(() => result.current.setAmount("1000"));
		expect(result.current.qr).toBeNull();
		expect(result.current.secondsLeft).toBe(0);
	});

	// Decide fail on response_status_id, not message text.
	it("shows an informative message when Initiate reports fail (response_status_id=1)", async () => {
		initiateCall.mockResolvedValue({
			data: {
				response_status_id: 1,
				message: "Daily cash-out limit reached",
			},
		});
		const { result } = renderHook(() => useUpiCashWithdrawal());
		act(() => result.current.setAmount("500"));
		await act(async () => {
			await result.current.generate();
		});
		expect(result.current.qr).toBeNull();
		expect(result.current.message).toBe("Daily cash-out limit reached");
	});
});
