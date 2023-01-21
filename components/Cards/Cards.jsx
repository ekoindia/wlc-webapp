import { Card } from "@chakra-ui/react";
import { useEffect, useState } from "react";

/**
 * A <Cards> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Cards></Cards>`
 */
const Cards = ({ className = "", children, ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<Card
			className={`${className}`}
			borderRadius="10px"
			boxShadow="0px 5px 15px #0000000D"
			border="1px solid #D2D2D2"
			p="5"
			h="620px"
			w="490px"
			bg="white"
			{...props}
		>
			{children}
		</Card>
	);
};

export default Cards;
