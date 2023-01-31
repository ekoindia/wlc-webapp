import { Box, Flex } from "@chakra-ui/react";
import useRequest from "hooks/useRequest";
import { useState } from "react";
import { NetworkTable } from ".";
import { Filter, SearchBar, Sort } from "..";

const Network = ({ className = "", ...props }) => {
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required

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
				<Box
					display={"flex"}
					justifyContent={"space-between"}
					mt="20px"
				>
					<SearchBar
						onChangeHandler={onChangeHandler}
						value={searchValue}
					/>
					<Flex gap="50px">
						<Box>
							<Filter />
						</Box>
						<Box>
							<Sort />
						</Box>
					</Flex>
				</Box>
				<Box mt={"10px"}>
					<NetworkTable />
				</Box>
			</Box>
		</>
	);
};

export default Network;
