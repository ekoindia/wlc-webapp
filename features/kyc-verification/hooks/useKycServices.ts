/**
 * Hook for accessing and filtering KYC verification services.
 * Provides filtering by category and search functionality.
 *
 * IMPORTANT: This hook must be used within a KycServicesProvider.
 * All data fetching and caching is handled by the context.
 */

import { useMemo, useState } from "react";
import { ALL_CATEGORIES_VALUE } from "../constants";
import { useKycServicesContext } from "../contexts";
import type { CategoryOption, VerificationService } from "../types";

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
 * Hook for accessing and filtering KYC verification services.
 * Provides category filtering, search functionality, and service lookup.
 *
 * Must be used within a KycServicesProvider - throws an error otherwise.
 * @returns {UseKycServicesReturn} Object with services data, filters, and utility functions
 * @throws {Error} If used outside of KycServicesProvider
 */
export const useKycServices = (): UseKycServicesReturn => {
	// Get services from context (required)
	const contextValue = useKycServicesContext();

	if (!contextValue) {
		throw new Error(
			"useKycServices must be used within a KycServicesProvider. " +
				"Wrap your component tree with <KycServicesProvider> to use this hook."
		);
	}

	// Local filter state
	const [selectedCategory, setSelectedCategory] =
		useState<string>(ALL_CATEGORIES_VALUE);
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Destructure context values
	const {
		services,
		categories,
		loading,
		error,
		refetch,
		getServiceByCode,
		getServicesByCodes,
		getServiceBySlug,
		getServicesBySlugs,
		getSlugByCode,
		getCodesBySlugs,
	} = contextValue;

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
