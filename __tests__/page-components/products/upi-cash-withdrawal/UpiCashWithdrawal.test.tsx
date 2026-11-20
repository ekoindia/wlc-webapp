import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { UpiCashWithdrawal } from "page-components/products/upi-cash-withdrawal/UpiCashWithdrawal";
import type { UpiCashStatus } from "page-components/products/upi-cash-withdrawal/types";

// Mock the enablement/registration hook so we can drive the gate's routing.
const mockStatus = jest.fn<UpiCashStatus, []>();
jest.mock("page-components/products/upi-cash-withdrawal/hooks", () => ({
	useUpiCashWithdrawalStatus: () => mockStatus(),
}));

// Stub the destination steps so the test asserts *which* one the gate routes to.
jest.mock("page-components/products/upi-cash-withdrawal/Onboarding", () => ({
	Onboarding: () => <div data-testid="onboarding-step" />,
}));
jest.mock("page-components/products/upi-cash-withdrawal/Withdrawal", () => ({
	Withdrawal: () => <div data-testid="withdrawal-step" />,
}));
jest.mock("components", () => ({
	PageTitle: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

const setStatus = (status: Partial<UpiCashStatus>): void => {
	mockStatus.mockReturnValue({
		isLoading: false,
		isEnabled: true,
		isRegistered: true,
		...status,
	});
};

describe("UpiCashWithdrawal gate", () => {
	afterEach(() => jest.clearAllMocks());

	it("shows a spinner while the profile is loading", () => {
		setStatus({ isLoading: true });
		render(<UpiCashWithdrawal />);

		expect(screen.getByTestId("upi-cash-loading")).toBeInTheDocument();
		expect(screen.queryByTestId("withdrawal-step")).not.toBeInTheDocument();
		expect(screen.queryByTestId("onboarding-step")).not.toBeInTheDocument();
	});

	// AC-5.1 — a non-enabled agent never sees or reaches the product.
	it("blocks a non-enabled agent (AC-5.1)", () => {
		setStatus({ isEnabled: false, isRegistered: true });
		render(<UpiCashWithdrawal />);

		expect(screen.getByTestId("upi-cash-not-enabled")).toBeInTheDocument();
		expect(screen.queryByTestId("withdrawal-step")).not.toBeInTheDocument();
		expect(screen.queryByTestId("onboarding-step")).not.toBeInTheDocument();
	});

	// AC-1.3 — on open, route a not-registered agent to onboarding.
	it("routes a not-registered agent to onboarding (AC-1.3)", () => {
		setStatus({ isEnabled: true, isRegistered: false });
		render(<UpiCashWithdrawal />);

		expect(screen.getByTestId("onboarding-step")).toBeInTheDocument();
		expect(screen.queryByTestId("withdrawal-step")).not.toBeInTheDocument();
	});

	// AC-1.3 — on open, route a registered agent to withdrawal (no provider step).
	it("routes a registered agent to withdrawal (AC-1.3)", () => {
		setStatus({ isEnabled: true, isRegistered: true });
		render(<UpiCashWithdrawal />);

		expect(screen.getByTestId("withdrawal-step")).toBeInTheDocument();
		expect(screen.queryByTestId("onboarding-step")).not.toBeInTheDocument();
	});

	// AC-1.2 — an enabled, registered agent (incl. an Admin in agent-view, which
	// resolves to the same status) can reach/transact.
	it("lets an enabled, registered agent reach the flow (AC-1.2)", () => {
		setStatus({ isEnabled: true, isRegistered: true });
		render(<UpiCashWithdrawal />);

		expect(screen.getByTestId("withdrawal-step")).toBeInTheDocument();
		expect(
			screen.queryByTestId("upi-cash-not-enabled")
		).not.toBeInTheDocument();
	});
});
