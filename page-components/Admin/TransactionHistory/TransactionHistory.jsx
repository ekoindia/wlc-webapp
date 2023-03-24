import { Box } from "@chakra-ui/react";
import { Headings, SearchBar } from "components";
import { useState } from "react";
import { TransactionHistoryTable } from ".";

/**
 * A <TransactionHistory> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistory></TransactionHistory>`
 */

const TransactionHistory = ({ className = "", ...props }) => {
	const [searchValue, setSearchValue] = useState(""); // TODO: Edit state as required

	function onChangeHandler(e) {
		setSearchValue(e);
	}

	return (
		<>
			<Headings title="Transaction History" hasIcon={false} />
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
		</>
	);
};

export default TransactionHistory;
