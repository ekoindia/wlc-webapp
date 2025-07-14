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

	// Uncomment and modify the submission test
	it("handles payment submission", async () => {
		const { getByText } = renderComponent();

		// Simulate PIN entry - assuming InputPintwin has a way to input
		// For testing, we might need to mock InputPintwin or find a way to set the value
		// Assuming it has an input with placeholder "Enter PIN"
		// But since it's custom, perhaps fire events on the component

		// For now, assume we set the pintwinEncoded somehow
		// Actually, since it's mock, perhaps mock the onChange

		const payButton = getByText("Pay");

		// Simulate clicking pay - but may need to set PIN first

		await act(async () => {
			fireEvent.click(payButton);
		});

		await waitFor(() => {
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_PAYMENT_STATUS",
				payload: expect.objectContaining({ status: "success" }),
			});
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_CURRENT_STEP",
				step: "status",
			});
		});
	});

	it("redirects if no bills selected", () => {
		const { getByText } = renderComponent({ selectedBills: [] });

		expect(getByText("No bills selected")).toBeInTheDocument();
	});
});
