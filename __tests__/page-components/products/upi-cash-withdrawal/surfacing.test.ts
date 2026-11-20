import { FeatureFlags } from "constants/featureFlags";
import { sidebarMenu } from "constants/SidebarMenu";
import {
	UPI_CASH_BASE_PATH,
	UPI_CASH_FEATURE_FLAG,
} from "page-components/products/upi-cash-withdrawal/constants";

/**
 * Surfacing / enablement config for the UPI Cash Withdrawal menu entry.
 * AC-1.1 (visible only to enabled agents/admins; hidden otherwise) and AC-5.1 are
 * enforced by the menu being gated — it carries a feature flag and links to the
 * custom product page, so a non-enabled agent is never shown it.
 */
describe("UPI Cash Withdrawal surfacing", () => {
	const entry = sidebarMenu.find((item) => item.link === UPI_CASH_BASE_PATH);

	// AC-1.1 — the menu entry exists and is gated (not shown to everyone).
	it("adds a menu entry gated by the feature flag (AC-1.1)", () => {
		expect(entry).toBeDefined();
		expect(entry?.featureFlag).toBe(UPI_CASH_FEATURE_FLAG);
		expect(entry?.link).toBe(UPI_CASH_BASE_PATH);
	});

	// AC-5.1 — the gating flag is defined so enablement can be scoped per org.
	it("defines the staged-rollout feature flag (AC-5.1)", () => {
		expect(FeatureFlags[UPI_CASH_FEATURE_FLAG]).toBeDefined();
	});
});
