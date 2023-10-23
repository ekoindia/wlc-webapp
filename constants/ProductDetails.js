/**
 * Product Details
 */
export const products = {
	DMT: {
		uriSegment: "dmt",
		slabs: [
			{ min: 100, max: 1000 },
			{ min: 1001, max: 2000 },
			{ min: 2001, max: 3000 },
			{ min: 3001, max: 4000 },
			{ min: 4001, max: 5000 },
		],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
		serviceCode: 721,
	},
	AEPS: {
		uriSegment: "aeps",
		slabs: [
			{ min: 100, max: 100 },
			{ min: 101, max: 499 },
			{ min: 500, max: 999 },
			{ min: 1000, max: 1999 },
			{ min: 2000, max: 2999 },
			{ min: 3000, max: 6999 },
			{ min: 7000, max: 9999 },
			{ min: 10000, max: 10000 },
		],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
		serviceCode: 424,
	},
	AADHAAR_PAY: {
		uriSegment: "aadharpay",
		slabs: [{ min: 1, max: 10000 }],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
	},
	INDO_NEPAL_FUND_TRANSFER: {
		uriSegment: "indonepal",
		slabs: [
			{ min: 100, max: 5000 },
			{ min: 5001, max: 49800 },
		],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
			payment_mode: "1",
		},
		serviceCode: [198, 466], //['cash_to_cash','cash_to_account']
	},
	CREDIT_CARD_BILL_PAYMENT: {
		uriSegment: "cc_bill_pay",
		slabs: [{ min: 100, max: 199999 }],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
		serviceCode: 711,
	},
	ACCOUNT_VERIFICATION: {
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
			min_pricing_value: "1.71",
		},
	},
	CARD_PAYMENT: {
		uriSegment: "pg",
		slabs: [{ min: 100, max: 25000 }],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
	},
};

export const productPricingCommissionValidationConfig = {
	DMT: {
		RETAILER: {
			PERCENT: { min: 0.3, max: 0.7 },
			FIXED: { min: 3.72, max: 35 },
		},
		DISTRIBUTOR: {
			PERCENT: { min: 0, max: 0.7 },
			FIXED: { min: 0, max: 35 },
		},
	},
	AEPS: {
		RETAILER: {
			PERCENT: { min: 0, max: 0.45 },
			FIXED: { min: 0, max: 13.65 },
		},
		DISTRIBUTOR: {
			PERCENT: { min: 0, max: 0.45 },
			FIXED: { min: 0, max: 13.65 },
		},
	},
	AADHAAR_PAY: {
		PERCENT: { min: 0.3, max: 1 },
		FIXED: { min: 0.3, max: 100 },
	},
	INDO_NEPAL_FUND_TRANSFER: {
		RETAILER: {
			FIXED_CTC: { min: 0, max: 90 },
			FIXED_CTA: { min: 0, max: 1.8 },
		},
		DISTRIBUTOR: {
			FIXED_CTC: { min: 0, max: 90 },
			FIXED_CTA: { min: 0, max: 1.8 },
		},
	},
	CREDIT_CARD_BILL_PAYMENT: {
		RETAILER: {
			PERCENT: { min: 0, max: 0.8 },
			FIXED: { min: 3, max: 1500 },
		},
		DISTRIBUTOR: {
			PERCENT: { min: 0, max: 0.8 },
			FIXED: { min: 0, max: 1500 },
		},
	},
	ACCOUNT_VERIFICATION: {
		FIXED: { min: 1.84, max: 5 },
	},
	CARD_PAYMENT: {
		RETAILER: {
			PERCENT: { min: 0.9, max: 4 },
			FIXED: { min: 1, max: 1000 },
		},
		DISTRIBUTOR: {
			PERCENT: { min: 0, max: 4 },
			FIXED: { min: 0, max: 1000 },
		},
	},
};

export const productPricingTextConfig = {
	PRICING: "Pricing",
	COMMISSION: "Commission",
};

export const productPricingType = {
	DMT: productPricingTextConfig.PRICING,
	AEPS: productPricingTextConfig.COMMISSION,
	AADHAAR_PAY: productPricingTextConfig.PRICING,
	INDO_NEPAL_FUND_TRANSFER: productPricingTextConfig.COMMISSION,
	// BBPS: productPricingTextConfig.COMMISSION,
	CREDIT_CARD_BILL_PAYMENT: productPricingTextConfig.PRICING,
	ACCOUNT_VERIFICATION: productPricingTextConfig.PRICING,
	CARD_PAYMENT: productPricingTextConfig.PRICING,
};
