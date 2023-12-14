/**
 * Creates a new User object based on the payload received from api like login/refresh-profile
 * @param {object} data - will contain the api returned userObject
 */

export const buildUserObjectState = (data) => {
	return {
		loggedIn: true,
		is_org_admin: data?.details?.is_org_admin || 0,
		isAdminAgentMode: false,
		access_token: data.access_token,
		refresh_token: data.refresh_token,
		token_timeout: data?.token_timeout,
		long_session: data?.long_session,
		userId: data?.details?.mobile,
		uid: data.details?.uid,
		userDetails: {
			...data.details,
		},
		personalDetails: data?.personal_details,
		shopDetails: data?.shop_details,
		accountDetails: data?.account_details,
		onboarding: data?.details?.onboarding,
		onboarding_steps: data?.details?.onboarding_steps,
		role_list: data?.details?.role_list,
		agreementId: data?.details?.agreement_id,
	};
};
