import { DisplayMedia } from "constants/trxnFramework";

/**
 * Returns the default view component for a given parameter type id.
 * TODO: Remove "view" components in favor of <Value> component that directly uses the parameter-type-id. Allow custom value-renderer components to be passed to <Value> component (or, prefix/postfix components).
 * @param {number} parameter_type_id
 * @returns
 */
const getViewComponent = (parameter_type_id) => {
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
 */
export const historyParametersMetadata = [
	{
		name: "tx_name",
		field: "Transaction Type",
		sorting: true,
		show: "Avatar",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "description",
		field: "Description",
		show: "Description",
		parameter_type_id: 12,
	},
	{
		name: "amount",
		field: "Amount",
		sorting: true,
		show: "Payment",
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "tid",
		field: "TID",
		sorting: true,
		parameter_type_id: 11,
		pattern_format: "#### #### #",
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "datetime",
		field: "Date & Time",
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
		field: "Transaction",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "status",
		field: "Status",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "amount",
		field: "Amount",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "fee",
		field: "Charges",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "tid",
		field: "TID",
		parameter_type_id: 11,
		pattern_format: "#### #### #",
		display_media_id: DisplayMedia.PRINT,
	},
	// Only shown to customer as "1% (min. Rs. 10)"; maybe for DMT only. Is it required as per regulations?
	// {
	// 	name: "fee",
	// 	field: "Customer Charges",
	// 	show: getViewComponent(9),
	// 	parameter_type_id: 9,
	// 	display_media_id: DisplayMedia.SCREEN,
	// },
	{
		name: "commission_earned",
		field: "Commission Earned",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "r_bal",
		field: "Balance Amount",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	},

	// Add new fields below ------------------------------------

	// After RBI Audit: Show customers that their Fee=1% (print receipt & SMS)	[2018-10-31]
	{
		name: "customer_fee",
		field: "Customer Charges",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.PRINT,
	},

	{
		name: "bonus",
		field: "Bonus",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},

	{
		name: "tds",
		field: "TDS",
		parameter_type_id: 10,
		display_media_id: DisplayMedia.SCREEN,
	},

	{
		name: "eko_service_charge",
		field: "Service Charge",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	}, // For Enterprise
	{
		name: "eko_gst",
		field: "GST",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
	}, // For Enterprise

	{
		name: "customer_name",
		field: "Customer",
		parameter_type_id: 12,
		case_id: 3,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "customer_mobile",
		field: "Customer's Mobile",
		parameter_type_id: 15,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "rrn",
		field: "RRN",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "recipient_name",
		field: "Recipient",
		parameter_type_id: 12,
		case_id: 3,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "recipient_mobile",
		field: "Recipient's Mobile",
		parameter_type_id: 15,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "account",
		field: "Recipient Account #",
		parameter_type_id: 11,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "bank",
		field: "Bank",
		parameter_type_id: 12,
		case_id: 3,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "channel",
		field: "Via",
		parameter_type_id: 12,
		case_id: 1,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "operator",
		field: "Service Provider",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "utility_account",
		field: "Utility Account",
		parameter_type_id: 11,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "refund_tid",
		field: "Refund TID",
		parameter_type_id: 11,
		pattern_format: "### ### ### #",
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "trackingnumber",
		field: "Tracking Number",
		parameter_type_id: 11,
		// display_media_id: DisplayMedia.BOTH,
	},
	// {
	// 	name: "client_ref_id",
	// 	field: "Client Ref. ID",
	// 	parameter_type_id: 11,
	// 	display_media_id: DisplayMedia.SCREEN,
	// },
	// {
	// 	name: "batch_id",
	// 	field: "Batch ID",
	// 	parameter_type_id: 11,
	// 	pattern_format: "#### #### #",
	// 	display_media_id: DisplayMedia.SCREEN,
	// },
	{
		name: "pinNo",
		field: "Pin#",
		parameter_type_id: 11,
		pattern_format: "### ### ### #",
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		// For UPI
		name: "vpa",
		field: "Customer VPA",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "user_name",
		field: "User Name",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "user_pan",
		field: "User Pan",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "reversal_narration",
		field: "Narration",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	// {
	// 	name: "merchant_name",
	// 	field: "Retailer Name",
	// 	parameter_type_id: 12,
	// 	// display_media_id: DisplayMedia.BOTH,
	// },
	// {
	// 	name: "merchant_mobile",
	// 	field: "Retailer Mobile",
	// 	parameter_type_id: 15,
	// 	// display_media_id: DisplayMedia.BOTH,
	// },
	{
		name: "gst",
		field: "GST",
		parameter_type_id: 10,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "loan_id",
		field: "Loan ID",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "order_id",
		field: "Order ID",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},
	{
		name: "partner_name",
		field: "Partner Name",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},

	// For DMT Transaction Insurance (IMPS): Insurance ID, Amount & Policy Link
	{
		name: "insurance_acquired",
		field: "Transaction Assured",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "insurance_amount",
		field: "Assurance Amount",
		parameter_type_id: 10,
		show: getViewComponent(10),
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "policy_number",
		field: "Policy Number",
		parameter_type_id: 12,
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "policy",
		field: "Download Policy",
		parameter_type_id: 31,
		// show: getViewComponent(31),
		// display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "refund_amount",
		field: "Refunded Amount",
		parameter_type_id: 10,
		show: getViewComponent(10),
		display_media_id: DisplayMedia.SCREEN,
	},
	// {
	// 	name: "plan_name",
	// 	field: "Plan Name",
	// 	parameter_type_id: 12,
	// 	display_media_id: DisplayMedia.SCREEN,
	// },

	//  Transaction + Updated DateTime: Should remain at the end...
	{
		name: "datetime",
		field: "Transaction Time",
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.PRINT,
	},
	{
		name: "updated_datetime",
		field: "Updated Time",
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.SCREEN,
	},
];
