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
import { pageRender } from "test-utils";

// Mock Next.js router properly
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock("next/router", () => ({
	useRouter: () => ({
		push: mockPush,
		back: mockBack,
		asPath: "/products/bbps/test",
		pathname: "/products/bbps/test",
		query: {},
		events: {
			on: jest.fn(),
			off: jest.fn(),
			emit: jest.fn(),
		},
	}),
}));

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

// Mock useBbpsApi
jest.mock("page-components/products/bbps/hooks/useBbpsApi", () => ({
	useBbpsApi: jest.fn(),
}));

// Mock toast
const mockToast = jest.fn();
jest.mock("@chakra-ui/react", () => ({
	...jest.requireActual("@chakra-ui/react"),
	useToast: () => mockToast,
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

describe("BBPS Search Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(useBbpsApi as jest.Mock).mockReturnValue(defaultMockApi);
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

	const renderComponent = (stateOverrides = {}) => {
		return pageRender(
			<BbpsContext.Provider
				value={{
					state: {
						...initialState,
						currentStep: "search",
						...stateOverrides,
					},
					dispatch: mockDispatch,
				}}
			>
				<Search product={mockProduct} />
			</BbpsContext.Provider>
		);
	};

	describe("Basic Rendering", () => {
		it("renders the search form with default values", () => {
			const { getByLabelText } = renderComponent();
			const customerIdInput = getByLabelText(/Customer ID/i);
			expect(customerIdInput).toHaveValue("LOAN041101");
		});

		it("renders page title", () => {
			const { getByText } = renderComponent();
			expect(getByText("Electricity Bill")).toBeInTheDocument();
		});

		it("renders proceed button", () => {
			const { getByText } = renderComponent();
			expect(getByText("Proceed")).toBeInTheDocument();
		});
	});

	describe("Mock Data Flag", () => {
		it("sets mock data flag based on product configuration", () => {
			renderComponent();
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_MOCK_DATA_FLAG",
				useMockData: true,
			});
		});

		it("does not dispatch if mock data flag is already set correctly", () => {
			renderComponent({ useMockData: true });
			// Should not dispatch SET_MOCK_DATA_FLAG again
			expect(mockDispatch).not.toHaveBeenCalledWith({
				type: "SET_MOCK_DATA_FLAG",
				useMockData: true,
			});
		});
	});

	describe("Form Submission", () => {
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

		it("handles form submission with custom input values", async () => {
			const { getByLabelText, getByText } = renderComponent();
			const customerIdInput = getByLabelText(/Customer ID/i);
			const submitButton = getByText("Proceed");

			// Change input value
			fireEvent.change(customerIdInput, {
				target: { value: "CUSTOM123" },
			});

			// Submit the form
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(mockDispatch).toHaveBeenCalledWith({
					type: "SET_SEARCH_PAYLOAD",
					payload: { customer_id: "CUSTOM123" },
				});
			});
		});

		it("handles API errors gracefully", async () => {
			const errorMessage = "API Error occurred";
			(useBbpsApi as jest.Mock).mockReturnValue({
				...defaultMockApi,
				fetchBills: jest.fn().mockResolvedValue({
					data: null,
					error: errorMessage,
				}),
			});

			const { getByText } = renderComponent();
			const submitButton = getByText("Proceed");

			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(mockDispatch).toHaveBeenCalledWith({
					type: "SET_ERROR",
					message: errorMessage,
				});
			});
		});
	});

	describe("Dynamic Form Reset", () => {
		it("resets dynamic form state when product changes", () => {
			renderComponent();

			expect(mockDispatch).toHaveBeenCalledWith({
				type: "RESET_DYNAMIC_FORM",
			});
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_OPERATORS",
				payload: [],
			});
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_SELECTED_OPERATOR",
				payload: null,
			});
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_DYNAMIC_FIELDS",
				payload: [],
			});
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "SET_LOADING_DYNAMIC_DATA",
				value: false,
			});
		});
	});

	describe("Operator Selection", () => {
		const _productWithCategory = {
			...mockProduct,
			categoryId: "testCategory",
			useMockData: false,
			searchFields: [], // Ensure no static fields interfere
		};

		it("fetches and renders operators when product has categoryId", async () => {
			const mockOperators = [
				{ operator_id: 1, name: "Operator 1" },
				{ operator_id: 2, name: "Operator 2" },
			];

			(useBbpsApi as jest.Mock).mockReturnValue({
				...defaultMockApi,
				fetchOperators: jest
					.fn()
					.mockResolvedValue({ data: mockOperators, error: null }),
			});

			const { findByLabelText } = renderComponent();

			expect(defaultMockApi.fetchOperators).toHaveBeenCalledWith(
				"testCategory"
			);

			const select = await findByLabelText(/Select Operator/i);
			expect(select).toBeInTheDocument();

			await waitFor(() => {
				expect(mockDispatch).toHaveBeenCalledWith({
					type: "SET_OPERATORS",
					payload: mockOperators,
				});
			});
		});

		it("handles operator selection change", async () => {
			const mockOperators = [
				{ operator_id: 1, name: "Operator 1" },
				{ operator_id: 2, name: "Operator 2" },
			];

			const { getByLabelText } = renderComponent({
				operators: mockOperators,
			});

			const select = getByLabelText(/Select Operator/i);
			fireEvent.change(select, { target: { value: "1" } });

			await waitFor(() => {
				expect(mockDispatch).toHaveBeenCalledWith({
					type: "RESET_DYNAMIC_FORM",
				});
				expect(mockDispatch).toHaveBeenCalledWith({
					type: "SET_SELECTED_OPERATOR",
					payload: mockOperators[0],
				});
			});
		});

		it("fetches dynamic fields when operator is selected", async () => {
			const mockDynamicFields = [
				{
					name: "account_number",
					label: "Account Number",
					parameter_type_id: 1,
				},
			];

			(useBbpsApi as jest.Mock).mockReturnValue({
				...defaultMockApi,
				fetchDynamicFields: jest.fn().mockResolvedValue({
					data: mockDynamicFields,
					error: null,
				}),
			});

			const selectedOperator = { operator_id: 1, name: "Test Operator" };

			renderComponent({
				selectedOperator,
			});

			await waitFor(() => {
				expect(defaultMockApi.fetchDynamicFields).toHaveBeenCalledWith(
					selectedOperator.operator_id
				);
				expect(mockDispatch).toHaveBeenCalledWith({
					type: "SET_DYNAMIC_FIELDS",
					payload: mockDynamicFields,
				});
			});
		});

		it("handles operator fetch errors", async () => {
			const errorMessage = "Failed to fetch operators";
			(useBbpsApi as jest.Mock).mockReturnValue({
				...defaultMockApi,
				fetchOperators: jest
					.fn()
					.mockResolvedValue({ data: null, error: errorMessage }),
			});

			renderComponent();

			await waitFor(() => {
				expect(mockToast).toHaveBeenCalledWith({
					title: "Error",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			});
		});
	});

	describe("Loading States", () => {
		it("shows loading state when fetching bills", () => {
			(useBbpsApi as jest.Mock).mockReturnValue({
				...defaultMockApi,
				isLoadingBills: true,
			});

			const { getByText } = renderComponent();
			const submitButton = getByText("Proceed");

			expect(submitButton).toBeDisabled();
		});

		it("shows loading state when fetching dynamic data", () => {
			const { container } = renderComponent({
				isLoadingDynamicData: true,
			});

			// Should show loading indicator
			expect(container).toMatchSnapshot();
		});
	});

	describe("Form Validation", () => {
		it("validates required fields", async () => {
			const { getByLabelText, getByText } = renderComponent();
			const customerIdInput = getByLabelText(/Customer ID/i);
			const submitButton = getByText("Proceed");

			// Clear required field
			fireEvent.change(customerIdInput, { target: { value: "" } });
			fireEvent.click(submitButton);

			// Should show validation error
			await waitFor(() => {
				expect(mockDispatch).not.toHaveBeenCalledWith({
					type: "SET_SEARCH_PAYLOAD",
					payload: expect.anything(),
				});
			});
		});
	});

	describe("Error Handling", () => {
		it("handles dynamic fields fetch errors", async () => {
			const errorMessage = "Failed to fetch dynamic fields";
			(useBbpsApi as jest.Mock).mockReturnValue({
				...defaultMockApi,
				fetchDynamicFields: jest
					.fn()
					.mockResolvedValue({ data: null, error: errorMessage }),
			});

			const selectedOperator = { operator_id: 1, name: "Test Operator" };

			renderComponent({
				selectedOperator,
			});

			await waitFor(() => {
				expect(mockToast).toHaveBeenCalledWith({
					title: "Error",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			});
		});

		it("handles missing product gracefully", () => {
			const { container } = pageRender(
				<BbpsContext.Provider
					value={{
						state: { ...initialState, currentStep: "search" },
						dispatch: mockDispatch,
					}}
				>
					<Search product={null as any} />
				</BbpsContext.Provider>
			);

			expect(container).not.toBeEmptyDOMElement();
		});
	});
});
