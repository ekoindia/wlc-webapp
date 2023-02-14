import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TransactionHistoryTable } from ".";
import { SearchBar } from "..";

const TransactionHistory = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required

	function onChangeHandler(e) {
		setSearchValue(e);
	}

	return (
		<Box w="100%" px={{ base: "16px", md: "initial" }} pb={"20px"}>
			<Box>
				<SearchBar
					onChangeHandler={onChangeHandler}
					value={searchValue}
				/>
			</Box>
			<Box>
				<TransactionHistoryTable />
			</Box>
		</Box>
	);
};

export default TransactionHistory;
