import { Box, Flex, HStack, useMediaQuery } from "@chakra-ui/react";
import { ResSortAndFilter } from "components/Sort/Sort";
import useRequest from "hooks/useRequest";
import { useState } from "react";
import { NetworkTable } from ".";
import { Filter, SearchBar, Sort } from "..";

const Network = ({ className = "", ...props }) => {
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required
	const [isMobileScreen] = useMediaQuery("(max-width: 440px)");
	let data = useRequest({
		baseUrl: "https://jsonplaceholder.typicode.com/posts",
	});
	console.log(data.data);

	function onChangeHandler(e) {
		setSearchValue(e);
	}

	return (
		<>
			<Box w={"100%"}>
				<Box display={"flex"} justifyContent={"space-between"}>
					<SearchBar
						onChangeHandler={onChangeHandler}
						value={searchValue}
					/>

					{!isMobileScreen && (
						<Flex gap={"20px"} align={"center"}>
							<Box>
								<Filter />
							</Box>
							<Box>
								<Sort />
							</Box>
						</Flex>
					)}
				</Box>

				<Box>
					<NetworkTable />
				</Box>
				<ResSortAndFilter />
			</Box>
		</>
	);
};

export default Network;
