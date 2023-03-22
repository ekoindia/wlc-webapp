import useRequest from "hooks/useRequest";

let transaction = {
    path: "/network/agents/transaction_history/recent_transaction?",
    parameters: "initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_value=9911572989",
};

let network = {
    path: "/network/agents?",
    parameters: "initiator_id=9911572989&user_code=99029899&org_id=1&source=WLC&record_count=10&client_ref_id=202301031354123456",
};

export const apisHelper = (tablename) => {
    console.log(tablename, "table name");

    let endpoint;
    let parameters;

    switch (tablename) {
        case "network":
            endpoint = network.path;
            parameters = network.parameters;
            break;
        case "transaction":
            endpoint = transaction.path;
            parameters = transaction.parameters;
            break;
        default:
            throw new Error(`Invalid tablename: ${tablename}`);
    }

    const data = useRequest({
        method: "POST",
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + '/transactions/do',
        headers: {
            "tf-req-uri-root-path": "/ekoicici/v1",
            "tf-req-uri": endpoint + parameters,
            "tf-req-method": "GET",
            "authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiLTEiLCJyb2xlX2xpc3QiOlstNV0sInVzZXJfdHlwZSI6Ii0xIiwiZWtvX3VzZXJfaWQiOiIiLCJlbWFpbCI6IiIsImNvZGUiOjAsInpvaG9faWQiOiIiLCJ1c2VyX2lkZW50aXR5X3R5cGUiOiJtb2JpbGVfbnVtYmVyIiwidXNlcl9pZGVudGl0eSI6IjY2NjQ2NjQ0NjQiLCJpYXQiOjE2NzkzODk4OTYsImV4cCI6MTY4MDQ2OTg5NiwiYXVkIjoiLTEiLCJpc3MiOiJjb25uZWN0LmVrbyJ9.Sn9PeKznuA5lDfZUNwldI0NcSTYAzzO1UcliYujX3SA`
        },
    });

    return data;
};
