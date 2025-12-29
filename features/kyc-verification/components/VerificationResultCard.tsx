/**
 * VerificationResultCard - Displays a single verification result
 * with input data and response in a card layout.
 * Supports skeleton loading state for retry functionality.
 */

import {
	Badge,
	Box,
	Card,
	Collapse,
	Flex,
	Skeleton,
	SkeletonText,
	Spinner,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { Icon } from "components";
import type { VerificationResult, VerificationStatus } from "../types";

interface VerificationResultCardProps {
	/** Verification result data */
	result: VerificationResult;
	/** Whether to show expanded by default */
	defaultExpanded?: boolean;
	/** Whether this card is in retry loading state */
	isRetrying?: boolean;
}

/**
 * Get badge color based on verification status.
 * @param status
 */
const getStatusBadgeProps = (
	status: VerificationStatus
): { colorScheme: string; label: string } => {
	switch (status) {
		case "success":
			return { colorScheme: "green", label: "SUCCESS" };
		case "failed":
			return { colorScheme: "red", label: "FAILED" };
		case "in_progress":
			return { colorScheme: "blue", label: "IN PROGRESS" };
		case "pending":
		default:
			return { colorScheme: "gray", label: "PENDING" };
	}
};

/**
 * Get status icon based on verification status.
 * @param status
 */
const getStatusIcon = (status: VerificationStatus): string => {
	switch (status) {
		case "success":
			return "check-circle";
		case "failed":
			return "warning";
		case "in_progress":
			return "autorenew";
		case "pending":
		default:
			return "schedule";
	}
};

/**
 * Render key-value pairs for input/response data.
 * @param root0
 * @param root0.data
 * @param root0.title
 */
const DataDisplay = ({
	data,
	title,
}: {
	data: Record<string, unknown>;
	title: string;
}): JSX.Element => (
	<Box>
		<Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2}>
			{title}
		</Text>
		<Box
			bg="gray.50"
			p={3}
			borderRadius="md"
			fontFamily="mono"
			fontSize="xs"
		>
			{Object.entries(data).map(([key, value]) => (
				<Flex key={key} mb={1}>
					<Text color="blue.600" minW="140px">
						{key}:
					</Text>
					<Text color="gray.700" wordBreak="break-word">
						{typeof value === "object"
							? JSON.stringify(value)
							: String(value ?? "N/A")}
					</Text>
				</Flex>
			))}
		</Box>
	</Box>
);

/**
 * VerificationResultCard component.
 * @param root0
 * @param root0.result
 * @param root0.defaultExpanded
 * @param root0.isRetrying
 */
export const VerificationResultCard = ({
	result,
	defaultExpanded = false,
	isRetrying = false,
}: VerificationResultCardProps): JSX.Element => {
	const { isOpen, onToggle } = useDisclosure({
		defaultIsOpen: defaultExpanded,
	});
	const statusBadge = getStatusBadgeProps(result.status);
	const statusIcon = getStatusIcon(result.status);
	const isLoading = result.status === "in_progress" || isRetrying;

	return (
		<Card
			variant="outline"
			overflow="hidden"
			borderColor={
				result.status === "success"
					? "green.200"
					: result.status === "failed"
						? "red.200"
						: "gray.200"
			}
			bg={
				result.status === "success"
					? "green.50"
					: result.status === "failed"
						? "red.50"
						: "white"
			}
		>
			{/* Header */}
			<Flex
				p={4}
				align="center"
				justify="space-between"
				cursor="pointer"
				onClick={onToggle}
			>
				<Flex align="center" gap={3} flex={1}>
					{/* Status Icon */}
					{isLoading ? (
						<Spinner size="sm" color="blue.500" />
					) : (
						<Icon
							name={statusIcon}
							size="sm"
							color={
								result.status === "success"
									? "green.500"
									: result.status === "failed"
										? "red.500"
										: "gray.400"
							}
						/>
					)}

					{/* Service Name and Timestamp */}
					<Box>
						<Text fontWeight="semibold" color="gray.800">
							{result.serviceName}
						</Text>
						{result.timestamp && (
							<Text fontSize="xs" color="gray.500">
								{result.timestamp}
							</Text>
						)}
					</Box>
				</Flex>

				{/* Status Badge and Expand Icon */}
				<Flex align="center" gap={2}>
					<Badge colorScheme={statusBadge.colorScheme} fontSize="xs">
						{statusBadge.label}
					</Badge>
					<Icon
						name={isOpen ? "expand-less" : "expand-more"}
						size="sm"
						color="gray.400"
					/>
				</Flex>
			</Flex>

			{/* Collapsible Content */}
			<Collapse in={isOpen} animateOpacity>
				<Box
					px={4}
					pb={4}
					pt={2}
					borderTop="1px"
					borderColor="gray.100"
					bg="white"
				>
					{/* Skeleton loading state for retry */}
					{isRetrying ? (
						<Box>
							<Skeleton height="16px" width="80px" mb={3} />
							<SkeletonText noOfLines={3} spacing={2} mb={4} />
							<Skeleton height="16px" width="80px" mb={3} />
							<SkeletonText noOfLines={4} spacing={2} />
						</Box>
					) : (
						<VStack spacing={4} align="stretch">
							{/* Input Data */}
							<DataDisplay
								data={result.requestData}
								title="Input Data"
							/>

							{/* Response Data */}
							{result.status === "pending" ? (
								<Text fontSize="sm" color="gray.400">
									Waiting to start...
								</Text>
							) : result.status === "in_progress" ? (
								<Flex align="center" gap={2}>
									<Spinner size="sm" />
									<Text fontSize="sm" color="blue.500">
										Verifying...
									</Text>
								</Flex>
							) : result.error ? (
								<Box>
									<Text
										fontSize="sm"
										fontWeight="semibold"
										color="red.600"
										mb={2}
									>
										Error Details
									</Text>
									<Box bg="red.50" p={3} borderRadius="md">
										<Text fontSize="sm" color="red.600">
											{result.error}
										</Text>
									</Box>
								</Box>
							) : result.responseData ? (
								<DataDisplay
									data={result.responseData}
									title="Response"
								/>
							) : (
								<Text fontSize="sm" color="gray.400">
									No response data
								</Text>
							)}
						</VStack>
					)}
				</Box>
			</Collapse>
		</Card>
	);
};

export default VerificationResultCard;
