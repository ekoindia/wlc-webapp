import {
	Badge,
	Box,
	Flex,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { Button, Icon } from "components";
import { useUser } from "contexts";
import { getDateDistance } from "libs/dateFormat";
import { useCallback, useEffect, useRef } from "react";
import { useBulkPayout } from "../context/BulkPayoutContext";
import { BatchStatus } from "../context/types";
import { useBulkPayoutApi } from "../hooks/useBulkPayoutApi";

const POLLING_INTERVAL = 5000; // 5 seconds

/**
 * Status badge color mapping
 * @param status
 */
const getStatusBadgeProps = (status: BatchStatus) => {
	switch (status) {
		case "SUCCESS":
			return { colorScheme: "green", label: "Success" };
		case "PROCESSING":
			return { colorScheme: "blue", label: "Processing" };
		case "FAILED":
			return { colorScheme: "red", label: "Failed" };
		case "PARTIAL":
			return { colorScheme: "yellow", label: "Partial" };
		case "INITIATED":
		default:
			return { colorScheme: "gray", label: "Initiated" };
	}
};

/**
 * BatchHistory component displaying list of batch uploads
 * Tab 2 in the main view
 */
const BatchHistory = () => {
	const { batches, isLoadingHistory } = useBulkPayout();
	const { fetchBatchList, fetchBatchStatus, downloadReport } =
		useBulkPayoutApi();
	const { userData } = useUser();
	const pollingRef = useRef<NodeJS.Timeout | null>(null);

	// Fetch batch list on mount
	useEffect(() => {
		if (userData?.user_code && userData?.org_id) {
			fetchBatchList(userData.user_code, userData.org_id);
		}
	}, [userData?.user_code, userData?.org_id, fetchBatchList]);

	// Polling for PROCESSING batches
	const pollProcessingBatches = useCallback(() => {
		const processingBatches = batches.filter(
			(batch) => batch.status === "PROCESSING"
		);
		processingBatches.forEach((batch) => {
			fetchBatchStatus(batch.batchNumber);
		});
	}, [batches, fetchBatchStatus]);

	useEffect(() => {
		const hasProcessingBatches = batches.some(
			(batch) => batch.status === "PROCESSING"
		);

		if (hasProcessingBatches) {
			// Start polling
			pollingRef.current = setInterval(
				pollProcessingBatches,
				POLLING_INTERVAL
			);
		} else {
			// Stop polling
			if (pollingRef.current) {
				clearInterval(pollingRef.current);
				pollingRef.current = null;
			}
		}

		return () => {
			if (pollingRef.current) {
				clearInterval(pollingRef.current);
			}
		};
	}, [batches, pollProcessingBatches]);

	const handleDownload = (batchNumber: string) => {
		downloadReport(batchNumber);
	};

	const handleRefresh = () => {
		if (userData?.user_code && userData?.org_id) {
			fetchBatchList(userData.user_code, userData.org_id);
		}
	};

	if (isLoadingHistory) {
		return (
			<Flex justify="center" align="center" minH="200px">
				<Text color="light">Loading batch history...</Text>
			</Flex>
		);
	}

	if (batches.length === 0) {
		return (
			<Flex
				direction="column"
				align="center"
				justify="center"
				minH="200px"
				gap="4"
			>
				<Icon name="inbox" size="xl" color="gray.300" />
				<Text color="light">No batch uploads yet</Text>
				<Button onClick={handleRefresh} size="sm" variant="ghost">
					<Icon name="refresh-cw" size="sm" />
					&nbsp; Refresh
				</Button>
			</Flex>
		);
	}

	return (
		<Flex direction="column" gap="4">
			{/* Header with refresh */}
			<Flex justify="space-between" align="center">
				<Text fontWeight="semibold" color="dark">
					Recent Uploads (Last 30 days)
				</Text>
				<Button onClick={handleRefresh} size="sm" variant="ghost">
					<Icon name="refresh-cw" size="sm" />
				</Button>
			</Flex>

			{/* Table */}
			<Box
				overflowX="auto"
				borderRadius="12px"
				border="1px solid"
				borderColor="divider"
			>
				<Table variant="simple" size="sm">
					<Thead bg="gray.50">
						<Tr>
							<Th>Date</Th>
							<Th>Customer</Th>
							<Th isNumeric>Records</Th>
							<Th isNumeric>Amount</Th>
							<Th>Status</Th>
							<Th isNumeric>Success</Th>
							<Th isNumeric>Failed</Th>
							<Th>Action</Th>
						</Tr>
					</Thead>
					<Tbody>
						{batches.map((batch) => {
							const statusProps = getStatusBadgeProps(
								batch.status
							);
							const isProcessing = batch.status === "PROCESSING";
							const canDownload =
								batch.status !== "PROCESSING" &&
								batch.status !== "INITIATED";

							return (
								<Tr key={batch.batchNumber}>
									<Td>
										<Text fontSize="xs" color="dark">
											{getDateDistance(
												batch.createdDate,
												new Date().toISOString()
											)}
										</Text>
									</Td>
									<Td>
										<Text
											fontSize="xs"
											fontWeight="medium"
											color="dark"
										>
											{batch.customerName}
										</Text>
										<Text fontSize="xs" color="light">
											{batch.customerNumber}
										</Text>
									</Td>
									<Td isNumeric>
										<Text fontSize="xs">
											{batch.totalRecords}
										</Text>
									</Td>
									<Td isNumeric>
										<Text fontSize="xs" fontWeight="medium">
											₹
											{batch.totalAmount.toLocaleString(
												"en-IN"
											)}
										</Text>
									</Td>
									<Td>
										<Badge
											colorScheme={
												statusProps.colorScheme
											}
											fontSize="xs"
											px="2"
											py="0.5"
											borderRadius="full"
										>
											{isProcessing && (
												<Box
													as="span"
													display="inline-block"
													w="6px"
													h="6px"
													borderRadius="full"
													bg="blue.500"
													mr="1"
													animation="pulse 1.5s infinite"
												/>
											)}
											{statusProps.label}
										</Badge>
									</Td>
									<Td isNumeric>
										<Text fontSize="xs" color="green.600">
											{batch.successCount}
										</Text>
									</Td>
									<Td isNumeric>
										<Text fontSize="xs" color="red.600">
											{batch.failureCount}
										</Text>
									</Td>
									<Td>
										{canDownload ? (
											<Button
												size="xs"
												variant="ghost"
												onClick={() =>
													handleDownload(
														batch.batchNumber
													)
												}
											>
												<Icon
													name="download"
													size="sm"
												/>
											</Button>
										) : (
											<Text fontSize="xs" color="light">
												-
											</Text>
										)}
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</Box>
		</Flex>
	);
};

export default BatchHistory;
