import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Status } from "page-components/products/bbps/Status";
import { BbpsContext } from "page-components/products/bbps/context/BbpsContext";
import {
	BbpsState,
	PaymentStatusType,
} from "page-components/products/bbps/context/types";

// Mock the navigation hook
jest.mock("page-components/products/bbps/hooks/useBbpsNavigation", () => ({
	useBbpsNavigation: () => ({
		goSearch: jest.fn(),
		goPayment: jest.fn(),
		goPreview: jest.fn(),
		goStatus: jest.fn(),
		backToGrid: jest.fn(),
		goPreviousStep: jest.fn(),
	}),
}));

describe("BBPS Status Component", () => {
	// Test data for different payment statuses
	const createMockState = (status: PaymentStatusType): BbpsState => ({
		currentStep: "status",
		selectedProduct: {
			id: "electricity",
			label: "Electricity",
			desc: "Electricity Bill Payment",
			icon: "electricity",
			url: "/electricity",
			searchFields: [],
		},
		billFetchResult: {
			selectionMode: "single",
			bills: [
				{
					billid: "bill-001",
					label: "CC-001-2024 - 15 Jan 2024",
					amount: 25000,
					amountRules: {
						min: 500,
						max: 25000,
						multiple: 100,
					},
				},
			],
		},
		selectedBills: [
			{
				billid: "bill-001",
				label: "CC-001-2024 - 15 Jan 2024",
				amount: 25000,
				amountRules: {
					min: 500,
					max: 25000,
					multiple: 100,
				},
			},
		],
		totalAmount: 25000,
		isLoading: false,
		error: null,
		searchFormData: {},
		useMockData: true,
		mockResponseType: status,
		paymentStatus: {
			status,
			message:
				status === "success"
					? "Payment processed successfully"
					: status === "failure"
						? "Payment failed due to insufficient funds"
						: "Payment is being processed",
			transactionId: "TXN123456789",
			amount: 25000,
			timestamp: "2024-01-15T14:30:45",
			billIds: ["CC-001-2024"],
		},
	});

	const mockDispatch = jest.fn();

	// Helper function to render the component with context
	const renderWithContext = (state: BbpsState) => {
		return render(
			<BbpsContext.Provider value={{ state, dispatch: mockDispatch }}>
				<Status />
			</BbpsContext.Provider>
		);
	};

	it("renders the success status correctly", () => {
		renderWithContext(createMockState("success"));

		expect(screen.getByText("Payment Successful")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Your bill payment has been processed successfully."
			)
		).toBeInTheDocument();
		expect(screen.getByText("TXN123456789")).toBeInTheDocument();
		// Check for amount in transaction details (use getAllByText to handle multiple instances)
		const amountElements = screen.getAllByText(/₹25,000.00/);
		expect(amountElements.length).toBeGreaterThan(0);
	});

	it("renders the failure status correctly", () => {
		renderWithContext(createMockState("failure"));

		expect(screen.getByText("Payment Failed")).toBeInTheDocument();
		expect(
			screen.getByText(
				"We couldn't process your payment. Please try again."
			)
		).toBeInTheDocument();
	});

	it("renders the pending status correctly", () => {
		renderWithContext(createMockState("pending"));

		expect(screen.getByText("Payment Pending")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Your payment is being processed. Please check back later."
			)
		).toBeInTheDocument();
	});

	it("renders empty state when no payment status is available", () => {
		const emptyState: BbpsState = {
			currentStep: "status",
			selectedProduct: {
				id: "electricity",
				label: "Electricity",
				desc: "Electricity Bill Payment",
				icon: "electricity",
				url: "/electricity",
				searchFields: [],
			},
			billFetchResult: null,
			selectedBills: [],
			totalAmount: 0,
			isLoading: false,
			error: null,
			searchFormData: {},
			useMockData: true,
			mockResponseType: "success",
			paymentStatus: null,
		};

		renderWithContext(emptyState);

		expect(
			screen.getByText("No payment information available")
		).toBeInTheDocument();
	});

	it("displays bill details when bills are selected", () => {
		renderWithContext(createMockState("success"));

		// Check if bill details section is present
		expect(screen.getByText("Bill Details")).toBeInTheDocument();
		expect(
			screen.getByText("CC-001-2024 - 15 Jan 2024")
		).toBeInTheDocument();
		expect(screen.getByText("Bill ID: bill-001")).toBeInTheDocument();
	});

	it("shows download and share buttons for successful payments", () => {
		renderWithContext(createMockState("success"));

		expect(screen.getByText("Download Receipt")).toBeInTheDocument();
		expect(screen.getByText("Share Receipt")).toBeInTheDocument();
	});

	it("shows appropriate action button text based on payment status", () => {
		// Test failure status shows "Try Again"
		renderWithContext(createMockState("failure"));
		expect(screen.getByText("Try Again")).toBeInTheDocument();

		// Test success status shows "Make Another Payment"
		renderWithContext(createMockState("success"));
		expect(screen.getByText("Make Another Payment")).toBeInTheDocument();
	});
});
