import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Preview } from "page-components/products/bbps/Preview";
import { BbpsContext } from "page-components/products/bbps/context/BbpsContext";
import { BbpsState } from "page-components/products/bbps/context/types";
import { useBbpsNavigation } from "page-components/products/bbps/hooks/useBbpsNavigation";

// Mock the navigation hook
jest.mock("page-components/products/bbps/hooks/useBbpsNavigation", () => ({
	useBbpsNavigation: jest.fn(),
}));

describe("BBPS Preview Component", () => {
	// Mock navigation functions
	const mockNavigation = {
		goSearch: jest.fn(),
		goPreview: jest.fn(),
		goPayment: jest.fn(),
		goStatus: jest.fn(),
		backToGrid: jest.fn(),
		goPreviousStep: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useBbpsNavigation as jest.Mock).mockReturnValue(mockNavigation);
	});

	// Test for single selection mode
	test("renders single selection mode correctly", () => {
		// Mock state for single selection
		const mockState: Partial<BbpsState> = {
			currentStep: "preview",
			searchFormData: {},
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
						billid: "bill-1",
						label: "EB-123 - 15 Jan 2024",
						amount: 1500,
						amountRules: {
							min: 500,
							max: 5000,
							multiple: 100,
						},
					},
				],
			},
			selectedBills: [],
			totalAmount: 0,
			isLoading: false,
			error: null,
			paymentStatus: null,
			useMockData: true,
			mockResponseType: "success",
		};

		const mockDispatch = jest.fn();

		render(
			<BbpsContext.Provider
				value={{
					state: mockState as BbpsState,
					dispatch: mockDispatch,
				}}
			>
				<Preview />
			</BbpsContext.Provider>
		);

		// Check if the title is correct
		expect(screen.getByText("Select a bill to pay")).toBeInTheDocument();

		// Check if the bill is displayed (just the bill number part)
		expect(screen.getByText("EB-123")).toBeInTheDocument();

		// Check if amount rules are not displayed initially (until selected)
		expect(screen.queryByText(/Amount range:/)).not.toBeInTheDocument();

		// Select the bill
		const radioButton = screen.getByRole("radio");
		fireEvent.click(radioButton);

		// Verify dispatch was called to select the bill
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "TOGGLE_BILL_SELECTION",
			billid: "bill-1",
		});
	});

	// Test for multi-optional selection mode
	test("renders multi-optional selection mode correctly", () => {
		// Mock state for multi-optional selection
		const mockState: Partial<BbpsState> = {
			currentStep: "preview",
			searchFormData: {},
			selectedProduct: {
				id: "credit-card",
				label: "Credit Card",
				desc: "Credit Card Bill Payment",
				icon: "credit-card",
				url: "/credit-card",
				searchFields: [],
			},
			billFetchResult: {
				selectionMode: "multiOptional",
				bills: [
					{
						billid: "bill-1",
						label: "CC-123 - 15 Jan 2024",
						amount: 5000,
						amountRules: {
							min: 500,
							max: 5000,
						},
					},
					{
						billid: "bill-2",
						label: "CC-456 - 20 Jan 2024",
						amount: 2500,
						amountRules: {
							min: 200,
							max: 2500,
							multiple: 50,
						},
					},
				],
			},
			selectedBills: [],
			totalAmount: 0,
			isLoading: false,
			error: null,
			paymentStatus: null,
			useMockData: true,
			mockResponseType: "success",
		};

		const mockDispatch = jest.fn();

		render(
			<BbpsContext.Provider
				value={{
					state: mockState as BbpsState,
					dispatch: mockDispatch,
				}}
			>
				<Preview />
			</BbpsContext.Provider>
		);

		// Check if the title is correct
		expect(
			screen.getByText("Select one or more bills to pay")
		).toBeInTheDocument();

		// Check if both bills are displayed
		expect(screen.getByText("CC-123")).toBeInTheDocument();
		expect(screen.getByText("CC-456")).toBeInTheDocument();

		// Check if checkboxes are present
		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes.length).toBe(2);

		// Select the first bill
		fireEvent.click(checkboxes[0]);

		// Verify dispatch was called to select the bill
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "TOGGLE_BILL_SELECTION",
			billid: "bill-1",
		});
	});

	// Test for multi-mandatory selection mode
	test("renders multi-mandatory selection mode correctly", () => {
		// Mock state for multi-mandatory selection
		const mockState: Partial<BbpsState> = {
			currentStep: "preview",
			searchFormData: {},
			selectedProduct: {
				id: "loan",
				label: "Loan",
				desc: "Loan Payment",
				icon: "loan",
				url: "/loan",
				searchFields: [],
			},
			billFetchResult: {
				selectionMode: "multiMandatory",
				bills: [
					{
						billid: "bill-1",
						label: "LOAN-123 - 15 Jan 2024",
						amount: 10000,
						amountRules: {
							min: 10000,
							max: 10000,
						},
					},
					{
						billid: "bill-2",
						label: "LOAN-456 - 20 Jan 2024",
						amount: 5000,
						amountRules: {
							min: 5000,
							max: 5000,
						},
					},
				],
			},
			selectedBills: [],
			totalAmount: 0,
			isLoading: false,
			error: null,
			paymentStatus: null,
			useMockData: true,
			mockResponseType: "success",
		};

		const mockDispatch = jest.fn();

		render(
			<BbpsContext.Provider
				value={{
					state: mockState as BbpsState,
					dispatch: mockDispatch,
				}}
			>
				<Preview />
			</BbpsContext.Provider>
		);

		// Check if the title is correct
		expect(screen.getByText("All bills must be paid")).toBeInTheDocument();

		// Check if both bills are displayed
		expect(screen.getByText("LOAN-123")).toBeInTheDocument();
		expect(screen.getByText("LOAN-456")).toBeInTheDocument();

		// Check if checkboxes are present and disabled
		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes.length).toBe(2);
		checkboxes.forEach((checkbox) => {
			expect(checkbox).toBeDisabled();
		});
	});

	// Test for no bills found
	test("renders no bills found message when no bills are available", () => {
		// Mock state with no bills
		const mockState: Partial<BbpsState> = {
			currentStep: "preview",
			searchFormData: {},
			selectedProduct: null,
			billFetchResult: null,
			selectedBills: [],
			totalAmount: 0,
			isLoading: false,
			error: null,
			paymentStatus: null,
			useMockData: true,
			mockResponseType: "success",
		};

		const mockDispatch = jest.fn();

		render(
			<BbpsContext.Provider
				value={{
					state: mockState as BbpsState,
					dispatch: mockDispatch,
				}}
			>
				<Preview />
			</BbpsContext.Provider>
		);

		// Check if no bills message is displayed
		expect(screen.getByText("No bills found")).toBeInTheDocument();

		// Check if back button is present
		const backButton = screen.getByText("Back to Search");
		expect(backButton).toBeInTheDocument();

		// Click back button
		fireEvent.click(backButton);

		// Verify navigation was called
		expect(mockNavigation.goSearch).toHaveBeenCalled();
	});

	// Test for amount validation
	test("validates amount input correctly", () => {
		// Mock state with selected bill
		const mockState: Partial<BbpsState> = {
			currentStep: "preview",
			searchFormData: {},
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
						billid: "bill-1",
						label: "EB-123 - 15 Jan 2024",
						amount: 1500,
						amountRules: {
							min: 500,
							max: 5000,
							multiple: 100,
						},
					},
				],
			},
			selectedBills: [
				{
					billid: "bill-1",
					label: "EB-123 - 15 Jan 2024",
					amount: 1500,
					amountRules: {
						min: 500,
						max: 5000,
						multiple: 100,
					},
				},
			],
			totalAmount: 1500,
			isLoading: false,
			error: null,
			paymentStatus: null,
			useMockData: true,
			mockResponseType: "success",
		};

		const mockDispatch = jest.fn();

		render(
			<BbpsContext.Provider
				value={{
					state: mockState as BbpsState,
					dispatch: mockDispatch,
				}}
			>
				<Preview />
			</BbpsContext.Provider>
		);

		// Check if amount rules are displayed for selected bill
		expect(screen.getByText(/Amount range:/)).toBeInTheDocument();
		expect(
			screen.getByText(/Amount must be a multiple of/)
		).toBeInTheDocument();

		// Check if payment amount input is present
		expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();

		// Check if Make Payment button is enabled since bill is selected
		const paymentButton = screen.getByText("Make Payment");
		expect(paymentButton).toBeInTheDocument();
		expect(paymentButton).not.toBeDisabled();
	});
});
