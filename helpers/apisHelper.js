import useRequest from "hooks/useRequest";
import { useUser } from "contexts/UserContext";
let transaction = {
	path: "/network/agents/transaction_history/recent_transaction?",
	parameters:
		"initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_value=9911572989",
};

let network = {
	path: "/network/agents?",
	parameters:
		"initiator_id=9911572989&user_code=99029899&org_id=1&source=WLC&record_count=10&client_ref_id=202301031354123456",
};
let recentTransaction = {
	path: "/network/agents/transaction_history/recent_transaction?",
	parameters:
		"initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_value=9911572989",
};
let account_statement = {
	path: "/network/agents/transaction_history/recent_transaction/account_statement?",
	parameters:
		"initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_value=9911572989",
};
export const apisHelper = (tablename, searchValue) => {
	const { userData } = useUser();

	let endpoint;
	let parameters;

	switch (tablename) {
		case "Network":
			endpoint = network.path;
			parameters = network.parameters;
			break;
		case "Transaction":
			endpoint = transaction.path;
			parameters = transaction.parameters;
			// + `&search_value=${searchValue}`
			break;
		case "recentTransaction":
			endpoint = recentTransaction.path;
			parameters = recentTransaction.parameters;
			break;
		case "account_statement":
			endpoint = account_statement.path;
			parameters = account_statement.parameters;
			break;
		default:
			throw new Error(`Invalid tablename: ${tablename}`);
	}

	const data = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: {
			"tf-req-uri-root-path": "/ekoicici/v1",
			"tf-req-uri": endpoint + parameters,
			"tf-req-method": "GET",
			authorization: `Bearer ${userData.access_token}`,
		},
	});

	return data;
};
