import { Box, Text } from "@chakra-ui/react";
import { Headings } from "components";
import { TransactionTypes } from "constants";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";
import { QueryCenterTable } from ".";

/**
 * A <QueryCenter> page component to show a list of queries/tickets raised by the admin or its network.
 * @param {object} prop Properties passed to the component
 * @param {...*} rest Rest of the props passed to this component.
 */
const QueryCenter = ({ ...rest }) => {
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const { accessToken } = useSession();

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionTypes.GET_ALL_QUERIES_FOR_ORG,
			},
			token: accessToken,
		})
			.then((res) => {
				const _data = res?.data?.csp_list ?? [];
				if (data === null) {
					setData(_data);
					console.log("[QueryCenter] Data loaded:", _data, res);
				} else {
					console.error(
						"[QueryCenter] Data already loaded:",
						_data,
						res
					);
				}
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error("[QueryCenter] Get All Queries Error:", error);
			})
			.finally(() => {
				setLoading(false);
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
						{loading ? "Loading Tickets..." : "Nothing Found"}
					</Text>
				)}
			</Box>
		</div>
	);
};

export default QueryCenter;
