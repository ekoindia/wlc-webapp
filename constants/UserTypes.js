export const UserType = {
	DISTRIBUTOR: 1,
	MERCHANT: 2,
	I_MERCHANT: 3,
	FOS: 4, // FOS / CCE / Cash Executive / Field Agent
	SALES_EXECUTIVE: 5,
	SUB_MERCHANT: 6,
	SUPER_DISTRIBUTOR: 7,
	PAYMENT_MERCHANT: 8,
	CUSTOMER: 10,
	ENTERPRISE_PARTNER_ADMIN: 23,
	ORG_ADMIN: 24,
	ORG_EMPLOYEE: 25,
};

export const UserTypeLabel = {
	1: "Distributor",
	2: "Retailer", // Agent / Merchant
	3: "Independent Retailer", // I-Merchant
	4: "Field Executive", // FOS / Field Agent / CCE / Cash Executive / EkoStar?
	5: "Sales Executive",
	6: "Sub-Retailer",
	7: "Super-Distributor",
	8: "Payment Retailer",
	10: "User", // Customer
	23: "Enterprise Partner", // API Partner Dashboard
	24: "Organization Admin",
	25: "Organization Employee",
};

export const UserTypeIcon = {
	1: "refer", // Distributor
	2: "people", // Retailer
	3: "person", // I-Merchant
	4: "directions-walk", // FOS / Field Agent / CCE / Cash Executive / EkoStar?
	7: "person", // Super-Distributor
};
