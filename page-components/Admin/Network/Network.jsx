import { Box, Flex } from "@chakra-ui/react";
import { Button, Headings, SearchBar } from "components";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NetworkFilter, NetworkTable, SortAndFilterMobile } from ".";

/**
 * A <Network> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Network></Network>`
 */
const Network = () => {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState();
	const [filter, setFilter] = useState({});
	const [pageNumber, setPageNumber] = useState(1);
	const router = useRouter();

	/* Filter */
	let postData = "";
	if (search) postData += `search_value=${search}&`;
	if (sort) {
		postData += `sortValue=${sort}&`;
	}
	if (Object.keys(filter).length) {
		let filterKeys = Object.keys(filter);
		let filterQuery = "filter=true";
		filterKeys.forEach((ele) => {
			filterQuery += `&${ele}=${filter[ele]}`;
		});
		postData += filterQuery;
	}

	/* API CALLING */

	const headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents?record_count=10&page_number=${pageNumber}&${postData}`,
		"tf-req-method": "GET",
	};
	const { data, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
	});

	useEffect(() => {
		mutate(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
			headers
		);
	}, [pageNumber, postData]);

	const totalRecords = data?.data?.totalRecords;
	const agentDetails = data?.data?.agent_details ?? [];
	const dataLength = agentDetails.length;

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
			<Box w={"100%"} px={{ base: "16px", md: "initial" }}>
				{dataLength > 0 ? (
					<Flex justify="space-between" align="center">
						<SearchBar
							value={search}
							setSearch={setSearch}
							minSearchLimit={10}
							maxSearchLimit={10}
						/>
						<Flex
							display={{ base: "none", md: "flex" }}
							gap={{ base: "5px", md: "20px", lg: "50px" }}
							align="center"
							justifyContent="space-between"
						>
							<NetworkFilter
								filter={filter}
								setFilter={setFilter}
							/>
							{/* <NetworkSort sort={sort} setSort={setSort} /> */}
						</Flex>
					</Flex>
				) : null}
				{dataLength > 0 ? (
					<Box mt="20px">
						<NetworkTable
							setFilter={setFilter}
							pageNumber={pageNumber}
							totalRecords={totalRecords}
							agentDetails={agentDetails}
							setPageNumber={setPageNumber}
						/>
					</Box>
				) : null}
				{dataLength > 0 ? (
					<SortAndFilterMobile
						filter={filter}
						sort={sort}
						setFilter={setFilter}
						setSort={setSort}
					/>
				) : null}
			</Box>
		</>
	);
};

export default Network;
