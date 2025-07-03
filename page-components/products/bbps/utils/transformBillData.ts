import { differenceInDays } from "date-fns";
import { formatDate } from "libs/dateFormat";
import { BillFetchResponse } from "../context/types";

/**
 * Normalize date format from various formats to DD/MM/YYYY
 * @param {string} dateString - Date string in various formats
 * @returns {string} Normalized date string in DD/MM/YYYY format
 */
const normalizeDateFormat = (dateString: string): string => {
	if (!dateString || dateString === "N/A") return dateString;

	// If already in DD/MM/YYYY format, return as is
	if (
		dateString.includes("/") &&
		dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
	) {
		return dateString;
	}

	// Convert DD-MM-YYYY to DD/MM/YYYY
	if (
		dateString.includes("-") &&
		dateString.match(/^\d{1,2}-\d{1,2}-\d{4}$/)
	) {
		return dateString.replace(/-/g, "/");
	}

	// Try using formatDate for other formats as fallback
	const formatted = formatDate(dateString, "dd/MM/yyyy");

	// If formatDate couldn't parse it (returns original string), try manual replacement
	if (formatted === dateString && dateString.includes("-")) {
		return dateString.replace(/-/g, "/");
	}

	return formatted;
};

/**
 * Calculate due date tag based on bill's due date using existing dateFormat utilities
 * @param {string} dueDate - The due date in DD/MM/YYYY format
 * @returns {object|null} Due date tag object with text and color, or null if not applicable
 */
export const calculateDueDateTag = (
	dueDate: string
): { text: string; color: string } | null => {
	if (!dueDate || dueDate === "N/A") return null;

	try {
		// Parse DD/MM/YYYY format manually since formatDate is for formatting, not parsing
		const [day, month, year] = dueDate.split("/").map(Number);

		// Validate parsed values
		if (
			isNaN(day) ||
			isNaN(month) ||
			isNaN(year) ||
			day < 1 ||
			day > 31 ||
			month < 1 ||
			month > 12
		) {
			console.warn("Invalid date components:", {
				day,
				month,
				year,
				dueDate,
			});
			return null;
		}

		// Create date objects (month is 0-indexed in Date constructor)
		const dueDateObj = new Date(year, month - 1, day);
		const today = new Date();

		// Set time to start of day for both dates to get accurate day difference
		dueDateObj.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);

		// Use date-fns to calculate the difference in days
		const diffDays = differenceInDays(dueDateObj, today);

		if (diffDays < 0) {
			return { text: "Overdue", color: "red" };
		} else if (diffDays <= 7) {
			return {
				text: `Due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
				color: "orange",
			};
		}

		return null;
	} catch (error) {
		console.warn("Error calculating due date tag:", dueDate, error);
		return null;
	}
};

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

		// Normalize date formats to DD/MM/YYYY for consistent handling
		const normalizedBillDate = normalizeDateFormat(bill.billDate);
		const normalizedDueDate = normalizeDateFormat(bill.billDueDate);

		// Create label from bill number and normalized due date
		const label = `${bill.billNumber} - ${normalizedDueDate}`;

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
			billDate: normalizedBillDate,
			billDueDate: normalizedDueDate,
			customerName: bill.filler1 || "N/A",
		};
	});

	return {
		selectionMode,
		bills,
	};
};
