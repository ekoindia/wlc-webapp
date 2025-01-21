import { DisplayMedia } from "constants/trxnFramework";

/**
 * Returns the default view component for a given parameter type id.
 * TODO: Remove "view" components in favor of <Value> component that directly uses the parameter-type-id. Allow custom value-renderer components to be passed to <Value> component (or, prefix/postfix components).
 * @param {number} parameter_type_id
 * @returns
 */
export const getViewComponent = (parameter_type_id) => {
	switch (parameter_type_id) {
		case 9:
			return "Amount";
		case 12:
			return null; // return "Avatar";
		case 14:
			return "DateTime";
		case 15:
			return "Mobile";
		default:
			return null;
	}
};

/**
 * Parameters to show in the Transaction History table (for agents)
 * MARK: Self History Items
 */
export const historyParametersMetadata = [
	{
		name: "tx_name",
		label: "Transaction Type",
		sorting: true,
		show: "Avatar",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "description",
		label: "Description",
		show: "Description",
		parameter_type_id: 12,
	},
	{
		name: "amount",
		label: "Amount",
		sorting: true,
		show: "Payment",
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "tid",
		label: "TID",
		sorting: true,
		parameter_type_id: 11,
		pattern_format: "#### #### #",
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "datetime",
		label: "Date & Time",
		sorting: true,
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "status",
		show: "Tag",
		display_media_id: DisplayMedia.SCREEN,
	},

	/* ------------------------------------------------------------
			Below are the extra fields shown upon expanding a row...
		------------------------------------------------------------- */
	{
		name: "tx_name",
		label: "Transaction",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "status",
		label: "Status",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "amount",
		label: "Amount",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "fee",
		label: "Charges",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "tid",
		label: "TID",
		parameter_type_id: 11,
		pattern_format: "#### #### #",
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "settlement_type",
		label: "Settlement Type",
		show: "Settlement Type",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	// Only shown to customer as "1% (min. Rs. 10)"; maybe for DMT only. Is it required as per regulations?
	// {
	// 	name: "fee",
	// 	label: "Customer Charges",
	// 	show: getViewComponent(9),
	// 	parameter_type_id: 9,
	// 	display_media_id: DisplayMedia.SCREEN,
	// },
	{
		name: "commission_earned",
		label: "Commission Earned",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "r_bal",
		label: "Balance Amount",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},

	// Add new fields below ------------------------------------

	// After RBI Audit: Show customers that their Fee=1% (print receipt & SMS)	[2018-10-31]
	{
		name: "customer_fee",
		label: "Customer Charges",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.PRINT,
	},

	{
		name: "bonus",
		label: "Bonus",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},

	{
		name: "tds",
		label: "TDS",
		parameter_type_id: 10,
		display_media_id: DisplayMedia.SCREEN,
	},

	{
		name: "eko_service_charge",
		label: "Service Charge",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	}, // For Enterprise
	{
		name: "eko_gst",
		label: "GST",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	}, // For Enterprise

	{
		name: "customer_name",
		label: "Customer",
		parameter_type_id: 12,
		case_id: 3,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "customer_mobile",
		label: "Customer's Mobile",
		parameter_type_id: 15,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "rrn",
		label: "RRN",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "recipient_name",
		label: "Recipient",
		parameter_type_id: 12,
		case_id: 3,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "recipient_mobile",
		label: "Recipient's Mobile",
		parameter_type_id: 15,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "account",
		label: "Recipient Account #",
		parameter_type_id: 11,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "bank",
		label: "Bank",
		parameter_type_id: 12,
		case_id: 3,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "channel",
		label: "Via",
		parameter_type_id: 12,
		case_id: 1,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "operator",
		label: "Service Provider",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "utility_account",
		label: "Utility Account",
		parameter_type_id: 11,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "refund_tid",
		label: "Refund TID",
		parameter_type_id: 11,
		pattern_format: "### ### ### #",
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "trackingnumber",
		label: "Tracking Number",
		parameter_type_id: 11,
		// display_media_id: DisplayMedia.BOTH,
	},
	// {
	// 	name: "client_ref_id",
	// 	label: "Client Ref. ID",
	// 	parameter_type_id: 11,
	// 	display_media_id: DisplayMedia.SCREEN,
	// },
	// {
	// 	name: "batch_id",
	// 	label: "Batch ID",
	// 	parameter_type_id: 11,
	// 	pattern_format: "#### #### #",
	// 	display_media_id: DisplayMedia.SCREEN,
	// },
	{
		name: "pinNo",
		label: "Pin#",
		parameter_type_id: 11,
		pattern_format: "### ### ### #",
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		// For UPI
		name: "vpa",
		label: "Customer VPA",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "user_name",
		label: "User Name",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "user_pan",
		label: "User Pan",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "reversal_narration",
		label: "Narration",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	// {
	// 	name: "merchant_name",
	// 	label: "Retailer Name",
	// 	parameter_type_id: 12,
	// 	// display_media_id: DisplayMedia.BOTH,
	// },
	// {
	// 	name: "merchant_mobile",
	// 	label: "Retailer Mobile",
	// 	parameter_type_id: 15,
	// 	// display_media_id: DisplayMedia.BOTH,
	// },
	{
		name: "gst",
		label: "GST",
		parameter_type_id: 10,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "loan_id",
		label: "Loan ID",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "order_id",
		label: "Order ID",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "partner_name",
		label: "Partner Name",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},

	// For DMT Transaction Insurance (IMPS): Insurance ID, Amount & Policy Link
	{
		name: "insurance_acquired",
		label: "Transaction Assured",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "insurance_amount",
		label: "Assurance Amount",
		parameter_type_id: 10,
		show: getViewComponent(10),
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "policy_number",
		label: "Policy Number",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "policy",
		label: "Download Policy",
		parameter_type_id: 31,
		// show: getViewComponent(31),
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "refund_amount",
		label: "Refunded Amount",
		parameter_type_id: 10,
		show: getViewComponent(10),
		display_media_id: DisplayMedia.SCREEN,
	},
	// {
	// 	name: "plan_name",
	// 	label: "Plan Name",
	// 	parameter_type_id: 12,
	// 	display_media_id: DisplayMedia.SCREEN,
	// },

	//  Transaction + Updated DateTime: Should remain at the end...
	{
		name: "datetime",
		label: "Transaction Time",
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "updated_datetime",
		label: "Updated Time",
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.SCREEN,
	},
];

/**
 * Parameters to show in the Transaction History table (for agents)
 * MARK: Network History Items
 */
export const networkHistoryParametersMetadata = [
	{
		name: "agent_name",
		label: "Agent Name",
		sorting: true,
		show: "Avatar",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "agent_type",
		label: "Agent Type",
		sorting: true,
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "agent_code",
		label: "Agent Code",
		sorting: true,
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "tx_name",
		label: "Transaction Type",
		sorting: true,
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "amount",
		label: "Amount",
		sorting: true,
		show: "Payment",
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "datetime",
		label: "Date & Time",
		sorting: true,
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "status",
		show: "Tag",
		display_media_id: DisplayMedia.SCREEN,
	},

	/* ------------------------------------------------------------
			Below are the extra fields shown upon expanding a row...
		------------------------------------------------------------- */
	{
		name: "tx_name",
		label: "Transaction",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "status",
		label: "Status",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "description",
		label: "Description",
		show: "Description",
		parameter_type_id: 12,
	},
	{
		name: "amount",
		label: "Amount",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "fee",
		label: "Charges",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "tid",
		label: "TID",
		parameter_type_id: 11,
		pattern_format: "#### #### #",
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "settlement_type",
		label: "Settlement Type",
		show: "Settlement Type",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "commission_earned",
		label: "Commission Earned",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},
	// {
	// 	name: "r_bal",
	// 	label: "Balance Amount",
	// 	show: getViewComponent(9),
	// 	parameter_type_id: 9,
	// 	display_media_id: DisplayMedia.SCREEN,
	// },

	// Add new fields below ------------------------------------

	// After RBI Audit: Show customers that their Fee=1% (print receipt & SMS)	[2018-10-31]
	{
		name: "customer_fee",
		label: "Customer Charges",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.PRINT,
	},

	{
		name: "bonus",
		label: "Bonus",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},

	{
		name: "tds",
		label: "TDS",
		parameter_type_id: 10,
		display_media_id: DisplayMedia.SCREEN,
	},

	{
		name: "eko_service_charge",
		label: "Service Charge",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	}, // For Enterprise
	{
		name: "eko_gst",
		label: "GST",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	}, // For Enterprise

	{
		name: "customer_name",
		label: "Customer",
		parameter_type_id: 12,
		case_id: 3,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "customer_mobile",
		label: "Customer's Mobile",
		parameter_type_id: 15,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "rrn",
		label: "RRN",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "recipient_name",
		label: "Recipient",
		parameter_type_id: 12,
		case_id: 3,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "recipient_mobile",
		label: "Recipient's Mobile",
		parameter_type_id: 15,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "account",
		label: "Recipient Account #",
		parameter_type_id: 11,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "bank",
		label: "Bank",
		parameter_type_id: 12,
		case_id: 3,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "channel",
		label: "Via",
		parameter_type_id: 12,
		case_id: 1,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "operator",
		label: "Service Provider",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "utility_account",
		label: "Utility Account",
		parameter_type_id: 11,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "refund_tid",
		label: "Refund TID",
		parameter_type_id: 11,
		pattern_format: "### ### ### #",
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "trackingnumber",
		label: "Tracking Number",
		parameter_type_id: 11,
		// display_media_id: DisplayMedia.BOTH,
	},
	// {
	// 	name: "client_ref_id",
	// 	label: "Client Ref. ID",
	// 	parameter_type_id: 11,
	// 	display_media_id: DisplayMedia.SCREEN,
	// },
	// {
	// 	name: "batch_id",
	// 	label: "Batch ID",
	// 	parameter_type_id: 11,
	// 	pattern_format: "#### #### #",
	// 	display_media_id: DisplayMedia.SCREEN,
	// },
	{
		name: "pinNo",
		label: "Pin#",
		parameter_type_id: 11,
		pattern_format: "### ### ### #",
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		// For UPI
		name: "vpa",
		label: "Customer VPA",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "user_name",
		label: "User Name",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "user_pan",
		label: "User Pan",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},

	{
		name: "reversal_narration",
		label: "Narration",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	// {
	// 	name: "merchant_name",
	// 	label: "Retailer Name",
	// 	parameter_type_id: 12,
	// 	// display_media_id: DisplayMedia.BOTH,
	// },
	// {
	// 	name: "merchant_mobile",
	// 	label: "Retailer Mobile",
	// 	parameter_type_id: 15,
	// 	// display_media_id: DisplayMedia.BOTH,
	// },
	{
		name: "gst",
		label: "GST",
		parameter_type_id: 10,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "loan_id",
		label: "Loan ID",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "order_id",
		label: "Order ID",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "partner_name",
		label: "Partner Name",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},

	// For DMT Transaction Insurance (IMPS): Insurance ID, Amount & Policy Link
	{
		name: "insurance_acquired",
		label: "Transaction Assured",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "insurance_amount",
		label: "Assurance Amount",
		parameter_type_id: 10,
		show: getViewComponent(10),
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "policy_number",
		label: "Policy Number",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "policy",
		label: "Download Policy",
		parameter_type_id: 31,
		// show: getViewComponent(31),
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "refund_amount",
		label: "Refunded Amount",
		parameter_type_id: 10,
		show: getViewComponent(10),
		display_media_id: DisplayMedia.SCREEN,
	},
	// {
	// 	name: "plan_name",
	// 	label: "Plan Name",
	// 	parameter_type_id: 12,
	// 	display_media_id: DisplayMedia.SCREEN,
	// },

	//  Transaction + Updated DateTime: Should remain at the end...
	{
		name: "datetime",
		label: "Transaction Time",
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "updated_datetime",
		label: "Updated Time",
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.SCREEN,
	},
];
