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
		<Box w="100%">
			<Box>
				<SearchBar
					onChangeHandler={onChangeHandler}
					value={searchValue}
				/>
			</Box>
			<TransactionHistoryTable />
		</Box>
	);
};

export default TransactionHistory;
