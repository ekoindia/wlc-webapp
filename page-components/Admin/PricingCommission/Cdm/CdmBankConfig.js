/**
 * Represents the configuration for CDM banks.
 * @typedef {object} CdmBankConfig
 * @property {number} bank_id - The ID of the bank.
 * @property {string} bank_label - The label of the bank.
 * @property {string} bank_name - The name of the bank.
 * @property {object} validation - The validation rules for the bank.
 * @property {object | boolean} validation.percentage - The percentage validation rules for the bank. Can be an object with `min` and `max` properties or `false` if not applicable.
 * @property {object | boolean} validation.fixed - The fixed validation rules for the bank. Can be an object with `min` and `max` properties or `false` if not applicable.
 */
export const CdmBankConfig = {
	1: {
		bank_id: 1,
		bank_label: "SBI Counter & CDM",
		bank_name: "SBI",
		desc: "SBI CDM without Card & Counter Deposit without Challan Slip",
		validation: {
			percentage: {
				min: 0.09,
				max: 2,
			},
			fixed: {
				min: 25,
				max: 200,
			},
		},
	},
	2: {
		bank_id: 2,
		bank_label: "ICICI Counter & CDM",
		bank_name: "ICICI",
		desc: "ICICI CDM without Card & Counter Deposit without Challan Slip",
		validation: {
			percentage: {
				min: 0.5,
				max: 2,
			},
			fixed: false,
		},
	},
	3: {
		bank_id: 3,
		bank_label: "SBI Counter Deposit (Challan)",
		bank_name: "SBI-2",
		desc: "SBI Counter Deposit with Challan Slip",
		validation: {
			percentage: false,
			fixed: {
				min: 55,
				max: 200,
			},
		},
	},
	5: {
		bank_id: 5,
		bank_label: "Axis Counter & CDM",
		bank_name: "Axis",
		desc: "Axis CDM without Card & Counter Deposit without Challan Slip",
		validation: {
			percentage: {
				min: 0.5,
				max: 2,
			},
			fixed: false,
		},
	},
	8: {
		bank_id: 8,
		bank_label: "KVB Counter & CDM",
		bank_name: "KYB",
		desc: "KVB CDM with Card & Counter Deposit with Challan Slip",
		validation: {
			percentage: {
				min: 0.6,
				max: 2,
			},
			fixed: false,
		},
	},
	10: {
		bank_id: 10,
		bank_label: "ICICI Counter Deposit (Challan)",
		bank_name: "ICICI-H2H",
		desc: "ICICI Counter Deposit with Challan Slip",
		validation: {
			percentage: {
				min: 0.24,
				max: 2,
			},
			fixed: false,
		},
	},
	11: {
		bank_id: 11,
		bank_label: "IDBI Counter Deposit (Challan)",
		bank_name: "IDBI",
		desc: "IDBI Counter Deposit with Challan Slip",
		validation: {
			percentage: {
				min: 0.6,
				max: 2,
			},
			fixed: false,
		},
	},
	30: {
		bank_id: 30,
		bank_label: "HDFC Counter & CDM",
		bank_name: "HDFC Bank",
		desc: "HDFC CDM without Card & Counter Deposit without Challan Slip",
		validation: {
			percentage: {
				min: 0.5,
				max: 2,
			},
			fixed: false,
		},
	},
	31: {
		bank_id: 31,
		bank_label: "PNB Counter & CDM",
		bank_name: "PNB",
		desc: "PNB CDM without Card & Counter Deposit without Challan Slip",
		validation: {
			percentage: {
				min: 0.06,
				max: 2,
			},
			fixed: false,
		},
	},
};
