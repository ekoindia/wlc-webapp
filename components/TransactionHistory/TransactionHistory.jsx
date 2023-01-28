import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TransactionHistoryTable } from ".";
import { SearchBar } from "..";
/**
 * A <TransactionHistory> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistory></TransactionHistory>`
 */
const TransactionHistory = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required

	function onChangeHandler(e) {
		setSearchValue(e);
	}

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Box w="100%">
			<Box marginTop={"1.5rem"} width="600px">
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
