import { Flex, Text } from "@chakra-ui/react";

/**
 * Section card component for the configuration page
 * @param {object} props
 * @param {string} [props.title] - Title of the section
 * @param {object} props.children - Child components
 */
export const Section = ({ title, children }) => {
	return (
		<Flex
			direction="column"
			gap={{ base: 4, md: 8 }}
			bg="white"
			borderRadius={6}
			p={{ base: 4, md: 8 }}
		>
			{title ? (
				<Text as="h2" fontSize="24px" fontWeight="600" color="#444">
					{title}
				</Text>
			) : null}
			<Flex
				direction={{ base: "column", md: "row" }}
				gap={{ base: 4, md: 8, lg: 12 }}
			>
				{children}
			</Flex>
		</Flex>
	);
};
