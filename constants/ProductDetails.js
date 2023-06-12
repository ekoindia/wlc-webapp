/* Slab Details */
export const ProductSlabs = {
	DMT: [{ min: 100, max: 5000 }],
	AEPS: [
		{ min: 100, max: 100 },
		{ min: 101, max: 499 },
		{ min: 500, max: 999 },
		{ min: 1000, max: 1999 },
		{ min: 2000, max: 2999 },
		{ min: 3000, max: 6999 },
		{ min: 7000, max: 9999 },
		{ min: 10000, max: 10000 },
	],
	AADHAARPAY: [{ min: 1, max: 10000 }],
};

export const ProductPricingTextConfig = {
	PRICING: "Pricing",
	COMMISSION: "Commission",
};

export const ProductPricingType = {
	DMT: ProductPricingTextConfig.PRICING,
	AEPS: ProductPricingTextConfig.COMMISSION,
	AADHAARPAY: ProductPricingTextConfig.PRICING,
	INDONEPAL: ProductPricingTextConfig.COMMISSION,
	// BBPS: ProductPricingTextConfig.COMMISSION,
};
