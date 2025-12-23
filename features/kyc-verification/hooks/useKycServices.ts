/**
 * Hook for fetching and managing KYC verification services.
 * Provides filtering by category and search functionality.
 */

import { useApiFetch } from "hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ALL_CATEGORIES_LABEL,
	ALL_CATEGORIES_VALUE,
	DEFAULT_ICON,
	DEFAULT_SERVICE_ICONS,
	KYC_SERVICES_INTERACTION_ID,
	UNCATEGORIZED_LABEL,
	UNCATEGORIZED_VALUE,
} from "../constants";
import { MOCK_KYC_SERVICES, USE_MOCK_DATA } from "../mocks/mockServices";
import type {
	CategoryOption,
	KycServicesResponse,
	VerificationService,
} from "../types";

/**
 * Derives an icon for a service based on its category or name.
 * @param service
 */
const getServiceIcon = (service: VerificationService): string => {
	if (service.icon) return service.icon;

	// Try to match by category
	if (service.category && DEFAULT_SERVICE_ICONS[service.category]) {
		return DEFAULT_SERVICE_ICONS[service.category];
	}

	// Try to match by service name keywords
	for (const [keyword, icon] of Object.entries(DEFAULT_SERVICE_ICONS)) {
		if (service.name.toLowerCase().includes(keyword.toLowerCase())) {
			return icon;
		}
	}

	return DEFAULT_ICON;
};

/**
 * Derives a description for a service if not provided.
 * @param service
 */
const getServiceDescription = (service: VerificationService): string => {
	if (service.description) return service.description;
	// Use label as fallback, removing provider prefix
	return service.label.replace(/^.*? - /, "");
};

/**
 * Normalize services to ensure all required fields are present.
 * @param services
 */
const normalizeServices = (
	services: VerificationService[]
): VerificationService[] => {
	return services.map((service) => ({
		...service,
		icon: getServiceIcon(service),
		description: getServiceDescription(service),
		category: service.category || UNCATEGORIZED_VALUE,
	}));
};

/**
 * Extract unique categories from services.
 * @param services
 */
const extractCategories = (
	services: VerificationService[]
): CategoryOption[] => {
	const categoryMap = new Map<string, number>();

	services.forEach((service) => {
		const category = service.category || UNCATEGORIZED_VALUE;
		categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
	});

	const categories: CategoryOption[] = [
		{
			value: ALL_CATEGORIES_VALUE,
			label: ALL_CATEGORIES_LABEL,
			count: services.length,
		},
	];

	// Sort categories alphabetically, but keep "Other" at the end
	const sortedCategories = Array.from(categoryMap.entries()).sort((a, b) => {
		if (a[0] === UNCATEGORIZED_VALUE) return 1;
		if (b[0] === UNCATEGORIZED_VALUE) return -1;
		return a[0].localeCompare(b[0]);
	});

	sortedCategories.forEach(([category, count]) => {
		categories.push({
			value: category,
			label:
				category === UNCATEGORIZED_VALUE
					? UNCATEGORIZED_LABEL
					: category,
			count,
		});
	});

	return categories;
};

/**
 * Simple fuzzy search - checks if query terms appear in text.
 * @param text
 * @param query
 */
const fuzzyMatch = (text: string, query: string): boolean => {
	const normalizedText = text.toLowerCase();
	const normalizedQuery = query.toLowerCase().trim();

	if (!normalizedQuery) return true;

	// Split query into words and check if all words appear in text
	const queryWords = normalizedQuery.split(/\s+/);
	return queryWords.every((word) => normalizedText.includes(word));
};

interface UseKycServicesReturn {
	/** All services (normalized) */
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
	/** Loading state */
	loading: boolean;
	/** Error message if any */
	error: string | null;
	/** Refetch services */
	refetch: () => void;
	/** Get a service by its code */
	getServiceByCode: (_code: string) => VerificationService | undefined;
	/** Get multiple services by their codes */
	getServicesByCodes: (_codes: string[]) => VerificationService[];
}

/**
 * Hook for fetching and managing KYC verification services.
 */
export const useKycServices = (): UseKycServicesReturn => {
	const [services, setServices] = useState<VerificationService[]>([]);
	const [selectedCategory, setSelectedCategory] =
		useState<string>(ALL_CATEGORIES_VALUE);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	const [fetchServices, loading] = useApiFetch(undefined, {
		method: "POST",
		onError: (err) => {
			setError(err?.data?.message || "Failed to fetch services");
		},
	});

	/**
	 * Fetch services from API or use mock data.
	 */
	const loadServices = useCallback(async () => {
		console.log(
			"[useKycServices] Loading services, USE_MOCK_DATA:",
			USE_MOCK_DATA
		);
		if (USE_MOCK_DATA) {
			// Use mock data
			console.log(
				"[useKycServices] Using mock data, services count:",
				MOCK_KYC_SERVICES.length
			);
			setServices(normalizeServices(MOCK_KYC_SERVICES));
			setError(null);
			return;
		}

		try {
			const response = await fetchServices({
				body: {
					interaction_type_id: KYC_SERVICES_INTERACTION_ID,
				},
			});

			console.log("[useKycServices] API response:", response);

			if (
				response?.data?.status === 0 &&
				response.data.data?.verification_service_list
			) {
				const normalizedServices = normalizeServices(
					(response.data as KycServicesResponse).data
						.verification_service_list
				);
				console.log(
					"[useKycServices] Loaded services:",
					normalizedServices.length
				);
				setServices(normalizedServices);
				setError(null);
			} else {
				setError(response?.data?.message || "Failed to fetch services");
			}
		} catch (err) {
			console.error("[useKycServices] Error fetching services:", err);
			setError("Failed to fetch services");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Load services on mount
	useEffect(() => {
		loadServices();
	}, [loadServices]);

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
			result = result.filter(
				(s) =>
					fuzzyMatch(s.name, searchQuery) ||
					fuzzyMatch(s.description || "", searchQuery) ||
					fuzzyMatch(s.label, searchQuery)
			);
		}

		return result;
	}, [services, selectedCategory, searchQuery]);

	/**
	 * Get a single service by code.
	 */
	const getServiceByCode = useCallback(
		(code: string): VerificationService | undefined => {
			return services.find((s) => s.serviceCode === code);
		},
		[services]
	);

	/**
	 * Get multiple services by codes.
	 */
	const getServicesByCodes = useCallback(
		(codes: string[]): VerificationService[] => {
			return services.filter((s) => codes.includes(s.serviceCode));
		},
		[services]
	);

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
		refetch: loadServices,
		getServiceByCode,
		getServicesByCodes,
	};
};
