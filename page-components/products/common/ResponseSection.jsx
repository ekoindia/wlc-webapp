import { Box, Text } from "@chakra-ui/react";
/**
 * A reusable section container for API response cards
 * @param {object} props
 * @param {string} props.heading - The heading of the section
 * @param {React.ReactNode} props.children - The content of the section
 * @returns {JSX.Element} The rendered section
 */
const ResponseSection = ({ heading, children }) => {
	return (
		<Box
			mb={4}
			borderLeft="4px"
			borderLeftColor="primary.DEFAULT"
			pl={3}
			ml={3}
		>
			<Text fontWeight="bold" fontSize="md" mb={2} color="primary.dark">
				{heading}
			</Text>
			{children}
		</Box>
	);
};

ResponseSection.displayName = "ResponseSection";

export default ResponseSection;
