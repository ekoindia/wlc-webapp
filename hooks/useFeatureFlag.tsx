import { FeatureFlags, FeatureFlagType } from "constants/featureFlags";
import { useOrgDetailContext, useSession } from "contexts";
import { useCallback, useEffect, useState } from "react";

/**
 * Hook for FeatureFlags. Check if a feature is enabled based on featureName, userId, userType, environment (process.env.NEXT_PUBLIC_ENV), etc.
 * The feature-flags (including featureName) are defined in the [constants/featureFlags.js](constants/featureFlags.js) file.
 * @param {string} featureName - Name of the feature (eg: "CHAT")
 * @returns {boolean} - Returns true if the feature is defined, enabled & passes all conditions, else false
 */
const useFeatureFlag = (featureName: string) => {
	const { isAdmin, userId, userType, isLoggedIn } = useSession();
	const { orgDetail } = useOrgDetailContext();
	const { org_id } = orgDetail ?? {};
	const [allowed, setAllowed] = useState<boolean>(false);

	/**
	 * CHeck if a feature is enabled based on the conditions defined in the featureFlags.
	 */
	const checkFeatureFlag = useCallback(
		(customFeatureName: string) => {
			if (!customFeatureName) {
				console.error("Feature name not provided:", customFeatureName);
				return false;
			}

			const feature: FeatureFlagType = FeatureFlags[customFeatureName];

			// If feature is not defined, return false.
			if (!feature) {
				console.log("Feature not defined:", customFeatureName);
				return false;
			}

			// If the feature is disabled, return false.
			if (feature.enabled !== true) {
				console.log("Feature disabled:", customFeatureName);
				return false;
			}

			// Check if the feature is allowed for Admin only
			if (feature.forAdminOnly && !isAdmin) {
				console.log(
					"Feature not allowed for non-Admins:",
					customFeatureName
				);
				return false;
			}

			// Check if the feature is enabled for the environment (if a set of envoirnments are allowed).
			if (
				feature.forEnv?.length > 0 &&
				!feature.forEnv.includes(process.env.NEXT_PUBLIC_ENV)
			) {
				console.log(
					"Feature not allowed for this environment:",
					customFeatureName
				);
				return false;
			}

			// Check if the feature is enabled for the user-type (if a set of allowed user-types is defined).
			if (
				feature.forUserType?.length > 0 &&
				!(
					isLoggedIn &&
					userType &&
					feature.forUserType.includes(userType)
				)
			) {
				return false;
			}

			// Check envoirnment specific conditions, such as user-id or org-id:
			if (
				feature.envConstraints &&
				process.env.NEXT_PUBLIC_ENV in feature.envConstraints
			) {
				const envConstraints =
					feature.envConstraints[process.env.NEXT_PUBLIC_ENV];

				// Check if the current user is allowed for the feature.
				if (
					envConstraints.forUserId?.length > 0 &&
					!(
						isLoggedIn &&
						userId &&
						envConstraints.forUserId.includes(userId)
					)
				) {
					return false;
				}

				// Check if the current org is allowed for the feature.
				if (
					envConstraints.forOrgId?.length > 0 &&
					!(org_id && envConstraints.forOrgId.includes(+org_id))
				) {
					return false;
				}
			}

			// If all conditions are satisfied, return true.
			console.log("Feature enabled:", customFeatureName);

			return true;
		},
		[
			FeatureFlags,
			isAdmin,
			userId,
			userType,
			isLoggedIn,
			org_id,
			process.env.NEXT_PUBLIC_ENV,
		]
	);

	/**
	 * Check if the default feature (passed to the hook) is enabled based on the conditions defined in the featureFlags.
	 */
	useEffect(() => {
		if (!featureName) {
			return;
		}
		setAllowed(checkFeatureFlag(featureName));
	}, [featureName, checkFeatureFlag]);

	// Return the allowed status of the feature.
	return [allowed, checkFeatureFlag];
};

export default useFeatureFlag;
