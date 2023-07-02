import { Card } from "@chakra-ui/react";

/**
 * A <Cards> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Cards></Cards>`
 */
const Cards = ({ className = "", children, ...rest }) => {
	const { onClick } = rest;

	return (
		<Card
			className={`${className}`}
			borderRadius="10px"
			boxShadow="basic"
			border="1px solid #D2D2D2"
			p="5"
			h={{ base: "auto", md: "600px", xl: "620px" }}
			bg="white"
			onClick={onClick}
			{...rest}
		>
			{children}
		</Card>
	);
};

export default Cards;
