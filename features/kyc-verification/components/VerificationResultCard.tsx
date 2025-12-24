/**
 * VerificationResultCard - Displays a single verification result
 * with input data and response in a card layout.
 */

import {
	Badge,
	Box,
	Card,
	Collapse,
	Flex,
	Spinner,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "components";
import type { VerificationResult, VerificationStatus } from "../types";

interface VerificationResultCardProps {
	/** Verification result data */
	result: VerificationResult;
	/** Whether to show expanded by default */
	defaultExpanded?: boolean;
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
			{title}:
		</Text>
		<Flex direction="column" gap={1}>
			{Object.entries(data).map(([key, value]) => (
				<Flex key={key} fontSize="sm">
					<Text color="gray.500" minW="140px">
						{key}:
					</Text>
					<Text color="gray.700" wordBreak="break-word">
						{typeof value === "object"
							? JSON.stringify(value)
							: String(value ?? "N/A")}
					</Text>
				</Flex>
			))}
		</Flex>
	</Box>
);

/**
 * VerificationResultCard component.
 * @param root0
 * @param root0.result
 * @param root0.defaultExpanded
 */
export const VerificationResultCard = ({
	result,
	defaultExpanded = true,
}: VerificationResultCardProps): JSX.Element => {
	const { isOpen, onToggle } = useDisclosure({
		defaultIsOpen: defaultExpanded,
	});
	const statusBadge = getStatusBadgeProps(result.status);
	const isLoading = result.status === "in_progress";

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
		>
			{/* Header */}
			<Flex
				p={4}
				align="center"
				justify="space-between"
				cursor="pointer"
				onClick={onToggle}
				bg={result.status === "in_progress" ? "blue.50" : "transparent"}
				_hover={{ bg: "gray.50" }}
			>
				<Flex align="center" gap={3} flex={1}>
					{/* Expand/Collapse Icon */}
					<Icon
						name={isOpen ? "expand-more" : "chevron-right"}
						size="sm"
						color="gray.400"
					/>

					{/* Service Name */}
					<Text fontWeight="semibold" color="gray.800">
						{result.serviceName}
					</Text>

					{/* Loading Spinner for in_progress */}
					{isLoading && <Spinner size="sm" color="blue.500" />}

					{/* Status Badge */}
					<Badge colorScheme={statusBadge.colorScheme} fontSize="xs">
						{statusBadge.label}
					</Badge>
				</Flex>

				{/* Timestamp */}
				{result.timestamp && (
					<Text fontSize="xs" color="gray.500">
						{result.timestamp}
					</Text>
				)}
			</Flex>

			{/* Collapsible Content */}
			<Collapse in={isOpen} animateOpacity>
				<Box
					px={4}
					pb={4}
					pt={2}
					borderTop="1px"
					borderColor="gray.100"
				>
					<Flex direction={{ base: "column", md: "row" }} gap={6}>
						{/* Input Data */}
						<Box flex={1}>
							<DataDisplay
								data={result.requestData}
								title="Input Data"
							/>
						</Box>

						{/* Response Data */}
						<Box flex={1}>
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
										Error:
									</Text>
									<Text fontSize="sm" color="red.500">
										{result.error}
									</Text>
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
						</Box>
					</Flex>
				</Box>
			</Collapse>
		</Card>
	);
};

export default VerificationResultCard;
