import { formatCurrency, getCurrencySymbol } from "utils/numberFormat";

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
