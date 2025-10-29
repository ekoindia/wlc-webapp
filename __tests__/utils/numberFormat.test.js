import {
	formatCurrency,
	formatMobile,
	getCurrencySymbol,
} from "utils/numberFormat";

describe("formatCurrency", () => {
	describe("default arguments", () => {
		it("should format INR currency correctly", () => {
			expect(formatCurrency(123456.789, "INR")).toBe("₹1,23,456.79");
		});

		it("should format USD currency correctly", () => {
			expect(formatCurrency(1123456.789, "USD")).toBe("$1,123,456.79");
		});

		it("should format currency as INR by default", () => {
			expect(formatCurrency(123456.789)).toBe("₹1,23,456.79");
		});
	});

	describe("noSymbol argument", () => {
		it("should format INR currency without symbol", () => {
			expect(formatCurrency(123456.789, "INR", true)).toBe("1,23,456.79");
		});

		it("should format USD currency without symbol", () => {
			expect(formatCurrency(123456.789, "USD", true)).toBe("123,456.79");
		});
	});

	describe("noZeroFraction argument", () => {
		it("should not include decimal fraction if it is zero for INR currency", () => {
			expect(formatCurrency(123456.0, "INR", false, true)).toBe(
				"₹1,23,456"
			);
		});

		it("should include decimal fraction even if it is zero for INR currency", () => {
			expect(formatCurrency(123456, "INR", false, false)).toBe(
				"₹1,23,456.00"
			);
		});
	});

	describe("default currency code", () => {
		it("should format currency as INR by default", () => {
			expect(formatCurrency(123456.789)).toBe("₹1,23,456.79");
		});

		it("should format currency as INR for unknown currency code", () => {
			expect(formatCurrency(123456.789, "XYZ")).toBe("₹1,23,456.79");
		});
	});
});

describe("getCurrencySymbol", () => {
	it("should return currency symbol for valid currency code", () => {
		expect(getCurrencySymbol("INR")).toBe("₹");
		expect(getCurrencySymbol("USD")).toBe("$");
	});

	it("should return empty string for unknown currency code", () => {
		expect(getCurrencySymbol("XXX")).toBe("");
	});
});

describe("formatMobile", () => {
	it("formats number with default country code", () => {
		expect(formatMobile(8765432345)).toBe("+91 876 543 2345");
	});

	it("formats string with default country code", () => {
		expect(formatMobile("8765432345")).toBe("+91 876 543 2345");
	});

	it("formats with custom country code (string)", () => {
		expect(formatMobile(8765432345, "1")).toBe("+1 876 543 2345");
	});

	it("formats with custom country code (number)", () => {
		expect(formatMobile("8765432345", 44)).toBe("+44 876 543 2345");
	});

	it("handles numbers shorter than 10 digits", () => {
		expect(formatMobile(12345)).toBe("+91 12345");
	});

	it("handles null/undefined/empty/0 input", () => {
		expect(formatMobile(null)).toBe("");
		expect(formatMobile(undefined)).toBe("");
		expect(formatMobile("")).toBe("");
		expect(formatMobile(0)).toBe("");
	});

	it("strips non-digit characters", () => {
		expect(formatMobile("(876)543-2345")).toBe("+91 876 543 2345");
	});

	it("handles countryCode = null/undefined", () => {
		expect(formatMobile(8765432345, null)).toBe("+91 876 543 2345");
		expect(formatMobile(8765432345, undefined)).toBe("+91 876 543 2345");
	});
});
