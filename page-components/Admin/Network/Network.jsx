import { Box, Flex } from "@chakra-ui/react";
import { Filter } from "components/Filter";
import { SearchBar } from "components/SearchBar";
import { Sort } from "components/Sort";
import { ResSortAndFilter } from "components/Sort/Sort";
import { useState } from "react";
import { NetworkTable } from "./NetworkTable";

/**
 * A <Network> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Network></Network>`
 */

const Network = ({ className = "", ...props }) => {
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required
	const [sortValue, setSortvalue] = useState();
	const [filter, setFilter] = useState();
	console.log("setFilter", setFilter);
	console.log("filter in network", filter);

	// const [status, setStatus] = useState("");
	const handleStatusClick = (value) => {
		setSortvalue(value);
	};
	//  console.log(sortValue,"sortValue");

	function onChangeHandler(e) {
		setSearchValue(e);
	}
	const onfilterHandler = (value) => {
		setFilter(value);
	};
	return (
		<>
			<Box w={"100%"} px={{ base: "16px", md: "initial" }}>
				<Box display={"flex"} justifyContent={"space-between"}>
					<SearchBar
						onChangeHandler={onChangeHandler}
						value={searchValue}
					/>

					<Flex
						display={{ base: "none", md: "flex" }}
						gap={{ sm: "5px", md: "20px", lg: "50px" }}
						align={"center"}
						justifyContent={"space-between"}
					>
						<Box>
							<Filter setFilter={setFilter} />
						</Box>
						<Box>
							<Sort handleStatusClick={handleStatusClick} />
						</Box>
					</Flex>
				</Box>

				<Box mt={{ base: "none", md: "20px" }}>
					<NetworkTable
						sortValue={sortValue}
						searchValue={searchValue}
						onfilterHandler={sortValue}
						filtervalues={filter}
					/>
				</Box>
				<ResSortAndFilter setFilter={setFilter} />
			</Box>
		</>
	);
};

export default Network;
