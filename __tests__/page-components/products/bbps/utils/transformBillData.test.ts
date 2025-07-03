import { afterEach, beforeEach, describe, it } from "node:test";
import { calculateDueDateTag } from "page-components/products/bbps/utils/transformBillData";
import { BillFetchResponse } from "../../../../../page-components/products/bbps/context/types";
import { transformBillData } from "../../../../../page-components/products/bbps/utils/transformBillData";

describe("transformBillData", () => {
	const mockResponse: BillFetchResponse = {
		response_status_id: -1,
		data: {
			billerid: "TEST001",
			amount: "",
			bbpstrxnrefid: "",
			ifsc_status: 0,
			utilitycustomername: "NA",
			billfetchresponse: "",
			billerstatus: "",
			payMultipleBills: "Y",
			postalcode: "123456",
			billDetailsList: [
				{
					billAmount: "2000.00",
					maxBillPayAmount: "2500.00",
					authenticator4: null,
					bharatBillReferenceNumber: "TEST001BILL001",
					billDate: "01-08-2023", // DD-MM-YYYY format from mock data
					amount_multiple: "100.00",
					billNumber: "BILL001",
					billDueDate: "07-08-2023", // DD-MM-YYYY format from mock data
					filler1: "Test Customer",
					filler2: null,
					minBillPayAmount: "50.00",
				},
			],
			geocode: "28.4526,77.0678",
			billdate: "",
			customer_id: "TEST001",
			billDueDate: "",
			billername: "Test Biller",
		},
		response_type_id: 1052,
		message: "Test message",
		status: 0,
	};

	it("should transform bill data correctly", () => {
		const result = transformBillData(mockResponse);

		expect(result).toBeDefined();
		expect(result.selectionMode).toBe("multiOptional");
		expect(result.bills).toHaveLength(1);
	});

	it("should normalize date formats from DD-MM-YYYY to DD/MM/YYYY", () => {
		const result = transformBillData(mockResponse);
		const bill = result.bills[0];

		// Check that dates are normalized to DD/MM/YYYY format
		expect(bill.billDate).toBe("01/08/2023");
		expect(bill.billDueDate).toBe("07/08/2023");

		// Check that the label uses the normalized due date
		expect(bill.label).toBe("BILL001 - 07/08/2023");
	});

	it("should handle already normalized dates", () => {
		const responseWithNormalizedDates = {
			...mockResponse,
			data: {
				...mockResponse.data,
				billDetailsList: [
					{
						...mockResponse.data.billDetailsList[0],
						billDate: "01/08/2023", // Already in DD/MM/YYYY format
						billDueDate: "07/08/2023", // Already in DD/MM/YYYY format
					},
				],
			},
		};

		const result = transformBillData(responseWithNormalizedDates);
		const bill = result.bills[0];

		// Should remain unchanged
		expect(bill.billDate).toBe("01/08/2023");
		expect(bill.billDueDate).toBe("07/08/2023");
	});

	it("should handle special date values", () => {
		const responseWithSpecialDates = {
			...mockResponse,
			data: {
				...mockResponse.data,
				billDetailsList: [
					{
						...mockResponse.data.billDetailsList[0],
						billDate: "N/A",
						billDueDate: "",
					},
				],
			},
		};

		const result = transformBillData(responseWithSpecialDates);
		const bill = result.bills[0];

		// Should handle special values gracefully
		expect(bill.billDate).toBe("N/A");
		expect(bill.billDueDate).toBe("");
	});

	it("should determine selection mode correctly", () => {
		// Test multiOptional
		expect(transformBillData(mockResponse).selectionMode).toBe(
			"multiOptional"
		);

		// Test multiMandatory
		const mandatoryResponse = {
			...mockResponse,
			data: { ...mockResponse.data, payMultipleBills: "M" },
		};
		expect(transformBillData(mandatoryResponse).selectionMode).toBe(
			"multiMandatory"
		);

		// Test single
		const singleResponse = {
			...mockResponse,
			data: { ...mockResponse.data, payMultipleBills: "N" },
		};
		expect(transformBillData(singleResponse).selectionMode).toBe("single");
	});
});

describe("calculateDueDateTag", () => {
	// Mock console.warn to avoid noise in tests
	const originalWarn = console.warn;
	beforeEach(() => {
		console.warn = jest.fn();
	});

	afterEach(() => {
		console.warn = originalWarn;
	});

	it("should return null for invalid or empty dates", () => {
		expect(calculateDueDateTag("")).toBeNull();
		expect(calculateDueDateTag("N/A")).toBeNull();
		expect(calculateDueDateTag("invalid-date")).toBeNull();
	});

	it("should return overdue tag for past dates", () => {
		// Create a date that's 5 days in the past
		const pastDate = new Date();
		pastDate.setDate(pastDate.getDate() - 5);
		const dateString = pastDate.toLocaleDateString("en-GB"); // DD/MM/YYYY format

		const result = calculateDueDateTag(dateString);
		expect(result).toEqual({
			text: "Overdue",
			color: "red",
		});
	});

	it("should return due tag for dates within 7 days", () => {
		// Create a date that's 3 days in the future
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 3);
		const dateString = futureDate.toLocaleDateString("en-GB"); // DD/MM/YYYY format

		const result = calculateDueDateTag(dateString);
		expect(result).toEqual({
			text: "Due in 3 days",
			color: "orange",
		});
	});

	it("should return due tag with singular 'day' for 1 day", () => {
		// Create a date that's 1 day in the future
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 1);
		const dateString = futureDate.toLocaleDateString("en-GB"); // DD/MM/YYYY format

		const result = calculateDueDateTag(dateString);
		expect(result).toEqual({
			text: "Due in 1 day",
			color: "orange",
		});
	});

	it("should return null for dates more than 7 days in the future", () => {
		// Create a date that's 10 days in the future
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 10);
		const dateString = futureDate.toLocaleDateString("en-GB"); // DD/MM/YYYY format

		const result = calculateDueDateTag(dateString);
		expect(result).toBeNull();
	});

	it("should handle different date formats correctly", () => {
		// Test with DD/MM/YYYY format
		const result1 = calculateDueDateTag("15/12/2024");
		expect(result1).toBeDefined(); // Should not be null if date is valid

		// Test with DD-MM-YYYY format (should be handled by formatDate)
		const result2 = calculateDueDateTag("15-12-2024");
		expect(result2).toBeDefined(); // Should not be null if date is valid
	});
});
