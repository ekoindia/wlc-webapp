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
		case 10:
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
 *
 * name - Parameter name returned from the server for this field
 * label - Label to show in the table header
 * sorting - If true, this column is sortable
 * show - The DataType which determines which custom component is used to render this field
 * parameter_type_id - The data-type of the parameter
 * display_media_id - The media type to display this field on (screen, print, both)
 * pattern_format - The format to use for this field (if applicable)
 * compute - A function to compute the value of this field (if applicable). The compute function takes the value of the field, the row data, and the index of the row as arguments & returns the computed value.
 * case_id - Whether to convert the field value to a specific case (1: uppercase, 2: lowercase, 3: titlecase)
 * visible_in_table - Whether to show this field in the table column. If false, the field will be hidden in the table column but will still be available in the expanded row.
 * visible_in_card - Whether to show this field in the small-screen card. If false, the field will be hidden in the card but will still be available in the expanded view.
 * hide_by_default - Whether to hide this field by default in the table column. Only applicable for fields that are visible_in_table. If true, the field will be hidden in the table column by default but can be toggled on by the user.
 * aggregate - What kind of aggregation to perform on this field (sum, avg, min, max, count) at the end of the table. Possible values: "sum", "avg", "min", "max", "count", "first", "last", "opening", "closing".
 * bg - Custom background color of the column.
 * alternateBg - Custom background color of the column for alternate rows.
 */
export const historyParametersMetadata = [
	{
		name: "summary",
		label: "Summary",
		sorting: true,
		show: "TrxnSummary",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
	},
	{
		name: "description",
		label: "Description",
		show: "Description",
		parameter_type_id: 12,
		visible_in_table: true,
		hide_by_default: true,
	},
	{
		name: "amount",
		label: "Transaction\nAmount",
		sorting: true,
		show: "Payment",
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
		aggregate: "sum",
	},
	{
		name: "debit",
		label: "Debit",
		desc: "The total amount debited from the E-value. This may include the debited transaction amount, fee, TDS, and GST, as applicable.",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
		aggregate: "sum",
		// bg: "#f8d7da",
		// alternateBg: "#f5c6cb",
		bg: "#fdf5f6",
		alternateBg: "#fbe6e8",
		compute: (value, row, _index) => {
			if (row.response_status_id === 1) {
				// For failed transactions, show the debit amount as 0
				// TODO: Check if this is the correct behavior. Do we still deduct fee etc?
				return "";
			}

			return (
				(row.amount_dr > 0 ? row.amount_dr : 0) +
					(row.fee > 0 ? row.fee : 0) +
					(row.tds > 0 ? row.tds : 0) +
					(row.gst > 0 ? row.gst : 0) +
					(row.insurance_amount > 0 ? row.insurance_amount : 0) +
					(row.eko_gst > 0 ? row.eko_gst : 0) || ""
			);
		},
	},
	{
		name: "credit",
		label: "Credit",
		desc: "The total amount credited to the E-value. This may include the credited transaction amount & the commission earned, if applicable.",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
		aggregate: "sum",
		// bg: "#e3ffec",
		// alternateBg: "#c6ffd9",
		bg: "#f5fff8",
		alternateBg: "#e3ffec",
		compute: (value, row, _index) => {
			if (row.response_status_id === 1) {
				// For failed transactions, show the debit amount as 0
				// TODO: Check if this is the correct behavior. Can we still credit in failed cases?
				return "";
			}

			return (
				(row.amount_cr > 0 ? row.amount_cr : 0) +
					(row.commission_earned > 0 ? row.commission_earned : 0) +
					(row.eko_service_charge > 0 ? row.eko_service_charge : 0) +
					(row.bonus > 0 ? row.bonus : 0) || ""
			);
		},
	},
	{
		name: "r_bal",
		label: "Running\nBalance",
		show: getViewComponent(9),
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
		aggregate: "closing",
	},
	{
		name: "tid",
		label: "TID",
		sorting: true,
		parameter_type_id: 11,
		pattern_format: "#### #### #",
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
		hide_by_default: true,
	},
	{
		name: "datetime",
		label: "Date & Time",
		sorting: true,
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
	},
	{
		name: "status",
		label: "Status",
		show: "Tag",
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
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
		display_media_id: DisplayMedia.BOTH,
	},
	{
		name: "fee",
		label: "Charges",
		show: getViewComponent(9),
		parameter_type_id: 9,
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
		name: "gst",
		label: "GST",
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
	}, // For Enterprise (API Partners) only
	{
		name: "tid",
		label: "TID",
		parameter_type_id: 11,
		pattern_format: "#### #### #",
		display_media_id: DisplayMedia.BOTH,
	},

	{
		name: "settlement_type",
		label: "Settlement Type",
		show: "Settlement Type",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
	},

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
	// {
	// 	name: "refund_amount",
	// 	label: "Refunded Amount",
	// 	parameter_type_id: 10,
	// 	show: getViewComponent(10),
	// 	display_media_id: DisplayMedia.SCREEN,
	// },
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
 * Parameters to show in the Network Transactions table (for admins)
 * MARK: Network History Items
 *
 * name - Parameter name returned from the server for this field
 * label - Label to show in the table header
 * sorting - If true, this column is sortable
 * show - The DataType which determines which custom component is used to render this field
 * parameter_type_id - The data-type of the parameter
 * display_media_id - The media type to display this field on (screen, print, both)
 * pattern_format - The format to use for this field (if applicable)
 * compute - A function to compute the value of this field (if applicable). The compute function takes the value of the field, the row data, and the index of the row as arguments & returns the computed value.
 * case_id - Whether to convert the field value to a specific case (1: uppercase, 2: lowercase, 3: titlecase)
 * visible_in_table - Whether to show this field in the table column. If false, the field will be hidden in the table column but will still be available in the expanded row.
 * visible_in_card - Whether to show this field in the small-screen card. If false, the field will be hidden in the card but will still be available in the expanded view.
 * hide_by_default - Whether to hide this field by default in the table column. Only applicable for fields that are visible_in_table. If true, the field will be hidden in the table column by default but can be toggled on by the user.
 * aggregate - What kind of aggregation to perform on this field (sum, avg, min, max, count) at the end of the table. Possible values: "sum", "avg", "min", "max", "count", "first", "last", "opening", "closing", "total".
 */
export const networkHistoryParametersMetadata = [
	{
		name: "agent_name",
		label: "Agent",
		sorting: true,
		show: "Avatar",
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
	},
	{
		name: "agent_type",
		label: "Agent Type",
		sorting: true,
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
	},
	{
		name: "agent_code",
		label: "Agent Code",
		sorting: true,
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
	},
	{
		name: "tx_name",
		label: "Transaction Type",
		sorting: true,
		parameter_type_id: 12,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
	},
	{
		name: "amount",
		label: "Amount",
		sorting: true,
		show: "Payment",
		parameter_type_id: 9,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
	},
	{
		name: "datetime",
		label: "Date & Time",
		sorting: true,
		show: getViewComponent(14),
		parameter_type_id: 14,
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
	},
	{
		name: "status",
		show: "Tag",
		display_media_id: DisplayMedia.SCREEN,
		visible_in_table: true,
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
		name: "agent_cell",
		label: "Agent's Mobile No.",
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
