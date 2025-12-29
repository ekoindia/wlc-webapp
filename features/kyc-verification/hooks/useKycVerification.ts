/**
 * Hook for managing KYC verification API calls.
 * Supports single and multi-service verification with progress tracking.
 * Scalable architecture for future OTP-based verifications.
 */

import { useEpsV3Fetch } from "hooks";
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
};

/**
 * Format current timestamp for display.
 * @returns Formatted timestamp string
 */
const getTimestamp = (): string => {
	return new Date().toLocaleString("en-IN", {
		day: "numeric",
		month: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
};

/**
 * Filter form data to only include parameters relevant to a specific service.
 * @param service - The service to filter parameters for
 * @param formData - The complete form data
 * @returns Object containing only the parameters defined in the service's requestParams
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
	/** Reset verification state to initial */
	reset: () => void;
	/** Check if verification is in progress */
	isVerifying: boolean;
	/** Get progress percentage (0-100) */
	progressPercent: number;
	/** Get progress text (e.g., "2 of 5") */
	progressText: string;
}

/**
 * Hook for managing KYC verification API calls.
 * @returns Object with verification state and control functions
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
	 * Reset verification state.
	 */
	const reset = useCallback(() => {
		setState(INITIAL_STATE);
	}, []);

	// Computed values
	const isVerifying = state.status === "in_progress";
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
		reset,
		isVerifying,
		progressPercent,
		progressText,
	};
};

export default useKycVerification;
