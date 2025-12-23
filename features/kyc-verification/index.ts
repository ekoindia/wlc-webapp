/**
 * KYC Verification Feature
 *
 * This feature provides a comprehensive KYC verification page with:
 * - Grid view of all verification services
 * - Category filtering with tabs
 * - Search functionality
 * - Single and multi-service selection modes
 * - Dynamic form generation based on service parameters
 * @example
 * // In a page component:
 * import { KycVerificationPage } from "features/kyc-verification";
 *
 * export default function Page() {
 *   return <KycVerificationPage />;
 * }
 */

// Page components
export { KycVerificationPage, ServiceFormPage } from "./page-components";

// Feature components
export {
	CategoryTabs,
	MultiServiceToggle,
	SelectedServicesPill,
	ServiceSearch,
} from "./components";

// Hooks
export { useKycServices, useServiceSelection } from "./hooks";

// Types
export type {
	CategoryOption,
	FormField,
	KycServicesResponse,
	MultiServiceState,
	RequestParam,
	RequestParamValidation,
	VerificationService,
} from "./types";

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
