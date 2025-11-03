export const UserType = {
	DISTRIBUTOR: 1,
	MERCHANT: 2,
	I_MERCHANT: 3,
	FOS: 4, // Field Agent
	SALES_EXECUTIVE: 5,
	SUB_MERCHANT: 6,
	SUPER_DISTRIBUTOR: 7,
	PAYMENT_MERCHANT: 8,
	CUSTOMER: 10,
	ENTERPRISE_PARTNER_ADMIN: 23,
	ORG_ADMIN: 24,
	ORG_EMPLOYEE: 25,
};

/**
 * Default labels for each user type.
 * Note: these can be configured per organization.
 */
export const UserTypeLabel = {
	[UserType.SUPER_DISTRIBUTOR]: "Super-Distributor",
	[UserType.DISTRIBUTOR]: "Distributor",
	[UserType.FOS]: "Field Executive", // FOS / Field Agent / CCE / Cash Executive / EkoStar?
	[UserType.MERCHANT]: "Retailer", // Agent / Merchant
	[UserType.I_MERCHANT]: "Independent Retailer", // I-Merchant
	[UserType.SUB_MERCHANT]: "Sub-Retailer",

	[UserType.PAYMENT_MERCHANT]: "Payment Retailer",
	[UserType.SALES_EXECUTIVE]: "Sales Executive",
	[UserType.CUSTOMER]: "User", // Customer

	[UserType.ENTERPRISE_PARTNER_ADMIN]: "Enterprise Partner", // API Partner Dashboard
	[UserType.ORG_ADMIN]: "Organization Admin",
	[UserType.ORG_EMPLOYEE]: "Organization Employee",
};

/**
 * Define the order of users in the hierarchy, from top to bottom.
 * Used for sorting and displaying user-types in the correct order.
 */
export const UserTypeOrder = [
	UserType.ENTERPRISE_PARTNER_ADMIN,
	UserType.ORG_ADMIN,
	UserType.ORG_EMPLOYEE,
	UserType.SUPER_DISTRIBUTOR,
	UserType.SALES_EXECUTIVE,
	UserType.DISTRIBUTOR,
	UserType.FOS,
	UserType.MERCHANT,
	UserType.SUB_MERCHANT,
	UserType.I_MERCHANT,
	UserType.PAYMENT_MERCHANT,
	UserType.CUSTOMER,
];

/**
 * Define icons for each user type.
 */
export const UserTypeIcon = {
	[UserType.DISTRIBUTOR]: "refer", // Distributor
	[UserType.MERCHANT]: "people", // Retailer
	[UserType.I_MERCHANT]: "person", // I-Merchant
	[UserType.FOS]: "directions-walk", // FOS / Field Agent / CCE / Cash Executive / EkoStar?
	[UserType.SUPER_DISTRIBUTOR]: "person", // Super-Distributor
};
