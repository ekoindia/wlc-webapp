/**
 * Product Details:
 * - products: Object containing details of all products for their pricing and commission
 * - productPricingTextConfig: Object containing text for "pricing" and "commission" terms
 * - productPricingType: Object containing product names mapped to their pricing type
 * - agreementProvider: Object containing agreement providers
 * - ProductRoleConfiguration: Object containing products mapped to their roles (for enabling & disabling the products)
 */
export const products = {
	AADHAAR_PAY: {
		uriSegment: "aadharpay",
		slabs: [
			{
				min: 1,
				max: 10000,
				validation: {
					PRICING: {
						fixed: false,
						percentage: { min: 0.3, max: 1 },
					},
				},
			},
		],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
	},
	ACCOUNT_VERIFICATION: {
		validation: {
			PRICING: {
				fixed: { min: 0.84, max: 5 },
				percentage: false,
			},
		},
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
		},
	},
	AEPS: {
		uriSegment: "aeps",
		slabs: [
			{
				min: 101,
				max: 499,
				validation: {
					PRICING: {
						fixed: { min: 0, max: 1 },
						percentage: false,
					},
				},
			},
			{
				min: 500,
				max: 999,
				validation: {
					PRICING: {
						fixed: { min: 0, max: 3.25 },
						percentage: false,
					},
				},
			},
			{
				min: 1000,
				max: 1999,
				validation: {
					PRICING: {
						fixed: { min: 0, max: 6.9 },
						percentage: false,
					},
				},
			},
			{
				min: 2000,
				max: 2999,
				validation: {
					PRICING: {
						fixed: { min: 0, max: 11.5 },
						percentage: false,
					},
				},
			},
			{
				min: 3000,
				max: 6999,
				validation: {
					PRICING: {
						fixed: { min: 0, max: 13.65 },
						percentage: false,
					},
				},
			},
			{
				min: 7000,
				max: 9999,
				validation: {
					PRICING: {
						fixed: { min: 0, max: 13.65 },
						percentage: false,
					},
				},
			},
			{
				min: 10000,
				max: 10000,
				validation: {
					PRICING: {
						fixed: { min: 0, max: 13.65 },
						percentage: false,
					},
				},
			},
		],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
		},
		serviceCode: 424,
	},
	CARD_PAYMENT: {
		uriSegment: "pg",
		slabs: [
			{
				min: 100,
				max: 200000,
				validation: {
					PRICING: {
						fixed: false,
						percentage: { min: 0.9, max: 4 },
					},
					COMMISSION: {
						fixed: { min: 0, max: 1000 },
						percentage: { min: 0, max: 4 },
					},
				},
			},
		],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
	},
	CDM: {
		api: {
			retailer: {},
			// distributor: {},
		},
		DEFAULT: {
			operation_type: "3",
			payment_mode: "1",
		},
	},
	CREDIT_CARD_BILL_PAYMENT: {
		uriSegment: "cc_bill_pay",
		slabs: [
			{
				min: 100,
				max: 3000,
				validation: {
					PRICING: {
						fixed: { min: 5, max: 24 },
						percentage: false,
					},
					COMMISSION: {
						fixed: { min: 0, max: 24 },
						percentage: false,
					},
				},
			},
			{
				min: 3001,
				max: 24999,
				validation: {
					PRICING: {
						fixed: { min: 8, max: 200 },
						percentage: { min: 0.3, max: 2 },
					},
					COMMISSION: {
						fixed: { min: 0, max: 200 },
						percentage: { min: 0, max: 0.8 },
					},
				},
			},
			{
				min: 25000,
				max: 200000,
				validation: {
					PRICING: {
						fixed: { min: 15, max: 1600 },
						percentage: { min: 0.06, max: 2 },
					},
					COMMISSION: {
						fixed: { min: 0, max: 1600 },
						percentage: { min: 0, max: 0.8 },
					},
				},
			},
		],
		DEFAULT: {
			operation_type: "3",
			// pricing_type: "0",
		},
		serviceCode: 711,
	},
	DMT: {
		uriSegment: "dmt",
		slabs: [
			{
				min: 100,
				max: 1000,
				validation: {
					PRICING: {
						fixed: { min: 8, max: 12 },
						percentage: false,
					},
					COMMISSION: {
						fixed: false,
						percentage: { min: 0, max: 0.25 },
					},
				},
			},
			{
				min: 1001,
				max: 2000,
				validation: {
					PRICING: {
						fixed: false,
						percentage: { min: 0.75, max: 1.2 },
					},
					COMMISSION: {
						fixed: false,
						percentage: { min: 0, max: 0.25 },
					},
				},
			},
			{
				min: 2001,
				max: 3000,
				validation: {
					PRICING: {
						fixed: false,
						percentage: { min: 0.6, max: 1.2 },
					},
					COMMISSION: {
						fixed: false,
						percentage: { min: 0, max: 0.25 },
					},
				},
			},
			{
				min: 3001,
				max: 4000,
				validation: {
					PRICING: {
						fixed: false,
						percentage: { min: 0.55, max: 1.2 },
					},
					COMMISSION: {
						fixed: false,
						percentage: { min: 0, max: 0.25 },
					},
				},
			},
			{
				min: 4001,
				max: 5000,
				validation: {
					PRICING: {
						fixed: false,
						percentage: { min: 0.52, max: 1.2 },
					},
					COMMISSION: {
						fixed: false,
						percentage: { min: 0, max: 0.25 },
					},
				},
			},
		],
		DEFAULT: {
			operation_type: "3",
			// pricing_type: "0",
		},
		serviceCode: 721,
	},
	FLIGHT_BOOKING: {
		agent: {
			uriSegment: "travel",
			initialVal: {
				operation_type: "3",
				pricing_type: "1",
			},
			validation: {
				fixed: false,
				percentage: { min: 0, max: 0.1 },
			},
		},
		distributor: {
			serviceCode: 750,
			validation: {
				fixed: false,
				percentage: { min: 0, max: 0.3 },
			},
		},
	},
	INDO_NEPAL_FUND_TRANSFER: {
		uriSegment: "indonepal",
		slabs: [
			{
				min: 100,
				max: 5000,
				validation: {
					PRICING: {
						fixed: {
							cash_to_cash: { min: 0, max: 33.8 },
							cash_to_account: { min: 0, max: 20.5 },
						},
						percentage: false,
					},
					COMMISSION: {
						fixed: {
							cash_to_cash: { min: 0, max: 23.3 },
							cash_to_account: { min: 0, max: 13.75 },
						},
						percentage: false,
					},
				},
			},
			{
				min: 5001,
				max: 49999,
				validation: {
					PRICING: {
						fixed: {
							cash_to_cash: { min: 0, max: 45 },
							cash_to_account: { min: 0, max: 27.4 },
						},
						percentage: false,
					},
					COMMISSION: {
						fixed: {
							cash_to_cash: { min: 0, max: 30.8 },
							cash_to_account: { min: 0, max: 18.3 },
						},
						percentage: false,
					},
				},
			},
		],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
			payment_mode: "1",
		},
		serviceCode: [198, 466], //['cash_to_cash','cash_to_account']
	},
	INSURANCE_DEKHO: {
		distributor: {
			serviceCode: 725,
			validation: {
				fixed: false,
				percentage: { min: 0, max: 37.5 },
			},
		},
	},
	QR_PAYMENT: {
		uriSegment: "qr",
		validation: {
			PRICING: {
				fixed: { min: 0, max: 10 },
				percentage: false,
			},
		},
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
		},
	},
	TRAIN_BOOKING: {
		agent: {
			uriSegment: "travel",
			initialVal: {
				operation_type: "3",
				pricing_type: "1",
			},
			validation: {
				fixed: false,
				percentage: { min: 0, max: 0.1 },
			},
		},
		distributor: {
			serviceCode: 712,
			validation: {
				fixed: false,
				percentage: { min: 0, max: 0.2 },
			},
		},
	},
	UPI_FUND_TRANSFER: {
		uriSegment: "vpa",
		slabs: [
			{
				min: 100,
				max: 1000,
				validation: {
					PRICING: {
						fixed: { min: 5, max: 25 },
						percentage: false,
					},
					COMMISSION: {
						fixed: { min: 0, max: 25 },
						percentage: false,
					},
				},
			},
			{
				min: 1001,
				max: 49999,
				validation: {
					PRICING: {
						fixed: { min: 10, max: 500 },
						percentage: false,
					},
					COMMISSION: {
						fixed: { min: 0, max: 500 },
						percentage: false,
					},
				},
			},
		],
		DEFAULT: {
			operation_type: "3",
			// pricing_type: "0",
		},
		serviceCode: 728,
	},
	UPI_MONEY_TRANSFER: {
		uriSegment: "vpa",
		slabs: [
			{
				min: 100,
				max: 1000,
				validation: {
					PRICING: {
						fixed: { min: 6.6, max: 8.4 },
						percentage: false,
					},
					COMMISSION: {
						fixed: { min: 0, max: 3.4 },
						percentage: { min: 0, max: 0.7 },
					},
				},
			},
			{
				min: 1001,
				max: 3500,
				validation: {
					PRICING: {
						fixed: { min: 8.6, max: 29.6 },
						percentage: false,
					},
					COMMISSION: {
						fixed: { min: 0, max: 22.6 },
						percentage: false,
					},
				},
			},
			{
				min: 3501,
				max: 25000,
				validation: {
					PRICING: {
						fixed: false,
						percentage: { min: 0.3, max: 0.7 },
					},
					COMMISSION: {
						fixed: false,
						percentage: { min: 0, max: 0.7 },
					},
				},
			},
		],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
		serviceCode: 726,
	},
	VALIDATE_UPI_ID: {
		uriSegment: "vpa",
		validation: {
			PRICING: {
				fixed: { min: 0, max: 5 },
				percentage: false,
			},
		},
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
		},
		serviceCode: 727,
	},
};

export const productPricingTextConfig = {
	PRICING: "Pricing",
	COMMISSION: "Commission",
};

export const productPricingType = {
	AADHAAR_PAY: productPricingTextConfig.PRICING,
	ACCOUNT_VERIFICATION: productPricingTextConfig.PRICING,
	AEPS: productPricingTextConfig.COMMISSION,
	// BBPS: productPricingTextConfig.COMMISSION,
	CARD_PAYMENT: productPricingTextConfig.PRICING,
	CDM: productPricingTextConfig.PRICING,
	CREDIT_CARD_BILL_PAYMENT: productPricingTextConfig.PRICING,
	DMT: productPricingTextConfig.PRICING,
	INDO_NEPAL_FUND_TRANSFER: productPricingTextConfig.COMMISSION,
	QR_PAYMENT: productPricingTextConfig.PRICING,
	TRAVEL_BOOKING: productPricingTextConfig.COMMISSION,
	UPI_FUND_TRANSFER: productPricingTextConfig.PRICING,
	UPI_MONEY_TRANSFER: productPricingTextConfig.PRICING,
	VALIDATE_UPI_ID: productPricingTextConfig.PRICING,
};

export const agreementProvider = {
	DIGIO: 0,
	KARZA: 1,
	SIGNZY: 2,
	LEEGALITY: 3,
};

// TODO: WIP Type Definitions for converting to Typescript
/**
 * Interface for setting min/max range
 */
// interface Range {
// 	min: number;
// 	max: number;
// }

/**
 * Interface for setting min/max range for pricing and commission
 */
// interface PriceRange {
// 	fixed: Range | false;
// 	percentage: Range | false;
// }

/**
 * Interface for Validation details
 */
// interface Validation {
// 	PRICING: PriceRange;
// 	COMMISSION?: PriceRange;
// }

/**
 * Interface for a pricing Slab
 */
// interface Slab {
// 	min: number;
// 	max: number;
// 	validation: Validation;
// }

/**
 * Interface for Product details
 */
// interface Product {
// 	uriSegment: string;
// 	slabs?: Slab[];
// 	DEFAULT: {
// 		operation_type: string;
// 		pricing_type?: string;
// 		payment_mode?: string;
// 	};
// 	serviceCode?: number | number[];
// }

/**
 * Interface for Products object
 */
// interface Products {
// 	[key: string]: Product;
// }

/**
 * List of all products mapped to their roles.
 */
export const ProductRoleConfiguration = {
	products: [
		{
			trxn_id: 1997,
			tx_typeid: 81,
			label: "Money Transfer",
			roles: [49200, 49300],
		},
		{
			trxn_id: 1122,
			label: "UPI Money Transfer",
			roles: [38000],
		},
		{
			trxn_id: 252,
			tx_typeid: 345,
			label: "AePS Cashout",
			roles: [4600, 9300],
		},
		{
			trxn_id: 244,
			tx_typeid: 63,
			label: "Recharge & Bill Payment",
			roles: [/* 100, */ 20000, 20100],
			comment: "Including Credit Card Bill Payment",
		},
		{
			trxn_id: 933,
			label: "Travel Booking",
			roles: [34003],
		},
		{ trxn_id: 208, tx_typeid: 279, label: "Indo-Nepal", roles: [3700] },
		{ trxn_id: 1776, tx_typeid: 325, label: "QR Payment", roles: [34000] },
		{
			trxn_id: 1729,
			label: "Lending & Insurance",
			roles: [39000, 37500],
		},
		{ trxn_id: 645, label: "LIC Bill Payment", roles: [28000] },
		{ trxn_id: 1117, tx_typeid: 558, label: "Aadhaar Pay", roles: [14200] },
		{ trxn_id: 877, label: "Airtel CMS", roles: [32000] },
		// { trxn_id: 66, label: "Credit Card Bill Payment", roles: [] },
		{ trxn_id: 9984, label: "Product Store", roles: [7400] },
	],
	evalue: [
		// { trxn_id: 0, label: "QR Payment (Static QR)", roles: [] },	// Same role as QR Payment transaction
		// {
		// 	trxn_id: 0,
		// 	label: "Dynamic QR (for Load E-value using UPI)",
		// 	roles: [],
		// },
		// { trxn_id: 0, label: "Request E-value (Retailer)", roles: [] },
		// { trxn_id: 0, label: "Request E-value (Distributor)", roles: [] },
		// { trxn_id: 0, label: "Request E-value (Super Distributor)", roles: [] },
		// { trxn_id: 0, label: "Payment Gateway (PG)", roles: [] },
		{ trxn_id: 92, label: "Challan Deposit", roles: [8700] },
		{ trxn_id: 324, label: "CDM", roles: [10100] },
		{
			trxn_id: 302,
			label: "Load E-value via Virtual Account",
			roles: [9600],
		}, // PhonePe, PayTM and Yes Bank
		// { trxn_id: 647, label: "AePS Pay", roles: [] }, // Same role as AePS transaction
		{ trxn_id: 263, label: "Get Business Loan", roles: [3200] },
		{ trxn_id: 821, label: "Via NEFT/IMPS/RTGS", roles: [23000] },
		{
			trxn_id: 1735,
			label: "Via Debit/Credit Card",
			roles: [41000],
		}, // Worldline PG
		// { trxn_id: 0, label: "Transfer E-value", roles: [700] },
	],
};
