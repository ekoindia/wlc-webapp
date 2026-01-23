/**
 * VerificationResultsPage - Page component showing verification progress and results.
 * Loads data from sessionStorage and displays progressive results.
 * Includes conditional action buttons based on verification outcome.
 */

import {
	Alert,
	AlertIcon,
	Box,
	Flex,
	Spinner,
	Text,
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
import {
	ANDROID_ACTION,
	doAndroidAction,
	saveDataToFile,
	toKebabCase,
} from "utils";
import { VerificationResultList } from "../components";
import { KYC_REPORT_DOWNLOAD_INTERACTION_ID } from "../constants";
import { useKycServices, useKycVerification } from "../hooks";
import type { RetryData, VerificationService } from "../types";

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

	const { accessToken } = useSession();
	const { isAndroid } = useAppSource();

	const { getServicesByCodes } = useKycServices();

	const {
		state,
		startVerification,
		progressText,
		failedCount,
		successCount,
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

	/**
	 * Get comma-separated tids from all verification results (success and failed).
	 * The PDF report will contain information about all processed verifications.
	 * @returns {string} Comma-separated transaction IDs
	 */
	const getAllTids = useCallback((): string => {
		return state.results
			.filter((r) => r.tid)
			.map((r) => r.tid)
			.join(",");
	}, [state.results]);

	/**
	 * Handle download PDF - calls API with tids to download verification report.
	 */
	const handleDownloadPdf = useCallback(async (): Promise<void> => {
		const tids = getAllTids();

		if (!tids) {
			toast({
				title: "No results to download",
				description: "There are no verification results to download.",
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
						tids,
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
	}, [getAllTids, accessToken, isAndroid, toast]);

	// Handle "Back to Services" button
	const handleBackToServices = useCallback(() => {
		router.push(basePath);
	}, [router, basePath]);

	// Handle "Home" button
	const handleGoHome = useCallback(() => {
		router.push("/");
	}, [router]);

	// Handle "Retry Failed Services" button - navigate to form with failed services
	const handleRetryFailed = useCallback(() => {
		// Get failed services and their form data
		const failedServiceCodes =
			state.results
				?.filter((r) => r.status === "failed")
				.map((r) => r.serviceCode) || [];

		if (failedServiceCodes.length === 0 || !state.formData) return;

		// Store retry data in sessionStorage for form page to pick up
		const retryData: RetryData = {
			formData: state.formData,
			failedServiceCodes,
			isRetryMode: true,
			timestamp: Date.now(),
		};
		sessionStorage.setItem("kyc_retry_data", JSON.stringify(retryData));

		// Get service objects to convert codes to slugs for SEO-friendly URLs
		const failedServices = getServicesByCodes(failedServiceCodes);
		const failedSlugs = failedServices.map((s) => toKebabCase(s.name));

		// Navigate to form page with slugified service names
		const path =
			failedSlugs.length === 1
				? `${basePath}/${failedSlugs[0]}`
				: `${basePath}/${failedSlugs.join("/")}`;
		router.push(path);
	}, [state.results, state.formData, basePath, router, getServicesByCodes]);

	// Determine button text for retry
	const retryButtonText = useMemo(() => {
		if (failedCount === 1) {
			return "Retry Failed Service";
		}
		return `Retry Failed Services (${failedCount})`;
	}, [failedCount]);

	// Check if all verifications were successful
	const allSuccessful = useMemo(() => {
		return (
			state.status === "completed" &&
			failedCount === 0 &&
			successCount > 0
		);
	}, [state.status, failedCount, successCount]);

	// Check if there are any failures
	const hasFailures = useMemo(() => {
		return state.status === "completed" && failedCount > 0;
	}, [state.status, failedCount]);

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
		: state.status === "completed"
			? "Verification Complete"
			: "Verification Results";

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
					{/* Results List */}
					{state.results.length > 0 ? (
						<VerificationResultList
							results={state.results}
							currentIndex={state.currentIndex}
							totalCount={state.totalCount}
							isComplete={state.status === "completed"}
							successCount={successCount}
							failedCount={failedCount}
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
					{state.status === "completed" && (
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
		</>
	);
};

export default VerificationResultsPage;
