/**
 * Shared utility functions for KYC verification services.
 * Used by both KycServicesContext and useAgentServices hook.
 */

import {
	ALL_CATEGORIES_VALUE,
	DEFAULT_ICON,
	DEFAULT_SERVICE_ICONS,
	UNCATEGORIZED_LABEL,
	UNCATEGORIZED_VALUE,
} from "../constants";
import type { CategoryOption, VerificationService } from "../types";

/**
 * Matches items from a Product master filter list against the keys present in an API productTypeBreakdown.
 * @param {Array} productMasterList - The prop productFilterList [{label, value}]
 * @param {object} productTypeBreakdown - The parsed object from the API
 * @returns {Array} - Filtered and mapped options
 */

export const productmatchAndMapFilters = (
	productMasterList,
	productTypeBreakdown
) => {
	if (!productTypeBreakdown || !productMasterList) return [];

	// Get the IDs (keys) available in the current API response
	const availableIds = Object.keys(productTypeBreakdown);

	// Filter the master list to only include what's in the breakdown
	return productMasterList.filter((item) =>
		availableIds.includes(String(item.value))
	);
};

/**
 * Derives an icon for a service based on its category or name.
 * Falls back to DEFAULT_ICON if no match is found.
 * @param {VerificationService} service - The service to get icon for
 * @returns {string} Icon name from the icon library
 */
export const getServiceIcon = (service: VerificationService): string => {
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
export const getServiceDescription = (service: VerificationService): string => {
	if (service.description) return service.description;
	// Use label as fallback, removing provider prefix
	return service.label.replace(/^.*? - /, "");
};

/**
 * Normalizes services to ensure all required fields are present.
 * Adds default icons, descriptions, and categories where missing.
 * Filters out disabled services.
 * @param {VerificationService[]} services - Array of services to normalize
 * @param {object} [options] - Normalization options
 * @param {boolean} [options.filterDisabled] - Filter out disabled services
 * @returns {VerificationService[]} Normalized services with all fields populated
 */
export const normalizeServices = (
	services: VerificationService[],
	options: { filterDisabled?: boolean } = {}
): VerificationService[] => {
	const { filterDisabled = true } = options;

	let result = services;

	// Optionally filter out disabled services
	if (filterDisabled) {
		result = result.filter((service) => service.is_enabled);
	}

	return result.map((service) => ({
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
export const extractCategories = (
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
			label: "All",
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
