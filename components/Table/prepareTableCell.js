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
 * @param {string} tableName
 * @returns
 */
export const prepareTableCell = (
	item,
	column,
	index,
	serialNo,
	tableName,
	expandedRow
) => {
	const account_status = item?.account_status;
	const eko_code = item?.profile?.eko_code ?? [];
	const trx_type = item?.debit_credit || item?.trx_type;
	switch (column?.show) {
		case "#":
			return serialNo;
		case "Tag":
			return getStatusStyle(item[column.name], tableName);
		case "Modal":
			return getModalStyle(eko_code, account_status);
		case "ExpandButton":
			return getExpandIcoButton(expandedRow, index);
		case "IconButton":
			return getLocationStyle(
				item[column.name],
				item?.address_details?.lattitude,
				item?.address_details?.longitude
			);
		case "Avatar":
			return getNameStyle(item[column.name]);
		case "Arrow":
			return getArrowStyle();
		case "Amount":
			return getAmountStyle(item[column.name]);
		case "Payment":
			return getPaymentStyle(item[column.name], trx_type);
		case "Description":
			return getDescriptionStyle(item[column.name]);
		case "Date":
			return getDateView(item[column.name]);
		case "DateTime":
			return getDateTimeView(item[column.name]);
		default:
			return item[column.name];
	}
};
