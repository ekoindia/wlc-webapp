/**
 * VerificationResultList - Container for all verification results
 * with filters and export options.
 * Layout: Results count → Filters & Download → Service blocks
 */

import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Button, Select } from "components";
import { useMemo, useState } from "react";
import type {
	VerificationFilterOptions,
	VerificationResult,
	VerificationStatus,
} from "../types";
import ServiceSearch from "./ServiceSearch";
import { VerificationProgress } from "./VerificationProgress";
import { VerificationResultCard } from "./VerificationResultCard";

/** Status label mapping for display */
const STATUS_LABELS: Record<VerificationStatus | "all", string> = {
	all: "All Status",
	success: "Success",
	failed: "Failed",
	in_progress: "In Progress",
	pending: "Pending",
};

interface VerificationResultListProps {
	/** Array of verification results */
	results: VerificationResult[];
	/** Current progress index */
	currentIndex: number;
	/** Total count of services */
	totalCount: number;
	/** Whether verification is complete */
	isComplete: boolean;
	/** Count of successful verifications */
	successCount?: number;
	/** Count of failed verifications */
	failedCount?: number;
	/** Completion timestamp */
	completedAt?: string;
	/** Indices of services being retried (for skeleton display) */
	retryingIndices?: number[];
	/** Callback to download results as PDF */
	onDownloadPdf?: () => void;
	/** Whether PDF download is in progress */
	isDownloading?: boolean;
}

/**
 * Calculates counts by verification status for summary display.
 * @param {VerificationResult[]} results - Array of verification results to count
 * @returns {Record<VerificationStatus, number>} Object with count for each status type
 */
const getStatusCounts = (
	results: VerificationResult[]
): Record<VerificationStatus, number> => {
	const counts: Record<VerificationStatus, number> = {
		pending: 0,
		in_progress: 0,
		success: 0,
		failed: 0,
	};

	results.forEach((r) => {
		counts[r.status]++;
	});

	return counts;
};

/**
 * Container component for displaying verification results with filtering and export options.
 * Layout: Results count → Filters & Download → Service result cards.
 * @param {VerificationResultListProps} props - Component props
 * @param {VerificationResult[]} props.results - Array of verification results to display
 * @param {number} props.currentIndex - Current progress index (0-based)
 * @param {number} props.totalCount - Total count of services being verified
 * @param {boolean} props.isComplete - Whether all verifications are complete
 * @param {number} [props.successCount] - Count of successful verifications
 * @param {number} [props.failedCount] - Count of failed verifications
 * @param {string} [props.completedAt] - Formatted completion timestamp
 * @param {number[]} [props.retryingIndices] - Indices of services being retried (for skeleton display)
 * @param {Function} [props.onDownloadPdf] - Callback to download results as PDF
 * @param {boolean} [props.isDownloading] - Whether PDF download is in progress
 * @returns {JSX.Element} Rendered results list with progress, filters, and result cards
 */
export const VerificationResultList = ({
	results,
	currentIndex,
	totalCount,
	isComplete,
	successCount,
	failedCount,
	completedAt,
	retryingIndices,
	onDownloadPdf,
	isDownloading,
}: VerificationResultListProps): JSX.Element => {
	const [filters, setFilters] = useState<VerificationFilterOptions>({
		status: "all",
		searchQuery: "",
	});

	const statusCounts = useMemo(() => getStatusCounts(results), [results]);

	// Determine if this is a multi-service verification (show filters only for multiple)
	const isMultiService = totalCount > 1;

	// Generate dynamic status options based on available statuses in results
	const statusOptions = useMemo(() => {
		const options: Array<{ label: string; value: string }> = [
			{ label: "All Status", value: "all" },
		];

		// Only add status options that exist in results
		const availableStatuses: VerificationStatus[] = [
			"pending",
			"in_progress",
			"success",
			"failed",
		];
		availableStatuses.forEach((status) => {
			if (statusCounts[status] > 0) {
				options.push({
					label: STATUS_LABELS[status],
					value: status,
				});
			}
		});

		return options;
	}, [statusCounts]);

	// Filter results based on current filters, maintain original order (first at top)
	const filteredResults = useMemo(() => {
		let filtered = [...results];

		// Filter by status
		if (filters.status && filters.status !== "all") {
			filtered = filtered.filter((r) => r.status === filters.status);
		}

		// Filter by search query
		if (filters.searchQuery?.trim()) {
			const query = filters.searchQuery.toLowerCase();
			filtered = filtered.filter((r) =>
				r.serviceName.toLowerCase().includes(query)
			);
		}

		// Keep original order (first service at top)
		return filtered;
	}, [results, filters]);

	// Get the original index of a result for checking retry status
	const getOriginalIndex = (result: VerificationResult): number => {
		return results.findIndex((r) => r.serviceCode === result.serviceCode);
	};

	return (
		<VStack spacing={4} align="stretch" w="100%">
			{/* 1. Results Summary Card (Progress Section) */}
			<Box bg="white" p={6} borderRadius="lg" shadow="sm">
				<VerificationProgress
					current={currentIndex}
					total={totalCount}
					isComplete={isComplete}
					successCount={successCount ?? statusCounts.success}
					failedCount={failedCount ?? statusCounts.failed}
					completedAt={completedAt}
				/>
			</Box>

			{/* 2. Filters and Actions - All on single line */}
			<Flex
				gap={3}
				align="center"
				justify={isMultiService ? "space-between" : "flex-end"}
				flexWrap="wrap"
			>
				{/* Filters - only show for multi-service verification */}
				{isMultiService && (
					<Flex gap={3} align="center" flex={1}>
						<ServiceSearch
							value={filters.searchQuery || ""}
							onChange={(query) =>
								setFilters((prev) => ({
									...prev,
									searchQuery: query,
								}))
							}
							placeholder="Search services..."
						/>
						<Select
							options={statusOptions}
							value={statusOptions.find(
								(opt) => opt.value === (filters.status || "all")
							)}
							onChange={(
								option: (typeof statusOptions)[number] | null
							) =>
								setFilters((prev) => ({
									...prev,
									status: (option?.value ||
										"all") as VerificationFilterOptions["status"],
								}))
							}
							placeholder="All Status"
							size="md"
							w="180px"
							required
						/>
					</Flex>
				)}

				{/* Download PDF - only show when complete */}
				{isComplete && onDownloadPdf && (
					<Button
						size="md"
						onClick={onDownloadPdf}
						icon="file-download"
						iconStyle={{ size: "xs" }}
						isLoading={isDownloading}
						isDisabled={isDownloading}
						loadingText="Downloading..."
					>
						Download PDF
					</Button>
				)}
			</Flex>

			{/* 3. Results List - Results label */}
			<Text fontWeight="semibold" color="gray.700" mt={2}>
				Results
			</Text>

			{/* 3. Results List - Cards */}
			<VStack spacing={3} align="stretch">
				{filteredResults.length === 0 ? (
					<Box textAlign="center" py={8}>
						<Text color="gray.500">No results to display</Text>
					</Box>
				) : (
					filteredResults.map((result, displayIndex) => {
						const originalIndex = getOriginalIndex(result);
						const isRetrying =
							retryingIndices?.includes(originalIndex);
						// Only first result is expanded by default
						const isFirstResult = displayIndex === 0;

						return (
							<VerificationResultCard
								key={result.serviceCode}
								result={result}
								defaultExpanded={isFirstResult}
								isRetrying={isRetrying}
							/>
						);
					})
				)}
			</VStack>
		</VStack>
	);
};

export default VerificationResultList;
