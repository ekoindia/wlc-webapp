import {
	BillFetchResponse,
	BillPaymentRequest,
	PaymentStatusData,
} from "../context/types";

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
				billDate: "01-07-2025",
				amount_multiple: "100.00",
				billNumber: "HGE1VT54UCC6DB27VW6JB0",
				billDueDate: "07-07-2025",
				filler1: "Sam",
				filler2: null,
				minBillPayAmount: "50.00",
			},
			{
				billAmount: "2000.00",
				maxBillPayAmount: "10000.00",
				authenticator4: null,
				bharatBillReferenceNumber: "HGE1VT54UCC6DB27VW6JB1",
				billDate: "01-07-2025",
				amount_multiple: "500.00",
				billNumber: "HGE1VT54UCC6DB27VW6JB1",
				billDueDate: "02-07-2025",
				filler1: "Sam",
				filler2: null,
				minBillPayAmount: "500.00",
			},
			{
				billAmount: "2000.00",
				maxBillPayAmount: "3000.00",
				authenticator4: null,
				bharatBillReferenceNumber: "HGE1VT54UCC6DB27VW6JB2",
				billDate: "01-07-2025",
				amount_multiple: "100.00",
				billNumber: "HGE1VT54UCC6DB27VW6JB2",
				billDueDate: "13-07-2025",
				filler1: "Sam",
				filler2: null,
				minBillPayAmount: "500.00",
			},
			{
				billAmount: "2000.00",
				maxBillPayAmount: "5000.00",
				authenticator4: null,
				bharatBillReferenceNumber: "HGE1VT54UCC6DB27VW6JB3",
				billDate: "10-07-2025",
				amount_multiple: "100.00",
				billNumber: "HGE1VT54UCC6DB27VW6JB3",
				billDueDate: "11-07-2025",
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

export const mockBillPaymentRequest: BillPaymentRequest = {
	sourceid: "EKO01",
	customerid: "EKO9466009091",
	paymentid: "HGAFP016920000334231",
	objectid: "payment",
	currency: "356",
	billerid: "LOAN00000NATOI",
	validationid: "HGE1VT5K29G5EOUB6KJ6",
	source_ref_no: "HG1751397691264",
	payment_amount: "8000.00",
	biller_name: "Loan API 1 1",
	biller_category: "Loan",
	authenticators: [
		{
			parameter_name: "Loan Account Number",
			value: "LOAN041101",
		},
	],
	payment_type: "instapay",
	txn_date_time: "02-07-2025 00:50:50",
	biller_status: "PENDING",
	payment_account: {
		objectid: "paymentaccount",
		payment_method: "Cash",
		remarks: "Agent Cash mode",
	},
	billlist: [
		{
			objectid: "bill",
			billid: "HGE1VT5K29G5EOUB6KJ6B0",
			billerid: "LOAN00000NATOI",
			sourceid: "EKO01",
			billstatus: "PENDING",
			authenticators: [
				{
					parameter_name: "Loan Account Number",
					value: "LOAN041101",
				},
			],
			billnumber: "LOAN001",
			billperiod: "August",
			net_billamount: "2000.00",
			description: "ABC 123 @#$",
			additional_details: [
				{
					seq: "1",
					label: "FetchAdditionalInfo",
					value: "Fetch Additional Info",
				},
			],
			validationid: "HGE1VT5K29G5EOUB6KJ6",
			customer_name: "Sam",
			max_pay_amount: "2500.00",
			min_pay_amount: "50.00",
			amount_multiple: "100.00",
			billamount: "2000.00",
			billdate: "01-08-2023",
			billduedate: "30-12-2099",
		},
		{
			objectid: "bill",
			billid: "HGE1VT5K29G5EOUB6KJ6B1",
			billerid: "LOAN00000NATOI",
			sourceid: "EKO01",
			billstatus: "PENDING",
			authenticators: [
				{
					parameter_name: "Loan Account Number",
					value: "LOAN041101",
				},
			],
			billnumber: "LOAN001",
			billperiod: "August",
			net_billamount: "2000.00",
			description: "Advance Payment",
			additional_details: [
				{
					seq: "1",
					label: "FetchAdditionalInfo",
					value: "Fetch Additional Info",
				},
			],
			validationid: "HGE1VT5K29G5EOUB6KJ6",
			customer_name: "Sam",
			max_pay_amount: "10000.00",
			min_pay_amount: "500.00",
			amount_multiple: "500.00",
			billamount: "2000.00",
			billdate: "01-08-2023",
			billduedate: "30-12-2099",
		},
		{
			objectid: "bill",
			billid: "HGE1VT5K29G5EOUB6KJ6B2",
			billerid: "LOAN00000NATOI",
			sourceid: "EKO01",
			billstatus: "PENDING",
			authenticators: [
				{
					parameter_name: "Loan Account Number",
					value: "LOAN041101",
				},
			],
			billnumber: "LOAN001",
			billperiod: "August",
			net_billamount: "2000.00",
			description: "Part Payment",
			additional_details: [
				{
					seq: "1",
					label: "FetchAdditionalInfo",
					value: "Fetch Additional Info",
				},
			],
			validationid: "HGE1VT5K29G5EOUB6KJ6",
			customer_name: "Sam",
			max_pay_amount: "3000.00",
			min_pay_amount: "500.00",
			amount_multiple: "100.00",
			billamount: "2000.00",
			billdate: "01-08-2023",
			billduedate: "30-12-2099",
		},
		{
			objectid: "bill",
			billid: "HGE1VT5K29G5EOUB6KJ6B3",
			billerid: "LOAN00000NATOI",
			sourceid: "EKO01",
			billstatus: "PENDING",
			authenticators: [
				{
					parameter_name: "Loan Account Number",
					value: "LOAN041101",
				},
			],
			billnumber: "LOAN001",
			billperiod: "August",
			net_billamount: "2000.00",
			description: "Foreclosure",
			additional_details: [
				{
					seq: "1",
					label: "FetchAdditionalInfo",
					value: "Fetch Additional Info",
				},
			],
			validationid: "HGE1VT5K29G5EOUB6KJ6",
			customer_name: "Sam",
			max_pay_amount: "5000.00",
			min_pay_amount: "500.00",
			amount_multiple: "100.00",
			billamount: "2000.00",
			billdate: "01-08-2023",
			billduedate: "30-12-2099",
		},
	],
	payment_status: "PAID",
	debit_amount: "8000.00",
	cou_conv_fee: "0.00",
	bou_conv_fee: "0.00",
	bbps_ref_no: "BD015183BAFAAAAAB04R",
	payment_amount_breakup: [
		{
			billid: "HGE1VT5K29G5EOUB6KJ6B0",
			bill_payment_amount: "2000.00",
		},
		{
			billid: "HGE1VT5K29G5EOUB6KJ6B1",
			bill_payment_amount: "2000.00",
		},
		{
			billid: "HGE1VT5K29G5EOUB6KJ6B2",
			bill_payment_amount: "2000.00",
		},
		{
			billid: "HGE1VT5K29G5EOUB6KJ6B3",
			bill_payment_amount: "2000.00",
		},
	],
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
