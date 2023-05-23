import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";
import { QueryCenterTable } from ".";

/**
 * A <QueryCenter> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<QueryCenter></QueryCenter>` TODO: Fix example
 */
const QueryCenter = ({ prop1, ...rest }) => {
	const [pageNumber, setPageNumber] = useState(1);
	const { accessToken } = useSession();

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL, Endpoints.TRANSACTION, {
			// headers: {
			// 	"tf-req-uri-root-path": "/ekoicici/v2",
			// 	"tf-req-uri": "/request",
			// 	"tf-req-method": "GET",
			// 	// "Content-Type": "application/x-www-form-urlencoded",
			// },
			body: {
				interaction_type_id: 692,
				// initiator_id: 7337628689,
				// customer_id: 7337628689,
				// user_code: 99013036,
				// locale: "en",
			},
			token: accessToken,
		}).then((data) => {
			console.log("data", data);
		});
	}, []);

	// tf-req-uri-root-path: /ekoicici/v2
	// tf-req-uri:/request
	// tf-req-method: GET

	//     curl --location 'http://dev.simplibank.eko.in:25008/ekoicici/v2/request' \
	// > --header 'Content-Type: application/x-www-form-urlencoded' \
	// > --data-urlencode 'customer_id=7337628689' \
	// > --data-urlencode 'user_code=99013036' \
	// > --data-urlencode 'locale=en' \
	// > --data-urlencode 'initiator_id=7337628689' \
	// > --data-urlencode 'interaction_type_id=692'

	return (
		<div {...rest}>
			<QueryCenterTable
				totalRecords={200}
				pageNumber={pageNumber}
				setPageNumber={setPageNumber}
			/>
		</div>
	);
};

export default QueryCenter;
