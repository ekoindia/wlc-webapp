import { BillFetchResponse, SelectedBill } from "../context/types";

type SelectionMode = "single" | "multiOptional" | "multiMandatory";

interface TransformedBillResponse {
	selectionMode: SelectionMode;
	bills: SelectedBill[];
}

/**
 * Transforms the raw API response into the format expected by BbpsContext
 * @param response The raw API response
 * @returns Transformed bill data in the format expected by the context, or null if no bills found
 */
export const transformBillFetchResponse = (
	response: BillFetchResponse
): TransformedBillResponse | null => {
	if (!response?.data?.billDetailsList?.length) {
		return null;
	}

	// Determine selection mode based on payMultipleBills flag
	const selectionMode: SelectionMode =
		response.data.payMultipleBills === "Y" ? "multiOptional" : "single";

	// Transform billDetailsList into SelectedBill format
	const bills: SelectedBill[] = response.data.billDetailsList.map((bill) => ({
		billid: bill.bharatBillReferenceNumber || bill.billNumber,
		label: `Bill ${bill.billNumber} - Due ${bill.billDueDate}`,
		amount: parseFloat(bill.billAmount) || 0,
		amountRules: {
			min: parseFloat(bill.minBillPayAmount) || undefined,
			max: parseFloat(bill.maxBillPayAmount) || undefined,
			multiple: parseFloat(bill.amount_multiple) || undefined,
		},
	}));

	return {
		selectionMode,
		bills,
	};
};
