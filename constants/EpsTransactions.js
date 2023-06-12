/**
 * Transaction_Types_Id to pass in any EPS Transactoin.
 * TODO: Replace with REST APIs.
 */
export const TransactionTypes = {
	GET_PINTWIN_KEY: 241,
	GET_TRANSACTION_HISTORY: 154,
	GET_WALLET_BALANCE: 9,
	GET_NOTIFICATIONS: 10010,
	GET_EARNING_SUMMARY: 623,
};

/**
 * Transaction-ids for different transactions/product routes.
 * Eg: To open "Manage My Account" transaction page, open the "/transaction/536" route.
 */
export const TransactionIds = {
	LOAD_EVALUE: 491, // For Retailer + Distributor
	REQUEST_EVALUE: 240, // For Distributor
	TRANSFER_EVALUE: 241, // For Distributor
	// For "Add Wallet Balance" Transaction.
	LOAD_WALLET_TRXN_ID_LIST: [
		491, // Retailers (Load E-value)
		240, // Distributors (Request E-value)
	],

	MANAGE_MY_ACCOUNT: 536,
	UPDATE_REGISTERED_MOBILE: 640,
	VERIFY_MOBILE: 811,
	ADD_ALT_MOBILE: 812,
	VERIFY_ALT_MOBILE: 813,
	DELETE_ALT_MOBILE: 823,
	SET_PIN: 736,
	EKOSTORE: 246,
	BILL_PAYMENT: 244,
	NEED_CASH: 148, // For sellers
	QUERY_TRACKER: 49,
	MY_TEAM: 242, // For Distributor
	USER_PROFILE: 401,
	USER_ONBOARDING: 298,
	USER_ONBOARDING_AADHAR: 523,
	USER_AADHAR_CONSENT: 550,
	USER_AADHAR_NUMBER_CONFIRM: 551,
	USER_AADHAR_OTP_CONFIRM: 552,
	USER_ONBOARDING_ROLE: 521,
	USER_ONBOARDING_BUSINESS: 522,
	USER_ONBOARDING_GET_AGREEMENT_URL: 548,
	USER_ONBOARDING_SUBMIT_SIGN_AGREEMENT: 549,
	USER_ONBOARDING_SECRET_PIN: 5,
	GET_BOOKLET_NUMBER: 170,
	GET_PINTWIN_KEY: 10005,
	ONBOARDING_SET_PIN: 5,
	SHOP_TYPE: 519,
	STATE_TYPE: 387,
	PINCODE_TYPE: 353,
};
