import "@testing-library/jest-dom";
import { fireEvent, waitFor } from "@testing-library/react";
import { Search } from "page-components/products/bbps/Search";
import { BbpsContext } from "page-components/products/bbps/context/BbpsContext";
import { initialState } from "page-components/products/bbps/context/types";
import { useBbpsApi } from "page-components/products/bbps/hooks/useBbpsApi";
import {
	mockBillFetchResponse,
	transformBillFetchResponse,
} from "page-components/products/bbps/utils";
import { act } from "react-dom/test-utils";
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

// Update the mock for useBbpsApi to be more flexible
jest.mock("page-components/products/bbps/hooks/useBbpsApi", () => ({
	useBbpsApi: jest.fn(),
}));

// Define a default mock for useBbpsApi
const defaultMockApi = {
	fetchBills: jest.fn().mockResolvedValue({
		data: mockBillFetchResponse,
		error: null,
	}),
	processBillFetchResponse: transformBillFetchResponse,
	fetchOperators: jest.fn().mockResolvedValue({ data: [], error: null }),
	fetchDynamicFields: jest.fn().mockResolvedValue({ data: [], error: null }),
	isLoadingBills: false,
};

// Mock router
jest.mock("next/router", () => ({
	...jest.requireActual("next/router"),
	back: jest.fn(),
}));

describe("BBPS Search Component", () => {
	beforeEach(() => {
		useBbpsApi.mockReturnValue(defaultMockApi);
	});

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

describe("BBPS Search with operators and dynamic fields", () => {
	beforeEach(() => {
		useBbpsApi.mockReturnValue(defaultMockApi);
	});

	it("fetches and renders operators when product has categoryId", async () => {
		const mockOperators = [
			{ phone_operator_code: 1, name: "Operator 1" },
			{ phone_operator_code: 2, name: "Operator 2" },
		];

		useBbpsApi.mockReturnValue({
			...defaultMockApi,
			fetchOperators: jest
				.fn()
				.mockResolvedValue({ data: mockOperators, error: null }),
		});

		const productWithCategory = {
			...mockProduct,
			categoryId: "testCategory",
			useMockData: false,
			searchFields: [], // Ensure no static fields interfere
		};

		const localDispatch = jest.fn();

		const { findByLabelText } = pageRender(
			<BbpsContext.Provider
				value={{
					state: { ...initialState, currentStep: "search" },
					dispatch: localDispatch,
				}}
			>
				<Search product={productWithCategory} />
			</BbpsContext.Provider>
		);

		expect(defaultMockApi.fetchOperators).toHaveBeenCalledWith(
			"testCategory"
		);

		const select = await findByLabelText(/Select Operator/i);
		expect(select).toBeInTheDocument();

		await waitFor(() => {
			expect(localDispatch).toHaveBeenCalledWith({
				type: "SET_OPERATORS",
				payload: mockOperators,
			});
		});
	});

	it("fetches dynamic fields when operator is selected", async () => {
		const mockOperators = [{ operator_id: 1, name: "Operator 1" }];
		const mockDynamicFields = [
			{
				param_name: "dynamicField",
				param_label: "Dynamic Field",
				param_type: "Text",
				regex: "",
				error_message: "",
			},
		];

		useBbpsApi.mockReturnValue({
			...defaultMockApi,
			fetchOperators: jest
				.fn()
				.mockResolvedValue({ data: mockOperators, error: null }),
			fetchDynamicFields: jest
				.fn()
				.mockResolvedValue({ data: mockDynamicFields, error: null }),
		});

		const product = {
			...mockProduct,
			categoryId: "test",
			useMockData: false,
		};

		const localDispatch = jest.fn();

		const { findByLabelText } = pageRender(
			<BbpsContext.Provider
				value={{
					state: {
						...initialState,
						currentStep: "search",
						operators: mockOperators,
					},
					dispatch: localDispatch,
				}}
			>
				<Search product={product} />
			</BbpsContext.Provider>
		);

		const select = await findByLabelText(/Select Operator/i);

		await act(async () => {
			fireEvent.change(select, { target: { value: "1" } });
		});

		await waitFor(() => {
			expect(localDispatch).toHaveBeenCalledWith({
				type: "SET_SELECTED_OPERATOR",
				payload: mockOperators[0],
			});
			expect(defaultMockApi.fetchDynamicFields).toHaveBeenCalledWith(1);
			expect(localDispatch).toHaveBeenCalledWith({
				type: "SET_DYNAMIC_FIELDS",
				payload: mockDynamicFields,
			});
		});

		const dynamicInput = await findByLabelText(/Dynamic Field/i);
		expect(dynamicInput).toBeInTheDocument();
	});

	it("submits form with operator and dynamic fields", async () => {
		const mockOperators = [{ operator_id: 1, name: "Operator 1" }];
		const mockDynamicFields = [
			{
				param_name: "dynamicField",
				param_label: "Dynamic Field",
				param_type: "Text",
				regex: "",
				error_message: "",
			},
		];

		useBbpsApi.mockReturnValue({
			...defaultMockApi,
			fetchOperators: jest
				.fn()
				.mockResolvedValue({ data: mockOperators, error: null }),
			fetchDynamicFields: jest
				.fn()
				.mockResolvedValue({ data: mockDynamicFields, error: null }),
		});

		const product = {
			...mockProduct,
			categoryId: "test",
			useMockData: false,
			defaultSearchValues: {},
			searchFields: [],
		};

		const localDispatch = jest.fn();

		const { findByLabelText, getByText } = pageRender(
			<BbpsContext.Provider
				value={{
					state: { ...initialState, currentStep: "search" },
					dispatch: localDispatch,
				}}
			>
				<Search product={product} />
			</BbpsContext.Provider>
		);

		const select = await findByLabelText(/Select Operator/i);
		fireEvent.change(select, { target: { value: "1" } });

		const dynamicInput = await findByLabelText(/Dynamic Field/i);
		fireEvent.change(dynamicInput, { target: { value: "testValue" } });

		const submitButton = getByText("Proceed");
		await act(async () => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(localDispatch).toHaveBeenCalledWith({
				type: "SET_SEARCH_PAYLOAD",
				payload: expect.objectContaining({
					phone_operator_code: "1",
					dynamicField: "testValue",
				}),
			});
		});
	});
});
