/**
 * VerificationProgress - Progress indicator for multi-service verification.
 * Shows current progress as "X of Y" with a progress bar.
 */

import { Box, Flex, Progress, Text } from "@chakra-ui/react";

interface VerificationProgressProps {
	/** Current index (number completed) */
	current: number;
	/** Total number of services */
	total: number;
	/** Whether verification is complete */
	isComplete?: boolean;
}

/**
 * VerificationProgress component.
 * @param root0
 * @param root0.current
 * @param root0.total
 * @param root0.isComplete
 */
export const VerificationProgress = ({
	current,
	total,
	isComplete = false,
}: VerificationProgressProps): JSX.Element => {
	const percent = total > 0 ? Math.round((current / total) * 100) : 0;

	return (
		<Box w="100%">
			<Flex justify="space-between" align="center" mb={2}>
				<Text fontWeight="semibold" color="gray.700">
					{isComplete
						? `All ${total} Completed`
						: `Verifying ${current} of ${total}`}
				</Text>
				<Text fontSize="sm" color="gray.500">
					{percent}%
				</Text>
			</Flex>
			<Progress
				value={percent}
				size="sm"
				colorScheme={isComplete ? "green" : "blue"}
				borderRadius="full"
				hasStripe={!isComplete}
				isAnimated={!isComplete}
			/>
		</Box>
	);
};

export default VerificationProgress;
