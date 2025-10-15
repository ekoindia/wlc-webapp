export interface OnboardingStep {
	role: number;
	label?: string;
}

export interface UserDataDetails {
	user_type: number;
	mobile: string;
	agreement_id: number;
	code: string;
	onboarding_steps: OnboardingStep[];
}

export interface AssistedUserData {
	user_type: number;
	mobile: string;
	agreement_id: number;
	code: string;
	onboarding_steps: OnboardingStep[];
	role_list: Array<number> | string;
}

/**
 * Unified user data interface used by utility functions
 */
export interface UnifiedUserData {
	userDetails?: UserDataDetails;
	onboarding_steps?: OnboardingStep[];
	user_detail?: AssistedUserData;
	role_list?: Array<number> | string;
}

/**
 * Extracts the user type from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @param {boolean} isAssistedOnboarding - Indicates if onboarding is assisted (done on behalf of an agent).
 * @returns {number | undefined} The user type if found, otherwise undefined.
 */
export const getUserTypeFromData = (
	data: UnifiedUserData,
	isAssistedOnboarding: boolean
): number | undefined => {
	const _userType = isAssistedOnboarding
		? data?.user_detail?.user_type
		: data?.userDetails?.user_type;

	return _userType;
};

/**
 * Extracts the onboarding steps from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @param {boolean} isAssistedOnboarding - Indicates if onboarding is assisted (done on behalf of an agent).
 * @returns {Array<{ role: number; label?: string }> | undefined} The list of onboarding steps if available, otherwise undefined.
 */
export const getOnboardingStepsFromData = (
	data: UnifiedUserData,
	isAssistedOnboarding: boolean
): Array<{ role: number; label?: string }> | undefined => {
	const _onboardingSteps = isAssistedOnboarding
		? data?.user_detail?.onboarding_steps
		: data?.onboarding_steps;

	return _onboardingSteps;
};

/**
 * Extracts the mobile number from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @param {boolean} isAssistedOnboarding - Indicates if onboarding is assisted (done on behalf of an agent).
 * @returns {string | undefined} The mobile number if found, otherwise undefined.
 */
export const getMobileFromData = (
	data: UnifiedUserData,
	isAssistedOnboarding: boolean
): string | undefined => {
	const _mobile = isAssistedOnboarding
		? data?.user_detail?.mobile
		: data?.userDetails?.mobile;
	return _mobile;
};

/**
 * Extracts the agreement ID from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @param {boolean} isAssistedOnboarding - Indicates if onboarding is assisted (done on behalf of an agent).
 * @returns {number | string | undefined} The agreement ID if found, otherwise undefined.
 */
export const getAgreementIdFromData = (
	data: UnifiedUserData,
	isAssistedOnboarding: boolean
): number | string | undefined => {
	const _agreementId = isAssistedOnboarding
		? data?.user_detail?.agreement_id
		: data?.userDetails?.agreement_id;
	return _agreementId;
};

/**
 * Extracts the user code from the unified user data object.
 * @param {UnifiedUserData} data - The unified user data object.
 * @param {boolean} isAssistedOnboarding - Indicates if onboarding is assisted (done on behalf of an agent).
 * @returns {string | undefined} The user code if found, otherwise undefined.
 */
export const getUserCodeFromData = (
	data: UnifiedUserData,
	isAssistedOnboarding: boolean
): string | undefined => {
	const _userCode = isAssistedOnboarding
		? data?.user_detail?.code
		: data?.userDetails?.code;

	return _userCode;
};

export const getRoleListFromData = (
	data: UnifiedUserData,
	isAssistedOnboarding: boolean
): string => {
	const _roleList = isAssistedOnboarding
		? data?.user_detail?.role_list
		: data?.role_list;

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
