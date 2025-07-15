import "@testing-library/jest-dom";
import { Payment } from "page-components/products/bbps/Payment";
import { BbpsContext } from "page-components/products/bbps/context/BbpsContext";
import { initialState } from "page-components/products/bbps/context/types";
import { act } from "react-dom/test-utils";
import { fireEvent, pageRender, waitFor } from "test-utils";

// Mock the hooks
jest.mock("page-components/products/bbps/hooks/useBbpsNavigation", () => ({
	useBbpsNavigation: () => ({
		goPreview: jest.fn(),
		goStatus: jest.fn(),
		goPreviousStep: jest.fn(),
	}),
}));

jest.mock("page-components/products/bbps/hooks/useBbpsApi", () => ({
	useBbpsApi: () => ({
		makePayment: jest.fn().mockResolvedValue({
			data: { status: 0, message: "Success" },
			error: null,
		}),
	}),
}));

// Mock Chakra UI toast
jest.mock("@chakra-ui/react", () => ({
	...jest.requireActual("@chakra-ui/react"),
	useToast: () => jest.fn(),
}));

// Mock InputPintwin component to allow controlled PIN simulation
jest.mock("tf-components/InputPintwin", () => {
	const MockInputPintwin = ({
		onChange,
		onValidationChange,
		label,
		...props
	}) => {
		return (
			<div data-testid="pintwin-component">
				<label>{label}</label>
				<input
					data-testid="pin-input"
					type="password"
					maxLength={4}
					onChange={(e) => {
						const value = e.target.value;
						const maskedValue = value.replace(/./g, "*");
						// Simulate encoded PIN with key ID (as per component logic)
						const encodedValue =
							value.length === 4 ? `encoded_${value}|87` : value;
						onChange?.(encodedValue, maskedValue);
						// Simulate validation change
						onValidationChange?.(value.length === 4);
					}}
					{...props}
				/>
			</div>
		);
	};

	return {
		__esModule: true,
		default: MockInputPintwin,
		InputPintwin: MockInputPintwin,
	};
});

describe("BBPS Payment Component", () => {
	const mockState = {
		...initialState,
		currentStep: "payment",
		selectedProduct: { id: "test" },
		selectedBills: [
			{ billid: "bill1", label: "Bill 1", amount: 1000 },
			{ billid: "bill2", label: "Bill 2", amount: 2000 },
		],
		totalAmount: 3000,
		useMockData: true,
		mockResponseType: "success",
		searchFormData: {},
	};

	const mockDispatch = jest.fn();

	const renderComponent = (overrides = {}) => {
		return pageRender(
			<BbpsContext.Provider
				value={{
					state: { ...mockState, ...overrides },
					dispatch: mockDispatch,
				}}
			>
				<Payment />
			</BbpsContext.Provider>
		);
	};

	it("renders payment summary with selected bills", () => {
		const { getByText } = renderComponent();

		expect(getByText("Payment Summary")).toBeInTheDocument();
		expect(getByText("Bill 1")).toBeInTheDocument();
		expect(getByText("₹1,000")).toBeInTheDocument();
		expect(getByText("Bill 2")).toBeInTheDocument();
		expect(getByText("₹2,000")).toBeInTheDocument();
		expect(getByText("Total Amount")).toBeInTheDocument();
		expect(getByText("₹3,000")).toBeInTheDocument();
	});

	it("renders mock response selection in mock mode", () => {
		const { getByRole } = renderComponent();

		expect(getByRole("radio", { name: "success" })).toBeInTheDocument();
		expect(getByRole("radio", { name: "failure" })).toBeInTheDocument();
		expect(getByRole("radio", { name: "pending" })).toBeInTheDocument();
	});

	it("handles payment submission after PIN entry", async () => {
		const { getByText, getByTestId } = renderComponent();

		// First, verify the Pay button is initially disabled
		const payButton = getByText("Pay");
		expect(payButton).toBeDisabled();

		// Simulate entering a 4-digit PIN using our mocked InputPintwin
		const pinInput = getByTestId("pin-input");
		fireEvent.change(pinInput, { target: { value: "1234" } });

		// Wait for the component to update and enable the Pay button
		await waitFor(() => {
			const updatedPayButton = getByText("Pay");
			expect(updatedPayButton).not.toBeDisabled();
		});

		// Now click the enabled Pay button
		await act(async () => {
			fireEvent.click(payButton);
		});

		// Verify payment status was set and navigation occurred
		await waitFor(() => {
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_PAYMENT_STATUS",
				payload: expect.objectContaining({
					status: "success",
					amount: 3000,
					billIds: ["bill1", "bill2"],
				}),
			});
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_CURRENT_STEP",
				step: "status",
			});
		});
	});

	it("keeps Pay button disabled with insufficient PIN length", async () => {
		const { getByText, getByTestId } = renderComponent();

		// Verify Pay button is initially disabled
		const payButton = getByText("Pay");
		expect(payButton).toBeDisabled();

		// Simulate entering only 2 digits (insufficient)
		const pinInput = getByTestId("pin-input");
		fireEvent.change(pinInput, { target: { value: "12" } });

		// Pay button should remain disabled
		expect(payButton).toBeDisabled();
	});

	it("validates PIN input correctly", async () => {
		const { getByText, getByTestId } = renderComponent();

		const payButton = getByText("Pay");
		const pinInput = getByTestId("pin-input");

		// Initially disabled
		expect(payButton).toBeDisabled();

		// Still disabled with 3 digits
		fireEvent.change(pinInput, { target: { value: "123" } });
		expect(payButton).toBeDisabled();

		// Enabled with 4 digits
		fireEvent.change(pinInput, { target: { value: "1234" } });
		await waitFor(() => {
			expect(payButton).not.toBeDisabled();
		});

		// Disabled again if cleared
		fireEvent.change(pinInput, { target: { value: "" } });
		await waitFor(() => {
			expect(payButton).toBeDisabled();
		});
	});

	it("redirects if no bills selected", () => {
		const { getByText } = renderComponent({ selectedBills: [] });

		expect(getByText("No bills selected")).toBeInTheDocument();
	});
});
