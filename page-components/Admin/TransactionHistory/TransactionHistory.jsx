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

	const router = useRouter();
	const handleClick = (e) => {
		router.push("/admin/transaction-history/account-statemen");
	};

	function onChangeHandler(e) {
		setSearchValue(e);
	}

	return (
		<Box w="100%" px={{ base: "16px", md: "initial" }} pb={"20px"}>
			<Box>
				<Button onClick={handleClick} bg="red " h="20px" w="20px" />
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
