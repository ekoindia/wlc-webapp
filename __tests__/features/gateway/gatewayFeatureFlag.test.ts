import { FeatureFlags } from "constants/featureFlags";

describe("ELOKA_GATEWAY feature flag", () => {
	it("is enabled in every environment", () => {
		// Regression guard: while this flag was restricted to `development`,
		// every deployed environment (UAT included) rendered the gateway route
		// as permanently unavailable. Partners embed these pages from UAT and
		// production, so the flag must not be environment-scoped.
		expect(FeatureFlags.ELOKA_GATEWAY.enabled).toBe(true);
		expect(FeatureFlags.ELOKA_GATEWAY.forEnv).toBeUndefined();
	});
});
