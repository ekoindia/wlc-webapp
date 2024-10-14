import { products } from "./ProductDetails";

/*
TODO:
	1. Multi level URL. Eg: /pricing/pg/nimbbl/settlement
	2. Each level (left to right) loads extra_params from config and the next level merges their extra_params. Right-most (last) level has max priority.
	3. Product types:
		a. Standard: Uses a custom-component or a template to show a page
		b. group:
		c. dynamic_group: Fetch group products from API. Store extra_params for each sub-product in a context. The next level product component will fetch the extra_params for this dynamic product from the context.
*/

/**
 * Interface for product "meta".
 * This interface defines few of the additional properties that can be passed to the product component.
 * The "meta" property can accept other name/value pairs as well, depending on the product template.
 */
interface ProductMeta {
	/**
	 * The API details to set the pricing/commission details for agent(s).
	 * TODO: MOVE TO ProductDetails, because the same URL config can be used for multiple sub-products.
	 */
	agent?: Record<
		"url" | "trxn_type_id" | "uriSegment" | "service_code" | string,
		string | number
	>;

	/**
	 * The API details to set the pricing/commission details for distributor(s).
	 * TODO: MOVE TO ProductDetails, because the same URL config can be used for multiple sub-products.
	 */
	distributor?: Record<
		"url" | "trxn_type_id" | "uriSegment" | "service_code" | string,
		string | number
	>;

	/**
	 * Pass additional payload to the API request when configuring pricing for this product.
	 * Eg: { "service_code": 1234 }
	 */
	additional_payload?: Record<string, string | number>;

	/**
	 * Additional headers to pass with the API request when configuring pricing for this product.
	 */
	additional_headers?: Record<string, string>;

	/**
	 * For "fileupload" template, provide the parameters required to download the sample file.
	 */
	sampleFileDownloadParams?: {
		interaction_type_id: number;
		service_code: number;
	};

	/**
	 * For "fileupload" template, the URI to upload the file for the product.
	 */
	fileUploadUri?: string;
}

/**
 * Interface for product details.
 */
interface ProductDetails {
	/**
	 * Whether the product is a group of products. When opened, it shows multiple sub-products.
	 * If true, the `products` property should be defined with the list of product-slugs associated with the group.
	 */
	is_group?: boolean;

	/** List of product slugs associated with the group. */
	products?: (keyof typeof product_slug_map)[];

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
	icon?: string | React.ComponentType;

	/**
	 * The component template to use for the product.
	 * Possible values: "fileupload", "standard", "custom".
	 * If "custom", the component name should be provided in the "comp" property.
	 */
	template?: "fileupload" | "standard" | "custom";

	/** The name of the component associated with the product (located at: page-components/Admin/PricingCommission/...). */
	comp?: string;

	/** Additional metadata for the product (depending on the template). These are passed as props to the component (defined by `template` or `comp`) */
	meta?: ProductMeta & Record<string, any>;

	/** Whether to hide the product from the pricing & commission page. Can be used to temporarily disable a product pricing for all users */
	hide?: boolean;
}

/**
 * Map of product slugs to their respective details.
 */
export const product_slug_map: Record<string, ProductDetails> = {
	"commission-frequency": {
		label: "Commission Frequency",
		desc: "Toggle between Daily and Monthly Commissions within your network",
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
		desc: "Set Agent Pricing for Aadhaar Pay services",
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
		icon: "replay",
		hide: false,
	},
	"toggle-cash-deposit-charges": {
		label: "Manage Cash-Deposit Charges",
		desc: "Enable/disable Cash-Deposit charges for your network",
		comp: "ToggleCdm",
		icon: "toggle",
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
	"travel-booking": {
		is_group: true,
		label: "Travel Booking",
		desc: "Set Agent Commission for travel booking services",
		hide: false,
		products: ["train-booking", "flight-booking"],
	},
	"train-booking": {
		// product_key: "TRAIN_BOOKING",
		label: "Train Booking",
		desc: "Set Agent Commission for train booking services",
		// template: "standard",
		comp: "TravelTrain",
		icon: "train",
		hide: false,
	},
	"flight-booking": {
		// product_key: "FLIGHT_BOOKING",
		label: "Flight Booking",
		desc: "Set Agent Commission for flight booking services",
		// template: "standard",
		comp: "TravelFlight",
		icon: "flight",
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
		is_group: true,
		label: "Cash Deposit Test",
		desc: "Set Agent Pricing for Cash Deposit services",
		icon: "money-deposit",
		hide: true,
		products: [
			"cash_deposit_counter",
			"cash_deposit_machine",
			"toggle-cash-deposit-charges",
		],
	},

	cash_deposit_counter: {
		product_key: "CDM",
		label: "Counter Cash Deposit",
		desc: "Set Agent's Pricing for Cash Deposit on Bank Counter",
		template: "standard",
		icon: "money-deposit",
		meta: {
			additional_payload: {
				payment_mode: "1",
			},
		},
		hide: false,
	},
	cash_deposit_machine: {
		product_key: "CDM",
		label: "Cash Deposit Machine",
		desc: "Set Agent's Pricing for Cash Deposit Machine",
		template: "standard",
		icon: "money-deposit",
		meta: {
			additional_payload: {
				payment_mode: "7",
			},
		},
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
	"General Settings": {
		description:
			"Manage product settings and configurations for your network.",
		products: [
			"commission-frequency",
			"refund-method",
			"optional-verification",
			// "cash-deposit",
		],
	},
	"Earning Opportunities": {
		description:
			"Set and adjust pricing and commissions for various services within your network.",
		products: [
			"money-transfer",
			"aeps",
			"credit-card-bill-payment",
			"indo-nepal-fund-transfer",
			"airtel-cms",
			"upi-money-transfer",
			"upi-fund-transfer",
			"validate-upi-id",
			"travel-booking",
		],
	},
	"Digitization Products": {
		description:
			"Set and adjust pricing and commissions for various services within your network.",
		products: [
			"payment-gateway",
			"qr-payment",
			"account-verification",
			"aadhaar-pay",
			"cdm",
			"test_cdm",
		],
	},
};
