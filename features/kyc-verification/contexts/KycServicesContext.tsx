/**
 * KYC Services Context
 *
 * Provides caching for KYC verification services data.
 * Services are fetched once when the provider mounts and cached for the session.
 * Pattern follows existing CommissionContext.js implementation.
 */

import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useApiFetch } from "hooks";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toKebabCase } from "utils";
import {
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
 * Context state interface for KYC services.
 */
interface KycServicesContextState {
	/** All services (normalized) */
	services: VerificationService[];
	/** Available categories for filtering */
	categories: CategoryOption[];
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

const KycServicesContext = createContext<KycServicesContextState | null>(null);

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
 * Filters out disabled services.
 * @param {VerificationService[]} services - Array of services to normalize
 * @returns {VerificationService[]} Normalized services with all fields populated
 */
const normalizeServices = (
	services: VerificationService[]
): VerificationService[] => {
	return services
		.filter((service) => service.is_enabled)
		.map((service) => ({
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

interface KycServicesProviderProps {
	children: React.ReactNode;
}

/**
 * Provider component for KYC services caching.
 * Wraps KYC verification pages to cache services data across navigation.
 * @param {KycServicesProviderProps} props - Provider props
 * @returns {JSX.Element} Provider wrapping children
 */
export const KycServicesProvider = ({
	children,
}: KycServicesProviderProps): JSX.Element => {
	const toast = useToast();
	const [services, setServices] = useState<VerificationService[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [hasFetched, setHasFetched] = useState<boolean>(false);

	const [fetchServices, loading] = useApiFetch(Endpoints.TRANSACTION, {
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

	/**
	 * Fetch services from API or use mock data.
	 */
	const loadServices = useCallback(async () => {
		console.log(
			"[KycServicesContext] Loading services, USE_MOCK_DATA:",
			USE_MOCK_DATA
		);
		if (USE_MOCK_DATA) {
			// Use mock data
			console.log(
				"[KycServicesContext] Using mock data, services count:",
				MOCK_KYC_SERVICES.length
			);
			setServices(normalizeServices(MOCK_KYC_SERVICES));
			setError(null);
			setHasFetched(true);
			return;
		}

		try {
			const response = await fetchServices({
				body: {
					interaction_type_id: KYC_SERVICES_INTERACTION_ID,
				},
			});

			console.log("[KycServicesContext] API response:", response);

			if (
				response?.data?.status === 0 &&
				response.data.data?.verification_service_list
			) {
				const normalizedServices = normalizeServices(
					(response.data as KycServicesResponse).data
						.verification_service_list
				);
				console.log(
					"[KycServicesContext] Loaded services:",
					normalizedServices.length
				);
				setServices(normalizedServices);
				setError(null);
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
			console.error("[KycServicesContext] Error fetching services:", err);
			const errorMessage = "Failed to fetch services";
			setError(errorMessage);
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

	// Load services on mount - only once
	useEffect(() => {
		if (!hasFetched) {
			loadServices();
		}
	}, [hasFetched, loadServices]);

	/**
	 * Categories derived from services.
	 */
	const categories = useMemo(() => extractCategories(services), [services]);

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

	/**
	 * Get a single service by its slug (kebab-cased name).
	 */
	const getServiceBySlug = useCallback(
		(slug: string): VerificationService | undefined => {
			return services.find((s) => toKebabCase(s.name) === slug);
		},
		[services]
	);

	/**
	 * Get multiple services by their slugs.
	 */
	const getServicesBySlugs = useCallback(
		(slugs: string[]): VerificationService[] => {
			return services.filter((s) => slugs.includes(toKebabCase(s.name)));
		},
		[services]
	);

	/**
	 * Get slug for a service code.
	 */
	const getSlugByCode = useCallback(
		(code: string): string | undefined => {
			const service = services.find((s) => s.serviceCode === code);
			return service ? toKebabCase(service.name) : undefined;
		},
		[services]
	);

	/**
	 * Get service codes from slugs.
	 */
	const getCodesBySlugs = useCallback(
		(slugs: string[]): string[] => {
			return services
				.filter((s) => slugs.includes(toKebabCase(s.name)))
				.map((s) => s.serviceCode);
		},
		[services]
	);

	const contextValue: KycServicesContextState = useMemo(
		() => ({
			services,
			categories,
			loading,
			error,
			refetch: loadServices,
			getServiceByCode,
			getServicesByCodes,
			getServiceBySlug,
			getServicesBySlugs,
			getSlugByCode,
			getCodesBySlugs,
		}),
		[
			services,
			categories,
			loading,
			error,
			loadServices,
			getServiceByCode,
			getServicesByCodes,
			getServiceBySlug,
			getServicesBySlugs,
			getSlugByCode,
			getCodesBySlugs,
		]
	);

	return (
		<KycServicesContext.Provider value={contextValue}>
			{children}
		</KycServicesContext.Provider>
	);
};

/**
 * Hook to access KYC services from context.
 * Returns null if used outside of KycServicesProvider.
 * @returns {KycServicesContextState | null} Context state or null
 */
export const useKycServicesContext = (): KycServicesContextState | null => {
	return useContext(KycServicesContext);
};
