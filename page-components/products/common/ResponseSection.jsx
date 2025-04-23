import { Box, Flex, Text } from "@chakra-ui/react";
/**
 * A reusable section container for API response cards used to show a related group of response data. It shows the section heading and a left border with an optional index number before the heading.
 * - For nested JSON, use a nested `ResponseSection` for each level of nesting.
 * - For displaying a list of objects, use a `ResponseSection` for each object in the list and pass `index` as a prop to the `ResponseSection` component, starting with 1.
 * @param {object} props
 * @param {string} props.heading - The heading of the section
 * @param {number} [props.index] - If provided, shows the index of the section. Used when the section represents an item of an array.
 * @param {React.ReactNode} props.children - The content of the section
 * @returns {JSX.Element} The rendered section
 */
const ResponseSection = ({ heading, index, children }) => {
	return (
		<Box
			// mb={4}
			// mt={4}
			borderLeft="4px"
			borderLeftColor="primary.DEFAULT"
			p="0.5em 0.5em 0.5em 1em"
			m="1em 0 0.5em 0.5em"
			// ml={3}
		>
			<Flex direction="row" align="center" mb={2}>
				{/* Show an index, if provided, as a number within a colored circle before the section heading */}
				{index !== undefined && index !== "" ? (
					<Flex
						as="span"
						bg="primary.DEFAULT"
						color="white"
						borderRadius="full"
						width="20px"
						height="20px"
						justify="center"
						align="center"
						fontSize="sm"
						mr={2}
					>
						{index}
					</Flex>
				) : null}
				{/* Section heading */}
				<Text fontWeight="bold" fontSize="md" color="primary.dark">
					{heading}
				</Text>
			</Flex>
			{children}
		</Box>
	);
};

ResponseSection.displayName = "ResponseSection";

export default ResponseSection;
