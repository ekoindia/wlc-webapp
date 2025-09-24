import { FeatureFlags, FeatureFlagType } from "constants/featureFlags";
import { useOrgDetailContext, useSession } from "contexts";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Hook for FeatureFlags. Check if a feature is enabled based on featureName, userId, userType, environment (process.env.NEXT_PUBLIC_ENV), etc.
 * The feature-flags (including featureName) are defined in the [constants/featureFlags.js](constants/featureFlags.js) file.
 * @param {string} featureName - Name of the feature (eg: "CHAT")
 * @returns {[boolean, (featureName: string) => boolean]} - Returns an array with the first element being true if the feature is defined, enabled & passes all conditions, else false. The second element is a function that can be used to check if a feature is enabled based on the same conditions.
 */
const useFeatureFlag = (
	featureName: string
): [boolean, (_featureName: string) => boolean] => {
	const { isAdmin, userId, userType, isLoggedIn } = useSession();
	const { orgDetail } = useOrgDetailContext();
	const { org_id } = orgDetail ?? {};
	const [allowed, setAllowed] = useState<boolean>(false);

	// Create a cache key based on user context
	// It is used to cache the results of feature flag checks in memory, so that repeated checks are faster (for circular dependencies, etc.)
	const cacheKey = useMemo(
		() =>
			`${isAdmin}-${userId}-${userType}-${isLoggedIn}-${org_id}-${process.env.NEXT_PUBLIC_ENV}`,
		[isAdmin, userId, userType, isLoggedIn, org_id]
	);

	/**
	 * Internal implementation of checkFeatureFlag, with additional parameters for caching and tracking visited features (to avoid circular dependencies).
	 * @param {string} customFeatureName - Name of the feature to check
	 * @param {Map<string, boolean>} cache - Cache to store results of feature checks (internal implementation; do not pass this parameter)
	 * @param {Set<string>} visitedFeatures - Set of features already visited in the current check (to avoid circular dependencies) (internal implementation; do not pass this parameter)
	 * @returns {boolean} - Returns true if the feature is defined, enabled & passes all conditions, else false.
	 */
	const _checkFeatureFlagImpl = useCallback(
		(
			customFeatureName: string,
			cache: Map<string, boolean> = new Map(),
			visitedFeatures: Set<string> = new Set()
		): boolean => {
			if (!customFeatureName) {
				console.error("Feature name not provided:", customFeatureName);
				return false;
			}

			// Check cache first
			const cacheKeyForFeature = `${cacheKey}-${customFeatureName}`;
			if (cache.has(cacheKeyForFeature)) {
				return cache.get(cacheKeyForFeature)!;
			}

			// Check for circular dependency
			if (visitedFeatures.has(customFeatureName)) {
				console.error(
					"Circular dependency detected for feature:",
					customFeatureName
				);
				cache.set(cacheKeyForFeature, false);
				return false;
			}

			// Add current feature to visited set
			const newVisitedFeatures = new Set(visitedFeatures);
			newVisitedFeatures.add(customFeatureName);

			const feature: FeatureFlagType = FeatureFlags[customFeatureName];

			// If feature is not defined, return false.
			if (!feature) {
				console.log("Feature not defined:", customFeatureName);
				cache.set(cacheKeyForFeature, false);
				return false;
			}

			// If the feature is disabled, return false.
			if (feature.enabled !== true) {
				console.log("Feature disabled:", customFeatureName);
				cache.set(cacheKeyForFeature, false);
				return false;
			}

			// Check if the feature is allowed for Admin only
			if (feature.forAdminOnly && !isAdmin) {
				console.log(
					"Feature not allowed for non-Admins:",
					customFeatureName
				);
				cache.set(cacheKeyForFeature, false);
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
				cache.set(cacheKeyForFeature, false);
				return false;
			}

			// Check if the feature is enabled for the user-type (if a set of allowed user-types is defined).
			if (
				feature.forUserType?.length > 0 &&
				!(
					isLoggedIn &&
					userType &&
					feature.forUserType.includes(+userType)
				)
			) {
				console.log(
					"Feature not allowed for this user-type:",
					customFeatureName,
					feature.forUserType,
					userType
				);

				cache.set(cacheKeyForFeature, false);
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
					cache.set(cacheKeyForFeature, false);
					return false;
				}

				// Check if the current org is allowed for the feature.
				if (
					envConstraints.forOrgId?.length > 0 &&
					!(org_id && envConstraints.forOrgId.includes(+org_id))
				) {
					cache.set(cacheKeyForFeature, false);
					return false;
				}
			}

			// Check if the dependency on other FeatureFlags (from `requiredFeatures` array) is satisfied.
			// Call the _checkFeatureFlagImpl recursively for each required feature.
			// If any required feature is not enabled, return false.
			// This is to ensure that the feature is not enabled if any of its dependencies are not met.
			if (feature.requiredFeatures?.length > 0) {
				const allRequiredFeaturesEnabled =
					feature.requiredFeatures.every((reqFeature) =>
						_checkFeatureFlagImpl(
							reqFeature,
							cache,
							newVisitedFeatures
						)
					);
				if (!allRequiredFeaturesEnabled) {
					console.log(
						"Feature not enabled due to missing dependencies:",
						customFeatureName
					);
					cache.set(cacheKeyForFeature, false);
					return false;
				}
			}

			// If all conditions are satisfied, return true.
			console.log("Feature enabled:", customFeatureName);
			cache.set(cacheKeyForFeature, true);

			return true;
		},
		[cacheKey, isAdmin, userId, userType, isLoggedIn, org_id]
	);

	/**
	 * Check if a feature is enabled based on the conditions defined in the featureFlags.
	 * @param {string | null | undefined} featureName - Name of the feature to check. If the feature name starts with "!", the result is inverted (to check for "feature not enabled").
	 * @returns {boolean} - Returns true if the feature is defined, enabled & passes all conditions, else false.
	 */
	const checkFeatureFlag = useCallback(
		(featureName: string | null | undefined): boolean => {
			// Guard non-string early to avoid runtime errors (e.g. calling .startsWith on null)
			if (typeof featureName !== "string") {
				console.error(
					"Feature name not provided:",
					featureName as unknown as string
				);
				return false;
			}
			let localFeatureName: string = featureName;
			const isInverted = localFeatureName.startsWith("!");
			if (isInverted) {
				localFeatureName = localFeatureName.substring(1);
			}
			if (!localFeatureName) {
				console.error("Feature name not provided:", localFeatureName);
				return false;
			}

			const result = _checkFeatureFlagImpl(localFeatureName);

			// If the feature name starts with "!", invert the result.
			// This is to allow checking for "feature not enabled" in a simple way.
			// Eg: checkFeatureFlag("!MY_FEATURE") will return true if MY_FEATURE is not enabled.
			return isInverted ? !result : result;
		},
		[_checkFeatureFlagImpl]
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
