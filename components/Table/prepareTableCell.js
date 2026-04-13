import {
	getAddressWithTooltip,
	getAmountStyle,
	getArrowStyle,
	getDateTimeView,
	getDateView,
	getDescriptionStyle,
	getExpandIcoButton,
	getLocationStyle,
	getShareMobileButton,
	getStatusStyle,
} from "helpers";
import { formatMobile } from "utils";

/**
 * Prepares the content for a table cell based on the column configuration.
 * @param {object} item - The data item for the current row
 * @param {object} column - The column configuration object
 * @param {number} index - Table row index
 * @param {number} serialNo - The serial number for the row
 * @param {string} tableName - The name of the table
 * @param {number} expandedRow - The index of the currently expanded row
 * @returns {React.ReactNode} The formatted React node for the cell
 */
export const prepareTableCell = (
	item,
	column,
	index,
	serialNo,
	tableName,
	expandedRow
) => {
	// Delegate custom rendering directly to the column definition
	if (typeof column?.render === "function") {
		return column.render(item, column, index, serialNo, expandedRow);
	}

	switch (column?.show) {
		case "#":
			return serialNo;
		case "Tag":
			return getStatusStyle(item[column.name], tableName);
		case "ExpandButton":
			return getExpandIcoButton(expandedRow, index);
		case "Address":
			return getAddressWithTooltip(item[column.name]);
		case "Location":
			return getLocationStyle(item[column.name]);
		case "Arrow":
			return getArrowStyle();
		case "Amount":
			return getAmountStyle(item[column.name]);
		case "Mobile":
			return formatMobile(item[column.name]);
		case "Description":
			return getDescriptionStyle(item[column.name]);
		case "Date":
			return getDateView(item[column.name]);
		case "DateTime":
			return getDateTimeView(item[column.name]);
		case "ShareMobile":
			return getShareMobileButton(item[column.name], column?.meta || {});
		default:
			return item[column.name];
	}
};
