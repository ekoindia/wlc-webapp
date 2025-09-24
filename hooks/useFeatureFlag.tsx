import { FeatureFlags, FeatureFlagType } from "constants/featureFlags";
import { useOrgDetailContext, useSession } from "contexts";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Pure function to handle inverted logic for feature flags
 * @param {boolean} result - The original feature flag result
 * @param {boolean} isInverted - Whether the feature name has ! prefix
 * @returns {boolean} - The final result considering inversion
 */
const checkInversion = (result: boolean, isInverted: boolean): boolean => {
	return isInverted ? !result : result;
};

/**
 * Hook for FeatureFlags. Check if a feature is enabled based on featureName, userId, userType, environment (process.env.NEXT_PUBLIC_ENV), etc.
 * The feature-flags (including featureName) are defined in the [constants/featureFlags.js](constants/featureFlags.js) file.
 * Supports inverted logic using ! prefix (e.g., "!FEATURE_NAME" returns opposite of FEATURE_NAME).
 * @param {string} featureName - Name of the feature (eg: "CHAT") or inverted feature (eg: "!LEGACY_FEATURE")
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
	const cacheKey = useMemo(
		() =>
			`${isAdmin}-${userId}-${userType}-${isLoggedIn}-${org_id}-${process.env.NEXT_PUBLIC_ENV}`,
		[isAdmin, userId, userType, isLoggedIn, org_id]
	);

	/**
	 * Check if a feature is enabled based on the conditions defined in the featureFlags.
	 * This function handles the core feature logic without inversion.
	 */
	const checkFeatureFlag = useCallback(
		(
			customFeatureName: string,
			cache: Map<string, boolean> = new Map(),
			visitedFeatures: Set<string> = new Set()
		): boolean => {
			if (!customFeatureName) {
				console.error("Feature name not provided:", customFeatureName);
				return false;
			}

			// Remove ! prefix for actual feature name processing
			const actualFeatureName = customFeatureName.startsWith("!")
				? customFeatureName.substring(1)
				: customFeatureName;

			// Check cache first (using actualFeatureName for core logic cache)
			const cacheKeyForFeature = `${cacheKey}-${actualFeatureName}`;
			if (cache.has(cacheKeyForFeature)) {
				return cache.get(cacheKeyForFeature)!;
			}

			// Check for circular dependency
			if (visitedFeatures.has(actualFeatureName)) {
				console.error(
					"Circular dependency detected for feature:",
					actualFeatureName
				);
				cache.set(cacheKeyForFeature, false);
				return false;
			}

			// Add current feature to visited set
			const newVisitedFeatures = new Set(visitedFeatures);
			newVisitedFeatures.add(actualFeatureName);

			const feature: FeatureFlagType = FeatureFlags[actualFeatureName];

			// If feature is not defined, return false.
			if (!feature) {
				console.log("Feature not defined:", actualFeatureName);
				cache.set(cacheKeyForFeature, false);
				return false;
			}

			// If the feature is disabled, return false.
			if (feature.enabled !== true) {
				console.log("Feature disabled:", actualFeatureName);
				cache.set(cacheKeyForFeature, false);
				return false;
			}

			// Check if the feature is allowed for Admin only
			if (feature.forAdminOnly && !isAdmin) {
				console.log(
					"Feature not allowed for non-Admins:",
					actualFeatureName
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
					actualFeatureName
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
					actualFeatureName,
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
			// Call the checkFeatureFlag recursively for each required feature.
			// If any required feature is not enabled, return false.
			// This is to ensure that the feature is not enabled if any of its dependencies are not met.
			if (feature.requiredFeatures?.length > 0) {
				const allRequiredFeaturesEnabled =
					feature.requiredFeatures.every((reqFeature) =>
						checkFeatureFlag(reqFeature, cache, newVisitedFeatures)
					);
				if (!allRequiredFeaturesEnabled) {
					console.log(
						"Feature not enabled due to missing dependencies:",
						actualFeatureName
					);
					cache.set(cacheKeyForFeature, false);
					return false;
				}
			}

			// If all conditions are satisfied, return true.
			console.log("Feature enabled:", actualFeatureName);
			cache.set(cacheKeyForFeature, true);
			return true;
		},
		[cacheKey, isAdmin, userId, userType, isLoggedIn, org_id]
	);

	/**
	 * Check if the default feature (passed to the hook) is enabled based on the conditions defined in the featureFlags.
	 * Apply inversion logic if feature name starts with !
	 */
	useEffect(() => {
		if (!featureName) {
			return;
		}
		const isInverted = featureName.startsWith("!");
		const result = checkFeatureFlag(featureName);
		setAllowed(checkInversion(result, isInverted));
	}, [featureName, checkFeatureFlag]);

	// Return the allowed status of the feature and the core checkFeatureFlag function.
	return [allowed, checkFeatureFlag];
};

export default useFeatureFlag;
