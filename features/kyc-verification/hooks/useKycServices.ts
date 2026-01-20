/**
 * Hook for fetching and managing KYC verification services.
 * Provides filtering by category and search functionality.
 *
 * Uses KycServicesContext for caching when available, with fallback
 * to direct API fetching for backward compatibility.
 */

import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useApiFetch } from "hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toKebabCase } from "utils";
import {
	ALL_CATEGORIES_LABEL,
	ALL_CATEGORIES_VALUE,
	DEFAULT_ICON,
	DEFAULT_SERVICE_ICONS,
	KYC_SERVICES_INTERACTION_ID,
	UNCATEGORIZED_LABEL,
	UNCATEGORIZED_VALUE,
} from "../constants";
import { useKycServicesContext } from "../contexts";
import { MOCK_KYC_SERVICES, USE_MOCK_DATA } from "../mocks/mockServices";
import type {
	CategoryOption,
	KycServicesResponse,
	VerificationService,
} from "../types";

/**
 * Derives an icon for a service based on its category or name.
 * Falls back to DEFAULT_ICON if no match is found.
 * @param {VerificationService} service - The service to get icon for
 * @returns {string} Icon name from the icon library
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
 * Falls back to label with provider prefix removed.
 * @param {VerificationService} service - The service to get description for
 * @returns {string} Service description text
 */
const getServiceDescription = (service: VerificationService): string => {
	if (service.description) return service.description;
	// Use label as fallback, removing provider prefix
	return service.label.replace(/^.*? - /, "");
};

/**
 * Normalizes services to ensure all required fields are present.
 * Adds default icons, descriptions, and categories where missing.
 * @param {VerificationService[]} services - Array of services to normalize
 * @returns {VerificationService[]} Normalized services with all fields populated
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
 * Extracts unique categories from services for filtering.
 * Returns array with "All" option first, followed by sorted categories.
 * @param {VerificationService[]} services - Array of services to extract categories from
 * @returns {CategoryOption[]} Array of category options with counts
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
 * Simple fuzzy search - checks if all query terms appear in text.
 * Case-insensitive matching.
 * @param {string} text - The text to search within
 * @param {string} query - The search query (space-separated terms)
 * @returns {boolean} True if all query terms are found in text
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
	/** Get a service by its slug (kebab-cased name) */
	getServiceBySlug: (_slug: string) => VerificationService | undefined;
	/** Get multiple services by their slugs */
	getServicesBySlugs: (_slugs: string[]) => VerificationService[];
	/** Get slug for a service code */
	getSlugByCode: (_code: string) => string | undefined;
	/** Get service codes from slugs */
	getCodesBySlugs: (_slugs: string[]) => string[];
}

/**
 * Hook for fetching and managing KYC verification services.
 * Provides category filtering, search functionality, and service lookup.
 * Uses KycServicesContext for caching when available (recommended).
 * Falls back to direct API fetching for backward compatibility.
 * @returns {UseKycServicesReturn} Object with services data, filters, and utility functions
 */
export const useKycServices = (): UseKycServicesReturn => {
	// Try to use context first (recommended - provides caching)
	const contextValue = useKycServicesContext();

	// Local state for fallback mode (when context is not available)
	const toast = useToast();
	const [localServices, setLocalServices] = useState<VerificationService[]>(
		[]
	);
	const [localError, setLocalError] = useState<string | null>(null);
	const [hasFetched, setHasFetched] = useState<boolean>(false);

	// Filter state (always local)
	const [selectedCategory, setSelectedCategory] =
		useState<string>(ALL_CATEGORIES_VALUE);
	const [searchQuery, setSearchQuery] = useState<string>("");

	const [fetchServices, localLoading] = useApiFetch(Endpoints.TRANSACTION, {
		method: "POST",
		onError: (err) => {
			const errorMessage =
				err?.data?.message || "Failed to fetch services";
			setLocalError(errorMessage);
			toast({
				title: "Error",
				description: errorMessage,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		},
	});

	/**
	 * Fetch services from API or use mock data (fallback mode only).
	 */
	const loadServices = useCallback(async () => {
		console.log(
			"[useKycServices] Loading services (fallback), USE_MOCK_DATA:",
			USE_MOCK_DATA
		);
		if (USE_MOCK_DATA) {
			// Use mock data
			console.log(
				"[useKycServices] Using mock data, services count:",
				MOCK_KYC_SERVICES.length
			);
			setLocalServices(normalizeServices(MOCK_KYC_SERVICES));
			setLocalError(null);
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
				setLocalServices(normalizedServices);
				setLocalError(null);
			} else {
				const errorMessage =
					response?.data?.message || "Failed to fetch services";
				setLocalError(errorMessage);
				toast({
					title: "Error",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		} catch (err) {
			console.error("[useKycServices] Error fetching services:", err);
			const errorMessage = "Failed to fetch services";
			setLocalError(errorMessage);
			toast({
				title: "Error",
				description: errorMessage,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
		setHasFetched(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Load services on mount - only if context is not available (fallback mode)
	useEffect(() => {
		// Skip fetching if context is available (services are cached there)
		if (contextValue) {
			console.log("[useKycServices] Using cached services from context");
			return;
		}

		// Fallback: fetch directly if not already fetched
		if (!hasFetched) {
			console.log(
				"[useKycServices] Context not available, fetching directly (fallback mode)"
			);
			loadServices();
		}
	}, [contextValue, hasFetched, loadServices]);

	// Determine which data source to use
	const services = contextValue?.services ?? localServices;
	const error = contextValue?.error ?? localError;
	const loading = contextValue?.loading ?? localLoading;
	const refetch = contextValue?.refetch ?? loadServices;

	/**
	 * Categories derived from services.
	 * Uses context categories if available, otherwise computes locally.
	 */
	const categories = useMemo(
		() => contextValue?.categories ?? extractCategories(services),
		[contextValue?.categories, services]
	);

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
	 * Get service codes from slugs.
	 * Uses context utility if available, otherwise computes locally.
	 */
	const getCodesBySlugs = useCallback(
		(slugs: string[]): string[] => {
			if (contextValue?.getCodesBySlugs) {
				return contextValue.getCodesBySlugs(slugs);
			}
			return services
				.filter((s) => slugs.includes(toKebabCase(s.name)))
				.map((s) => s.serviceCode);
		},
		[contextValue, services]
	);

	/**
	 * Get a single service by code.
	 * Uses context utility if available, otherwise computes locally.
	 */
	const getServiceByCode = useCallback(
		(code: string): VerificationService | undefined => {
			if (contextValue?.getServiceByCode) {
				return contextValue.getServiceByCode(code);
			}
			return services.find((s) => s.serviceCode === code);
		},
		[contextValue, services]
	);

	/**
	 * Get multiple services by codes.
	 * Uses context utility if available, otherwise computes locally.
	 */
	const getServicesByCodes = useCallback(
		(codes: string[]): VerificationService[] => {
			if (contextValue?.getServicesByCodes) {
				return contextValue.getServicesByCodes(codes);
			}
			return services.filter((s) => codes.includes(s.serviceCode));
		},
		[contextValue, services]
	);

	/**
	 * Get a single service by its slug (kebab-cased name).
	 * Uses context utility if available, otherwise computes locally.
	 */
	const getServiceBySlug = useCallback(
		(slug: string): VerificationService | undefined => {
			if (contextValue?.getServiceBySlug) {
				return contextValue.getServiceBySlug(slug);
			}
			return services.find((s) => toKebabCase(s.name) === slug);
		},
		[contextValue, services]
	);

	/**
	 * Get multiple services by their slugs.
	 * Uses context utility if available, otherwise computes locally.
	 */
	const getServicesBySlugs = useCallback(
		(slugs: string[]): VerificationService[] => {
			if (contextValue?.getServicesBySlugs) {
				return contextValue.getServicesBySlugs(slugs);
			}
			return services.filter((s) => slugs.includes(toKebabCase(s.name)));
		},
		[contextValue, services]
	);

	/**
	 * Get slug for a service code.
	 * Uses context utility if available, otherwise computes locally.
	 */
	const getSlugByCode = useCallback(
		(code: string): string | undefined => {
			if (contextValue?.getSlugByCode) {
				return contextValue.getSlugByCode(code);
			}
			const service = services.find((s) => s.serviceCode === code);
			return service ? toKebabCase(service.name) : undefined;
		},
		[contextValue, services]
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
		refetch,
		getServiceByCode,
		getServicesByCodes,
		getServiceBySlug,
		getServicesBySlugs,
		getSlugByCode,
		getCodesBySlugs,
	};
};
