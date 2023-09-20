import { Box, Text } from "@chakra-ui/react";
import { Headings } from "components";
import { TransactionTypes } from "constants";
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
	const [data, setData] = useState(null);
	const { accessToken } = useSession();

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionTypes.GET_ALL_QUERIES_FOR_ORG,
			},
			token: accessToken,
		})
			.then((data) => {
				const _data = data?.data?.csp_list ?? [];
				setData(_data);
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error("[QueryCenter] Get All Queries Error:", error);
			});
	}, []);

	return (
		<div {...rest}>
			<Headings title="Query Center" hasIcon={false} />
			<Box mx={{ base: "4", md: "0" }}>
				{data?.length > 0 ? (
					<QueryCenterTable
						pageNumber={pageNumber}
						setPageNumber={setPageNumber}
						data={data}
					/>
				) : (
					<Text textAlign="center" fontSize="sm">
						Nothing Found
					</Text>
				)}
			</Box>
		</div>
	);
};

export default QueryCenter;
