import { Box, Flex } from "@chakra-ui/react";
import { ResSortAndFilter } from "components/Sort/Sort";
import { useState } from "react";
import { NetworkTable } from ".";
import { Filter, SearchBar, Sort } from "..";

const Network = ({ className = "", ...props }) => {
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required

	function onChangeHandler(e) {
		setSearchValue(e);
	}

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
						gap={{ sm: "5px", md: "50px" }}
						align={"center"}
						justifyContent={"space-between"}
					>
						<Box>
							<Filter />
						</Box>
						<Box>
							<Sort />
						</Box>
					</Flex>
				</Box>

				<Box mt={{ base: "none", md: "20px" }}>
					<NetworkTable />
				</Box>
				<ResSortAndFilter />
			</Box>
		</>
	);
};

export default Network;
