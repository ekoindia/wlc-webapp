import { DisplayMedia } from "constants";
import { getFirstWord, limitText } from "utils";

/**
 * Prepare each row of the Transaction History table data (for sellers & distributors) by adding new generated columns like description, amount, trx_type, etc.
 * @param {Array} data the data array of the Transaction History table
 * @returns the processed data array
 */
export const getHistoryTableProcessedData = (data) => {
	const processedData = data?.map((row) => {
		row.description = getNarrationText(row);
		if (row.amount_dr) {
			row.amount = row.amount_dr;
			row.trx_type = "DR";
		} else if (row.amount_cr) {
			row.amount = row.amount_cr;
			row.trx_type = "CR";
		}
		return row;
	});

	return processedData;
};

export const filterNarrationText = (txt) => {
	return txt ? txt.replace(/[0-9]+/g, "").trim() : "";
};

/**
 * Get the narration text for a transaction for the Transaction History table
 * @param {object} row A single transaction object
 * @returns
 */
export const getNarrationText = (row) => {
	let narration = "";

	// Add customer's first name
	if (row.customer_name) {
		narration += limitText(
			getFirstWord(filterNarrationText(row.customer_name)),
			15
		);
	}

	// Add customer's mobile number
	if (row.customer_mobile) {
		narration += " +91" + row.customer_mobile;
	}

	// Add customer's bank name
	if (row.bank) {
		narration += " " + limitText(filterNarrationText(row.bank), 30);
	}

	// Add customer's operator name
	if (row.operator) {
		narration += " " + limitText(filterNarrationText(row.operator), 20);
	}

	// Add customer's reversal-narration (only if previous info not available)
	if (row.reversal_narration && !narration) {
		narration += " " + limitText(row.reversal_narration, 150);
	}

	return narration;

	// return (
	// 	limitText(
	// 		getFirstWord(filterNarrationText(row.customer_name)),
	// 		20
	// 	) + // Cust Name
	// 	(row.customer_mobile ? " +91" + row.customer_mobile : "") + // Mobile
	// 	(row.account || row.utility_account
	// 		? " A/c:" + (row.account || row.utility_account)
	// 		: "") + // Acc
	// 	(row.bank
	// 		? " " + limitText(filterNarrationText(row.bank), 30)
	// 		: "") + // Bank
	// 	(row.operator
	// 		? " " + limitText(filterNarrationText(row.operator), 25)
	// 		: "") + // Operator
	// 	(row.client_ref_id ? " Cl.ID:" + row.client_ref_id : "") + // ClientRefID
	// 	(row.reversal_narration ? " " + row.reversal_narration : "") // Rev. Narration
	// );
};

/**
 * Processes transaction data to extract additional metadata and generate history parameter metadata.
 * @param {Array<object>} trxn_data - The transaction data array.
 * @param {Array<object>} history_parameter_metadata - The history parameter metadata array.
 * @returns {object} - An object containing updated transaction data and history parameter metadata.
 */
export const getAdditionalTransactionMetadata = (
	trxn_data,
	history_parameter_metadata
) => {
	const _history_parameter_metadata = history_parameter_metadata ?? [];
	const _trxn_data = trxn_data ?? [];
	_trxn_data?.forEach((item) => {
		const trxn_additional_data = item?.["transaction_additional_metadata"];
		if (trxn_additional_data) {
			for (let key in trxn_additional_data) {
				// adding key value in data object
				item[key] = trxn_additional_data[key]["value"];

				//generate parameter metadata based on type
				const parameterMetadata = generateParameterMetadata(
					key,
					trxn_additional_data[key]["type"]
				);

				// Push only if parameter metadata not present
				if (
					!_history_parameter_metadata.some(
						(meta) => meta.name === parameterMetadata.name
					)
				) {
					_history_parameter_metadata.push(parameterMetadata);
				}
			}

			// removing "transaction_additional_metadata" as not needed after flattening
			delete item["transaction_additional_metadata"];
		}
	});

	return {
		history_parameter_metadata: _history_parameter_metadata,
		trxn_data: _trxn_data,
	};
};

/**
 * Generates parameter metadata based on the key and type.
 * @param {string} key - The parameter key.
 * @param {string} type - The parameter type.
 * @returns {object} - The generated parameter metadata.
 */
const generateParameterMetadata = (key, type) => {
	let _parameterMetadata = {};

	_parameterMetadata.name = key;
	_parameterMetadata.label = convertKeyToLabel(key);
	_parameterMetadata.parameter_type_id = type;
	_parameterMetadata.display_media_id = DisplayMedia.BOTH;

	return _parameterMetadata;
};

/**
 * Converts a key string to a readable label format.
 * @param {string} key - The key string to convert.
 * @returns {string} - The converted label string.
 */
const convertKeyToLabel = (key) => {
	return key
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (str) => str.toUpperCase())
		.replace(/_./g, (str) => " " + str[1].toUpperCase());
};
