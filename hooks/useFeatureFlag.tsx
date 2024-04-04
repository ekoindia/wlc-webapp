import { FeatureFlags, FeatureFlagType } from "constants/featureFlags";
import { useSession } from "contexts";
import { useEffect, useState } from "react";

/**
 * Hook for FeatureFlags. Check if a feature is enabled based on featureName, userId, userType, environment (process.env.NEXT_PUBLIC_ENV), etc.
 * The feature-flags (including featureName) are defined in the [constants/featureFlags.js](constants/featureFlags.js) file.
 * @param {string} featureName - Name of the feature (eg: "CHAT")
 * @returns {boolean} - Returns true if the feature is defined, enabled & passes all conditions, else false
 */
const useFeatureFlag = (featureName) => {
	const { isAdmin, userId, userType, isLoggedIn } = useSession();
	const [allowed, setAllowed] = useState<boolean>(false);

	useEffect(() => {
		const feature: FeatureFlagType = FeatureFlags[featureName];

		// If the feature is not defined or disabled, return false without checking other conditions.
		if (!feature?.enabled) {
			setAllowed(false);
			return;
		}

		// Check if the feature is allowed for Admin only
		if (feature.forAdminOnly && !isAdmin) {
			setAllowed(false);
			return;
		}

		// Check if the feature is enabled for the environment (if a set of envoirnments are allowed).
		if (
			feature.forEnv?.length > 0 &&
			!feature.forEnv.includes(process.env.NEXT_PUBLIC_ENV)
		) {
			setAllowed(false);
			return;
		}

		// Check if the feature is enabled for the user-type (if a set of allowed user-types is defined).
		if (
			feature.forUserType?.length > 0 &&
			!(isLoggedIn && userType && feature.forUserType.includes(userType))
		) {
			setAllowed(false);
			return;
		}

		// Check if the feature is enabled for the user (if a set of allowed user-IDs is defined).
		if (
			feature.forUserId?.length > 0 &&
			!(isLoggedIn && userId && feature.forUserId.includes(userId))
		) {
			setAllowed(false);
			return;
		}

		// If all conditions are satisfied, set the feature as allowed.
		setAllowed(true);
	}, [featureName, FeatureFlags, isAdmin, userId, userType, isLoggedIn]);

	// Return the allowed status of the feature.
	return allowed;
};

export default useFeatureFlag;
