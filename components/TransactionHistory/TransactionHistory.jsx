import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

/**
 * A <TransactionHistory> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistory></TransactionHistory>`
 */
const TransactionHistory = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Box className={`${className}`} {...props}>
			TransactionHistory
		</Box>
	);
};

export default TransactionHistory;
