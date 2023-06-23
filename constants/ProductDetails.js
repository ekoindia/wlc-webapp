/* Slab Details */
export const products = {
	DMT: { slabs: [{ min: 100, max: 5000 }] },
	AEPS: {
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
	},
	AADHAARPAY: { slabs: [{ min: 1, max: 10000 }] },
	INDONEPAL: {
		slabs: [
			{ min: 100, max: 5000 },
			{ min: 5001, max: 49800 },
		],
	},
};

export const productPricingTextConfig = {
	PRICING: "Pricing",
	COMMISSION: "Commission",
};

export const productPricingType = {
	DMT: productPricingTextConfig.PRICING,
	AEPS: productPricingTextConfig.COMMISSION,
	AADHAARPAY: productPricingTextConfig.PRICING,
	INDONEPAL: productPricingTextConfig.COMMISSION,
	// BBPS: productPricingTextConfig.COMMISSION,
};
