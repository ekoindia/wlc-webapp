/**
 * Creates a new User object based on the payload received from api like login/refresh-profile
 * @param {object} data - will contain the api returned userObject
 */

export const buildUserObjectState = (data) => {
	const {
		personal_details,
		shop_details,
		business_details,
		account_details,
		details,
		...restData
	} = data;

	const {
		uid,
		onboarding,
		onboarding_steps,
		role_list,
		agreementId,
		...restDetails
	} = details || {};

	return {
		isAdminAgentMode: false,
		loggedIn: true,
		is_org_admin: details?.is_org_admin || 0,
		userId: details?.mobile,

		uid,
		onboarding,
		onboarding_steps,
		role_list,
		agreementId,

		userDetails: { ...restDetails, role_list },
		personalDetails: personal_details,
		shopDetails: shop_details,
		businessDetails: business_details,
		accountDetails: account_details,

		...restData,
	};
};
