import { Flex, FlexProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface CardProps extends FlexProps {
	/** Optional classes to pass to this component */
	className?: string;
	/** Child elements of the card */
	children?: ReactNode;
	/** Function to call when the card is clicked */
	onClick?: () => void;
}

/**
 * A basic card with a shadow and border
 * @param {CardProps} props - Properties passed to the component
 * @returns {JSX.Element} The rendered card component
 * @example `<Card>rest of the contents</Card>`
 */
const Card = ({ className = "", children, onClick, ...rest }: CardProps) => {
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
