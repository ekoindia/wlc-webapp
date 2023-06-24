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

		// if (row.tx_name) {
		// 	temp["trx_name"] = row.tx_name;
		// }
		// if (row.tid) {
		// 	temp["trx_id"] = row.tid;
		// }
		// if (row.datetime) {
		// 	temp["dateTime"] = row.datetime;
		// }
		// if (row.status) {
		// 	temp["status"] = row.status;
		// }
		// if (row.r_bal) {
		// 	temp["balance"] = row.r_bal;
		// }
		// if (row.trackingnumber) {
		// 	temp["trackingNumber"] = row.trackingnumber;
		// }
		// if (row.customer_mobile) {
		// 	temp["customerMobile"] = row.customer_mobile;
		// }
		// if (row.commission_earned) {
		// 	temp["commissionEarned"] = row.commission_earned;
		// }
		// if (row.tid) {
		// 	temp["tid"] = row.tid;
		// }
		// if (row.client_ref_id) {
		// 	temp["clientRefID"] = row.client_ref_id;
		// }
		// if (row.fee) {
		// 	temp["fee"] = row.fee;
		// }
		// return temp;
	});

	return processedData;
};

export const getFormattedDateAndTime = (datetimeStr) => {
	const datetime = new Date(datetimeStr);
	const formattedDate = String(datetime).slice(4, 15);
	const formattedTime = String(datetime).slice(16, 24);
	return {
		date: formattedDate,
		time: formattedTime,
	};
};

export const limitNarrationText = (txt, limit) => {
	return txt.length > limit ? txt.substr(0, limit - 1) + "…" : txt;
};

export const filterNarrationText = (txt) => {
	return txt ? txt.replace(/[0-9]+/g, "") : "";
};

export const getNarrationText = (row) => {
	return (
		limitNarrationText(filterNarrationText(row.customer_name), 20) + // Cust Name
		(row.customer_mobile ? " +91" + row.customer_mobile : "") + // Mobile
		(row.account || row.utility_account
			? " A/c:" + (row.account || row.utility_account)
			: "") + // Acc
		(row.bank
			? " " + limitNarrationText(filterNarrationText(row.bank), 30)
			: "") + // Bank
		(row.operator
			? " " + limitNarrationText(filterNarrationText(row.operator), 25)
			: "") + // Operator
		(row.client_ref_id ? " Cl.ID:" + row.client_ref_id : "") + // ClientRefID
		(row.reversal_narration ? " " + row.reversal_narration : "")
	); // Rev. Narration
};
