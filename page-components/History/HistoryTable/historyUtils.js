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
} from "helpers";

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

	if (column?.name) {
		value = item[column.name] || "";
	}

	if (column?.compute && typeof column.compute === "function") {
		value = column.compute(value, item, index);
	}

	switch (column?.show) {
		case "#":
			return serialNo;
		case "Tag":
			return getStatusStyle(value, "History");
		case "Modal":
			return getModalStyle(eko_code, account_status);
		case "ExpandButton":
			return getExpandIcoButton(expandedRow, index);
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
