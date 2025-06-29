import { ParamType } from "constants/trxnFramework";
import { BbpsProduct } from "./types";

export const BbpsProducts: BbpsProduct[] = [
	{
		id: "electricity",
		label: "Electricity Bill",
		desc: "Pay monthly electricity dues",
		icon: "electricity",
		url: "/products/bbps/electricity/search",
		searchFields: [
			{
				name: "utility_acc_no",
				label: "Consumer Number",
				parameter_type_id: ParamType.NUMERIC,
				required: true,
				validations: {
					minLength: 10,
					maxLength: 10,
					pattern: /^[0-9]{10}$/,
					message: "Please enter a valid consumer number",
				},
			},
			{
				name: "confirmation_mobile_no",
				label: "Mobile Number",
				parameter_type_id: ParamType.NUMERIC,
				required: true,
				validations: {
					minLength: 10,
					maxLength: 10,
					pattern: /^[6-9]\d{9}$/,
					message: "Please enter a valid mobile number",
				},
			},
		],
		useMockData: true,
	},
	{
		id: "echallan",
		label: "Traffic E-challan",
		desc: "Pay pending traffic challans",
		icon: "directions-car",
		url: "/products/bbps/echallan/search",
		searchFields: [
			{
				name: "utility_acc_no",
				label: "Vehicle Reg No.",
				parameter_type_id: ParamType.TEXT,
				required: true,
				validations: {
					minLength: 10,
					maxLength: 10,
					pattern: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
					message: "Please enter a valid vehicle registration number",
				},
			},
		],
		useMockData: true,
	},
	{
		id: "corporate-cc",
		label: "Corporate Credit Card",
		desc: "Clear outstanding corporate card dues",
		icon: "creditcard",
		url: "/products/bbps/corporate-cc/search",
		searchFields: [
			{
				name: "credit_card_no",
				label: "Card Number",
				parameter_type_id: ParamType.TEXT,
				required: true,
				validations: {
					pattern:
						/^(?:4\d{12}(?:\d{3})?|(?:5[1-5]\d{14})|(?:222[1-9]\d{12}|22[3-9]\d{13}|2[3-6]\d{14}|27[01]\d{13}|2720\d{12})|3[47]\d{13}|6(?:011|5\d{2})\d{12}|35(?:2[89]|[3-8]\d)\d{12}|6\d{15})$/,
					message: "Please enter a valid credit card number",
				},
			},
			{
				name: "confirmation_mobile_no",
				label: "Mobile Number",
				parameter_type_id: ParamType.NUMERIC,
				required: true,
				validations: {
					minLength: 10,
					maxLength: 10,
					pattern: /^[6-9]\d{9}$/,
					message: "Please enter a valid mobile number",
				},
			},
		],
		useMockData: true,
	},
];
