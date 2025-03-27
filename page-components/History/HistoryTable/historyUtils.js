import { DisplayMedia } from "constants";

import {
	getAmountStyle,
	getArrowStyle,
	getDateTimeView,
	getDateView,
	getDescriptionStyle,
	getExpandIcoButton,
	getLocationStyle,
	getModalStyle,
	getNameStyle,
	getPaymentStyle,
	getStatusStyle,
	getTrxnSummaryStyle,
} from "helpers";

/**
 * Returns the default view component for a given parameter type id.
 * TODO: Remove "view" components in favor of <Value> component that directly uses the parameter-type-id. Allow custom value-renderer components to be passed to <Value> component (or, prefix/postfix components).
 * @param {number} parameter_type_id
 * @returns
 */
const getViewComponent = (parameter_type_id) => {
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
 *
 * @param {*} item
 * @param {*} column
 * @param {number} index - Table row index
 * @param {number} serialNo
 * @param expandedRow
 * @param icon
 * @param hue
 * @returns
 */
export const prepareTableCell = (
	item,
	column,
	index,
	serialNo,
	expandedRow,
	icon,
	hue
) => {
	const account_status = item?.account_status;
	const eko_code = item?.profile?.eko_code ?? [];
	const trx_type = item?.debit_credit || item?.trx_type;

	let value = "";

	if (!(item && column)) {
		return "";
	}

	if (column.name) {
		value = item[column.name] || "";
	}

	// If a component to render the value is not provided, use the component based on the parameter type
	let viewType = column.show;
	if (!viewType && column.parameter_type_id) {
		viewType = getViewComponent(column.parameter_type_id);
	}

	switch (viewType) {
		case "#":
			return serialNo;
		case "TrxnSummary":
			return getTrxnSummaryStyle(item, icon, hue);
		case "Tag":
			return getStatusStyle(value, "History");
		case "Modal":
			return getModalStyle(eko_code, account_status);
		case "ExpandButton":
			return getExpandIcoButton(expandedRow, index, column.center);
		case "IconButton":
			return getLocationStyle(
				value,
				item?.address_details?.lattitude,
				item?.address_details?.longitude
			);
		case "Avatar":
			// Name with avatar
			return getNameStyle(value, icon, hue);
		case "Arrow":
			return getArrowStyle();
		case "Amount":
			return getAmountStyle(value);
		case "Payment":
			return getPaymentStyle(value, trx_type);
		case "Description":
			return getDescriptionStyle(value);
		case "Date":
			return getDateView(value);
		case "DateTime":
			return getDateTimeView(value);
		default:
			return value;
	}
};

/**
 * Show the column on screen?
 * @param {number} display_media_id
 * @returns
 */
export const showOnScreen = (display_media_id) => {
	display_media_id = display_media_id ?? DisplayMedia.BOTH;
	return (
		display_media_id === DisplayMedia.SCREEN ||
		display_media_id === DisplayMedia.BOTH
	);
};

/**
 * Show the column in print?
 * @param {number} display_media_id
 * @returns
 */
export const showInPrint = (display_media_id) => {
	display_media_id = display_media_id ?? DisplayMedia.BOTH;
	return (
		display_media_id === DisplayMedia.PRINT ||
		display_media_id === DisplayMedia.BOTH
	);
};

/**
 * Convert a history row into sharable text message
 * @param {Array} extraColumns
 * @param {object} item	The current history row name/value pairs
 * @returns {string} The sharable text message
 */
export const generateShareMessage = (extraColumns, item) => {
	let message = "";
	extraColumns.forEach((column) => {
		let value = item[column.name];
		if (
			typeof value !== "undefined" &&
			value !== null &&
			value != "" &&
			showInPrint(column.display_media_id)
		) {
			message += `${column.label}: ${value}\n`;
		}
	});
	return message;
};
