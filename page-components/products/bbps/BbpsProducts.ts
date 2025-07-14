import { ParamType } from "constants/trxnFramework";
import { BbpsProduct } from "./types";

export const BbpsProducts: BbpsProduct[] = [
	{
		id: "corporate-cc",
		label: "Corporate Credit Card",
		desc: "Clear outstanding corporate card dues",
		icon: "creditcard",
		url: "/products/bbps/corporate-cc/search",
		categoryId: "7",
		searchFields: [
			{
				name: "sender_name",
				label: "Customer Name",
				parameter_type_id: ParamType.TEXT,
			},
			{
				name: "confirmation_mobile_no",
				label: "Mobile Number",
				parameter_type_id: ParamType.NUMERIC,
				validations: {
					minLength: 10,
					maxLength: 10,
					pattern: {
						value: /^[6-9]\d{9}$/,
						message: "Please enter a valid mobile number",
					},
				},
			},
			{
				name: "operator_category_id",
				label: "Operator Category",
				parameter_type_id: ParamType.FIXED,
				value: "21",
			},
			{
				name: "communication",
				label: "Operator Category",
				parameter_type_id: ParamType.FIXED,
				value: "1",
			},
		],
	},
	{
		id: "loan",
		label: "Loan",
		desc: "Pay outstanding loan dues",
		icon: "loan",
		url: "/products/bbps/loan/search",
		categoryId: "21",
		searchFields: [
			{
				name: "sender_name",
				label: "Customer Name",
				parameter_type_id: ParamType.TEXT,
			},
			{
				name: "confirmation_mobile_no",
				label: "Mobile Number",
				parameter_type_id: ParamType.NUMERIC,
				validations: {
					minLength: 10,
					maxLength: 10,
					pattern: {
						value: /^[6-9]\d{9}$/,
						message: "Please enter a valid mobile number",
					},
				},
			},
			{
				name: "operator_category_id",
				label: "Operator Category",
				parameter_type_id: ParamType.FIXED,
				value: "21",
			},
			{
				name: "communication",
				label: "Operator Category",
				parameter_type_id: ParamType.FIXED,
				value: "1",
			},
		],
	},
];
