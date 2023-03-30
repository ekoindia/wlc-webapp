import { Box, Button } from "@chakra-ui/react";
import { SearchBar } from "components";
import { useState } from "react";
import { TransactionHistoryTable } from ".";
import { useRouter } from "next/router";
/**
 * A <TransactionHistory> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistory></TransactionHistory>`
 */

const TransactionHistory = ({ className = "", ...props }) => {
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required

	// const router = useRouter();

	function onChangeHandler(e) {
		setSearchValue(e);
	}

	return (
		<Box w="100%" px={{ base: "16px", md: "initial" }} pb={"20px"}>
			<Box>
				<SearchBar
					onChangeHandler={onChangeHandler}
					// value={searchValue}
					searchedvalue={searchValue}
					setSearchValue={setSearchValue}
				/>
			</Box>
			<Box>
				<TransactionHistoryTable searchValue={searchValue} />
			</Box>
		</Box>
	);
};

export default TransactionHistory;
