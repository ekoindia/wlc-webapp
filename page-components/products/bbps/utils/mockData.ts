import { BillFetchResponse, PaymentStatusData } from "../context/types";

/**
 * Mock response for BBPS bill fetch API
 * Used for both testing and development when API is unavailable
 */
export const mockBillFetchResponse: BillFetchResponse = {
	response_status_id: -1,
	data: {
		billerid: "LOAN00000NATOI",
		amount: "",
		bbpstrxnrefid: "",
		ifsc_status: 0,
		utilitycustomername: "NA",
		billfetchresponse: "",
		billerstatus: "",
		payMultipleBills: "Y",
		postalcode: "854333",
		billDetailsList: [
			{
				billAmount: "2000.00",
				maxBillPayAmount: "2500.00",
				authenticator4: null,
				bharatBillReferenceNumber: "HGE1VT54UCC6DB27VW6JB0",
				billDate: "01-08-2023",
				amount_multiple: "100.00",
				billNumber: "HGE1VT54UCC6DB27VW6JB0",
				billDueDate: "30-12-2099",
				filler1: "Sam",
				filler2: null,
				minBillPayAmount: "50.00",
			},
			{
				billAmount: "2000.00",
				maxBillPayAmount: "10000.00",
				authenticator4: null,
				bharatBillReferenceNumber: "HGE1VT54UCC6DB27VW6JB1",
				billDate: "01-08-2023",
				amount_multiple: "500.00",
				billNumber: "HGE1VT54UCC6DB27VW6JB1",
				billDueDate: "30-12-2099",
				filler1: "Sam",
				filler2: null,
				minBillPayAmount: "500.00",
			},
			{
				billAmount: "2000.00",
				maxBillPayAmount: "3000.00",
				authenticator4: null,
				bharatBillReferenceNumber: "HGE1VT54UCC6DB27VW6JB2",
				billDate: "01-08-2023",
				amount_multiple: "100.00",
				billNumber: "HGE1VT54UCC6DB27VW6JB2",
				billDueDate: "30-12-2099",
				filler1: "Sam",
				filler2: null,
				minBillPayAmount: "500.00",
			},
			{
				billAmount: "2000.00",
				maxBillPayAmount: "5000.00",
				authenticator4: null,
				bharatBillReferenceNumber: "HGE1VT54UCC6DB27VW6JB3",
				billDate: "01-08-2023",
				amount_multiple: "100.00",
				billNumber: "HGE1VT54UCC6DB27VW6JB3",
				billDueDate: "30-12-2099",
				filler1: "Sam",
				filler2: null,
				minBillPayAmount: "500.00",
			},
		],
		geocode: "28.4526,77.0678",
		billdate: "",
		customer_id: "LOAN041101",
		billDueDate: "",
		billername: "Loan API 1 1",
	},
	response_type_id: 1052,
	message: "Due Bill Amount For utility",
	status: 0,
};

/**
 * Mock responses for different pay_multiple_bills scenarios
 */
export const mockBillFetchResponses = {
	// Optional Multiple Selection (Y)
	multiOptional: {
		...mockBillFetchResponse,
		data: {
			...mockBillFetchResponse.data,
			payMultipleBills: "Y",
		},
	},
	// Mandatory All Selection (M)
	multiMandatory: {
		...mockBillFetchResponse,
		data: {
			...mockBillFetchResponse.data,
			payMultipleBills: "M",
		},
	},
	// Single Selection Only (N)
	singleOnly: {
		...mockBillFetchResponse,
		data: {
			...mockBillFetchResponse.data,
			payMultipleBills: "N",
			billDetailsList: [mockBillFetchResponse.data.billDetailsList[0]], // Only one bill
		},
	},
};

/**
 * Mock payment status responses for different scenarios
 */
export const paymentStatusMocks: Record<string, PaymentStatusData> = {
	success: {
		status: "success",
		message: "Payment processed successfully",
		transactionId: `TXN${Date.now()}`,
		amount: 0, // Will be set dynamically
		timestamp: new Date().toISOString(),
		billIds: [], // Will be set dynamically
	},
	failure: {
		status: "failure",
		message: "Payment failed due to insufficient funds",
		transactionId: `TXN${Date.now()}`,
		amount: 0, // Will be set dynamically
		timestamp: new Date().toISOString(),
		billIds: [], // Will be set dynamically
	},
	pending: {
		status: "pending",
		message: "Payment is being processed. Please check back later.",
		transactionId: `TXN${Date.now()}`,
		amount: 0, // Will be set dynamically
		timestamp: new Date().toISOString(),
		billIds: [], // Will be set dynamically
	},
};

/**
 * Transform bill fetch response for testing
 * @param response Raw response
 * @returns Transformed response
 */
export const transformBillFetchResponse = (response: BillFetchResponse) => {
	// This would normally be done by the transformBillData utility
	return response;
};
