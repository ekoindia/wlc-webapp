/**
 * KYC Verification Feature
 *
 * This feature provides a comprehensive KYC verification page with:
 * - Grid view of all verification services
 * - Category filtering with tabs
 * - Search functionality
 * - Single and multi-service selection modes
 * - Dynamic form generation based on service parameters
 * - API integration with progressive results display
 * @example
 * // In a page component:
 * import { KycVerificationPage } from "features/kyc-verification";
 *
 * export default function Page() {
 *   return <KycVerificationPage />;
 * }
 */

export {
	KycVerificationPage,
	ManageAgentServicesPage,
	ServiceFormPage,
	VerificationResultsPage,
} from "./page-components";

// Feature components
export {
	CategoryTabs,
	MultiServiceToggle,
	RetryFormModal,
	SelectedServicesPill,
	ServiceFormPageModal,
	ServiceSearch,
	VerificationProgress,
	VerificationResultCard,
	VerificationResultList,
} from "./components";

// Contexts
export { KycServicesProvider, useKycServicesContext } from "./contexts";

// Hooks
export {
	mergeVerificationResults,
	useAgentServices,
	useKycServices,
	useKycVerification,
	useServiceSelection,
} from "./hooks";

// Types
export type {
	AgentServicesResponse,
	CategoryOption,
	FormField,
	KycServicesResponse,
	MultiServiceState,
	RequestParam,
	RequestParamValidation,
	VerificationFilterOptions,
	VerificationResult,
	VerificationService,
	VerificationState,
	VerificationStatus,
} from "./types";

// Utilities
export {
	extractCategories,
	getServiceDescription,
	getServiceIcon,
	normalizeServices,
} from "./utils";

// Constants
export {
	ALL_CATEGORIES_LABEL,
	ALL_CATEGORIES_VALUE,
	DEFAULT_ICON,
	DEFAULT_SERVICE_ICONS,
	KYC_MULTI_SERVICE_STORAGE_KEY,
	KYC_SERVICES_INTERACTION_ID,
	MULTI_SERVICE_SESSION_TIMEOUT_MS,
	UNCATEGORIZED_LABEL,
	UNCATEGORIZED_VALUE,
} from "./constants";

// Mocks (for development)
export {
	getMockServiceByCode,
	getMockServicesByCodes,
	MOCK_KYC_SERVICES,
	MOCK_KYC_SERVICES_RESPONSE,
	USE_MOCK_DATA,
} from "./mocks/mockServices";
