import { useUser } from "contexts/UserContext";
import useRequest from "hooks/useRequest";

export const apisHelper = (tablename, postData) => {
	console.log("tablename", tablename);
	let transaction = {
		path: "/network/agents/transaction_history?",
		parameters: `initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_value=${postData?.searchValue}`,
	};
	console.log("transaction", transaction.parameters);
	let network = {
		path: "/network/agents?",
		parameters: `${postData}&initiator_id=9911572989&user_code=99029899&org_id=1&source=WLC&record_count=10&client_ref_id=202301031354123456`,
	};
	let accountStatement = {
		path: "/network/agents/transaction_history/recent_transaction?",
		parameters:
			"initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_value=9911572989",
	};
	let detiledstatement = {
		path: "/network/agents/transaction_history/recent_transaction/account_statement?",
		parameters:
			"initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_value=9911572989",
	};
	const { userData } = useUser();

	let endpoint;
	let parameters;

	console.log("tablename", tablename);
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
		case "accountStatement":
			endpoint = accountStatement.path;
			parameters = accountStatement.parameters;
			// + `&search_value=${searchValue}`
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
