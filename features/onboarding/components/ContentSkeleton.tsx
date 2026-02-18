import { Box, Skeleton, VStack } from "@chakra-ui/react";

/**
 * ContentSkeleton - Loading skeleton for content area only
 *
 * Displays a skeleton loader for form content without the stepper.
 * Used in ContentRenderer fallback case.
 * @returns {JSX.Element} The skeleton loading component
 */
const ContentSkeleton = (): JSX.Element => {
	return (
		<VStack spacing={6} align="stretch" p={6}>
			{/* Title skeleton */}
			<Skeleton height="32px" width="60%" />

			{/* Description skeleton */}
			<Skeleton height="16px" width="90%" />
			<Skeleton height="16px" width="80%" />

			{/* Form fields skeleton */}
			<VStack spacing={4} align="stretch" mt={4}>
				<Box>
					<Skeleton height="14px" width="100px" mb={2} />
					<Skeleton height="40px" width="100%" />
				</Box>
				<Box>
					<Skeleton height="14px" width="120px" mb={2} />
					<Skeleton height="40px" width="100%" />
				</Box>
			</VStack>

			{/* Button skeleton */}
			<Skeleton height="48px" width="100%" mt={4} />
		</VStack>
	);
};

export default ContentSkeleton;
