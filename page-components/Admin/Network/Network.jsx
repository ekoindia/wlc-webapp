import { Box, Flex } from "@chakra-ui/react";
import { Filter } from "components/Filter";
import { SearchBar } from "components/SearchBar";
import { Sort } from "components/Sort";
import { ResSortAndFilter } from "components/Sort/Sort";
import { useUser } from "contexts/UserContext";
import useRequest from "hooks/useRequest";
import { useEffect, useState } from "react";
import { NetworkTable } from "./NetworkTable";

/**
 * A <Network> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Network></Network>`
 */

const Network = ({ className = "", ...props }) => {
	const [search, setSearch] = useState(""); 
	const [sort, setSort] = useState();
	console.log("sortValue", sort);
	const [filter, setFilter] = useState({});

	const [pageNumber, setPageNumber] = useState(1);
	const { userData } = useUser();

	const handleStatusClick = (value) => {
		setSort(value);
	};

	console.log("filter", filter);
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

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents?initiator_id=9911572989&user_code=99029899&org_id=1&source=WLC&record_count=10&client_ref_id=202301031354123456&page_number=${pageNumber}&${postData}`,
		"tf-req-method": "GET",
	};
	const { data, error, isLoading, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
		authorization: `Bearer ${userData.access_token}`,
	});

	useEffect(() => {
		mutate(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
			headers
		);
	}, [pageNumber, headers["tf-req-uri"]]);

	const totalRecords = data?.data?.TotalRecords;
	const agentDetails = data?.data?.agent_details ?? [];

	// console.log("onfilterHandler", onfilterHandler);
	return (
		<>
			<Box w={"100%"} px={{ base: "16px", md: "initial" }}>
				<Box display={"flex"} justifyContent={"space-between"}>
					<SearchBar value={search} setSearch={setSearch} />
					<Flex
						display={{ base: "none", md: "flex" }}
						gap={{ sm: "5px", md: "20px", lg: "50px" }}
						align={"center"}
						justifyContent={"space-between"}
					>
						<Box>
							<Filter filter={filter} setFilter={setFilter} />
						</Box>
						<Box>
							<Sort sort={sort} setSort={setSort} />
						</Box>
					</Flex>
				</Box>

				<Box mt={{ base: "none", md: "20px" }}>
					<NetworkTable
						// sortValue={sortValue}
						// searchValue={searchValue}
						// onfilterHandler={sortValue}
						// filter={filter}
						setFilter={setFilter}
						pageNumber={pageNumber}
						totalRecords={totalRecords}
						agentDetails={agentDetails}
						setPageNumber={setPageNumber}
					/>
				</Box>
				<ResSortAndFilter
					filter={filter}
					sort={sort}
					setFilter={setFilter}
					setSort={setSort}
				/>
			</Box>
		</>
	);
};

export default Network;
