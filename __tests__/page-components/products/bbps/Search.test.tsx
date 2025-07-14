import "@testing-library/jest-dom";
import { fireEvent, waitFor } from "@testing-library/react";
import { Search } from "page-components/products/bbps/Search";
import { BbpsContext } from "page-components/products/bbps/context/BbpsContext";
import { initialState } from "page-components/products/bbps/context/types";
import {
	mockBillFetchResponse,
	transformBillFetchResponse,
} from "page-components/products/bbps/utils";
import { pageRender } from "test-utils";

// Mock the hooks
jest.mock("page-components/products/bbps/hooks/useBbpsNavigation", () => ({
	useBbpsNavigation: () => ({
		goPreview: jest.fn(),
		goPayment: jest.fn(),
		goSearch: jest.fn(),
		goStatus: jest.fn(),
		backToGrid: jest.fn(),
		goPreviousStep: jest.fn(),
	}),
}));

jest.mock("page-components/products/bbps/hooks/useBbpsApi", () => ({
	useBbpsApi: () => ({
		fetchBills: jest.fn().mockResolvedValue({
			data: mockBillFetchResponse,
			error: null,
		}),
		processBillFetchResponse: jest
			.fn()
			.mockImplementation((response) =>
				transformBillFetchResponse(response)
			),
		isLoadingBills: false,
	}),
}));

// Mock router
jest.mock("next/router", () => ({
	...jest.requireActual("next/router"),
	back: jest.fn(),
}));

describe("BBPS Search Component", () => {
	const mockProduct = {
		id: "electricity",
		label: "Electricity Bill",
		desc: "Pay your electricity bills",
		icon: "electricity",
		url: "/products/bbps/electricity",
		useMockData: true,
		searchFields: [
			{
				name: "customer_id",
				label: "Customer ID",
				parameter_type_id: 1,
				required: true,
			},
		],
		defaultSearchValues: {
			customer_id: "LOAN041101",
		},
	};

	const mockDispatch = jest.fn();

	const renderComponent = () => {
		return pageRender(
			<BbpsContext.Provider
				value={{
					state: { ...initialState, currentStep: "search" },
					dispatch: mockDispatch,
				}}
			>
				<Search product={mockProduct} />
			</BbpsContext.Provider>
		);
	};

	it("renders the search form with default values", () => {
		const { getByLabelText } = renderComponent();
		const customerIdInput = getByLabelText(/Customer ID/i);
		expect(customerIdInput).toHaveValue("LOAN041101");
	});

	it("submits the form and processes the mock data", async () => {
		const { getByText } = renderComponent();
		const submitButton = getByText("Proceed");

		// Submit the form
		fireEvent.click(submitButton);

		// Wait for the mock API call to resolve
		await waitFor(() => {
			// Verify dispatch was called with the correct actions
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_SEARCH_PAYLOAD",
				payload: { customer_id: "LOAN041101" },
			});

			// Verify loading state was set
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_LOADING",
				value: true,
			});

			// Verify validation response was set with transformed data
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_VALIDATION_RESPONSE",
				payload: expect.objectContaining({
					selectionMode: "multiOptional",
					bills: expect.arrayContaining([
						expect.objectContaining({
							billid: expect.any(String),
							amount: expect.any(Number),
						}),
					]),
				}),
			});

			// Verify loading state was unset
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_LOADING",
				value: false,
			});
		});
	});
});
