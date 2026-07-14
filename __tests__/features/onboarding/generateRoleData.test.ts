import {
	generateRoleData,
	getCardKey,
	ROLE_IDS,
	type Role,
} from "features/onboarding/utils/roleSelection";

const byLabel = (roles: Role[], label: string) =>
	roles.find((r) => r.label === label);

describe("generateRoleData — Enterprise split", () => {
	it("expands the Enterprise card into two vertical cards when splitEnterprise is set", () => {
		const roles = generateRoleData({
			visibleAgentTypes: [1, 2, 3],
			splitEnterprise: true,
		});

		// Retailer + Distributor + two Enterprise variants = 4 cards
		expect(roles).toHaveLength(4);

		const api = byLabel(roles, "Get API Access");
		const saas = byLabel(roles, "Get SaaS Access");
		expect(api).toBeDefined();
		expect(saas).toBeDefined();

		// Both keep Enterprise role id + applicant_type, differ only by vertical
		expect(api?.id).toBe(ROLE_IDS.ENTERPRISE);
		expect(saas?.id).toBe(ROLE_IDS.ENTERPRISE);
		expect(api?.applicant_type).toBe(saas?.applicant_type);
		expect(api?.businessVertical).toBe("EPS");
		expect(saas?.businessVertical).toBe("Eloka");
		expect(api?.businessVerticalCode).toBe("eps");
		expect(saas?.businessVerticalCode).toBe("eloka");

		// Retailer/Distributor untouched (no vertical fields)
		expect(
			byLabel(roles, "I'm a Retailer")?.businessVertical
		).toBeUndefined();
	});

	it("keeps a single generic Enterprise card when splitEnterprise is false", () => {
		const roles = generateRoleData({
			visibleAgentTypes: [3],
			splitEnterprise: false,
		});
		expect(roles).toHaveLength(1);
		expect(roles[0].id).toBe(ROLE_IDS.ENTERPRISE);
		expect(roles[0].businessVertical).toBeUndefined();
	});

	it("shows only the two Enterprise cards when the visible set is [3] and splitEnterprise is set", () => {
		const roles = generateRoleData({
			visibleAgentTypes: [3],
			splitEnterprise: true,
		});
		expect(roles).toHaveLength(2);
		expect(roles.map((r) => r.businessVerticalCode)).toEqual([
			"eps",
			"eloka",
		]);
	});

	it("does not let an org label/description override collapse both variant labels", () => {
		const roles = generateRoleData({
			visibleAgentTypes: [3],
			splitEnterprise: true,
			// applicant_type key for Enterprise (1) — would hit both variants
			labelMap: { 1: "Enterprise" },
			descriptionMap: { 1: "overridden" },
		});
		expect(roles.map((r) => r.label)).toEqual([
			"Get API Access",
			"Get SaaS Access",
		]);
		expect(roles.every((r) => r.description !== "overridden")).toBe(true);
	});
});

describe("getCardKey", () => {
	it("uses the vertical code for the two Enterprise variants", () => {
		const roles = generateRoleData({
			visibleAgentTypes: [3],
			splitEnterprise: true,
		});
		expect(roles.map(getCardKey)).toEqual(["eps", "eloka"]);
	});

	it("falls back to the role id for non-variant cards", () => {
		const roles = generateRoleData({ visibleAgentTypes: [1, 2] });
		expect(roles.map(getCardKey)).toEqual(["1", "2"]);
	});
});
