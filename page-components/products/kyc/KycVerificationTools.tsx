// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/page-components/products/kyc/KycVerificationTools.tsx
import { Card, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useRouter } from "next/router";

/**
 * List of KYC verification tools
 */
const KycTools: {
	title: string;
	description: string;
	iconName?: string;
	URL: string;
}[] = [
	{
		title: "Vehicle RC Verification",
		description: "Verify vehicle details and registration information",
		iconName: "directions-car",
		URL: "vehicle-rc",
	},
	{
		title: "GSTIN Verification",
		description: "Verify a GSTIN and view business details",
		iconName: "search",
		URL: "gstin",
	},
];

export const KycVerificationTools = (): JSX.Element => {
	return (
		<Flex
			direction={{ base: "column", md: "row" }}
			gap={8}
			justify="center"
			align="center"
			mt={8}
			flexWrap="wrap"
		>
			{KycTools.map((tool) => (
				<KycVerificationCard
					key={tool.title}
					title={tool.title}
					description={tool.description}
					iconName={tool.iconName}
					URL={`/products/kyc/${tool.URL}`}
				/>
			))}
		</Flex>
	);
};

/**
 * Card component for displaying KYC verification tools
 * @param root0
 * @param root0.title
 * @param root0.description
 * @param root0.iconName
 * @param root0.URL
 * @returns {JSX.Element} KYC verification tools card
 */
const KycVerificationCard = ({
	title,
	description,
	iconName,
	URL,
}: {
	title: string;
	description: string;
	iconName: string;
	URL: string;
}) => {
	const router = useRouter();
	return (
		<Card
			as="button"
			w={{ base: "100%", md: "320px" }}
			h="180px"
			p={6}
			boxShadow="md"
			_hover={{ boxShadow: "lg", bg: "gray.50" }}
			onClick={() => router.push(URL)}
		>
			<Flex direction="column" align="center" justify="center" h="100%">
				<Icon
					name={iconName || "search"}
					size="lg"
					color="primary.DEFAULT"
					mb={3}
				/>
				<Text fontWeight="bold" fontSize="lg" mb={1}>
					{title}
				</Text>
				<Text fontSize="sm" color="gray.600" textAlign="center">
					{description}
				</Text>
			</Flex>
		</Card>
	);
};
