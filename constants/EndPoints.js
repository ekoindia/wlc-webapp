export const Endpoints = {
	LOGIN: "/authentication/login",
	GOOGLELOGIN: "/authentication/wlc-login",
	LOGOUT: "/authentication/revoke",
	SENDOTP: "/authentication/sendotp",
	GENERATE_TOKEN: "/authentication/token",
	REFRESH_PROFILE: "/authentication/refresh-profile",
	TRANSACTION: "/transactions/do",
	UPLOAD: "/transactions/upload",
	UPLOAD_CUSTOM_URL: "/transactions/customupload", //TODO: merge functionality into upload in node.js app
	GET_ORG_FROM_DOMAIN: "/wlctransactions/wlcorgmeta",
	USER_PROFILE: "/profile",
	HISTORY: "/history",
};
