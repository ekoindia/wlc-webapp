import { Flex } from "@chakra-ui/react";

/**
 * A base card
 * @param 	{object}	children	Child elements for the card body
 * @param 	{function}	onClick 	onClick function
 * @param	{...*}	rest	Rest of the props passed to this component
 * @example	`<Card></Card>` TODO: Fix example
 */
const Card = ({ className = "", children, onClick, ...rest }) => {
	return (
		<Flex
			className={`${className}`}
			direction="column"
			borderRadius="10px"
			boxShadow="basic"
			border="1px solid var(--chakra-colors-hint)"
			p="5"
			h={{ base: "auto", md: "600px" /* , xl: "620px"  */ }}
			bg="white"
			onClick={onClick}
			{...rest}
		>
			{children}
		</Flex>
	);
};

export default Card;
