import {
	getAddressWithTooltip,
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
	getShareMobileButton,
	getStatusStyle,
} from "helpers";
import { formatMobile } from "utils";

/**
 *
 * @param {*} item
 * @param {*} column
 * @param {number} index - Table row index
 * @param {number} serialNo
 * @param {string} tableName
 * @param expandedRow
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
	const agent_type = item?.agent_type;
	const account_status_id = item?.account_status_id;
	const mobile_number = item?.agent_mobile;
	const eko_code = item?.profile?.eko_code ?? [];
	const trx_type = item?.debit_credit || item?.trx_type;

	switch (column?.show) {
		case "#":
			return serialNo;
		case "Tag":
			return getStatusStyle(item[column.name], tableName);
		case "Modal":
			return getModalStyle(
				mobile_number,
				eko_code,
				account_status_id,
				agent_type
			);
		case "ExpandButton":
			return getExpandIcoButton(expandedRow, index);
		case "Address":
			return getAddressWithTooltip(item[column.name]);
		case "Location":
			return getLocationStyle(item[column.name]);
		case "Avatar":
			return getNameStyle(item[column.name]);
		case "Arrow":
			return getArrowStyle();
		case "Amount":
			return getAmountStyle(item[column.name]);
		case "Payment":
			return getPaymentStyle(item[column.name], trx_type);
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
