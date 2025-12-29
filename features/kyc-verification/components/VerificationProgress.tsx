/**
 * VerificationProgress - Progress indicator for multi-service verification.
 * Shows current progress with segmented colored bar (green for success, red for failed).
 * Displays summary card with Total, Successful, Failed counts.
 */

import { Box, Flex, Grid, Text } from "@chakra-ui/react";

interface VerificationProgressProps {
	/** Current index (number completed) */
	current: number;
	/** Total number of services */
	total: number;
	/** Whether verification is complete */
	isComplete?: boolean;
	/** Count of successful verifications */
	successCount?: number;
	/** Count of failed verifications */
	failedCount?: number;
	/** Completion timestamp */
	completedAt?: string;
}

/**
 * VerificationProgress component.
 * @param root0
 * @param root0.current
 * @param root0.total
 * @param root0.isComplete
 * @param root0.successCount
 * @param root0.failedCount
 * @param root0.completedAt
 */
export const VerificationProgress = ({
	current,
	total,
	isComplete = false,
	successCount = 0,
	failedCount = 0,
	completedAt,
}: VerificationProgressProps): JSX.Element => {
	const successPercent = total > 0 ? (successCount / total) * 100 : 0;
	const failedPercent = total > 0 ? (failedCount / total) * 100 : 0;
	// Overall percentage is based on completed verifications (success + failed)
	const completedCount = successCount + failedCount;
	const overallPercent =
		total > 0 ? Math.round((completedCount / total) * 100) : 0;

	return (
		<Box w="100%">
			{/* Header with count and timestamp */}
			<Flex direction="column" align="center" mb={4}>
				<Text fontSize="xl" fontWeight="bold" color="gray.800">
					{total} Verification{total !== 1 ? "s" : ""}
				</Text>
				{isComplete && completedAt && (
					<Text fontSize="sm" color="gray.500">
						Completed on {completedAt}
					</Text>
				)}
			</Flex>

			{/* Progress Section */}
			<Flex justify="space-between" align="center" mb={2}>
				<Text fontSize="sm" fontWeight="medium" color="gray.600">
					Overall Progress
				</Text>
				<Text fontSize="sm" fontWeight="semibold" color="gray.700">
					{overallPercent}%
				</Text>
			</Flex>

			{/* Segmented Progress Bar */}
			<Box
				w="100%"
				h="10px"
				bg="gray.200"
				borderRadius="full"
				overflow="hidden"
				mb={4}
			>
				<Flex h="100%">
					{/* Green segment for success */}
					{successPercent > 0 && (
						<Box
							w={`${successPercent}%`}
							h="100%"
							bg="green.500"
							transition="width 0.3s ease"
						/>
					)}
					{/* Red segment for failed */}
					{failedPercent > 0 && (
						<Box
							w={`${failedPercent}%`}
							h="100%"
							bg="red.500"
							transition="width 0.3s ease"
						/>
					)}
				</Flex>
			</Box>

			{/* Stats Grid - only show when complete */}
			{isComplete && (
				<Grid templateColumns="repeat(3, 1fr)" gap={3}>
					{/* Successful */}
					<Box
						p={4}
						bg="green.50"
						borderRadius="md"
						border="1px solid"
						borderColor="green.200"
						textAlign="center"
					>
						<Text
							fontSize="2xl"
							fontWeight="bold"
							color="green.600"
						>
							{successCount}
						</Text>
						<Text fontSize="sm" color="green.600">
							Successful
						</Text>
					</Box>

					{/* Failed */}
					<Box
						p={4}
						bg="red.50"
						borderRadius="md"
						border="1px solid"
						borderColor="red.200"
						textAlign="center"
					>
						<Text fontSize="2xl" fontWeight="bold" color="red.600">
							{failedCount}
						</Text>
						<Text fontSize="sm" color="red.600">
							Failed
						</Text>
					</Box>

					{/* Total */}
					<Box
						p={4}
						bg="blue.50"
						borderRadius="md"
						border="1px solid"
						borderColor="blue.200"
						textAlign="center"
					>
						<Text fontSize="2xl" fontWeight="bold" color="blue.600">
							{total}
						</Text>
						<Text fontSize="sm" color="blue.600">
							Total
						</Text>
					</Box>
				</Grid>
			)}

			{/* In-progress text */}
			{!isComplete && (
				<Text fontSize="sm" color="gray.500" textAlign="center">
					Verifying {current} of {total}...
				</Text>
			)}
		</Box>
	);
};

export default VerificationProgress;
