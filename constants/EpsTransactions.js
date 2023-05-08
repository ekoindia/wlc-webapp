/**
 * Transaction_Types_Id to pass in any EPS Transactoin.
 * TODO: Replace with REST APIs.
 */
export const TransactionTypes = {
	GET_PINTWIN_KEY: 241,
	GET_TRANSACTION_HISTORY: 154,
	GET_WALLET_BALANCE: 9,
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
};
