export const UserType = {
	DISTRIBUTOR: 1,
	MERCHANT: 2,
	I_MERCHANT: 3,
	FOS: 4, // FOS / CCE / Cash Executive / EkoStar?
	SALES_EXECUTIVE: 5,
	SUB_MERCHANT: 6,
	SUPER_DISTRIBUTOR: 7,
	PAYMENT_MERCHANT: 8,
	CUSTOMER: 10,
	ENTERPRISE_PARTNER_ADMIN: 23,
};

export const UserTypeLabel = {
	1: "Distributor",
	2: "Seller",
	3: "iSeller",
	4: "Cash Executive", // FOS / CCE / Cash Executive / EkoStar?
	5: "Sales Executive",
	6: "Sub-Seller",
	7: "Super-Distributor",
	8: "Payment Seller",
	10: "Personal User", // Customer
	23: "Enterprise Partner", // API Partner Dashboard
};
