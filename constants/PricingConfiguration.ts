import { products } from "./ProductDetails";

/**
 * Interface for product details.
 */
interface ProductDetails {
	/**
	 * The key used to identify the product in the `constants/ProductDetails` file.
	 * THis will help fetch additional product pricing config for this product from the ProductDetails file.
	 */
	product_key?: keyof typeof products;

	/** The label of the product */
	label: string;

	/** The description of the product. */
	desc: string;

	/** Additional notes about the product. */
	note?: string;

	/** The icon representing the product. */
	icon?: string;

	/**
	 * The component template to use for the product.
	 * Possible values: "fileupload", "standard", "custom".
	 * If "custom", the component name should be provided in the "comp" property.
	 */
	template?: "fileupload" | "standard" | "custom";

	/** The name of the component associated with the product (located at: page-components/Admin/PricingCommission/...). */
	comp?: string;

	/** Additional metadata for the product (depending on the template). These are passed as props to the component (defined by `template` or `comp`) */
	meta?: Record<string, any>;

	/** Whether to hide the product from the pricing & commission page. Can be used to temporarily disable a product pricing for all users */
	hide?: boolean;
}

/**
 * Map of product slugs to their respective details.
 */
export const product_slug_map: Record<string, ProductDetails> = {
	"commission-frequency": {
		label: "Commission Frequency",
		desc: "Toggle between Daily/Monthly Commissions within your network",
		icon: "money-deposit",
		comp: "CommissionFrequency",
		hide: false,
	},
	"money-transfer": {
		label: "Money Transfer",
		desc: "Set Agent Pricing/Commission for Domestic Money Transfer services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "cash",
		comp: "Dmt",
		hide: false,
	},
	aeps: {
		label: "AePS Cashout",
		desc: "Set Agent Commissions for AePS Cashout services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "cashout",
		comp: "Aeps",
		hide: false,
	},
	"payment-gateway": {
		label: "Payment Gateway",
		desc: "Set Agent Pricing for loading E-value using Credit/Debit Card (PG)",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		comp: "CardPayment",
		hide: true,
	},
	"optional-verification": {
		label: "Account Verification",
		desc: "Change Configuration for Recipient Bank Account Verification process",
		icon: "playlist-add-check",
		comp: "OptionalVerification",
		hide: false,
	},
	"account-verification": {
		label: "Account Verification",
		desc: "Set Agent Pricing for Recipient Bank Account Verification services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "money-note",
		comp: "AccountVerification",
		hide: false,
	},
	"credit-card-bill-payment": {
		label: "Credit Card Bill Payment",
		desc: "Set Agent Pricing for Credit Card Bill Payment services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "creditcard",
		comp: "CreditCardBillPayment",
		hide: false,
	},
	"aadhaar-pay": {
		label: "Aadhaar Pay",
		desc: "Set Agent Pricing for Credit Card Bill Payment services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "wallet",
		comp: "AadhaarPay",
		hide: false,
	},
	"indo-nepal-fund-transfer": {
		label: "Indo-Nepal Fund Transfer",
		desc: "Set Agent Pricing/Commission for Indo-Nepal Fund Transfer services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		icon: "nepal",
		comp: "IndoNepal",
		hide: false,
	},
	"airtel-cms": {
		label: "Airtel CMS",
		desc: "Set Agent Pricing/Commission for Airtel CMS services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		template: "fileupload",
		// comp: "AirtelCms",
		hide: false,
		meta: {
			sampleFileDownloadParams: {
				interaction_type_id: 707,
				service_code: 57,
			},
			fileUploadUri:
				"/network/pricing_commissions/airtel_cms_bulk_update_commercial",
		},
	},
	"refund-method": {
		label: "Refund Method",
		desc: "Choose the Refund Method for failed transactions within your network",
		comp: "RefundMethod",
		icon: "money-deposit",
		hide: false,
	},
	"cash-deposit": {
		label: "Cash Deposit",
		desc: "Configure Cash Deposit services within your network",
		comp: "ToggleCdm",
		icon: "money-deposit",
		hide: false,
	},
	"upi-money-transfer": {
		label: "UPI Money Transfer",
		desc: "Set Agent Pricing/Commission for UPI Money Transfer services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		comp: "UpiMoneyTransfer",
		icon: "upi",
		hide: true,
	},
	"upi-fund-transfer": {
		label: "UPI NeoBank Payments",
		desc: "Set Agent Pricing/Commission for UPI NeoBank Payments",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		comp: "UpiFundTransfer",
		icon: "upi",
		hide: true,
	},
	"validate-upi-id": {
		label: "UPI ID Verification",
		desc: "Set Agent Pricing for Recipient UPI ID Verification services",
		note: "The revised cost structure will come into effect from tomorrow (12:00 AM midnight).",
		comp: "ValidateUpiId",
		icon: "upi",
		hide: true,
	},
	"qr-payment": {
		label: "QR Payment",
		desc: "Set Agent Pricing for QR Payment services",
		comp: "QrPayment",
		icon: "qrcode",
		hide: false,
	},
	cdm: {
		product_key: "CDM",
		label: "Cash Deposit",
		desc: "Set Agent Pricing for Cash Deposit services",
		comp: "Cdm",
		icon: "money-deposit",
		hide: false,
	},

	test_cdm: {
		product_key: "CDM",
		label: "Cash Deposit Test",
		desc: "Set Agent Pricing for Cash Deposit services",
		// comp: "Cdm",
		template: "standard",
		icon: "money-deposit",
		hide: false,
	},
};

/**
 * Interface for product category map.
 */
interface ProductCategoryMap {
	[category: string]: {
		/** Short description of the product category. */
		description: string;
		/** List of product slugs associated with the category. */
		products: (keyof typeof product_slug_map)[];
	};
}

/**
 * Define how products are categorized and visible on the Pricing & Commission page.
 */
export const product_categories: ProductCategoryMap = {
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
			"test_cdm",
		],
	},
};
