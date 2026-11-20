import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { WithdrawalStatus } from "page-components/products/upi-cash-withdrawal/WithdrawalStatus";
import type { UpiCashStatusPollResult } from "page-components/products/upi-cash-withdrawal/hooks/useUpiCashStatusPoll";

const pollResult = jest.fn<UpiCashStatusPollResult, []>();
jest.mock("page-components/products/upi-cash-withdrawal/hooks", () => ({
	useUpiCashStatusPoll: () => pollResult(),
}));
jest.mock("components", () => ({
	Button: ({ children, disabled, colorScheme, variant, ...rest }: any) => (
		<button disabled={disabled} {...rest}>
			{children}
		</button>
	),
}));

const renderWith = (result: Partial<UpiCashStatusPollResult>) => {
	pollResult.mockReturnValue({
		status: "pending",
		bankRefNum: null,
		statusDesc: null,
		attemptsUsed: 1,
		isPaid: false,
		...result,
	});
	return render(
		<WithdrawalStatus
			tid="T1"
			schedule={{ startIn: 1, gap: 1, attempts: 3 }}
			amount={500}
			onReset={jest.fn()}
		/>
	);
};

describe("WithdrawalStatus — outcome + hard cash-gate", () => {
	afterEach(() => jest.clearAllMocks());

	// AC-4.1 — pending → "do not hand over cash", CTA disabled.
	it("pending: shows do-not-hand-over and disables the cash CTA (AC-4.1)", () => {
		renderWith({ status: "pending", isPaid: false });
		expect(screen.getByTestId("upi-cash-status-pending")).toHaveTextContent(
			/do not hand over cash/i
		);
		expect(screen.getByTestId("upi-cash-handover")).toBeDisabled();
	});

	// AC-4.2 — paid → enabled CTA + bank ref.
	it("paid: enables the cash CTA and shows the bank ref (AC-4.2)", () => {
		renderWith({ status: "paid", isPaid: true, bankRefNum: "BR-77" });
		expect(screen.getByTestId("upi-cash-status-paid")).toHaveTextContent(
			/hand over ₹500/i
		);
		expect(screen.getByText(/BR-77/)).toBeInTheDocument();
		expect(screen.getByTestId("upi-cash-handover")).toBeEnabled();
	});

	// AC-4.3 — failed → message, disabled CTA, offer new txn.
	it("failed: disables the CTA and offers a new withdrawal (AC-4.3)", () => {
		renderWith({ status: "failed", isPaid: false });
		expect(screen.getByTestId("upi-cash-status-failed")).toHaveTextContent(
			/do not hand over cash/i
		);
		expect(screen.getByTestId("upi-cash-handover")).toBeDisabled();
		expect(
			screen.getByTestId("upi-cash-new-after-fail")
		).toBeInTheDocument();
	});

	// AC-4.4 — unknown/timeout → disabled CTA, do not hand over.
	it("unknown: disables the CTA and warns not to hand over (AC-4.4)", () => {
		renderWith({ status: "unknown", isPaid: false });
		expect(screen.getByTestId("upi-cash-status-unknown")).toHaveTextContent(
			/do not hand over cash/i
		);
		expect(screen.getByTestId("upi-cash-handover")).toBeDisabled();
	});

	// AC-4.5 — the hard gate: CTA enabled ONLY on paid, no other state.
	it("hard gate: cash CTA is enabled only for paid (AC-4.5)", () => {
		(["pending", "failed", "unknown"] as const).forEach((status) => {
			const { unmount } = renderWith({ status, isPaid: false });
			expect(screen.getByTestId("upi-cash-handover")).toBeDisabled();
			unmount();
		});
		renderWith({ status: "paid", isPaid: true });
		expect(screen.getByTestId("upi-cash-handover")).toBeEnabled();
	});
});
