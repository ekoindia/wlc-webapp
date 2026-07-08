import { parseBusinessVertical } from "features/onboarding/constants";

describe("parseBusinessVertical", () => {
	it("maps each documented code to its canonical business_vertical string", () => {
		expect(parseBusinessVertical("eps")).toBe("EPS");
		expect(parseBusinessVertical("eloka")).toBe("Eloka");
		expect(parseBusinessVertical("sbi_kiosk")).toBe("SBI Kiosk");
		expect(parseBusinessVertical("enterprise")).toBe("Enterprise");
	});

	it("is case- and whitespace-insensitive on the code", () => {
		expect(parseBusinessVertical("  EPS  ")).toBe("EPS");
		expect(parseBusinessVertical("Sbi_Kiosk")).toBe("SBI Kiosk");
	});

	it("does not alias spaces or hyphens (strict codes only)", () => {
		// The public contract is the lowercase underscore code, not the raw value.
		expect(parseBusinessVertical("SBI Kiosk")).toBeUndefined();
		expect(parseBusinessVertical("sbi-kiosk")).toBeUndefined();
	});

	it("takes the first value when the param is duplicated (array)", () => {
		expect(parseBusinessVertical(["eps", "eloka"])).toBe("EPS");
		// First-wins: an invalid first value is NOT rescued by a valid second one.
		expect(parseBusinessVertical(["bad", "eps"])).toBeUndefined();
	});

	it("returns undefined for unknown / empty / missing input", () => {
		expect(parseBusinessVertical("xyz")).toBeUndefined();
		expect(parseBusinessVertical("")).toBeUndefined();
		expect(parseBusinessVertical(undefined)).toBeUndefined();
		// Empty array is truthy but yields no first value — must not throw.
		expect(parseBusinessVertical([])).toBeUndefined();
		expect(parseBusinessVertical([""])).toBeUndefined();
	});
});
