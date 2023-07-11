import { limitText } from "utils";

export const getCommissionsTableProcessedData = (data) => {
	const processedData = [];
	data?.map((row) => {
		const temp = {};
		if (row) {
			// temp["description"] = getNarrationText(dummyRowData);
			temp["description"] = getNarrationText(row);
		}
		if (row.tx_name) {
			temp["trx_name"] = row.tx_name;
		}
		if (row.tid) {
			temp["trx_id"] = row.tid;
		}
		if (row.datetime) {
			// const { date, time } = getFormattedDateAndTime(row.datetime);
			// temp["date"] = date;
			// temp["time"] = time;
			temp["dateTime"] = row.datetime;
		}
		if (row.amount_dr) {
			temp["amount"] = row.amount_dr;
			temp["trx_type"] = "DR";
		}
		if (row.amount_cr) {
			temp["amount"] = row.amount_cr;
			temp["trx_type"] = "CR";
		}
		if (row.status) {
			// temp["status_id"] = row.status_id;
			// temp["status"] =
			// 	row.status_id === 0
			// 		? row.status
			// 		: row.status_id === 1
			// 		? row.status
			// 		: "";
			temp["status"] = row.status;
		}
		if (row.r_bal) {
			temp["balance"] = row.r_bal;
		}

		if (row.trackingnumber) {
			temp["trackingNumber"] = row.trackingnumber;
		}

		if (row.customer_mobile) {
			temp["customerMobile"] = row.customer_mobile;
		}

		if (row.commission_earned) {
			temp["commissionEarned"] = row.commission_earned;
		}
		if (row.tid) {
			temp["tid"] = row.tid;
		}
		if (row.client_ref_id) {
			temp["clientRefID"] = row.client_ref_id;
		}
		if (row.fee) {
			temp["fee"] = row.fee;
		}

		processedData.push(temp);
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

export const filterNarrationText = (txt) => {
	return txt ? txt.replace(/[0-9]+/g, "") : "";
};

export const getNarrationText = (row) => {
	return (
		limitText(filterNarrationText(row.customer_name), 20) + // Cust Name
		(row.customer_mobile ? " +91" + row.customer_mobile : "") + // Mobile
		(row.account || row.utility_account
			? " A/c:" + (row.account || row.utility_account)
			: "") + // Acc
		(row.bank ? " " + limitText(filterNarrationText(row.bank), 30) : "") + // Bank
		(row.operator
			? " " + limitText(filterNarrationText(row.operator), 25)
			: "") + // Operator
		// (row.client_ref_id ? " Cl.ID:" + row.client_ref_id : "") + // ClientRefID
		(row.reversal_narration ? " " + row.reversal_narration : "")
	); // Rev. Narration
};
