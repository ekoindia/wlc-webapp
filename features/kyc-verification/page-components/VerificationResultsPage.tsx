/**
 * VerificationResultsPage - Page component showing verification progress and results.
 * Loads data from sessionStorage and displays progressive results.
 * Includes conditional action buttons based on verification outcome.
 * Supports retry via modal - preserving success results and merging retry results.
 */

import {
	Alert,
	AlertIcon,
	Box,
	Flex,
	Spinner,
	Text,
	useDisclosure,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { Button, PageTitle } from "components";
import ActionButtonGroup from "components/ActionButtonGroup/ActionButtonGroup";
import { Endpoints } from "constants/EndPoints";
import { useAppSource, useSession } from "contexts";
import { fetcher } from "helpers";
import { formatDateTime } from "libs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ANDROID_ACTION, doAndroidAction, saveDataToFile } from "utils";
import { RetryFormModal, VerificationResultList } from "../components";
import { KYC_REPORT_DOWNLOAD_INTERACTION_ID } from "../constants";
import {
	mergeVerificationResults,
	useKycServices,
	useKycVerification,
} from "../hooks";
import type { VerificationResult, VerificationService } from "../types";

interface StoredVerificationData {
	formData: Record<string, unknown>;
	services: VerificationService[];
	timestamp: number;
}

interface VerificationResultsPageProps {
	/** Base path for navigation (defaults to /products/kyc-verification) */
	basePath?: string;
}

/**
 * Verification results page component.
 * Loads verification data from sessionStorage and displays progressive results.
 * Includes conditional action buttons based on verification outcome.
 * Supports retry via modal - preserving success results and merging retry results.
 * @param {VerificationResultsPageProps} [props] - Component props
 * @param {string} [props.basePath] - Base path for navigation (defaults to /products/kyc-verification)
 * @returns {JSX.Element} Rendered results page with progress and result cards
 */
export const VerificationResultsPage = ({
	basePath = "/products/kyc-verification",
}: VerificationResultsPageProps = {}): JSX.Element => {
	const router = useRouter();
	const toast = useToast();
	const hasStarted = useRef(false);
	const [initialData, setInitialData] =
		useState<StoredVerificationData | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isDownloading, setIsDownloading] = useState(false);
	const [completedAt, setCompletedAt] = useState<string | undefined>(
		undefined
	);

	// Retry modal state
	const {
		isOpen: isRetryModalOpen,
		onOpen: openRetryModal,
		onClose: closeRetryModal,
	} = useDisclosure();

	// Preserved success results for merging after retry
	const [preservedSuccessResults, setPreservedSuccessResults] = useState<
		VerificationResult[]
	>([]);

	// Merged results state - holds final combined results after retry
	const [mergedResults, setMergedResults] = useState<VerificationResult[]>(
		[]
	);

	// Track edited form data to preserve user changes across retry modal opens/closes
	const [lastEditedFormData, setLastEditedFormData] = useState<
		Record<string, unknown>
	>({});

	const { accessToken } = useSession();
	const { isAndroid } = useAppSource();

	const { getServicesByCodes } = useKycServices();

	const {
		state,
		startVerification,
		progressText,
		failedCount: _failedCount,
		successCount: _successCount,
	} = useKycVerification();

	// Load verification data from sessionStorage on mount
	useEffect(() => {
		try {
			const storedData = sessionStorage.getItem("kyc_verification_data");
			if (storedData) {
				const parsed = JSON.parse(storedData) as StoredVerificationData;

				// Check if data is not too old (5 minutes)
				const isExpired = Date.now() - parsed.timestamp > 5 * 60 * 1000;
				if (isExpired) {
					setLoadError(
						"Verification session expired. Please try again."
					);
					sessionStorage.removeItem("kyc_verification_data");
				} else {
					setInitialData(parsed);
				}
			} else {
				setLoadError(
					"No verification data found. Please select services to verify."
				);
			}
		} catch (err) {
			console.error("Error loading verification data:", err);
			setLoadError("Failed to load verification data.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Start verification once we have data
	useEffect(() => {
		if (initialData && !hasStarted.current && state.status === "idle") {
			hasStarted.current = true;
			startVerification(initialData.services, initialData.formData);
			// Clear sessionStorage after starting
			sessionStorage.removeItem("kyc_verification_data");
		}
	}, [initialData, startVerification, state.status]);

	// Set completion timestamp when verification completes
	useEffect(() => {
		if (state.status === "completed" && !completedAt) {
			setCompletedAt(formatDateTime(new Date().toISOString()));
		}
	}, [state.status, completedAt]);

	// Computed display values - use merged results if available, otherwise use state results
	const displayResults = useMemo(
		() => (mergedResults.length > 0 ? mergedResults : state.results),
		[mergedResults, state.results]
	);

	const displaySuccessCount = useMemo(
		() => displayResults.filter((r) => r.status === "success").length,
		[displayResults]
	);

	const displayFailedCount = useMemo(
		() => displayResults.filter((r) => r.status === "failed").length,
		[displayResults]
	);

	// Get failed services for retry modal
	const failedServicesForRetry = useMemo(() => {
		const currentResults =
			mergedResults.length > 0 ? mergedResults : state.results;
		const failedServiceCodes = currentResults
			.filter((r) => r.status === "failed")
			.map((r) => r.serviceCode);
		return getServicesByCodes(failedServiceCodes);
	}, [mergedResults, state.results, getServicesByCodes]);

	// Get form data for retry - use last edited data if available, fallback to state.formData
	const formDataForRetry = useMemo(() => {
		if (Object.keys(lastEditedFormData).length > 0) {
			return lastEditedFormData;
		}
		return state.formData ?? {};
	}, [lastEditedFormData, state.formData]);

	/**
	 * Get comma-separated client_ref_ids from all display results (success and failed).
	 * client_ref_id is extracted from the result object itself (stored during API call).
	 * Uses merged results if available for accurate report generation.
	 * @returns {string} Comma-separated client reference IDs
	 */
	const getAllClientRefIds = useCallback((): string => {
		return displayResults
			.map((r) => r.clientRefId)
			.filter(Boolean)
			.join(",");
	}, [displayResults]);

	/**
	 * Handle download PDF - calls API with client_ref_ids to download verification report.
	 */
	const handleDownloadPdf = useCallback(async (): Promise<void> => {
		const clientRefIds = getAllClientRefIds();

		if (!clientRefIds) {
			toast({
				title: "No results to download",
				description:
					"There are no verification results with responses to download.",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setIsDownloading(true);

		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					headers: {
						"tf-is-file-download": "1",
					},
					body: {
						interaction_type_id: KYC_REPORT_DOWNLOAD_INTERACTION_ID,
						tids: clientRefIds,
					},
					token: accessToken,
				}
			);

			const blob = response?.file?.blob;
			const filename = response?.file?.name || "verification-report.pdf";
			const contentType =
				response?.file?.["content-type"] || "application/pdf";
			const isBase64 = true;

			if (blob) {
				if (isAndroid) {
					doAndroidAction(ANDROID_ACTION.SAVE_FILE_BLOB, {
						blob,
						name: filename,
					});
				} else {
					saveDataToFile(blob, filename, contentType, isBase64);
				}

				toast({
					title: "Report downloaded",
					description: "Verification report has been downloaded.",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				throw new Error("No file data in response");
			}
		} catch (err) {
			console.error("[VerificationResultsPage] Download error:", err);
			toast({
				title: "Download failed",
				description:
					"Failed to download the verification report. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsDownloading(false);
		}
	}, [getAllClientRefIds, accessToken, isAndroid, toast]);

	// Handle "Back to Services" button
	const handleBackToServices = useCallback(() => {
		router.push(basePath);
	}, [router, basePath]);

	// Handle "Home" button
	const handleGoHome = useCallback(() => {
		router.push("/");
	}, [router]);

	/**
	 * Handle "Retry Failed Services" button - opens modal instead of navigating.
	 * Preserves successful results (response_status_id === 0) for merging after retry.
	 */
	const handleRetryFailed = useCallback(() => {
		// Get current display results (either merged or state results)
		const currentResults =
			mergedResults.length > 0 ? mergedResults : state.results;

		// Preserve successful results (those with status === "success")
		// Success is determined by response_status_id === 0 in API response
		const successResults = currentResults.filter(
			(r) => r.status === "success"
		);
		setPreservedSuccessResults(successResults);

		// Open the retry modal
		openRetryModal();
	}, [state.results, mergedResults, openRetryModal]);

	/**
	 * Handle retry completion from modal.
	 * Merges new retry results with preserved success results.
	 * @param {VerificationResult[]} retryResults - Results from retry verification
	 */
	const handleRetryComplete = useCallback(
		(retryResults: VerificationResult[]) => {
			// Merge preserved success results with new retry results
			const merged = mergeVerificationResults(
				preservedSuccessResults,
				retryResults
			);
			setMergedResults(merged);

			// Update completion timestamp
			setCompletedAt(formatDateTime(new Date().toISOString()));

			// Close the modal
			closeRetryModal();

			// Show success toast
			const newSuccessCount = retryResults.filter(
				(r) => r.status === "success"
			).length;
			const newFailedCount = retryResults.filter(
				(r) => r.status === "failed"
			).length;

			if (newFailedCount === 0) {
				toast({
					title: "Retry successful",
					description: `All ${newSuccessCount} service(s) verified successfully.`,
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				toast({
					title: "Retry completed",
					description: `${newSuccessCount} succeeded, ${newFailedCount} still failed.`,
					status: newSuccessCount > 0 ? "warning" : "error",
					duration: 5000,
					isClosable: true,
				});
			}
		},
		[preservedSuccessResults, closeRetryModal, toast]
	);

	// Determine button text for retry - use display counts for accurate label
	const retryButtonText = useMemo(() => {
		if (displayFailedCount === 1) {
			return "Retry Failed Service";
		}
		return `Retry Failed Services (${displayFailedCount})`;
	}, [displayFailedCount]);

	// Check if all verifications were successful (use display counts after retry)
	const allSuccessful = useMemo(() => {
		// After retry, check merged results; otherwise check state
		const isComplete =
			mergedResults.length > 0 || state.status === "completed";
		return (
			isComplete && displayFailedCount === 0 && displaySuccessCount > 0
		);
	}, [
		state.status,
		mergedResults.length,
		displayFailedCount,
		displaySuccessCount,
	]);

	// Check if there are any failures (use display counts after retry)
	const hasFailures = useMemo(() => {
		const isComplete =
			mergedResults.length > 0 || state.status === "completed";
		return isComplete && displayFailedCount > 0;
	}, [state.status, mergedResults.length, displayFailedCount]);

	// Loading state
	if (isLoading) {
		return (
			<>
				<PageTitle title="Loading..." />
				<Flex justify="center" align="center" minH="200px">
					<Spinner size="lg" color="primary.DEFAULT" />
				</Flex>
			</>
		);
	}

	// Error state
	if (loadError) {
		return (
			<>
				<PageTitle title="Verification Results" />
				<Flex justify="center" w="100%">
					<VStack spacing={4} maxW="600px" w="100%" px={4}>
						<Box
							p={6}
							textAlign="center"
							w="100%"
							bg="white"
							borderRadius="lg"
							shadow="sm"
						>
							<Text color="error" mb={4}>
								{loadError}
							</Text>
							<Button onClick={handleBackToServices}>
								Go to Services
							</Button>
						</Box>
					</VStack>
				</Flex>
			</>
		);
	}

	const isVerifying = state.status === "in_progress";
	const pageTitle = isVerifying
		? `Verifying ${progressText}`
		: state.status === "completed" || mergedResults.length > 0
			? "Verification Complete"
			: "Verification Results";

	// Determine if we should show completed state (either from state or after retry merge)
	const isCompleted =
		state.status === "completed" || mergedResults.length > 0;

	return (
		<>
			<PageTitle title={pageTitle} />
			<Flex justify="center" w="100%" mb={{ base: "128px", md: "64px" }}>
				<VStack
					spacing={4}
					align="stretch"
					px={{ base: "4", md: "0" }}
					maxW="900px"
					w="100%"
				>
					{/* Results List - use displayResults for merged view after retry */}
					{displayResults.length > 0 ? (
						<VerificationResultList
							results={displayResults}
							currentIndex={
								mergedResults.length > 0
									? displayResults.length
									: state.currentIndex
							}
							totalCount={displayResults.length}
							isComplete={isCompleted}
							successCount={displaySuccessCount}
							failedCount={displayFailedCount}
							completedAt={completedAt}
							retryingIndices={state.retryingIndices}
							onDownloadPdf={handleDownloadPdf}
							isDownloading={isDownloading}
						/>
					) : (
						<Box
							p={6}
							textAlign="center"
							bg="white"
							borderRadius="lg"
							shadow="sm"
						>
							<Text color="gray.500">
								Preparing verification...
							</Text>
						</Box>
					)}

					{/* Action Buttons */}
					{isCompleted && (
						<>
							{/* Download warning for retry */}
							{hasFailures && (
								<Alert
									status="warning"
									borderRadius="md"
									py={3}
								>
									<AlertIcon />
									<Text fontSize="sm">
										Wait! If you need these results,
										download the report before retrying.
										After retry, they&apos;ll only be
										available in transaction history.
									</Text>
								</Alert>
							)}
							<ActionButtonGroup
								buttonConfigList={
									hasFailures
										? [
												{
													label: retryButtonText,
													onClick: handleRetryFailed,
													styles: {
														w: {
															base: "100%",
															md: "auto",
														},
														minW: {
															md: "200px",
														},
													},
													icon: "refresh",
													iconStyle: { size: "sm" },
												},
												{
													variant: "link",
													label: "Back to Services",
													onClick:
														handleBackToServices,
													styles: {
														w: {
															base: "100%",
															md: "auto",
														},
														minW: {
															md: "150px",
														},
													},
												},
											]
										: allSuccessful
											? [
													{
														label: "Verify More",
														onClick:
															handleBackToServices,
														styles: {
															w: {
																base: "100%",
																md: "200px",
															},
														},
														icon: "verified-user",
														iconStyle: {
															size: "xs",
														},
													},
													{
														variant: "link",
														label: "Home",
														onClick: handleGoHome,
														styles: {
															w: {
																base: "100%",
																md: "200px",
															},
														},
													},
												]
											: [
													{
														label: "Back to Services",
														onClick:
															handleBackToServices,

														styles: {
															bg: {
																base: "white",
																md: "primary.DEFAULT",
															},
															w: {
																base: "100%",
																md: "200px",
															},
														},
													},
												]
								}
								bg={{ base: "white", md: "none" }}
							/>
						</>
					)}
				</VStack>
			</Flex>

			{/* Retry Form Modal */}
			<RetryFormModal
				isOpen={isRetryModalOpen}
				onClose={closeRetryModal}
				failedServices={failedServicesForRetry}
				formData={formDataForRetry}
				onRetryComplete={handleRetryComplete}
				onFormDataChange={setLastEditedFormData}
				basePath={basePath}
			/>
		</>
	);
};

export default VerificationResultsPage;
