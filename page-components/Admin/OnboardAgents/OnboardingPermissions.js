import { UserType } from "constants/UserTypes";

/**
 * Permission configuration map for agent onboarding based on user roles
 * This defines the capabilities for each user role in a centralized way
 */
const ONBOARDING_PERMISSIONS = {
	ADMIN: {
		key: "admin", // Corresponds to isAdmin = true
		allowedAgentTypes: [1, 2], // 1 = Distributor, 2 = Retailer
		autoMapDistributor: false,
	},
	SUPER_DISTRIBUTOR: {
		key: UserType.SUPER_DISTRIBUTOR, // Corresponds to usertype = 7
		allowedAgentTypes: [1, 2], // 1 = Distributor, 2 = Retailer
		autoMapDistributor: false,
	},
	DISTRIBUTOR: {
		key: UserType.DISTRIBUTOR, // Corresponds to usertype = 1
		allowedAgentTypes: [2], // 2 = Retailer only
		autoMapDistributor: true,
	},
	FIELD_EXECUTIVE: {
		key: UserType.FOS, // Corresponds to usertype = 4
		allowedAgentTypes: [2], // 2 = Retailer only
		autoMapDistributor: false,
	},
};

/**
 * Get permissions based on user role
 * @param {boolean} isAdmin - Whether the user is an admin
 * @param {number} userType - User type ID
 * @returns {object} - Permissions object for the user role
 */
export const getOnboardingPermissions = (isAdmin, userType) => {
	if (isAdmin) {
		return ONBOARDING_PERMISSIONS.ADMIN;
	}

	switch (userType) {
		case UserType.SUPER_DISTRIBUTOR:
			return ONBOARDING_PERMISSIONS.SUPER_DISTRIBUTOR;
		case UserType.DISTRIBUTOR:
			return ONBOARDING_PERMISSIONS.DISTRIBUTOR;
		case UserType.FOS:
			return ONBOARDING_PERMISSIONS.FIELD_EXECUTIVE;
		default:
			// Default to most restrictive permissions if user type is unknown
			return {
				key: "unknown",
				allowedAgentTypes: [],
				autoMapDistributor: false,
			};
	}
};

export default ONBOARDING_PERMISSIONS;
