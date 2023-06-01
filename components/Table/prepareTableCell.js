import {
	getAmountStyle,
	getArrowStyle,
	getDescriptionStyle,
	getExpandIcoButton,
	getLocationStyle,
	getModalStyle,
	getNameStyle,
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
			return getAmountStyle(item[column.name], item.trx_type);
		case "Description":
			return getDescriptionStyle(item[column.name]);
		default:
			return item[column.name];
	}
};
