import { resolveAllowedRoleIds } from "features/onboarding/utils/roleSelection";

describe("resolveAllowedRoleIds", () => {
	it("parses an explicit role CSV into numeric ids", () => {
		expect(resolveAllowedRoleIds("1,2,3", undefined)).toEqual([1, 2, 3]);
		expect(resolveAllowedRoleIds(" 1 , 2 ", undefined)).toEqual([1, 2]);
	});

	it("normalizes a duplicated role param (array) to a numeric list", () => {
		expect(resolveAllowedRoleIds(["1", "2"], undefined)).toEqual([1, 2]);
	});

	it("defaults to Enterprise (3) when role is absent but bv is valid", () => {
		expect(resolveAllowedRoleIds(undefined, "eloka")).toEqual([3]);
		expect(resolveAllowedRoleIds(undefined, "eps")).toEqual([3]);
		expect(resolveAllowedRoleIds(undefined, "sbi_kiosk")).toEqual([3]);
		expect(resolveAllowedRoleIds(undefined, "enterprise")).toEqual([3]);
	});

	it("lets an explicit role win over the bv default", () => {
		expect(resolveAllowedRoleIds("1,2", "sbi_kiosk")).toEqual([1, 2]);
		expect(resolveAllowedRoleIds("1", "eps")).toEqual([1]);
	});

	it("returns undefined when neither a role nor a valid bv is given", () => {
		expect(resolveAllowedRoleIds(undefined, undefined)).toBeUndefined();
		expect(resolveAllowedRoleIds(undefined, "garbage")).toBeUndefined();
		expect(resolveAllowedRoleIds(undefined, "")).toBeUndefined();
	});

	it("returns undefined for a role param with no numeric entries", () => {
		expect(resolveAllowedRoleIds("abc", undefined)).toBeUndefined();
	});
});
