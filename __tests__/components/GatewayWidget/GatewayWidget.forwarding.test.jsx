import { render, screen } from "@testing-library/react";
import { GatewayWidget } from "components/GatewayWidget";
import mockRouter from "next-router-mock";

/*
	GatewayWidget forwards ONLY the `mobile` URL query param as a prop to the
	custom OnboardingGateway component (registry flag `passMobile: true`), because
	LoginWidget has no URL access and needs it as `initialMobile`.

	`bv` / `role` are intentionally NOT forwarded here: they ride the iframe `src`
	URL and are read directly from `router.query` deeper in OnboardingWidget. This
	test locks in that contract so the prop path doesn't silently regrow.
*/

// Feature flag ELOKA_GATEWAY must be on for the gateway to render.
jest.mock("hooks", () => ({
	__esModule: true,
	useFeatureFlag: () => [true],
}));

// OrgDetailContext is only used for chrome (logo); stub it.
jest.mock("contexts", () => ({
	__esModule: true,
	useOrgDetailContext: () => ({ orgDetail: {} }),
}));

// Strip layout chrome so we don't drag in OrgLogo and its context deps.
jest.mock("components/GatewayWidget/GatewayLayout", () => ({
	__esModule: true,
	default: ({ children }) => <div>{children}</div>,
}));

// Replace the real OnboardingGateway (heavy — pulls UserContext, etc.) with a
// probe that echoes the props it received into the DOM.
jest.mock(
	"features/onboarding/page-components/OnboardingGateway/OnboardingGateway",
	() => ({
		__esModule: true,
		default: ({ mobile, bv, role }) => (
			<div
				data-testid="onboarding-gateway"
				data-mobile={mobile ?? ""}
				data-bv={bv ?? ""}
				data-role={role ?? ""}
			/>
		),
	})
);

describe("GatewayWidget — query param forwarding", () => {
	const renderAt = (url) => {
		mockRouter.setCurrentUrl(url);
		return render(<GatewayWidget id={["onboarding"]} token="tkn" />);
	};

	it("forwards `mobile` from the URL to OnboardingGateway", () => {
		renderAt("/gateway/onboarding?mobile=9999999999");
		expect(screen.getByTestId("onboarding-gateway")).toHaveAttribute(
			"data-mobile",
			"9999999999"
		);
	});

	it("does NOT forward `bv` / `role` as props (they are read from the URL downstream)", () => {
		renderAt("/gateway/onboarding?mobile=9999999999&bv=sbi_kiosk&role=1,2");
		const el = screen.getByTestId("onboarding-gateway");
		expect(el).toHaveAttribute("data-mobile", "9999999999");
		expect(el).toHaveAttribute("data-bv", "");
		expect(el).toHaveAttribute("data-role", "");
	});
});
