/**
 * VerificationResultsPage - Page component showing verification progress and results.
 * Loads data from sessionStorage and displays progressive results.
 */

import { Box, Card, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { Button, PageTitle } from "components";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { VerificationResultList } from "../components";
import { useKycVerification } from "../hooks";
import type { VerificationService } from "../types";

interface StoredVerificationData {
	formData: Record<string, unknown>;
	services: VerificationService[];
	timestamp: number;
}

/**
 * VerificationResultsPage component.
 */
export const VerificationResultsPage = (): JSX.Element => {
	const router = useRouter();
	const hasStarted = useRef(false);
	const [initialData, setInitialData] =
		useState<StoredVerificationData | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const { state, startVerification, progressText } = useKycVerification();

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

	// Handle download JSON
	const handleDownloadJson = useCallback(() => {
		const jsonData = JSON.stringify(
			{
				timestamp: new Date().toISOString(),
				results: state.results,
			},
			null,
			2
		);
		const blob = new Blob([jsonData], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `kyc-verification-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}, [state.results]);

	// Handle download PDF
	const handleDownloadPdf = useCallback(() => {
		// Use print functionality for now
		window.print();
	}, []);

	// Handle "Go Back" button
	const handleGoBack = useCallback(() => {
		router.push("/products/kyc-verification");
	}, [router]);

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
						<Card p={6} textAlign="center" w="100%">
							<Text color="red.500" mb={4}>
								{loadError}
							</Text>
							<Button onClick={handleGoBack}>
								Go to Services
							</Button>
						</Card>
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
			<Flex justify="center" w="100%">
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
							onDownloadJson={handleDownloadJson}
							onDownloadPdf={handleDownloadPdf}
						/>
					) : (
						<Card p={6} textAlign="center">
							<Text color="gray.500">
								Preparing verification...
							</Text>
						</Card>
					)}

					{/* Actions */}
					{state.status === "completed" && (
						<Box pt={4}>
							<Flex gap={3} justify="center">
								<Button
									variant="outline"
									onClick={handleGoBack}
									icon="refresh"
								>
									Verify More
								</Button>
								<Button
									onClick={handleGoBack}
									icon="arrow-forward"
									iconPosition="right"
								>
									Back to Services
								</Button>
							</Flex>
						</Box>
					)}
				</VStack>
			</Flex>
		</>
	);
};

export default VerificationResultsPage;
