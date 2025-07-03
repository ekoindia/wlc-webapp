import { BillFetchResponse } from "../context/types";

/**
 * Transform raw bill fetch response to application format
 * @param response Raw API response
 * @returns Transformed data for the application
 */
export const transformBillData = (response: BillFetchResponse) => {
	if (!response || !response.data || !response.data.billDetailsList) {
		throw new Error("Invalid bill fetch response");
	}

	// Determine selection mode based on payMultipleBills flag
	let selectionMode: "single" | "multiOptional" | "multiMandatory";
	switch (response.data.payMultipleBills) {
		case "Y":
			selectionMode = "multiOptional";
			break;
		case "M":
			selectionMode = "multiMandatory";
			break;
		case "N":
		default:
			selectionMode = "single";
			break;
	}

	// Transform bill details
	const bills = response.data.billDetailsList.map((bill, index) => {
		// Parse amount values
		const amount = parseFloat(bill.billAmount);
		const minAmount = bill.minBillPayAmount
			? parseFloat(bill.minBillPayAmount)
			: undefined;
		const maxAmount = bill.maxBillPayAmount
			? parseFloat(bill.maxBillPayAmount)
			: undefined;
		const amountMultiple = bill.amount_multiple
			? parseFloat(bill.amount_multiple)
			: undefined;

		// Create label from bill number and due date
		const label = `${bill.billNumber} - ${bill.billDueDate}`;

		return {
			billid: bill.bharatBillReferenceNumber || `bill-${index}-${amount}`,
			label,
			amount,
			amountRules: {
				min: minAmount,
				max: maxAmount,
				multiple: amountMultiple,
			},
			billNumber: bill.billNumber,
			billDate: bill.billDate,
			billDueDate: bill.billDueDate,
			customerName: bill.filler1 || "N/A",
		};
	});

	return {
		selectionMode,
		bills,
	};
};
