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
			{
				min: 101,
				max: 499,
				validation: {
					RETAILER: {
						fixed: { min: 0, max: 1 },
						percentage: false,
					},
				},
			},
			{
				min: 500,
				max: 999,
				validation: {
					RETAILER: {
						fixed: { min: 0, max: 3.25 },
						percentage: false,
					},
				},
			},
			{
				min: 1000,
				max: 1999,
				validation: {
					RETAILER: {
						fixed: { min: 0, max: 6.9 },
						percentage: false,
					},
				},
			},
			{
				min: 2000,
				max: 2999,
				validation: {
					RETAILER: {
						fixed: { min: 0, max: 11.5 },
						percentage: false,
					},
				},
			},
			{
				min: 3000,
				max: 6999,
				validation: {
					RETAILER: {
						fixed: { min: 0, max: 13.65 },
						percentage: false,
					},
				},
			},
			{
				min: 7000,
				max: 9999,
				validation: {
					RETAILER: {
						fixed: { min: 0, max: 13.65 },
						percentage: false,
					},
				},
			},
			{
				min: 10000,
				max: 10000,
				validation: {
					RETAILER: {
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
			{
				min: 100,
				max: 5000,
				validation: {
					RETAILER: {
						fixed: {
							cash_to_cash: { min: 0, max: 33.8 },
							cash_to_account: { min: 0, max: 20.5 },
						},
						percentage: false,
					},
					DISTRIBUTOR: {
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
					RETAILER: {
						fixed: {
							cash_to_cash: { min: 0, max: 45 },
							cash_to_account: { min: 0, max: 27.4 },
						},
						percentage: false,
					},
					DISTRIBUTOR: {
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
	CREDIT_CARD_BILL_PAYMENT: {
		uriSegment: "cc_bill_pay",
		slabs: [
			{
				min: 100,
				max: 3000,
				validation: {
					RETAILER: {
						fixed: { min: 3, max: 24 },
						percentage: false,
					},
					DISTRIBUTOR: {
						fixed: { min: 0, max: 24 },
						percentage: false,
					},
				},
			},
			{
				min: 3001,
				max: 24999,
				validation: {
					RETAILER: {
						fixed: { min: 3, max: 200 },
						percentage: { min: 0.1, max: 0.8 },
					},
					DISTRIBUTOR: {
						fixed: { min: 0, max: 200 },
						percentage: { min: 0, max: 0.8 },
					},
				},
			},
			{
				min: 25000,
				max: 200000,
				validation: {
					RETAILER: {
						fixed: { min: 6, max: 1600 },
						percentage: { min: 0.03, max: 0.8 },
					},
					DISTRIBUTOR: {
						fixed: { min: 0, max: 1600 },
						percentage: { min: 0, max: 0.8 },
					},
				},
			},
		],
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
		},
	},
	CARD_PAYMENT: {
		uriSegment: "pg",
		slabs: [{ min: 100, max: 200000 }],
		DEFAULT: {
			operation_type: "3",
			pricing_type: "0",
		},
	},
	UPI_MONEY_TRANSFER: {
		uriSegment: "vpa",
		slabs: [
			{
				min: 100,
				max: 1000,
				validation: {
					RETAILER: {
						fixed: { min: 6.6, max: 8.4 },
						percentage: false,
					},
					DISTRIBUTOR: {
						fixed: { min: 0, max: 3.4 },
						percentage: { min: 0, max: 0.7 },
					},
				},
			},
			{
				min: 1001,
				max: 3500,
				validation: {
					RETAILER: {
						fixed: { min: 8.6, max: 29.6 },
						percentage: false,
					},
					DISTRIBUTOR: {
						fixed: { min: 0, max: 22.6 },
						percentage: false,
					},
				},
			},
			{
				min: 3501,
				max: 25000,
				validation: {
					RETAILER: {
						fixed: false,
						percentage: { min: 0.3, max: 0.7 },
					},
					DISTRIBUTOR: {
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
	UPI_FUND_TRANSFER: {
		uriSegment: "vpa",
		slabs: [
			{
				min: 100,
				max: 1000,
				validation: {
					fixed: {
						DISTRIBUTOR: { min: 0, max: 25 },
						RETAILER: { min: 5, max: 25 },
					},
					percentage: false,
				},
			},
			{
				min: 1001,
				max: 49999,
				validation: {
					fixed: {
						DISTRIBUTOR: { min: 0, max: 500 },
						RETAILER: { min: 10, max: 500 },
					},
					percentage: false,
				},
			},
		],
		DEFAULT: {
			operation_type: "3",
			// pricing_type: "0",
		},
		serviceCode: 728,
	},
	VALIDATE_UPI_ID: {
		uriSegment: "vpa",
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
		},
		serviceCode: 727,
	},
	QR_PAYMENT: {
		uriSegment: "qr",
		DEFAULT: {
			operation_type: "3",
			pricing_type: "1",
		},
	},
	CDM: {
		DEFAULT: {
			operation_type: "3",
			payment_mode: "1",
		},
	},
};

export const productPricingCommissionValidationConfig = {
	DMT: {
		RETAILER: {
			PERCENT: { min: 0.6, max: 0.8 },
			// FIXED: { min: 3.72, max: 35 },
		},
		DISTRIBUTOR: {
			PERCENT: { min: 0, max: 0.25 },
			// FIXED: { min: 0, max: 35 },
		},
	},
	AADHAAR_PAY: {
		PERCENT: { min: 0.3, max: 1 },
		FIXED: { min: 0.3, max: 100 },
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
	VALIDATE_UPI_ID: {
		FIXED: { min: 0, max: 5 },
	},
	QR_PAYMENT: {
		PERCENT: { min: 0, max: 1 },
		FIXED: { min: 0, max: 10 },
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
	UPI_MONEY_TRANSFER: productPricingTextConfig.PRICING,
	UPI_FUND_TRANSFER: productPricingTextConfig.PRICING,
	VALIDATE_UPI_ID: productPricingTextConfig.PRICING,
	QR_PAYMENT: productPricingTextConfig.PRICING,
	CDM: productPricingTextConfig.PRICING,
};

export const agreementProvider = {
	DIGIO: 0,
	KARZA: 1,
	SIGNZY: 2,
	LEEGALITY: 3,
};
