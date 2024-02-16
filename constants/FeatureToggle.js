/**
 * Note: This file is used to enable or disable features in the application.
 * Can be used to enable or disable features based on user roles or environment.
 */
const FeatureToggle = {
	GPT_CHAT: {
		enabled: true,
		forUsers: [],
		forEnv: ["development"], // ["staging", "development"]
	},
};

/**
 * Function to check if a feature is enabled based on featureName, userId and environment (process.env.NEXT_PUBLIC_ENV)
 * @param {String} featureName - Name of the feature (eg: "GPT_CHAT")
 * @param {String} userId - User Id
 * @returns {Boolean} - Returns true if the feature is enabled, else false
 */
export const isFeatureEnabled = (featureName, userId) => {
	const feature = FeatureToggle[featureName];
	if (!feature) {
		return false;
	}

	if (
		userId &&
		feature.forUsers.length > 0 &&
		!feature.forUsers.includes(userId)
	) {
		return false;
	}

	if (
		feature.forEnv.length > 0 &&
		!feature.forEnv.includes(process.env.NEXT_PUBLIC_ENV)
	) {
		return false;
	}

	return feature.enabled;
};
