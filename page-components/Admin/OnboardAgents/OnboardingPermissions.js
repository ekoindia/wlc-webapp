import { UserType } from "constants/UserTypes";

/**
 * Permission configuration map for agent onboarding based on user roles
 * This defines the capabilities for each user role in a centralized way
 */
const ONBOARDING_PERMISSIONS = {
	ADMIN: {
		key: "admin", // Corresponds to isAdmin = true
		allowedAgentTypes: [UserType.MERCHANT, UserType.DISTRIBUTOR], // 2 = Retailer, 1 = Distributor
		autoMapDistributor: false,
	},
	SUPER_DISTRIBUTOR: {
		key: UserType.SUPER_DISTRIBUTOR, // Corresponds to usertype = 7
		allowedAgentTypes: [UserType.MERCHANT, UserType.DISTRIBUTOR], // 2 = Retailer, 1 = Distributor
		autoMapDistributor: false,
	},
	DISTRIBUTOR: {
		key: UserType.DISTRIBUTOR, // Corresponds to usertype = 1
		allowedAgentTypes: [UserType.MERCHANT], // 2 = Retailer only
		autoMapDistributor: true,
	},
	FIELD_EXECUTIVE: {
		key: UserType.FOS, // Corresponds to usertype = 4
		allowedAgentTypes: [UserType.MERCHANT], // 2 = Retailer only
		autoMapDistributor: false,
	},
};

/**
 * Filter allowed agent types based on org metadata
 * Removes agent types that have disable_partial_account_creation set to true
 * @param {Array<number>} agentTypes - Array of agent type IDs
 * @param {object} userTypesMetadata - User types metadata from org context
 * @returns {Array<number>} - Filtered agent types
 */
const filterAgentTypesByMetadata = (agentTypes, userTypesMetadata) => {
	if (!userTypesMetadata) {
		return agentTypes;
	}

	return agentTypes.filter((typeId) => {
		const typeKey = String(typeId);
		const typeMetadata = userTypesMetadata[typeKey];

		// If metadata exists and disable_partial_account_creation is true, filter it out
		if (
			typeMetadata &&
			typeMetadata.disable_partial_account_creation === true
		) {
			return false;
		}

		// Otherwise, keep the agent type
		return true;
	});
};

/**
 * Get permissions based on user role
 * @param {boolean} isAdmin - Whether the user is an admin
 * @param {number} userType - User type ID
 * @param {object} [userTypesMetadata] - User types metadata from org context (optional)
 * @returns {object} - Permissions object for the user role
 */
export const getOnboardingPermissions = (
	isAdmin,
	userType,
	userTypesMetadata
) => {
	let permissions;

	if (isAdmin) {
		permissions = { ...ONBOARDING_PERMISSIONS.ADMIN };
	} else {
		switch (userType) {
			case UserType.SUPER_DISTRIBUTOR:
				permissions = { ...ONBOARDING_PERMISSIONS.SUPER_DISTRIBUTOR };
				break;
			case UserType.DISTRIBUTOR:
				permissions = { ...ONBOARDING_PERMISSIONS.DISTRIBUTOR };
				break;
			case UserType.FOS:
				permissions = { ...ONBOARDING_PERMISSIONS.FIELD_EXECUTIVE };
				break;
			default:
				// Default to most restrictive permissions if user type is unknown
				permissions = {
					key: "unknown",
					allowedAgentTypes: [],
					autoMapDistributor: false,
				};
		}
	}

	// Filter agent types based on metadata
	if (
		(isAdmin || userType === UserType.SUPER_DISTRIBUTOR) &&
		userTypesMetadata
	) {
		permissions.allowedAgentTypes = filterAgentTypesByMetadata(
			permissions.allowedAgentTypes,
			userTypesMetadata
		);
	}

	return permissions;
};

export default ONBOARDING_PERMISSIONS;
