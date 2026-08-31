import type { AepsServices } from "page-components/products/aeps-cashout/contracts";

/**
 * Mock AEPS services for testing
 */
export const mockAepsServices: AepsServices = {
	accessToken: "mock-access-token-12345",
	userCode: "AGENT001",
	initiatorId: "agent-123",
	orgId: "org-456",
	generateNewToken: jest.fn(() => true),
	realSourceIp: "192.168.1.1",
};

/**
 * Mock data for provider selection
 */
export const mockProviders = [
	{
		id: "fingpay",
		name: "Fingpay",
		description: "Fingpay AePS Provider",
	},
];

/**
 * Mock geolocation data
 */
export const mockGeolocation = {
	latitude: 28.6139,
	longitude: 77.209,
	accuracy: 10,
};

/**
 * Mock customer search response
 */
export const mockCustomerSearchResponse = {
	status: 200,
	response_type_id: 150,
	response_status_id: 1,
	message: "Customer found",
	data: {
		customer_id: "CUST123456",
		name: "John Doe",
		mobile: "9876543210",
		aadhar: "1234****5678",
	},
};

/**
 * Mock OTP response
 */
export const mockOtpResponse = {
	status: 200,
	response_type_id: 152,
	response_status_id: 1,
	message: "OTP sent successfully",
	data: {
		otp_ref_id: "otp-ref-12345",
	},
};

/**
 * Mock cashout response - success
 */
export const mockCashoutSuccessResponse = {
	status: 200,
	response_type_id: 154,
	response_status_id: 1,
	message: "Transaction successful",
	data: {
		transaction_id: "TXN123456789",
		amount: 5000,
		status: "success",
		timestamp: "2024-08-24T10:30:00Z",
	},
};

/**
 * Mock cashout response - pending
 */
export const mockCashoutPendingResponse = {
	status: 200,
	response_type_id: 154,
	response_status_id: 2,
	message: "Transaction pending",
	data: {
		transaction_id: "TXN987654321",
		amount: 5000,
		status: "pending",
		timestamp: "2024-08-24T10:30:00Z",
	},
};

/**
 * Mock Daily Auth response
 */
export const mockDailyAuthResponse = {
	status: 200,
	response_type_id: 594,
	response_status_id: 1,
	message: "Daily authentication successful",
	data: {
		authenticated: true,
	},
};

/**
 * Mock Fingpay Status response - active
 */
export const mockFingpayStatusActiveResponse = {
	status: 200,
	response_type_id: 391,
	response_status_id: 1,
	message: "Fingpay is active",
	data: {
		active: true,
	},
};

/**
 * Mock payment modes
 */
export const mockPaymentModes = [
	{
		id: "aadhar_fp",
		name: "Aadhaar Fingerprint",
		description: "Use Aadhaar-based fingerprint authentication",
	},
	{
		id: "bank_account",
		name: "Bank Account",
		description: "Use connected bank account",
	},
];
