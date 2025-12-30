/**
 * Hook for managing KYC verification API calls.
 * Supports single and multi-service verification with progress tracking.
 * Scalable architecture for future OTP-based verifications.
 */

import { useEpsV3Fetch } from "hooks";
import { formatDateTime } from "libs";
import { useCallback, useState } from "react";
import type {
	VerificationResult,
	VerificationService,
	VerificationState,
} from "../types";

/**
 * Initial state for verification process.
 */
const INITIAL_STATE: VerificationState = {
	status: "idle",
	results: [],
	currentIndex: 0,
	totalCount: 0,
	formData: undefined,
	services: undefined,
	retryingIndices: undefined,
};

/**
 * Formats current timestamp for display using consistent date utilities.
 * @returns {string} Formatted timestamp string
 */
const getTimestamp = (): string => formatDateTime(new Date().toISOString());

/**
 * Filters form data to only include parameters relevant to a specific service.
 * @param {VerificationService} service - The service to filter parameters for
 * @param {Record<string, unknown>} formData - The complete form data object
 * @returns {Record<string, unknown>} Object containing only the parameters defined in the service's requestParams
 */
const getServiceSpecificParams = (
	service: VerificationService,
	formData: Record<string, unknown>
): Record<string, unknown> => {
	const serviceParamNames = new Set(service.requestParams.map((p) => p.name));
	return Object.fromEntries(
		Object.entries(formData).filter(([key]) => serviceParamNames.has(key))
	);
};

interface UseKycVerificationReturn {
	/** Current verification state */
	state: VerificationState;
	/** Start verification for given services with form data */
	startVerification: (
		_services: VerificationService[],
		_formData: Record<string, unknown>
	) => Promise<void>;
	/** Retry only failed services with same form data */
	retryFailedServices: () => Promise<void>;
	/** Reset verification state to initial */
	reset: () => void;
	/** Check if verification is in progress */
	isVerifying: boolean;
	/** Get progress percentage (0-100) */
	progressPercent: number;
	/** Get progress text (e.g., "2 of 5") */
	progressText: string;
	/** Count of failed services */
	failedCount: number;
	/** Count of successful services */
	successCount: number;
}

/**
 * Hook for managing KYC verification API calls.
 * Supports single and multi-service verification with progress tracking.
 * @returns {UseKycVerificationReturn} Object with verification state and control functions
 */
export const useKycVerification = (): UseKycVerificationReturn => {
	const [state, setState] = useState<VerificationState>(INITIAL_STATE);

	// Use EPS v3 fetch hook for API calls
	// We pass null as endpoint since we'll set it dynamically per service
	const [doVerification] = useEpsV3Fetch("");

	/**
	 * Initialize verification results for all services.
	 */
	const initializeResults = useCallback(
		(
			services: VerificationService[],
			formData: Record<string, unknown>
		): VerificationResult[] => {
			return services.map((service) => {
				// Filter to only include params relevant to this service
				const filteredData = getServiceSpecificParams(
					service,
					formData
				);
				return {
					serviceCode: service.serviceCode,
					serviceName: service.name,
					endpointPath: service.endpointPath,
					status: "pending",
					requestData: filteredData,
				};
			});
		},
		[]
	);

	/**
	 * Call API for a single service and update state.
	 */
	const verifyService = useCallback(
		async (
			service: VerificationService,
			formData: Record<string, unknown>,
			index: number
		): Promise<VerificationResult> => {
			// Filter to only include params relevant to this service
			const filteredData = getServiceSpecificParams(service, formData);

			// Mark as in_progress
			setState((prev) => ({
				...prev,
				currentIndex: index,
				results: prev.results.map((r, i) =>
					i === index ? { ...r, status: "in_progress" as const } : r
				),
			}));

			try {
				// Make API call with tf-req-uri header override
				// (needed because we pass null as defaultUrlEndpoint to useEpsV3Fetch)
				const response = await doVerification({
					headers: {
						"tf-req-uri": service.endpointPath,
					},
					body: filteredData,
				});

				console.log(
					`[useKycVerification] Response for ${service.name}:`,
					response
				);

				// Check response
				if (response?.data?.status === 0 && response.data.data) {
					// Success
					return {
						serviceCode: service.serviceCode,
						serviceName: service.name,
						endpointPath: service.endpointPath,
						status: "success",
						requestData: filteredData,
						responseData: response.data.data,
						timestamp: getTimestamp(),
					};
				} else {
					// API returned error
					return {
						serviceCode: service.serviceCode,
						serviceName: service.name,
						endpointPath: service.endpointPath,
						status: "failed",
						requestData: filteredData,
						responseData: response?.data,
						error:
							response?.data?.message ||
							"Verification failed. Please try again.",
						timestamp: getTimestamp(),
					};
				}
			} catch (err) {
				console.error(
					`[useKycVerification] Error for ${service.name}:`,
					err
				);
				return {
					serviceCode: service.serviceCode,
					serviceName: service.name,
					endpointPath: service.endpointPath,
					status: "failed",
					requestData: filteredData,
					error:
						err instanceof Error
							? err.message
							: "Network error. Please check your connection.",
					timestamp: getTimestamp(),
				};
			}
		},
		[doVerification]
	);

	/**
	 * Start verification for given services.
	 * Calls APIs sequentially and updates state progressively.
	 */
	const startVerification = useCallback(
		async (
			services: VerificationService[],
			formData: Record<string, unknown>
		): Promise<void> => {
			if (services.length === 0) return;

			// Initialize state
			const initialResults = initializeResults(services, formData);
			setState({
				status: "in_progress",
				results: initialResults,
				currentIndex: 0,
				totalCount: services.length,
				formData,
				services,
				retryingIndices: undefined,
			});

			// Process services sequentially
			const updatedResults = [...initialResults];

			for (let i = 0; i < services.length; i++) {
				const service = services[i];
				const result = await verifyService(service, formData, i);

				// Update result in array
				updatedResults[i] = result;

				// Update state with new result
				setState((prev) => ({
					...prev,
					results: [...updatedResults],
					currentIndex: i + 1,
				}));
			}

			// Mark as completed
			setState((prev) => ({
				...prev,
				status: "completed",
			}));
		},
		[initializeResults, verifyService]
	);

	/**
	 * Retry only failed services with the same form data.
	 */
	const retryFailedServices = useCallback(async (): Promise<void> => {
		const { services, formData, results } = state;
		if (!services || !formData) return;

		// Find indices of failed results
		const failedIndices = results
			.map((r, i) => (r.status === "failed" ? i : -1))
			.filter((i) => i !== -1);

		if (failedIndices.length === 0) return;

		// Mark as in_progress and set retrying indices
		setState((prev) => ({
			...prev,
			status: "in_progress",
			retryingIndices: failedIndices,
			results: prev.results.map((r, i) =>
				failedIndices.includes(i)
					? { ...r, status: "pending" as const }
					: r
			),
		}));

		// Process failed services sequentially
		const updatedResults = [...results];

		for (const idx of failedIndices) {
			const service = services[idx];
			const result = await verifyService(service, formData, idx);
			updatedResults[idx] = result;

			setState((prev) => ({
				...prev,
				results: [...updatedResults],
			}));
		}

		// Mark as completed and clear retrying indices
		setState((prev) => ({
			...prev,
			status: "completed",
			retryingIndices: undefined,
		}));
	}, [state, verifyService]);

	/**
	 * Reset verification state.
	 */
	const reset = useCallback(() => {
		setState(INITIAL_STATE);
	}, []);

	// Computed values
	const isVerifying = state.status === "in_progress";
	const failedCount = state.results.filter(
		(r) => r.status === "failed"
	).length;
	const successCount = state.results.filter(
		(r) => r.status === "success"
	).length;
	const progressPercent =
		state.totalCount > 0
			? Math.round((state.currentIndex / state.totalCount) * 100)
			: 0;
	const progressText =
		state.totalCount > 0
			? `${state.currentIndex} of ${state.totalCount}`
			: "";

	return {
		state,
		startVerification,
		retryFailedServices,
		reset,
		isVerifying,
		progressPercent,
		progressText,
		failedCount,
		successCount,
	};
};

export default useKycVerification;
