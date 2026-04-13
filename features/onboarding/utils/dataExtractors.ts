export interface OnboardingStep {
	role: number;
	label?: string;
}

export interface UserDataDetails {
	user_type: number;
	name: string;
	mobile: string;
	agreement_id: number;
	code: string;
	onboarding_steps: OnboardingStep[];
}

/**
 * Unified user data interface used by utility functions.
 * Both Self and Assisted Onboarding map their API responses into this shape,
 * so all extractors work identically for both flows.
 */
export interface UnifiedUserData {
	userDetails?: UserDataDetails;
	onboarding_steps?: OnboardingStep[];
	role_list?: Array<number> | string;
}

/**
 * Extracts the user type from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @returns {number | undefined} The user type if found, otherwise undefined.
 */
export const getUserTypeFromData = (
	data: UnifiedUserData
): number | undefined => {
	return data?.userDetails?.user_type;
};

/**
 * Extracts the onboarding steps from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @returns {Array<{ role: number; label?: string }> | undefined} The list of onboarding steps if available, otherwise undefined.
 */
export const getOnboardingStepsFromData = (
	data: UnifiedUserData
): Array<{ role: number; label?: string }> | undefined => {
	console.log("[getOnboardingStepsFromData] data", data);
	return data?.onboarding_steps;
};

/**
 * Extracts the user's name from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @returns {string | undefined} The user's name if found, otherwise undefined.
 */
export const getUserNameFromData = (
	data: UnifiedUserData
): string | undefined => {
	return data?.userDetails?.name;
};

/**
 * Extracts the mobile number from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @returns {string | undefined} The mobile number if found, otherwise undefined.
 */
export const getMobileFromData = (
	data: UnifiedUserData
): string | undefined => {
	return data?.userDetails?.mobile;
};

/**
 * Extracts the agreement ID from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @returns {number | string | undefined} The agreement ID if found, otherwise undefined.
 */
export const getAgreementIdFromData = (
	data: UnifiedUserData
): number | string | undefined => {
	return data?.userDetails?.agreement_id;
};

/**
 * Extracts the user code from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @returns {string | undefined} The user code if found, otherwise undefined.
 */
export const getUserCodeFromData = (
	data: UnifiedUserData
): string | undefined => {
	return data?.userDetails?.code;
};

export const getRoleListFromData = (data: UnifiedUserData): string => {
	const _roleList = data?.role_list;

	// Ensure we return string
	if (typeof _roleList === "string") {
		return _roleList;
	}
	// If it's an array, join it into a comma-separated string
	if (Array.isArray(_roleList)) {
		return _roleList.join(",");
	}

	// Default to empty array if undefined or not in expected format
	return "";
};
