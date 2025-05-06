import { Flex } from "@chakra-ui/react";

/**
 * A basic card with a shadow and border
 * @param {object} prop - Properties passed to the component
 * @param {string} [prop.className] - Optional classes to pass to this component.
 * @param {ReactNode} [prop.children] - Child elements of the card.
 * @param {Function} [prop.onClick] - Function to call when the card is clicked.
 * @param {...*} rest - Rest of the props passed to this component.
 * @example `<Card>rest of the contents</Card>`
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
			onClick={onClick && (() => onClick())}
			{...rest}
		>
			{children}
		</Flex>
	);
};

export default Card;
