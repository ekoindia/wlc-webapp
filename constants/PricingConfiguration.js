/**
 * Map of product slugs to their respective details.
 * @typedef {object} ProductDetails
 * @property {string} label - The label of the product.
 * @property {string} desc - The description of the product.
 * @property {string} [note] - Additional notes about the product.
 * @property {string} [icon] - The icon representing the product.
 * @property {string} comp - The component associated with the product.
 * @property {string} slug - The slug identifying the product.
 * @property {boolean} hide - Whether to hide the product from the pricing & commission page.
 */

/**
 * Map containing details for various products identified by their slugs.
 * @type {Object.<string, ProductDetails>}
 */
export const product_slug_map = {
	"commission-frequency": {
		label: "Commission Frequency",
		desc: "Toggle between Daily/Monthly Commissions within your network",
		icon: "money-deposit",
		comp: "CommissionFrequency",
		slug: "commission-frequency",
		hide: false,
	},
	"money-transfer": {
		label: "Money Transfer",
		desc: "Set Agent Pricing/Commission for Domestic Money Transfer services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "cash",
		comp: "Dmt",
		slug: "money-transfer",
		hide: false,
	},
	aeps: {
		label: "AePS Cashout",
		desc: "Set Agent Commissions for AePS Cashout services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "cashout",
		comp: "Aeps",
		slug: "aeps",
		hide: false,
	},
	"payment-gateway": {
		label: "Payment Gateway",
		desc: "Set Agent Pricing for loading E-value using Credit/Debit Card (PG)",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		comp: "CardPayment",
		slug: "payment-gateway",
		hide: true,
	},
	"optional-verification": {
		label: "Account Verification",
		desc: "Change Configuration for Recipient Bank Account Verification process",
		icon: "playlist-add-check",
		comp: "OptionalVerification",
		slug: "optional-verification",
		hide: false,
	},
	"account-verification": {
		label: "Account Verification",
		desc: "Set Agent Pricing for Recipient Bank Account Verification services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "money-note",
		comp: "AccountVerification",
		slug: "account-verification",
		hide: false,
	},
	"credit-card-bill-payment": {
		label: "Credit Card Bill Payment",
		desc: "Set Agent Pricing for Credit Card Bill Payment services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "creditcard",
		comp: "CreditCardBillPayment",
		slug: "credit-card-bill-payment",
		hide: false,
	},
	"aadhaar-pay": {
		label: "Aadhaar Pay",
		desc: "Set Agent Pricing for Credit Card Bill Payment services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "wallet",
		comp: "AadhaarPay",
		slug: "aadhaar-pay",
		hide: false,
	},
	"indo-nepal-fund-transfer": {
		label: "Indo-Nepal Fund Transfer",
		desc: "Set Agent Pricing/Commission for Indo-Nepal Fund Transfer services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "nepal",
		comp: "IndoNepal",
		slug: "indo-nepal-fund-transfer",
		hide: false,
	},
	"airtel-cms": {
		label: "Airtel CMS",
		desc: "Set Agent Pricing/Commission for Airtel CMS services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		comp: "AirtelCms",
		slug: "airtel-cms",
		hide: false,
	},
	"refund-method": {
		label: "Refund Method",
		desc: "Choose the Refund Method for failed transactions within your network",
		comp: "RefundMethod",
		icon: "money-deposit",
		slug: "refund-method",
		hide: false,
	},
	"cash-deposit": {
		label: "Cash Deposit",
		desc: "Configure Cash Deposit services within your network",
		comp: "ToggleCdm",
		icon: "money-deposit",
		slug: "cash-deposit",
		hide: false,
	},
	"upi-money-transfer": {
		label: "UPI Money Transfer",
		desc: "Set Agent Pricing/Commission for UPI Money Transfer services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		comp: "UpiMoneyTransfer",
		icon: "upi",
		slug: "upi-money-transfer",
		hide: true,
	},
	"upi-fund-transfer": {
		label: "UPI NeoBank Payments",
		desc: "Set Agent Pricing/Commission for UPI NeoBank Payments",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		comp: "UpiFundTransfer",
		icon: "upi",
		slug: "upi-fund-transfer",
		hide: true,
	},
	"validate-upi-id": {
		label: "UPI ID Verification",
		desc: "Set Agent Pricing for Recipient UPI ID Verification services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		comp: "ValidateUpiId",
		icon: "upi",
		slug: "validate-upi-id",
		hide: true,
	},
	"qr-payment": {
		label: "QR Payment",
		desc: "Set Agent Pricing for QR Payment services",
		comp: "QrPayment",
		icon: "qrcode",
		slug: "qr-payment",
		hide: false,
	},
	cdm: {
		label: "Cash Deposit",
		desc: "Set Agent Pricing for Cash Deposit services",
		comp: "Cdm",
		icon: "money-deposit",
		slug: "cdm",
		hide: false,
	},
	"travel-train": {
		label: "Travel Train",
		desc: "Set Agent Pricing for Cash Deposit services",
		comp: "TravelTrain",
		slug: "travel-train",
		hide: false,
	},
	"travel-flight": {
		label: "Travel Flight",
		desc: "Set Agent Pricing for Cash Deposit services",
		comp: "TravelFlight",
		icon: "flight",
		slug: "travel-flight",
		hide: false,
	},
};

/**
 * Map of product categories to their associated slugs.
 * @typedef {object} ProductCategoryMap
 * @property {string[]} Product Configuration - Slugs associated with the "Product Configuration" category.
 * @property {string[]} Pricing Configuration - Slugs associated with the "Pricing Configuration" category.
 */

/**
 * Map containing product categories and their associated slugs.
 * @type {ProductCategoryMap}
 */
export const product_categories = {
	"Product Configuration": {
		description:
			"Manage product settings and configurations for your network.",
		products: [
			"commission-frequency",
			"refund-method",
			"optional-verification",
			"cash-deposit",
		],
	},
	"Pricing Configuration": {
		description:
			"Set and adjust pricing and commissions for various services within your network.",
		products: [
			"money-transfer",
			"aeps",
			"payment-gateway",
			"qr-payment",
			"account-verification",
			"credit-card-bill-payment",
			"aadhaar-pay",
			"indo-nepal-fund-transfer",
			"airtel-cms",
			"upi-money-transfer",
			"upi-fund-transfer",
			"validate-upi-id",
			"cdm",
			"travel-train",
			"travel-flight",
		],
	},
};
