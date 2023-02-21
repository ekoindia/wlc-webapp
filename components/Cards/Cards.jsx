import { Card } from "@chakra-ui/react";

/**
 * A <Cards> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Cards></Cards>`
 */
const Cards = ({ className = "", children, ...props }) => {
	const { onClick } = props;

	return (
		<Card
			className={`${className}`}
			borderRadius="10px"
			boxShadow="0px 5px 15px #0000000D"
			border="1px solid #D2D2D2"
			p="5"
			h={{ base: "auto", xl: "620px" }}
			w={{ base: "100%", md: "47%", lg: "404px", xl: "490px" }}
			bg="white"
			onClick={onClick}
			{...props}
		>
			{children}
		</Card>
	);
};

export default Cards;
