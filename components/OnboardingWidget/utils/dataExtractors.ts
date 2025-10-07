/**
 * Utility functions for extracting data from unified userData structure
 * Handles both normal and assisted onboarding data formats
 */

/**
 * Unified user data interface that handles both normal and assisted onboarding
 */
export interface UnifiedUserData {
	details?: {
		// Normal onboarding structure
		user_type?: number;
		onboarding_steps?: Array<{ role: number; label?: string }>;
		mobile?: string;
		agreement_id?: number | string;

		// Assisted onboarding structure
		user_detail?: {
			user_type?: number;
			onboarding_steps?: Array<{ role: number; label?: string }>;
			mobile?: string;
			agreement_id?: number | string;
		};
	};
	// Assisted onboarding structure
	user_detail?: {
		user_type?: number;
		onboarding_steps?: Array<{ role: number; label?: string }>;
		mobile?: string;
		agreement_id?: number | string;
	};
}

/**
 * Extracts user type from unified userData structure
 * @param {UnifiedUserData} userData - User data object
 * @returns {number | undefined} User type or undefined if not found
 */
export const getUserTypeFromData = (
	userData: UnifiedUserData
): number | undefined => {
	console.log("[AgentOnboarding] getUserTypeFromData", userData);
	console.log(
		"[AgentOnboarding] getUserTypeFromData userData?.details?.user_detail?.user_type",
		userData?.details?.user_detail?.user_type
	);
	console.log(
		"[AgentOnboarding] getUserTypeFromData userData?.details?.user_type",
		userData?.details?.user_type
	);
	return (
		userData?.details?.user_detail?.user_type || // Assisted onboarding
		userData?.details?.user_type // Normal onboarding
	);
};

/**
 * Extracts onboarding steps from unified userData structure
 * @param {UnifiedUserData} userData - User data object
 * @returns {Array<{ role: number; label?: string }> | undefined} Onboarding steps or undefined if not found
 */
export const getOnboardingStepsFromData = (
	userData: UnifiedUserData
): Array<{ role: number; label?: string }> | undefined => {
	return (
		userData?.details?.user_detail?.onboarding_steps || // Assisted onboarding
		userData?.details?.onboarding_steps // Normal onboarding
	);
};

/**
 * Extracts mobile number from unified userData structure
 * @param {UnifiedUserData} userData - User data object
 * @returns {string | undefined} Mobile number or undefined if not found
 */
export const getMobileFromData = (
	userData: UnifiedUserData
): string | undefined => {
	return (
		userData?.user_detail?.mobile || userData?.details?.mobile // Assisted onboarding // Normal onboarding
	);
};

/**
 * Extracts agreement ID from unified userData structure
 * @param {UnifiedUserData} userData - User data object
 * @returns {number | string | undefined} Agreement ID or undefined if not found
 */
export const getAgreementIdFromData = (
	userData: UnifiedUserData
): number | string | undefined => {
	return (
		userData?.details?.user_detail?.agreement_id || // Assisted onboarding
		userData?.details?.agreement_id // Normal onboarding
	);
};
