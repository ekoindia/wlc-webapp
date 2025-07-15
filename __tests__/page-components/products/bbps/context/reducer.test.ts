import { BbpsProducts } from "page-components/products/bbps/BbpsProducts";
import { bbpsReducer } from "page-components/products/bbps/context/reducer";
import {
	Action,
	BbpsState,
	initialState,
} from "page-components/products/bbps/context/types";

describe("bbpsReducer", () => {
	const mockProduct = BbpsProducts[0];
	const mockBill = {
		billid: "bill-1",
		label: "Test Bill",
		amount: 1000,
		customerName: "Test Customer",
		billDate: "01/01/2024",
		billDueDate: "15/01/2024",
		billNumber: "BILL001",
		amountRules: { min: 100, max: 5000 },
	};

	describe("SET_SELECTED_PRODUCT", () => {
		it("sets selected product and resets state for different product", () => {
			const currentState: BbpsState = {
				...initialState,
				selectedProduct: { ...mockProduct, id: "different-product" },
				selectedBills: [mockBill],
				billFetchResult: {
					selectionMode: "single",
					bills: [mockBill],
					arePartialPaymentsAllowed: false,
				},
				totalAmount: 1000,
				searchFormData: { test: "data" },
				error: "Previous error",
				paymentStatus: {
					status: "success",
					message: "Success",
					transactionId: "123",
					amount: 1000,
					timestamp: "2024-01-01",
					billIds: ["bill-1"],
				},
			};

			const action: Action = {
				type: "SET_SELECTED_PRODUCT",
				payload: mockProduct,
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.selectedProduct).toBe(mockProduct);
			expect(newState.selectedBills).toEqual([]);
			expect(newState.billFetchResult).toBeNull();
			expect(newState.totalAmount).toBe(0);
			expect(newState.searchFormData).toEqual({});
			expect(newState.error).toBeNull();
			expect(newState.paymentStatus).toBeNull();
			expect(newState.useMockData).toBe(mockProduct.useMockData);
		});

		it("preserves state when setting same product", () => {
			const currentState: BbpsState = {
				...initialState,
				selectedProduct: mockProduct,
				selectedBills: [mockBill],
				billFetchResult: {
					selectionMode: "single",
					bills: [mockBill],
					arePartialPaymentsAllowed: false,
				},
				totalAmount: 1000,
				searchFormData: { test: "data" },
				error: "Some error",
				paymentStatus: {
					status: "success",
					message: "Success",
					transactionId: "123",
					amount: 1000,
					timestamp: "2024-01-01",
					billIds: ["bill-1"],
				},
			};

			const action: Action = {
				type: "SET_SELECTED_PRODUCT",
				payload: mockProduct,
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.selectedProduct).toBe(mockProduct);
			expect(newState.selectedBills).toEqual([mockBill]);
			expect(newState.billFetchResult).toEqual(
				currentState.billFetchResult
			);
			expect(newState.totalAmount).toBe(1000);
			expect(newState.searchFormData).toEqual({ test: "data" });
			expect(newState.error).toBe("Some error");
			expect(newState.paymentStatus).toEqual(currentState.paymentStatus);
		});

		it("handles null product", () => {
			const action: Action = {
				type: "SET_SELECTED_PRODUCT",
				payload: null,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.selectedProduct).toBeNull();
			expect(newState.useMockData).toBe(false);
		});
	});

	describe("SET_VALIDATION_RESPONSE", () => {
		it("sets validation response and auto-selects bills for multiMandatory", () => {
			const bills = [mockBill, { ...mockBill, billid: "bill-2" }];
			const validationResponse = {
				selectionMode: "multiMandatory" as const,
				bills,
				arePartialPaymentsAllowed: false,
			};

			const action: Action = {
				type: "SET_VALIDATION_RESPONSE",
				payload: validationResponse,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.billFetchResult).toBe(validationResponse);
			expect(newState.selectedBills).toEqual(bills);
			expect(newState.totalAmount).toBe(2000); // Sum of both bills
		});

		it("does not auto-select bills for single mode", () => {
			const validationResponse = {
				selectionMode: "single" as const,
				bills: [mockBill],
				arePartialPaymentsAllowed: false,
			};

			const action: Action = {
				type: "SET_VALIDATION_RESPONSE",
				payload: validationResponse,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.billFetchResult).toBe(validationResponse);
			expect(newState.selectedBills).toEqual([]);
			expect(newState.totalAmount).toBe(0);
		});

		it("does not auto-select bills for multiOptional mode", () => {
			const validationResponse = {
				selectionMode: "multiOptional" as const,
				bills: [mockBill],
				arePartialPaymentsAllowed: true,
			};

			const action: Action = {
				type: "SET_VALIDATION_RESPONSE",
				payload: validationResponse,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.billFetchResult).toBe(validationResponse);
			expect(newState.selectedBills).toEqual([]);
			expect(newState.totalAmount).toBe(0);
		});

		it("handles null validation response", () => {
			const action: Action = {
				type: "SET_VALIDATION_RESPONSE",
				payload: null,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.billFetchResult).toBeNull();
			expect(newState.selectedBills).toEqual([]);
			expect(newState.totalAmount).toBe(0);
		});
	});

	describe("SET_SEARCH_PAYLOAD", () => {
		it("sets search form data", () => {
			const searchData = { customer_id: "123", phone: "9876543210" };
			const action: Action = {
				type: "SET_SEARCH_PAYLOAD",
				payload: searchData,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.searchFormData).toEqual(searchData);
		});

		it("overwrites existing search data", () => {
			const currentState: BbpsState = {
				...initialState,
				searchFormData: { old: "data" },
			};

			const newSearchData = { customer_id: "123" };
			const action: Action = {
				type: "SET_SEARCH_PAYLOAD",
				payload: newSearchData,
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.searchFormData).toEqual(newSearchData);
		});
	});

	describe("TOGGLE_BILL_SELECTION", () => {
		const currentState: BbpsState = {
			...initialState,
			billFetchResult: {
				selectionMode: "multiOptional",
				bills: [
					mockBill,
					{ ...mockBill, billid: "bill-2", amount: 2000 },
				],
				arePartialPaymentsAllowed: false,
			},
		};

		it("adds bill to selection when not selected", () => {
			const action: Action = {
				type: "TOGGLE_BILL_SELECTION",
				billid: "bill-1",
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.selectedBills).toHaveLength(1);
			expect(newState.selectedBills[0].billid).toBe("bill-1");
			expect(newState.totalAmount).toBe(1000);
		});

		it("removes bill from selection when already selected", () => {
			const stateWithSelectedBill: BbpsState = {
				...currentState,
				selectedBills: [mockBill],
				totalAmount: 1000,
			};

			const action: Action = {
				type: "TOGGLE_BILL_SELECTION",
				billid: "bill-1",
			};

			const newState = bbpsReducer(stateWithSelectedBill, action);

			expect(newState.selectedBills).toHaveLength(0);
			expect(newState.totalAmount).toBe(0);
		});

		it("handles single selection mode by replacing selection", () => {
			const singleModeState: BbpsState = {
				...currentState,
				billFetchResult: {
					...currentState.billFetchResult!,
					selectionMode: "single",
				},
				selectedBills: [
					{ ...mockBill, billid: "bill-2", amount: 2000 },
				],
				totalAmount: 2000,
			};

			const action: Action = {
				type: "TOGGLE_BILL_SELECTION",
				billid: "bill-1",
			};

			const newState = bbpsReducer(singleModeState, action);

			expect(newState.selectedBills).toHaveLength(1);
			expect(newState.selectedBills[0].billid).toBe("bill-1");
			expect(newState.totalAmount).toBe(1000);
		});

		it("ignores selection for non-existent bill", () => {
			const action: Action = {
				type: "TOGGLE_BILL_SELECTION",
				billid: "non-existent",
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.selectedBills).toHaveLength(0);
			expect(newState.totalAmount).toBe(0);
		});
	});

	describe("UPDATE_BILL_AMOUNT", () => {
		const currentState: BbpsState = {
			...initialState,
			selectedBills: [
				mockBill,
				{ ...mockBill, billid: "bill-2", amount: 2000 },
			],
			totalAmount: 3000,
		};

		it("updates bill amount and recalculates total", () => {
			const action: Action = {
				type: "UPDATE_BILL_AMOUNT",
				billid: "bill-1",
				amount: 1500,
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.selectedBills[0].amount).toBe(1500);
			expect(newState.totalAmount).toBe(3500); // 1500 + 2000
		});

		it("ignores update for non-existent bill", () => {
			const action: Action = {
				type: "UPDATE_BILL_AMOUNT",
				billid: "non-existent",
				amount: 1500,
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.selectedBills).toEqual(currentState.selectedBills);
			expect(newState.totalAmount).toBe(currentState.totalAmount);
		});
	});

	describe("SET_LOADING", () => {
		it("sets loading state to true", () => {
			const action: Action = {
				type: "SET_LOADING",
				value: true,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.isLoading).toBe(true);
		});

		it("sets loading state to false", () => {
			const currentState: BbpsState = {
				...initialState,
				isLoading: true,
			};

			const action: Action = {
				type: "SET_LOADING",
				value: false,
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.isLoading).toBe(false);
		});
	});

	describe("SET_ERROR", () => {
		it("sets error message", () => {
			const errorMessage = "Something went wrong";
			const action: Action = {
				type: "SET_ERROR",
				message: errorMessage,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.error).toBe(errorMessage);
		});

		it("clears error message", () => {
			const currentState: BbpsState = {
				...initialState,
				error: "Previous error",
			};

			const action: Action = {
				type: "SET_ERROR",
				message: null,
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.error).toBeNull();
		});
	});

	describe("SET_CURRENT_STEP", () => {
		it("sets current step", () => {
			const action: Action = {
				type: "SET_CURRENT_STEP",
				step: "payment",
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.currentStep).toBe("payment");
		});

		it("changes step from one to another", () => {
			const currentState: BbpsState = {
				...initialState,
				currentStep: "search",
			};

			const action: Action = {
				type: "SET_CURRENT_STEP",
				step: "preview",
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.currentStep).toBe("preview");
		});
	});

	describe("SET_MOCK_RESPONSE_TYPE", () => {
		it("sets mock response type", () => {
			const action: Action = {
				type: "SET_MOCK_RESPONSE_TYPE",
				responseType: "failure",
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.mockResponseType).toBe("failure");
		});
	});

	describe("SET_PAYMENT_STATUS", () => {
		it("sets payment status", () => {
			const paymentStatus = {
				status: "success" as const,
				message: "Payment successful",
				transactionId: "TXN123",
				amount: 1000,
				timestamp: "2024-01-01T10:00:00Z",
				billIds: ["bill-1"],
			};

			const action: Action = {
				type: "SET_PAYMENT_STATUS",
				payload: paymentStatus,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.paymentStatus).toEqual(paymentStatus);
		});
	});

	describe("SET_MOCK_DATA_FLAG", () => {
		it("sets mock data flag to true", () => {
			const action: Action = {
				type: "SET_MOCK_DATA_FLAG",
				useMockData: true,
			};

			const newState = bbpsReducer(initialState, action);

			expect(newState.useMockData).toBe(true);
		});

		it("sets mock data flag to false", () => {
			const currentState: BbpsState = {
				...initialState,
				useMockData: true,
			};

			const action: Action = {
				type: "SET_MOCK_DATA_FLAG",
				useMockData: false,
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState.useMockData).toBe(false);
		});
	});

	describe("Dynamic Fields Actions", () => {
		const mockOperators = [
			{ operator_id: 1, name: "Operator 1" },
			{ operator_id: 2, name: "Operator 2" },
		];

		const mockDynamicFields = [
			{
				name: "account_number",
				label: "Account Number",
				parameter_type_id: 1,
			},
			{
				name: "customer_name",
				label: "Customer Name",
				parameter_type_id: 2,
			},
		];

		describe("SET_OPERATORS", () => {
			it("sets operators list", () => {
				const action: Action = {
					type: "SET_OPERATORS",
					payload: mockOperators,
				};

				const newState = bbpsReducer(initialState, action);

				expect(newState.operators).toEqual(mockOperators);
			});

			it("replaces existing operators", () => {
				const currentState: BbpsState = {
					...initialState,
					operators: [{ operator_id: 3, name: "Old Operator" }],
				};

				const action: Action = {
					type: "SET_OPERATORS",
					payload: mockOperators,
				};

				const newState = bbpsReducer(currentState, action);

				expect(newState.operators).toEqual(mockOperators);
			});
		});

		describe("SET_SELECTED_OPERATOR", () => {
			it("sets selected operator", () => {
				const selectedOperator = mockOperators[0];
				const action: Action = {
					type: "SET_SELECTED_OPERATOR",
					payload: selectedOperator,
				};

				const newState = bbpsReducer(initialState, action);

				expect(newState.selectedOperator).toEqual(selectedOperator);
			});

			it("clears selected operator", () => {
				const currentState: BbpsState = {
					...initialState,
					selectedOperator: mockOperators[0],
				};

				const action: Action = {
					type: "SET_SELECTED_OPERATOR",
					payload: null,
				};

				const newState = bbpsReducer(currentState, action);

				expect(newState.selectedOperator).toBeNull();
			});
		});

		describe("SET_DYNAMIC_FIELDS", () => {
			it("sets dynamic fields", () => {
				const action: Action = {
					type: "SET_DYNAMIC_FIELDS",
					payload: mockDynamicFields,
				};

				const newState = bbpsReducer(initialState, action);

				expect(newState.dynamicFields).toEqual(mockDynamicFields);
			});

			it("replaces existing dynamic fields", () => {
				const currentState: BbpsState = {
					...initialState,
					dynamicFields: [
						{
							name: "old_field",
							label: "Old Field",
							parameter_type_id: 1,
						},
					],
				};

				const action: Action = {
					type: "SET_DYNAMIC_FIELDS",
					payload: mockDynamicFields,
				};

				const newState = bbpsReducer(currentState, action);

				expect(newState.dynamicFields).toEqual(mockDynamicFields);
			});
		});

		describe("SET_LOADING_DYNAMIC_DATA", () => {
			it("sets loading dynamic data to true", () => {
				const action: Action = {
					type: "SET_LOADING_DYNAMIC_DATA",
					value: true,
				};

				const newState = bbpsReducer(initialState, action);

				expect(newState.isLoadingDynamicData).toBe(true);
			});

			it("sets loading dynamic data to false", () => {
				const currentState: BbpsState = {
					...initialState,
					isLoadingDynamicData: true,
				};

				const action: Action = {
					type: "SET_LOADING_DYNAMIC_DATA",
					value: false,
				};

				const newState = bbpsReducer(currentState, action);

				expect(newState.isLoadingDynamicData).toBe(false);
			});
		});

		describe("RESET_DYNAMIC_FORM", () => {
			it("resets dynamic form fields while preserving other state", () => {
				const currentState: BbpsState = {
					...initialState,
					selectedProduct: mockProduct,
					selectedBills: [mockBill],
					operators: mockOperators,
					selectedOperator: mockOperators[0],
					dynamicFields: mockDynamicFields,
					isLoadingDynamicData: true,
				};

				const action: Action = {
					type: "RESET_DYNAMIC_FORM",
				};

				const newState = bbpsReducer(currentState, action);

				// Should reset dynamic form fields
				expect(newState.selectedOperator).toBeNull();
				expect(newState.dynamicFields).toEqual([]);
				expect(newState.isLoadingDynamicData).toBe(false);

				// Should preserve other state
				expect(newState.selectedProduct).toBe(mockProduct);
				expect(newState.selectedBills).toEqual([mockBill]);
				expect(newState.operators).toEqual(mockOperators);
			});
		});
	});

	describe("RESET_STATE", () => {
		it("resets state to initial values", () => {
			const currentState: BbpsState = {
				...initialState,
				selectedProduct: mockProduct,
				selectedBills: [mockBill],
				totalAmount: 1000,
				isLoading: true,
				error: "Some error",
				currentStep: "payment",
				searchFormData: { test: "data" },
				useMockData: true,
				mockResponseType: "failure",
				paymentStatus: {
					status: "success",
					message: "Success",
					transactionId: "123",
					amount: 1000,
					timestamp: "2024-01-01",
					billIds: ["bill-1"],
				},
				operators: mockOperators,
				selectedOperator: mockOperators[0],
				dynamicFields: mockDynamicFields,
				isLoadingDynamicData: true,
			};

			const action: Action = {
				type: "RESET_STATE",
			};

			const newState = bbpsReducer(currentState, action);

			expect(newState).toEqual(initialState);
		});
	});

	describe("Default case", () => {
		it("returns current state for unknown action", () => {
			const unknownAction = { type: "UNKNOWN_ACTION" } as any;

			const newState = bbpsReducer(initialState, unknownAction);

			expect(newState).toBe(initialState);
		});
	});
});
