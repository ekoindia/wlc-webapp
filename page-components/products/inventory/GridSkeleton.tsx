import {
	Box,
	SimpleGrid,
	Skeleton,
	SkeletonText,
	VStack,
} from "@chakra-ui/react";
import { Card } from "components";

interface GridSkeletonProps {
	count?: number;
}

export const GridSkeleton = ({ count = 8 }: GridSkeletonProps): JSX.Element => {
	return (
		<SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
			{Array.from({ length: count }).map((_, index) => (
				<Card key={index}>
					<VStack spacing={4} align="stretch">
						{/* Image Skeleton */}
						<Skeleton height="200px" borderRadius="md" />

						{/* Content Skeleton */}
						<VStack spacing={3} align="stretch">
							{/* Title */}
							<Skeleton height="20px" />

							{/* Description */}
							<SkeletonText noOfLines={3} spacing="2" />

							{/* Price */}
							<Box>
								<Skeleton height="16px" width="80px" />
								<Skeleton height="14px" width="100px" mt={1} />
							</Box>

							{/* Buttons */}
							<Box mt={4}>
								<Skeleton height="36px" />
							</Box>
						</VStack>
					</VStack>
				</Card>
			))}
		</SimpleGrid>
	);
};
