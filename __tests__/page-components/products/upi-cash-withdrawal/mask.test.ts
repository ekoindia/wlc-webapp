import {
	maskAadhaar,
	maskBankAccount,
	maskPan,
	maskValue,
} from "page-components/products/upi-cash-withdrawal/utils/mask";

// Invariant: mask PAN / Aadhaar / bank on display; never show them in clear.
describe("UPI Cash Withdrawal — sensitive-value masking", () => {
	it("keeps only the last 4 characters of a PAN", () => {
		expect(maskPan("ABCDE1234F")).toBe("••••••234F");
		expect(maskPan("ABCDE1234F")).not.toContain("ABCDE");
	});

	it("masks an Aadhaar number, ignoring spaces, to its last 4 digits", () => {
		expect(maskAadhaar("1234 5678 9012")).toBe("••••••••9012");
		expect(maskAadhaar("123456789012")).not.toContain("12345678");
	});

	it("masks a bank account to its last 4 digits", () => {
		expect(maskBankAccount("000111222333")).toBe("••••••••2333");
	});

	it("never echoes a short value in clear and handles empty input", () => {
		expect(maskValue("12", 4)).toBe("••");
		expect(maskValue("")).toBe("");
		expect(maskValue(null)).toBe("");
		expect(maskValue(undefined)).toBe("");
	});
});
