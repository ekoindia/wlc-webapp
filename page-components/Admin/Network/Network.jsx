import { Box, Flex } from "@chakra-ui/react";
import { Button, Headings, SearchBar } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NetworkFilter, NetworkTable, SortAndFilterMobile } from ".";

/**
 * A My Network page-component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Network></Network>`
 */
const Network = () => {
	const router = useRouter();
	const [sort, setSort] = useState();
	const { accessToken } = useSession();
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState({});
	const [pageNumber, setPageNumber] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [networkData, setNetworkData] = useState([]);

	/* Filter */
	let postData = "";
	if (search) postData += `search_value=${search}`;
	if (sort) {
		postData += `&sortValue=${sort}`;
	}
	if (Object.keys(filter).length) {
		let filterKeys = Object.keys(filter);
		let filterQuery = "filter=true";
		filterKeys.forEach((ele) => {
			filterQuery += `&${ele}=${filter[ele]}`;
		});
		postData += filterQuery;
	}

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents?record_count=10&page_number=${pageNumber}&${postData}`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((res) => {
				let _networkData = res?.data;
				setNetworkData(_networkData);
			})
			.catch((err) => {
				console.log("[Network] error", err);
			})
			.finally(() => {
				setIsLoading(false);
			});

		return () => {
			// setNetworkData([]);
			setIsLoading(true);
		};
	}, [pageNumber, postData]);

	const totalRecords = networkData?.totalRecords;
	const agentDetails = networkData?.agent_details ?? [];

	return (
		<>
			<Headings
				title="My Network"
				hasIcon={false}
				propComp={
					<Button
						onClick={() =>
							router.push("/admin/my-network/profile/change-role")
						}
					>
						Change Roles
					</Button>
				}
			/>
			<Flex direction="column" gap="4" mx={{ base: "4", md: "0" }}>
				<Flex justify="space-between" align="center">
					<SearchBar
						value={search}
						setSearch={setSearch}
						minSearchLimit={10}
						maxSearchLimit={10}
					/>
					<Box display={{ base: "none", md: "flex" }}>
						<NetworkFilter {...{ filter, setFilter }} />
					</Box>
				</Flex>
				<NetworkTable
					{...{
						isLoading,
						totalRecords,
						agentDetails,
						setFilter,
						pageNumber,
						setPageNumber,
					}}
				/>
				<SortAndFilterMobile
					{...{
						filter,
						sort,
						setFilter,
						setSort,
					}}
				/>
			</Flex>
		</>
	);
};

export default Network;
