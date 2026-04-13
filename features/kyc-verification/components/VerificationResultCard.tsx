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
import { Icon, JsonViewer } from "components";
import type { VerificationResult, VerificationStatus } from "../types";

/**
 * Key display name overrides for JSON viewer
 */
const JSON_KEY_OVERRIDES = {
	dob: "Date of Birth",
	dob_match: "Date of Birth Match",
	pan: "PAN",
	pan_number: "PAN",
	pan_status: "PAN Status",
	tid: "Transaction ID",
	name_match: "Name Match",
	aadhaar_seeding_status: "Aadhaar Seeding Status",
	aadhaar_seeding_status_desc: "Aadhaar Seeding Status Description",
	gstin: "GSTIN",
} as const;

/**
 * Value transformations for JSON viewer
 */
const JSON_VALUE_TRANSFORMS = {
	byKey: {
		Y: "Yes",
		N: "No",
	},
} as const;

interface VerificationResultCardProps {
	/** Verification result data */
	result: VerificationResult;
	/** Whether to show expanded by default */
	defaultExpanded?: boolean;
	/** Whether this card is in retry loading state */
	isRetrying?: boolean;
}

/**
 * Returns badge color scheme and label based on verification status.
 * @param {VerificationStatus} status - The verification status to get badge props for
 * @returns {{ colorScheme: string; label: string }} Badge color scheme and display label
 */
const getStatusBadgeProps = (
	status: VerificationStatus
): { variant: string; label: string } => {
	switch (status) {
		case "success":
			return { variant: "outlineSuccess", label: "SUCCESS" };
		case "failed":
			return { variant: "outlineError", label: "FAILED" };
		case "in_progress":
			return { variant: "highlight", label: "IN PROGRESS" };
		case "pending":
		default:
			return { variant: "muted", label: "PENDING" };
	}
};

/**
 * Returns the icon name for a given verification status.
 * @param {VerificationStatus} status - The verification status to get icon for
 * @returns {string} Icon name from the icon library
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
 * Displays a single verification result with input data and response in a collapsible card.
 * Supports skeleton loading state for retry functionality.
 * @param {VerificationResultCardProps} props - Component props
 * @param {VerificationResult} props.result - Verification result data including status, request, and response
 * @param {boolean} [props.defaultExpanded] - Whether to show expanded by default (default: false)
 * @param {boolean} [props.isRetrying] - Whether this card is in retry loading state (default: false)
 * @returns {JSX.Element} Rendered collapsible card with status badge, request data, and response
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
					? "rgba(0, 195, 65, 0.4)"
					: result.status === "failed"
						? "rgba(255, 64, 129, 0.4)"
						: "gray.200"
			}
			bg={
				result.status === "success"
					? "linear-gradient(rgba(0, 195, 65, 0.15), rgba(0, 195, 65, 0.15)), white"
					: result.status === "failed"
						? "linear-gradient(rgba(255, 64, 129, 0.15), rgba(255, 64, 129, 0.15)), white"
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
									? "success"
									: result.status === "failed"
										? "error"
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
					<Badge variant={statusBadge.variant}>
						{statusBadge.label}
					</Badge>
					<Icon
						name={isOpen ? "expand-less" : "expand-more"}
						size="sm"
						color="gray.600"
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
							{/* Request Data */}
							<Box>
								<Text
									fontSize="sm"
									fontWeight="semibold"
									color="gray.600"
									mb={2}
								>
									Request
								</Text>
								<JsonViewer
									data={result.requestData}
									collapseAfterLevel={2}
									keyOverrides={JSON_KEY_OVERRIDES}
								/>
							</Box>

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
										color="error"
										mb={2}
									>
										Error Details
									</Text>
									<Box
										bg="rgba(255, 64, 129, 0.15)"
										p={3}
										borderRadius="md"
									>
										<Text fontSize="sm" color="error">
											{result.error}
										</Text>
									</Box>
								</Box>
							) : result.responseData ? (
								<Box>
									<Text
										fontSize="sm"
										fontWeight="semibold"
										color="gray.600"
										mb={2}
									>
										Response
									</Text>
									<JsonViewer
										data={result.responseData}
										collapseAfterLevel={2}
										keyOverrides={JSON_KEY_OVERRIDES}
										valueTransforms={JSON_VALUE_TRANSFORMS}
									/>
								</Box>
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
