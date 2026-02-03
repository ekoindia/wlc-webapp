/**
 * Hook for fetching and managing agent verification services.
 * Provides fetching services for a specific agent and toggling their enabled/disabled state.
 */

import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useApiFetch, useEpsV3Fetch } from "hooks";
import { useCallback, useMemo, useRef, useState } from "react";
import { ALL_CATEGORIES_VALUE } from "../constants";
import type { CategoryOption, VerificationService } from "../types";
import { extractCategories, normalizeServices } from "../utils";

/** Interaction type ID for fetching agent services */
const AGENT_SERVICES_INTERACTION_ID = 1043;

/** Throttle delay for toggle actions (ms) */
const TOGGLE_THROTTLE_DELAY = 5000;

/**
 * Progress tracking for batch operations (Enable All / Disable All)
 */
interface BatchProgress {
	/** Whether a batch operation is in progress */
	isRunning: boolean;
	/** Current index being processed */
	current: number;
	/** Total count to process */
	total: number;
	/** Operation type */
	operation: "enable" | "disable" | null;
}

interface UseAgentServicesReturn {
	/** All services for the selected agent */
	services: VerificationService[];
	/** Filtered services based on category and search */
	filteredServices: VerificationService[];
	/** Available categories for filtering */
	categories: CategoryOption[];
	/** Currently selected category */
	selectedCategory: string;
	/** Set the selected category */
	setSelectedCategory: (_category: string) => void;
	/** Current search query */
	searchQuery: string;
	/** Set the search query */
	setSearchQuery: (_query: string) => void;
	/** Loading state for fetching services */
	loading: boolean;
	/** Error message if any */
	error: string | null;
	/** Currently selected agent user code */
	selectedAgentCode: string | null;
	/** Select an agent to load their services */
	selectAgent: (_userCode: string) => void;
	/** Toggle a single service's enabled state */
	toggleService: (_serviceCode: string) => Promise<boolean>;
	/** Loading state for individual service toggle (maps serviceCode to loading state) */
	togglingServices: Record<string, boolean>;
	/** Throttle/cooldown state for individual services (maps serviceCode to throttled state) */
	throttledServices: Record<string, boolean>;
	/** Enable all disabled services in the current filtered view */
	enableFilteredServices: () => Promise<void>;
	/** Disable all enabled services in the current filtered view */
	disableFilteredServices: () => Promise<void>;
	/** Batch operation progress */
	batchProgress: BatchProgress;
	/** Count of enabled services (total) */
	enabledCount: number;
	/** Count of disabled services (total) */
	disabledCount: number;
	/** Total count of services */
	totalCount: number;
	/** Count of enabled services in filtered view */
	filteredEnabledCount: number;
	/** Count of disabled services in filtered view */
	filteredDisabledCount: number;
	/** Total count of services in filtered view */
	filteredTotalCount: number;
	/** Refetch services for the current agent */
	refetch: () => void;
}

/**
 * Hook for fetching and managing agent verification services.
 * Supports fetching services by agent, toggling individual services,
 * and batch enable/disable operations.
 * @returns {UseAgentServicesReturn} Object with agent services data, filters, and control functions
 */
export const useAgentServices = (): UseAgentServicesReturn => {
	const toast = useToast();
	const [services, setServices] = useState<VerificationService[]>([]);
	const [selectedCategory, setSelectedCategory] =
		useState<string>(ALL_CATEGORIES_VALUE);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [selectedAgentCode, setSelectedAgentCode] = useState<string | null>(
		null
	);
	const [togglingServices, setTogglingServices] = useState<
		Record<string, boolean>
	>({});
	const [batchProgress, setBatchProgress] = useState<BatchProgress>({
		isRunning: false,
		current: 0,
		total: 0,
		operation: null,
	});

	// Track which services are in throttle/cooldown period
	const [throttledServices, setThrottledServices] = useState<
		Record<string, boolean>
	>({});

	// Throttle ref for toggle actions
	const lastToggleTime = useRef<Record<string, number>>({});

	// API hook for fetching services
	const [fetchServicesApi, loading] = useApiFetch(Endpoints.TRANSACTION, {
		method: "POST",
		onError: (err) => {
			const errorMessage =
				err?.data?.message || "Failed to fetch services";
			setError(errorMessage);
			toast({
				title: "Error",
				description: errorMessage,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		},
	});

	// API hook for toggling service - we'll set the URL dynamically
	const [toggleServiceApi] = useEpsV3Fetch(null, {
		method: "PUT",
	});

	/**
	 * Fetch services for a specific agent.
	 */
	const loadServices = useCallback(
		async (agentUserCode: string) => {
			if (!agentUserCode) return;

			setError(null);
			try {
				const response = await fetchServicesApi({
					body: {
						interaction_type_id: AGENT_SERVICES_INTERACTION_ID,
						agent_code: agentUserCode,
					},
				});

				if (
					response?.data?.status === 0 &&
					response?.data?.data?.verification_service_list
				) {
					// Don't filter disabled services - we need to show all for management
					const normalizedServices = normalizeServices(
						response?.data?.data?.verification_service_list,
						{ filterDisabled: false }
					);
					setServices(normalizedServices);
				} else {
					const errorMessage =
						response?.data?.message || "Failed to fetch services";
					setError(errorMessage);
					toast({
						title: "Error",
						description: errorMessage,
						status: "error",
						duration: 5000,
						isClosable: true,
					});
				}
			} catch (err) {
				const errorMessage =
					err?.data?.message || "Failed to fetch services";
				setError(errorMessage);
				toast({
					title: "Error",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		},
		[fetchServicesApi, toast]
	);

	/**
	 * Select an agent and load their services.
	 */
	const selectAgent = useCallback(
		(userCode: string) => {
			setSelectedAgentCode(userCode);
			setServices([]);
			setSelectedCategory(ALL_CATEGORIES_VALUE);
			setSearchQuery("");
			loadServices(userCode);
		},
		[loadServices]
	);

	/**
	 * Refetch services for the current agent.
	 */
	const refetch = useCallback(() => {
		if (selectedAgentCode) {
			loadServices(selectedAgentCode);
		}
	}, [selectedAgentCode, loadServices]);

	/**
	 * Toggle a single service's enabled state.
	 * Throttled to prevent rapid API calls.
	 * @param {string} serviceCode - The service code to toggle
	 * @param {boolean} [skipToast=false] - Skip showing toast notification (used in batch operations)
	 * @returns {Promise<boolean>} true if toggle was successful, false otherwise
	 */
	const toggleService = useCallback(
		async (serviceCode: string, skipToast = false): Promise<boolean> => {
			if (!selectedAgentCode) return false;

			// Throttle check per service
			const now = Date.now();
			const lastTime = lastToggleTime.current[serviceCode] || 0;
			if (now - lastTime < TOGGLE_THROTTLE_DELAY) {
				return false;
			}
			lastToggleTime.current[serviceCode] = now;

			const service = services.find((s) => s.serviceCode === serviceCode);
			if (!service) return false;

			const action = service.is_enabled ? "deactivate" : "activate";
			const endpoint = `/admin/network/agent/${selectedAgentCode}/service/${serviceCode}/${action}`;

			// Set loading state for this service
			setTogglingServices((prev) => ({ ...prev, [serviceCode]: true }));

			try {
				const response = await toggleServiceApi({
					headers: {
						"tf-req-uri": endpoint,
						"tf-req-method": "PUT",
					},
					body: {},
				});

				if (response?.data?.status === 0) {
					// Update local state optimistically
					setServices((prev) =>
						prev.map((s) =>
							s.serviceCode === serviceCode
								? { ...s, is_enabled: !s.is_enabled }
								: s
						)
					);

					// Set throttled state and clear after delay
					setThrottledServices((prev) => ({
						...prev,
						[serviceCode]: true,
					}));
					setTimeout(() => {
						setThrottledServices((prev) => ({
							...prev,
							[serviceCode]: false,
						}));
					}, TOGGLE_THROTTLE_DELAY);

					// Show success toast (skip during batch operations)
					if (!skipToast) {
						toast({
							title:
								action === "activate"
									? "Service Activated"
									: "Service Deactivated",
							description:
								response?.data?.message ||
								`${service.name} has been ${action === "activate" ? "enabled" : "disabled"} successfully.`,
							status: "success",
							duration: 3000,
							isClosable: true,
						});
					}

					return true;
				} else {
					const errorMessage =
						response?.data?.message ||
						`Failed to ${action} service`;
					setError(errorMessage);

					// Show error toast (skip during batch operations)
					if (!skipToast) {
						toast({
							title: `Failed to ${action === "activate" ? "Activate" : "Deactivate"} Service`,
							description: errorMessage,
							status: "error",
							duration: 4000,
							isClosable: true,
						});
					}

					return false;
				}
			} catch (err) {
				console.error(
					"[useAgentServices] Error toggling service:",
					err
				);
				const errorMessage = `Failed to ${action} service`;
				setError(errorMessage);

				// Show error toast (skip during batch operations)
				if (!skipToast) {
					toast({
						title: "Error",
						description: errorMessage,
						status: "error",
						duration: 4000,
						isClosable: true,
					});
				}

				return false;
			} finally {
				setTogglingServices((prev) => ({
					...prev,
					[serviceCode]: false,
				}));
			}
		},
		[selectedAgentCode, services, toggleServiceApi, toast]
	);

	/**
	 * Categories derived from services.
	 */
	const categories = useMemo(() => extractCategories(services), [services]);

	/**
	 * Filter services by category and search query.
	 */
	const filteredServices = useMemo(() => {
		let result = services;

		// Filter by category
		if (selectedCategory !== ALL_CATEGORIES_VALUE) {
			result = result.filter((s) => s.category === selectedCategory);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(s) =>
					s.name.toLowerCase().includes(query) ||
					s.description?.toLowerCase().includes(query) ||
					s.label.toLowerCase().includes(query)
			);
		}

		return result;
	}, [services, selectedCategory, searchQuery]);

	/**
	 * Enable all disabled services in the current filtered view.
	 * Makes consecutive API calls with progress tracking.
	 */
	const enableFilteredServices = useCallback(async () => {
		const disabledInView = filteredServices.filter((s) => !s.is_enabled);
		if (disabledInView.length === 0) return;

		setBatchProgress({
			isRunning: true,
			current: 0,
			total: disabledInView.length,
			operation: "enable",
		});

		for (let i = 0; i < disabledInView.length; i++) {
			setBatchProgress((prev) => ({ ...prev, current: i + 1 }));
			await toggleService(disabledInView[i].serviceCode, true);
		}

		setBatchProgress({
			isRunning: false,
			current: 0,
			total: 0,
			operation: null,
		});
	}, [filteredServices, toggleService]);

	/**
	 * Disable all enabled services in the current filtered view.
	 * Makes consecutive API calls with progress tracking.
	 */
	const disableFilteredServices = useCallback(async () => {
		const enabledInView = filteredServices.filter((s) => s.is_enabled);
		if (enabledInView.length === 0) return;

		setBatchProgress({
			isRunning: true,
			current: 0,
			total: enabledInView.length,
			operation: "disable",
		});

		for (let i = 0; i < enabledInView.length; i++) {
			setBatchProgress((prev) => ({ ...prev, current: i + 1 }));
			await toggleService(enabledInView[i].serviceCode, true);
		}

		setBatchProgress({
			isRunning: false,
			current: 0,
			total: 0,
			operation: null,
		});
	}, [filteredServices, toggleService]);

	/**
	 * Total counts (all services)
	 */
	const enabledCount = useMemo(
		() => services.filter((s) => s.is_enabled).length,
		[services]
	);

	const disabledCount = useMemo(
		() => services.filter((s) => !s.is_enabled).length,
		[services]
	);

	const totalCount = services.length;

	/**
	 * Filtered counts (current view)
	 */
	const filteredEnabledCount = useMemo(
		() => filteredServices.filter((s) => s.is_enabled).length,
		[filteredServices]
	);

	const filteredDisabledCount = useMemo(
		() => filteredServices.filter((s) => !s.is_enabled).length,
		[filteredServices]
	);

	const filteredTotalCount = filteredServices.length;

	return {
		services,
		filteredServices,
		categories,
		selectedCategory,
		setSelectedCategory,
		searchQuery,
		setSearchQuery,
		loading,
		error,
		selectedAgentCode,
		selectAgent,
		toggleService,
		togglingServices,
		throttledServices,
		enableFilteredServices,
		disableFilteredServices,
		batchProgress,
		enabledCount,
		disabledCount,
		totalCount,
		filteredEnabledCount,
		filteredDisabledCount,
		filteredTotalCount,
		refetch,
	};
};

export default useAgentServices;
