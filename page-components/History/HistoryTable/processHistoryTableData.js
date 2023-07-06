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

// export const getFormattedDateAndTime = (datetimeStr) => {
// 	const datetime = new Date(datetimeStr);
// 	const formattedDate = String(datetime).slice(4, 15);
// 	const formattedTime = String(datetime).slice(16, 24);
// 	return {
// 		date: formattedDate,
// 		time: formattedTime,
// 	};
// };

export const limitNarrationText = (txt, limit) => {
	return txt.length > limit ? txt.substr(0, limit - 1) + "…" : txt;
};

export const filterNarrationText = (txt) => {
	return txt ? txt.replace(/[0-9]+/g, "").trim() : "";
};

const getFirstWord = (txt) => {
	return txt ? txt.split(" ")[0] : "";
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
		narration += limitNarrationText(
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
		narration +=
			" " + limitNarrationText(filterNarrationText(row.bank), 30);
	}

	// Add customer's operator name
	if (row.operator) {
		narration +=
			" " + limitNarrationText(filterNarrationText(row.operator), 20);
	}

	// Add customer's reversal-narration (only if previous info not available)
	if (row.reversal_narration && !narration) {
		narration += " " + limitNarrationText(row.reversal_narration, 50);
	}

	return narration;

	// return (
	// 	limitNarrationText(
	// 		getFirstWord(filterNarrationText(row.customer_name)),
	// 		20
	// 	) + // Cust Name
	// 	(row.customer_mobile ? " +91" + row.customer_mobile : "") + // Mobile
	// 	(row.account || row.utility_account
	// 		? " A/c:" + (row.account || row.utility_account)
	// 		: "") + // Acc
	// 	(row.bank
	// 		? " " + limitNarrationText(filterNarrationText(row.bank), 30)
	// 		: "") + // Bank
	// 	(row.operator
	// 		? " " + limitNarrationText(filterNarrationText(row.operator), 25)
	// 		: "") + // Operator
	// 	(row.client_ref_id ? " Cl.ID:" + row.client_ref_id : "") + // ClientRefID
	// 	(row.reversal_narration ? " " + row.reversal_narration : "") // Rev. Narration
	// );
};
