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
		uriSegment: "indoNepal",
		slabs: [
			{ min: 100, max: 5000 },
			{ min: 5001, max: 49800 },
		],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
			payment_mode: "1",
		},
	},
	CREDIT_CARD_BILL_PAYMENT: {
		uriSegment: "cc_bill_pay",
		slabs: [{ min: 100, max: 199999 }],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
	},
	ACCOUNT_VERIFICATION: {
		DEFAULT: {
			pricing_type: "1",
			min_pricing_value: "1.7",
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
	ACCOUNT_VERIFICATION: productPricingTextConfig.COMMISSION,
};
