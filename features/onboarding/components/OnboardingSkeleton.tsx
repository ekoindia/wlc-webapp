import { Box, Flex, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";
import ContentSkeleton from "./ContentSkeleton";

/**
 * OnboardingSkeleton - Loading skeleton for onboarding flow
 *
 * Displays a skeleton loader that matches the onboarding layout structure
 * with a stepper sidebar and content area.
 * @returns {JSX.Element} The skeleton loading component
 */
const OnboardingSkeleton = (): JSX.Element => {
	return (
		<Flex
			overflow="hidden"
			justify="center"
			p={{ base: 2, md: 4 }}
			w="100%"
		>
			<Flex
				gap={{ base: 4, md: 6 }}
				w="100%"
				maxW="1200px"
				direction={{ base: "column", md: "row" }}
			>
				{/* Stepper Skeleton */}
				<VStack
					display={{ base: "none", md: "flex" }}
					spacing={4}
					align="stretch"
					minW="250px"
					p={4}
				>
					{/* Render 6 step items */}
					{[1, 2, 3, 4, 5].map((step) => (
						<Flex key={step} align="center" gap={3}>
							<SkeletonCircle size="10" />
							<Skeleton height="20px" flex={1} />
						</Flex>
					))}
				</VStack>

				{/* Content Skeleton - reuse ContentSkeleton component */}
				<Box
					flex={1}
					maxW={{ base: "100%", md: "600px" }}
					bg="white"
					borderRadius="lg"
					boxShadow="sm"
				>
					<ContentSkeleton />
				</Box>
			</Flex>
		</Flex>
	);
};

export default OnboardingSkeleton;
