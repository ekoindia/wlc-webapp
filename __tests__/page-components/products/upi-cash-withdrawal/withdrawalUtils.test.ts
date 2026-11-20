import {
	hasRealLocation,
	isWithdrawalMaintenanceWindow,
	validateWithdrawalAmount,
} from "page-components/products/upi-cash-withdrawal/utils/withdrawalUtils";

describe("validateWithdrawalAmount (AC-3.1: ₹100–5000, ×100, no paise)", () => {
	it("accepts valid in-range multiples of 100", () => {
		["100", "500", "2500", "5000"].forEach((v) => {
			const r = validateWithdrawalAmount(v);
			expect(r.valid).toBe(true);
			expect(r.amount).toBe(Number(v));
			expect(r.error).toBe("");
		});
	});

	it("rejects below ₹100 and above ₹5000", () => {
		expect(validateWithdrawalAmount("50").valid).toBe(false);
		expect(validateWithdrawalAmount("99").valid).toBe(false);
		expect(validateWithdrawalAmount("5100").valid).toBe(false);
		expect(validateWithdrawalAmount("10000").valid).toBe(false);
	});

	it("rejects non-multiples of 100", () => {
		const r = validateWithdrawalAmount("150");
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/multiples of ₹100/);
	});

	it("rejects paise / decimals / non-digits", () => {
		["100.50", "100.0", "1e3", "abc", "-100", "₹100"].forEach((v) => {
			expect(validateWithdrawalAmount(v).valid).toBe(false);
		});
		expect(validateWithdrawalAmount("100.50").error).toMatch(/no paise/);
	});

	it("treats empty input as invalid with no error text", () => {
		const r = validateWithdrawalAmount("");
		expect(r.valid).toBe(false);
		expect(r.error).toBe("");
	});
});

describe("hasRealLocation (AC-3.2: no placeholder/zero/stale)", () => {
	it("accepts a real fix", () => {
		expect(hasRealLocation(28.61, 77.2)).toBe(true);
	});
	it("rejects null coordinates", () => {
		expect(hasRealLocation(null, 77.2)).toBe(false);
		expect(hasRealLocation(28.61, null)).toBe(false);
		expect(hasRealLocation(null, null)).toBe(false);
	});
	it("rejects the (0,0) null-island placeholder", () => {
		expect(hasRealLocation(0, 0)).toBe(false);
	});
});

describe("isWithdrawalMaintenanceWindow (AC-3.5: 23:30–00:05)", () => {
	const at = (h: number, m: number) => new Date(2026, 0, 1, h, m, 0);

	it("is true inside the window", () => {
		expect(isWithdrawalMaintenanceWindow(at(23, 30))).toBe(true);
		expect(isWithdrawalMaintenanceWindow(at(23, 45))).toBe(true);
		expect(isWithdrawalMaintenanceWindow(at(0, 0))).toBe(true);
		expect(isWithdrawalMaintenanceWindow(at(0, 5))).toBe(true);
	});

	it("is false outside the window", () => {
		expect(isWithdrawalMaintenanceWindow(at(23, 29))).toBe(false);
		expect(isWithdrawalMaintenanceWindow(at(0, 6))).toBe(false);
		expect(isWithdrawalMaintenanceWindow(at(12, 0))).toBe(false);
	});
});
