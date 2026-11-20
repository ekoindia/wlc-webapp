import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Withdrawal } from "page-components/products/upi-cash-withdrawal/Withdrawal";

const hookState = {
	amountInput: "",
	setAmount: jest.fn(),
	amountValidation: { valid: false, amount: null, error: "" },
	qr: null as any,
	secondsLeft: 0,
	isExpired: false,
	message: null as string | null,
	isLocating: false,
	locationReady: true,
	inMaintenanceWindow: false,
	isInitiating: false,
	canGenerate: true,
	generate: jest.fn(),
	reset: jest.fn(),
};

jest.mock("page-components/products/upi-cash-withdrawal/hooks", () => ({
	useUpiCashWithdrawal: () => hookState,
}));
// The status/cash-gate panel (T-4) is covered by its own tests; stub it here so this
// suite stays focused on the T-3 amount/QR UI.
jest.mock(
	"page-components/products/upi-cash-withdrawal/WithdrawalStatus",
	() => ({
		WithdrawalStatus: () => <div data-testid="upi-cash-status" />,
	})
);
// Keep custom components light so the test focuses on the withdrawal UI.
jest.mock("components", () => ({
	PageTitle: ({ title }: { title: string }) => <h1>{title}</h1>,
	Button: ({ children, disabled, ...rest }: any) => (
		<button disabled={disabled} {...rest}>
			{children}
		</button>
	),
	Input: ({ label, errorMsg }: { label: string; errorMsg?: string }) => (
		<label>
			{label}
			{errorMsg ? <span>{errorMsg}</span> : null}
		</label>
	),
}));

const reset = () =>
	Object.assign(hookState, {
		qr: null,
		secondsLeft: 0,
		isExpired: false,
		message: null,
		inMaintenanceWindow: false,
		canGenerate: true,
	});

describe("Withdrawal UI", () => {
	beforeEach(reset);

	// AC-3.3 — on success render the QR + visible countdown + own-phone/UPI-PIN copy.
	it("renders the base64 QR, countdown and own-phone/UPI-PIN instructions (AC-3.3)", () => {
		hookState.qr = {
			tid: "T1",
			qrString: "QRBASE64",
			amount: 500,
			expirySeconds: 60,
			schedule: { startIn: 5, gap: 3, attempts: 10 },
		};
		hookState.secondsLeft = 42;

		render(<Withdrawal />);

		const img = screen.getByTestId("upi-cash-qr") as HTMLImageElement;
		expect(img.src).toContain("data:image/png;base64,QRBASE64");
		expect(screen.getByTestId("upi-cash-countdown")).toHaveTextContent(
			"42s"
		);
		expect(
			screen.getByText(/scan this QR from their own phone/i)
		).toBeInTheDocument();
		expect(screen.getByText(/their own UPI PIN/i)).toBeInTheDocument();
	});

	it("shows an expired state instead of the countdown once it lapses", () => {
		hookState.qr = {
			tid: "T1",
			qrString: "QRBASE64",
			amount: 500,
			expirySeconds: 60,
			schedule: { startIn: 5, gap: 3, attempts: 10 },
		};
		hookState.secondsLeft = 0;
		hookState.isExpired = true;

		render(<Withdrawal />);

		expect(screen.getByTestId("upi-cash-expired")).toBeInTheDocument();
		expect(
			screen.queryByTestId("upi-cash-countdown")
		).not.toBeInTheDocument();
	});

	// AC-3.5 — daily maintenance window → informative message, Generate disabled.
	it("shows the maintenance-window message and disables Generate (AC-3.5)", () => {
		hookState.inMaintenanceWindow = true;
		hookState.canGenerate = false;

		render(<Withdrawal />);

		expect(screen.getByTestId("upi-cash-message")).toHaveTextContent(
			/daily settlement/i
		);
		expect(screen.getByTestId("upi-cash-generate")).toBeDisabled();
	});
});
