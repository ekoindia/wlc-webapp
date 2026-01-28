import { DownloadIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Badge,
	Box,
	Flex,
	HStack,
	IconButton,
	keyframes,
	Spinner,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useBreakpointValue,
} from "@chakra-ui/react";
import { Button, Card, Icon, PageTitle, Pagination } from "components";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { formatDateTime } from "libs/dateFormat";
import { useCallback, useEffect, useState } from "react";
import { saveDataToFile } from "utils";
import {
	useBulkPayout,
	useBulkPayoutContext,
} from "../context/BulkPayoutContext";
import HistoryCard from "./HistoryCard";

// Blinking animation for watch icon
const blinkAnimation = keyframes`
	0%, 100% { opacity: 1; }
	50% { opacity: 0.3; }
`;

const BULK_PAYOUT_TF_URIS = {
	SINGLE_BATCH: "/bulk/upload/batch",
	DOWNLOAD_REPORT: "/bulk/upload/report",
	BATCH_LIST: "/bulk/upload/batch/list",
} as const;

const TF_ROOT_PATH = "/api/v1";

export interface ApiBatch {
	batchNumber: string;
	batchUploadDate: string;
	customerName: string;
	totalRecords: number;
	totalAmount: number;
	invalidRecords: number;
	successCount: number;
	failureCount: number;
	pendingCount: number;
	totalRecordsApproved: number;
}

export type BatchStatus = "PROCESSING" | "PROCESSED";

/**
 * Derive batch status from success/failure/pending counts
 * @param {ApiBatch} batch - Batch data from API
 * @returns {BatchStatus} Status derived from counts
 */
const deriveBatchStatus = (batch: ApiBatch): BatchStatus => {
	const processedTotal =
		batch.successCount +
		batch.failureCount +
		batch.pendingCount +
		batch.invalidRecords;

	if (processedTotal !== batch.totalRecords) return "PROCESSING";
	return "PROCESSED";
};

/**
 * Status badge color mapping with icons
 * @param {BatchStatus} status - Batch status
 * @returns {Record<string, string>} Badge props with color scheme, label, and icon
 */
const getStatusBadgeProps = (
	status: BatchStatus
): { colorScheme: string; label: string; icon: string } => {
	switch (status) {
		case "PROCESSING":
			return {
				colorScheme: "blue",
				label: "Processing",
				icon: "access-time",
			};
		case "PROCESSED":
		default:
			return {
				colorScheme: "green",
				label: "Processed",
				icon: "check",
			};
	}
};

/**
 * BatchHistory component displaying list of batch uploads
 * Shows real data fetched from API with upload date and download functionality
 * @returns {JSX.Element} Batch history table
 */
const BatchHistory: React.FC = (): JSX.Element => {
	const pageSize = 8;
	const [batches, setBatches] = useState<ApiBatch[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [pollingBatchNumbers, setPollingBatchNumbers] = useState<Set<string>>(
		new Set()
	);
	const { accessToken } = useSession();
	const {
		state: { activeTab },
	} = useBulkPayoutContext();

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	const { setProcessingBatchCount } = useBulkPayout();

	/**
	 * Sort batches: Processing first, then by upload date (newest first)
	 * @param batchList
	 */
	const sortBatches = (batchList: ApiBatch[]): ApiBatch[] => {
		return [...batchList].sort((a, b) => {
			const statusA = deriveBatchStatus(a);
			const statusB = deriveBatchStatus(b);

			// Processing status comes first
			if (statusA === "PROCESSING" && statusB !== "PROCESSING") return -1;
			if (statusA !== "PROCESSING" && statusB === "PROCESSING") return 1;

			// Otherwise, sort by date (newest first)
			const dateA = new Date(a.batchUploadDate).getTime();
			const dateB = new Date(b.batchUploadDate).getTime();
			return dateB - dateA;
		});
	};

	/**
	 * Fetch single batch data for polling
	 * @param {string} batchNumber - Batch number to fetch
	 */
	const fetchSingleBatch = useCallback(
		async (batchNumber: string): Promise<ApiBatch | null> => {
			try {
				if (!accessToken) return null;

				const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${Endpoints.TRANSACTION}`;
				const response = await fetcher(url, {
					headers: {
						"tf-req-uri-root-path": TF_ROOT_PATH,
						"tf-req-uri": `${BULK_PAYOUT_TF_URIS.SINGLE_BATCH}?batchNumber=${batchNumber}`,
						"tf-req-method": "GET",
					},
					body: {},
					token: accessToken,
				});

				if (response?.status === 0 && response?.batch) {
					return response.batch;
				}
				return null;
			} catch (error) {
				console.error(` Failed to fetch batch ${batchNumber}:`, error);
				return null;
			}
		},
		[accessToken]
	);

	/**
	 * Update a single batch in the batches array
	 * @param {ApiBatch} updatedBatch - Updated batch data
	 */
	const updateBatchInList = useCallback(
		(updatedBatch: ApiBatch) => {
			setBatches((prevBatches) => {
				const updatedList = prevBatches.map((batch) =>
					batch.batchNumber === updatedBatch.batchNumber
						? updatedBatch
						: batch
				);
				const sortedList = sortBatches(updatedList);

				// Recalculate processing batch count after update
				const processingCount = sortedList.filter(
					(batch) => deriveBatchStatus(batch) === "PROCESSING"
				).length;
				setProcessingBatchCount(processingCount);

				return sortedList;
			});
		},
		[setProcessingBatchCount]
	);

	// fetch batches from API
	const fetchBatches = useCallback(async () => {
		// const userCode = userData.userDetails.code;
		// const orgId = userData.userDetails.org_id;

		setIsLoading(true);

		try {
			if (!accessToken) throw new Error("Access token not found");

			const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${Endpoints.TRANSACTION}`;

			const response = await fetcher(url, {
				headers: {
					"tf-req-uri-root-path": TF_ROOT_PATH,
					"tf-req-uri": `${BULK_PAYOUT_TF_URIS.BATCH_LIST}?service_code=45`,
					"tf-req-method": "GET",
				},
				body: {},
				token: accessToken,
			});

			// console.log("response", response);

			if (response?.status === 0 && Array.isArray(response?.batchList)) {
				console.log(
					"Batches received:",
					response.batchList.length,
					"items"
				);
				const sortedBatches = sortBatches(response.batchList);
				setBatches(sortedBatches);

				// Identify processing batches and start polling
				const processingBatches = sortedBatches.filter(
					(batch) => deriveBatchStatus(batch) === "PROCESSING"
				);
				const processingBatchNumbers = new Set(
					processingBatches.map((batch) => batch.batchNumber)
				);
				setPollingBatchNumbers(processingBatchNumbers);

				// Update context with processing batch count
				setProcessingBatchCount(processingBatches.length);
			} else {
				console.warn(
					" Unexpected response format (no batchList or status != 1)",
					response
				);
				setBatches([]);
				setProcessingBatchCount(0);
			}
		} catch (error) {
			console.error("Fetch failed:", error);
		} finally {
			setIsLoading(false);
		}
	}, [accessToken]);

	/**
	 * Initial data fetcher for the Batch History.
	 * Triggered specifically when the user navigates to the 'history' tab.
	 */
	useEffect(() => {
		if (activeTab === "history") {
			fetchBatches();
		}
	}, [fetchBatches, activeTab]);

	/**
	 * Polling effect to monitor batches currently in 'PROCESSING' status.
	 * Runs every 5 seconds for each batch in the polling set.
	 * @listens activeTab - Only executes when on the "history" tab.
	 * @listens pollingBatchNumbers - Manages individual intervals for each batch ID.
	 */
	useEffect(() => {
		// Only poll if on history tab and have batches to poll
		if (activeTab !== "history" || pollingBatchNumbers.size === 0) return;

		const intervals: Record<string, NodeJS.Timeout> = {};

		pollingBatchNumbers.forEach((batchNumber) => {
			intervals[batchNumber] = setInterval(async () => {
				const updatedBatch = await fetchSingleBatch(batchNumber);

				if (updatedBatch) {
					updateBatchInList(updatedBatch);

					// Check if batch is now processed
					const status = deriveBatchStatus(updatedBatch);
					if (status === "PROCESSED") {
						// Stop polling for this batch
						setPollingBatchNumbers((prev) => {
							const newSet = new Set(prev);
							newSet.delete(batchNumber);
							return newSet;
						});
					}
				}
			}, 5000); // Poll every 5 seconds
		});

		// Cleanup intervals on unmount or when polling list changes
		return () => {
			Object.values(intervals).forEach((interval) =>
				clearInterval(interval)
			);
		};
	}, [activeTab, pollingBatchNumbers, fetchSingleBatch, updateBatchInList]);

	/**
	 * Resets the pagination to the first page and re-fetches the batch data.
	 * Use this to manually sync the UI with the latest server state.
	 */
	const handleRefresh = useCallback(() => {
		setCurrentPage(1);
		fetchBatches();
	}, [fetchBatches]);

	/**
	 * Fetches and triggers the download of a report for a specific batch.
	 * @async
	 * @param {string} batchNumber - The unique identifier of the batch to download.
	 * @returns {Promise<void>} - Resolves once the file download is triggered.
	 * @throws Will log an error to the console if the API request fails or blob generation fails.
	 */
	const downloadReport = useCallback(
		async (batchNumber: string) => {
			try {
				const data = await fetcher(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}${Endpoints.TRANSACTION}`,
					{
						headers: {
							"tf-req-uri-root-path": TF_ROOT_PATH,
							"tf-req-uri": `${BULK_PAYOUT_TF_URIS.DOWNLOAD_REPORT}?batchNumber=${batchNumber}`,
							"tf-req-method": "GET",
						},
						body: {},
						token: accessToken,
					}
				);

				const blob = data?.file?.blob;
				const filename = data?.file?.name ?? "report.xlsx";
				const type = data?.file?.["content-type"];

				if (blob) {
					saveDataToFile(blob, filename, type, true);
				}
			} catch (error) {
				console.error("Error downloading batch report", error);
			}
		},
		[accessToken]
	);

	const handleDownload = useCallback(
		(batchNumber: string) => {
			downloadReport(batchNumber);
		},
		[downloadReport]
	);

	// Convert Batches to Paginated Batches Render logic
	const paginatedBatches = batches.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	if (batches.length === 0) {
		return (
			<Flex
				direction="column"
				align="center"
				justify="center"
				minH="400px"
				gap="4"
			>
				<Icon name="inbox" size="xl" color="gray.300" />
				<Text color="light">No batch uploads yet</Text>
				<Button onClick={handleRefresh} size="sm" variant="ghost">
					<Icon name="refresh" size="sm" />
					&nbsp; Refresh
				</Button>
			</Flex>
		);
	}

	return (
		<Flex direction="column">
			<PageTitle title="Bulk Payment History" hideBackIcon />

			<Box>
				{isLoading ? (
					<Flex justify="center" align="center" minH="300px">
						<Spinner />
					</Flex>
				) : isSmallScreen ? (
					/* Mobile View: Stack of HistoryCards */
					<Stack spacing="4">
						{paginatedBatches.map((batch) => {
							const status = deriveBatchStatus(batch);
							const statusProps = getStatusBadgeProps(status);
							const isProcessing = status === "PROCESSING";
							const totalCount =
								batch.successCount +
								batch.failureCount +
								batch.invalidRecords +
								batch.pendingCount;
							const processedCount = Math.min(
								totalCount,
								batch.totalRecords
							);
							const canDownload = status === "PROCESSED";

							return (
								<HistoryCard
									key={batch.batchNumber}
									batch={batch}
									statusProps={statusProps}
									isProcessing={isProcessing}
									processedCount={processedCount}
									canDownload={canDownload}
									onDownload={handleDownload}
								/>
							);
						})}
					</Stack>
				) : (
					/* Desktop View: Table  */
					<Card maxW="100%" w="100%" h="auto" p={{ base: 4, md: 4 }}>
						<Box overflowX="auto">
							<Table variant="simple" size="sm">
								<Thead bg="shade">
									<Tr>
										<Th textAlign="center">Upload Date</Th>
										<Th textAlign="center">Vendor</Th>
										<Th textAlign="center" isNumeric>
											Records
										</Th>
										<Th textAlign="center" isNumeric>
											Amount
										</Th>
										<Th textAlign="center">Status</Th>
										<Th textAlign="center" isNumeric>
											Approved
										</Th>
										<Th textAlign="center" isNumeric>
											Invalid
										</Th>
										<Th textAlign="center" isNumeric>
											Success
										</Th>
										<Th textAlign="center" isNumeric>
											Pending
										</Th>
										<Th textAlign="center" isNumeric>
											Failed
										</Th>
										<Th textAlign="center">Action</Th>
									</Tr>
								</Thead>
								<Tbody>
									{paginatedBatches.map((batch) => {
										const totalCount =
											batch.successCount +
											batch.failureCount +
											batch.invalidRecords +
											batch.pendingCount;
										const status = deriveBatchStatus(batch);
										const statusProps =
											getStatusBadgeProps(status);
										const isProcessing =
											status === "PROCESSING";
										const processedCount = Math.min(
											totalCount,
											batch.totalRecords
										);
										const canDownload =
											status === "PROCESSED";

										return (
											<Tr key={batch.batchNumber}>
												<Td>
													<Text fontSize="sm">
														{formatDateTime(
															batch.batchUploadDate
														)}
													</Text>
												</Td>
												<Td>
													<HStack gap="3" spacing={0}>
														<Avatar
															name={
																batch.customerName
															}
															size="sm"
															bg="primary.light"
															color="white"
															fontSize="xs"
														/>
														<Text
															fontSize="sm"
															fontWeight="medium"
															color="dark"
														>
															{batch.customerName}
														</Text>
													</HStack>
												</Td>
												<Td isNumeric>
													<Text fontSize="sm">
														{batch.totalRecords}
													</Text>
												</Td>
												<Td isNumeric>
													<Text
														fontSize="sm"
														fontWeight="medium"
													>
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
														justifyContent="center"
														fontSize="xs"
														px="2"
														py="1"
														borderRadius="full"
														whiteSpace="nowrap"
														display="inline-flex"
														alignItems="center"
														gap="1"
													>
														<Box
															as="span"
															display="inline-flex"
															alignItems="center"
															animation={
																isProcessing
																	? `${blinkAnimation} 1.5s infinite`
																	: "none"
															}
														>
															<Icon
																name={
																	statusProps.icon
																}
																size="xs"
															/>
														</Box>
														<Text as="span">
															{statusProps.label}
														</Text>
														{isProcessing && (
															<Text
																as="span"
																ml="1"
																fontWeight="semibold"
															>
																{processedCount
																	.toString()
																	.padStart(
																		2,
																		"0"
																	)}
																|
																{batch.totalRecords
																	.toString()
																	.padStart(
																		2,
																		"0"
																	)}
															</Text>
														)}
													</Badge>
												</Td>
												<Td isNumeric>
													<Text
														fontSize="xs"
														color="green.600"
													>
														{
															batch.totalRecordsApproved
														}
													</Text>
												</Td>
												<Td isNumeric>
													<Text
														fontSize="xs"
														color="red.600"
													>
														{batch.invalidRecords}
													</Text>
												</Td>
												<Td isNumeric>
													<Text
														fontSize="xs"
														color="green.600"
													>
														{batch.successCount}
													</Text>
												</Td>
												<Td isNumeric>
													<Text
														fontSize="xs"
														color="yellow.600"
													>
														{batch.pendingCount}
													</Text>
												</Td>
												<Td isNumeric>
													<Text
														fontSize="xs"
														color="red.600"
													>
														{batch.failureCount}
													</Text>
												</Td>
												<Td>
													<Flex justify="center">
														{isProcessing ? (
															<Spinner
																size="sm"
																color="blue.500"
																thickness="2px"
															/>
														) : canDownload ? (
															<IconButton
																aria-label="Download Report"
																icon={
																	<DownloadIcon />
																}
																size="xs"
																variant="ghost"
																onClick={() =>
																	handleDownload(
																		batch.batchNumber
																	)
																}
																title="Download Report"
															/>
														) : (
															<Text
																fontSize="xs"
																color="light"
															>
																-
															</Text>
														)}
													</Flex>
												</Td>
											</Tr>
										);
									})}
								</Tbody>
							</Table>
						</Box>
					</Card>
				)}
			</Box>
			<Box mb={{ base: "9", md: "none" }}>
				<Pagination
					pageSize={pageSize}
					totalCount={batches.length}
					currentPage={currentPage}
					onPageChange={setCurrentPage}
				/>
			</Box>
		</Flex>
	);
};

export default BatchHistory;
