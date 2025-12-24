/**
 * VerificationResultList - Container for all verification results
 * with filters and export options.
 */

import { Box, Button, Flex, Select, Text, VStack } from "@chakra-ui/react";
import { Input } from "components";
import { useMemo, useState } from "react";
import type {
	VerificationFilterOptions,
	VerificationResult,
	VerificationStatus,
} from "../types";
import { VerificationProgress } from "./VerificationProgress";
import { VerificationResultCard } from "./VerificationResultCard";

interface VerificationResultListProps {
	/** Array of verification results */
	results: VerificationResult[];
	/** Current progress index */
	currentIndex: number;
	/** Total count of services */
	totalCount: number;
	/** Whether verification is complete */
	isComplete: boolean;
	/** Callback to download results as PDF */
	onDownloadPdf?: () => void;
	/** Callback to download results as JSON */
	onDownloadJson?: () => void;
}

/**
 * Get counts by status for summary display.
 * @param results
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
 * VerificationResultList component.
 * @param root0
 * @param root0.results
 * @param root0.currentIndex
 * @param root0.totalCount
 * @param root0.isComplete
 * @param root0.onDownloadPdf
 * @param root0.onDownloadJson
 */
export const VerificationResultList = ({
	results,
	currentIndex,
	totalCount,
	isComplete,
	onDownloadPdf,
	onDownloadJson,
}: VerificationResultListProps): JSX.Element => {
	const [filters, setFilters] = useState<VerificationFilterOptions>({
		status: "all",
		searchQuery: "",
	});

	const statusCounts = useMemo(() => getStatusCounts(results), [results]);

	// Filter results based on current filters
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

		// Show completed results first (reverse order - newest first)
		return filtered.reverse();
	}, [results, filters]);

	return (
		<VStack spacing={4} align="stretch" w="100%">
			{/* Progress Section */}
			<Box bg="white" p={4} borderRadius="md" shadow="sm">
				<VerificationProgress
					current={currentIndex}
					total={totalCount}
					isComplete={isComplete}
				/>

				{/* Status Summary */}
				{isComplete && (
					<Flex gap={4} mt={3} flexWrap="wrap">
						<Text fontSize="sm" color="green.600">
							✓ {statusCounts.success} Success
						</Text>
						{statusCounts.failed > 0 && (
							<Text fontSize="sm" color="red.600">
								✗ {statusCounts.failed} Failed
							</Text>
						)}
					</Flex>
				)}
			</Box>

			{/* Filters and Actions */}
			<Flex
				direction={{ base: "column", md: "row" }}
				gap={3}
				align={{ base: "stretch", md: "center" }}
				justify="space-between"
			>
				{/* Filters */}
				<Flex gap={3} flex={1} flexWrap="wrap">
					<Input
						placeholder="Search services..."
						value={filters.searchQuery || ""}
						onChange={(e) =>
							setFilters((prev) => ({
								...prev,
								searchQuery: e.target.value,
							}))
						}
						maxW="250px"
					/>
					<Select
						value={filters.status || "all"}
						onChange={(e) =>
							setFilters((prev) => ({
								...prev,
								status: e.target
									.value as VerificationFilterOptions["status"],
							}))
						}
						maxW="180px"
						bg="white"
					>
						<option value="all">All Statuses</option>
						<option value="success">Success</option>
						<option value="failed">Failed</option>
						<option value="in_progress">In Progress</option>
						<option value="pending">Pending</option>
					</Select>
				</Flex>

				{/* Export Actions - only show when complete */}
				{isComplete && (
					<Flex gap={2}>
						{onDownloadJson && (
							<Button
								size="sm"
								variant="outline"
								onClick={onDownloadJson}
								leftIcon={<Text>{"</>"}</Text>}
							>
								Download JSON
							</Button>
						)}
						{onDownloadPdf && (
							<Button
								size="sm"
								variant="outline"
								onClick={onDownloadPdf}
								leftIcon={<Text>📄</Text>}
							>
								Download PDF
							</Button>
						)}
					</Flex>
				)}
			</Flex>

			{/* Results List */}
			<VStack spacing={3} align="stretch">
				{filteredResults.length === 0 ? (
					<Box textAlign="center" py={8}>
						<Text color="gray.500">No results to display</Text>
					</Box>
				) : (
					filteredResults.map((result) => (
						<VerificationResultCard
							key={result.serviceCode}
							result={result}
							defaultExpanded={
								result.status === "success" ||
								result.status === "failed" ||
								result.status === "in_progress"
							}
						/>
					))
				)}
			</VStack>
		</VStack>
	);
};

export default VerificationResultList;
