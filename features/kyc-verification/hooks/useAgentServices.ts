/**
 * Hook for fetching and managing agent verification services.
 * Provides fetching services for a specific agent and toggling their enabled/disabled state.
 */

import { Endpoints } from "constants/EndPoints";
import { useApiFetch, useEpsV3Fetch } from "hooks";
import { useCallback, useMemo, useState } from "react";
import {
	ALL_CATEGORIES_VALUE,
	DEFAULT_ICON,
	DEFAULT_SERVICE_ICONS,
	UNCATEGORIZED_VALUE,
} from "../constants";
import type {
	AgentService,
	CategoryOption,
	VerificationService,
} from "../types";

/** Interaction type ID for fetching agent services */
const AGENT_SERVICES_INTERACTION_ID = 1043;

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

/**
 * Derives an icon for a service based on its category or name.
 * @param service - The service to get icon for
 * @returns Icon name from the icon library
 */
const getServiceIcon = (service: VerificationService): string => {
	if (service.icon) return service.icon;

	if (service.category && DEFAULT_SERVICE_ICONS[service.category]) {
		return DEFAULT_SERVICE_ICONS[service.category];
	}

	for (const [keyword, icon] of Object.entries(DEFAULT_SERVICE_ICONS)) {
		if (service.name.toLowerCase().includes(keyword.toLowerCase())) {
			return icon;
		}
	}

	return DEFAULT_ICON;
};

/**
 * Normalizes services to ensure all required fields are present.
 * @param services
 */
const normalizeServices = (services: VerificationService[]): AgentService[] => {
	return services.map((service) => ({
		...service,
		icon: getServiceIcon(service),
		category: service.category || UNCATEGORIZED_VALUE,
	}));
};

/**
 * Extracts unique categories from services for filtering.
 * @param services
 */
const extractCategories = (services: AgentService[]): CategoryOption[] => {
	const categoryMap = new Map<string, number>();

	services.forEach((service) => {
		const category = service.category || UNCATEGORIZED_VALUE;
		categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
	});

	const categories: CategoryOption[] = [
		{
			value: ALL_CATEGORIES_VALUE,
			label: "All",
			count: services.length,
		},
	];

	const sortedCategories = Array.from(categoryMap.entries()).sort((a, b) => {
		if (a[0] === UNCATEGORIZED_VALUE) return 1;
		if (b[0] === UNCATEGORIZED_VALUE) return -1;
		return a[0].localeCompare(b[0]);
	});

	sortedCategories.forEach(([category, count]) => {
		categories.push({
			value: category,
			label: category === UNCATEGORIZED_VALUE ? "Other" : category,
			count,
		});
	});

	return categories;
};

interface UseAgentServicesReturn {
	/** All services for the selected agent */
	services: AgentService[];
	/** Filtered services based on category and search */
	filteredServices: AgentService[];
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
	/** Enable all services for the selected agent */
	enableAllServices: () => Promise<void>;
	/** Disable all services for the selected agent */
	disableAllServices: () => Promise<void>;
	/** Batch operation progress */
	batchProgress: BatchProgress;
	/** Count of enabled services */
	enabledCount: number;
	/** Count of disabled services */
	disabledCount: number;
	/** Total count of services */
	totalCount: number;
	/** Refetch services for the current agent */
	refetch: () => void;
}

/**
 * Hook for fetching and managing agent verification services.
 * Supports fetching services by agent, toggling individual services,
 * and batch enable/disable operations.
 * @returns Object with agent services data, filters, and control functions
 */
export const useAgentServices = (): UseAgentServicesReturn => {
	const [services, setServices] = useState<AgentService[]>([]);
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

	// API hook for fetching services
	const [fetchServicesApi, loading] = useApiFetch(Endpoints.TRANSACTION, {
		method: "POST",
		onError: (err) => {
			setError(err?.data?.message || "Failed to fetch services");
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
						user_code: agentUserCode,
					},
				});

				console.log("[useAgentServices] response", response);

				if (
					response?.data?.status === 0 &&
					response?.data?.data?.verification_service_list
				) {
					const normalizedServices = normalizeServices(
						response?.data?.data?.verification_service_list
					);
					setServices(normalizedServices);
				} else {
					setError(
						response?.data?.message || "Failed to fetch services"
					);
				}
			} catch (err) {
				console.error(
					"[useAgentServices] Error fetching services:",
					err
				);
				setError("Failed to fetch services");
			}
		},
		[fetchServicesApi]
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
	 * @returns true if toggle was successful, false otherwise
	 */
	const toggleService = useCallback(
		async (serviceCode: string): Promise<boolean> => {
			if (!selectedAgentCode) return false;

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
					body: {
						// Add any required body params here
					},
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
					return true;
				} else {
					setError(
						response?.data?.message || `Failed to ${action} service`
					);
					return false;
				}
			} catch (err) {
				console.error(
					"[useAgentServices] Error toggling service:",
					err
				);
				setError(`Failed to ${action} service`);
				return false;
			} finally {
				setTogglingServices((prev) => ({
					...prev,
					[serviceCode]: false,
				}));
			}
		},
		[selectedAgentCode, services, toggleServiceApi]
	);

	/**
	 * Enable all services for the selected agent.
	 * Makes consecutive API calls with progress tracking.
	 */
	const enableAllServices = useCallback(async () => {
		const disabledServices = services.filter((s) => !s.is_enabled);
		if (disabledServices.length === 0) return;

		setBatchProgress({
			isRunning: true,
			current: 0,
			total: disabledServices.length,
			operation: "enable",
		});

		for (let i = 0; i < disabledServices.length; i++) {
			setBatchProgress((prev) => ({ ...prev, current: i + 1 }));
			await toggleService(disabledServices[i].serviceCode);
		}

		setBatchProgress({
			isRunning: false,
			current: 0,
			total: 0,
			operation: null,
		});
	}, [services, toggleService]);

	/**
	 * Disable all services for the selected agent.
	 * Makes consecutive API calls with progress tracking.
	 */
	const disableAllServices = useCallback(async () => {
		const enabledServices = services.filter((s) => s.is_enabled);
		if (enabledServices.length === 0) return;

		setBatchProgress({
			isRunning: true,
			current: 0,
			total: enabledServices.length,
			operation: "disable",
		});

		for (let i = 0; i < enabledServices.length; i++) {
			setBatchProgress((prev) => ({ ...prev, current: i + 1 }));
			await toggleService(enabledServices[i].serviceCode);
		}

		setBatchProgress({
			isRunning: false,
			current: 0,
			total: 0,
			operation: null,
		});
	}, [services, toggleService]);

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
	 * Counts
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
		enableAllServices,
		disableAllServices,
		batchProgress,
		enabledCount,
		disabledCount,
		totalCount,
		refetch,
	};
};

export default useAgentServices;
