import { fireEvent, render, waitFor } from "test-utils";

// Capture the pipeline payload instead of hitting the network.
const mockExecutePipeline = jest.fn().mockResolvedValue(undefined);
jest.mock("features/onboarding/utils", () => ({
	__esModule: true,
	executePipeline: (args: unknown) => mockExecutePipeline(args),
}));

// Idle onboarding state (no submit in flight).
jest.mock("features/onboarding/hooks", () => ({
	__esModule: true,
	useOnboardingState: () => ({
		state: { ui: { apiInProgress: false }, latLong: "" },
		actions: { setApiInProgress: jest.fn() },
	}),
}));

// Avoid the real color/user-type hooks (they need extra context).
jest.mock("hooks", () => ({
	__esModule: true,
	useHslColor: () => ({ h: 0, s: 0, l: 0 }),
	useUserTypes: () => ({ userTypeLabels: {} }),
}));

import RoleSelection from "features/onboarding/components/RoleSelection";

const baseProps = {
	setStep: jest.fn(),
	setSelectedRole: jest.fn(),
	isAssistedOnboarding: false,
	userData: { userDetails: { signup_mobile: "9999999999" } },
	assistedAgentDetails: undefined,
	agentMobile: undefined,
	allowedRoleIds: [3], // Enterprise-only visible set
	refreshAgentProfile: jest.fn().mockResolvedValue(undefined),
	accessToken: "token",
	generateNewToken: jest.fn(),
};

const submittedFormData = () =>
	mockExecutePipeline.mock.calls[0][0].formData.form_data;

describe("RoleSelection — Enterprise vertical split", () => {
	beforeEach(() => mockExecutePipeline.mockClear());

	it("submits business_vertical=EPS for the Get API Access card and only selects that card", async () => {
		const { getByText } = render(
			<RoleSelection
				{...baseProps}
				businessVertical={undefined}
				showEnterprise
			/>
		);

		// Both variant cards render; no auto-submit (two roles).
		getByText("Get SaaS Access");
		fireEvent.click(getByText("Get API Access"));
		fireEvent.click(getByText("Continue"));

		await waitFor(() =>
			expect(mockExecutePipeline).toHaveBeenCalledTimes(1)
		);
		expect(submittedFormData()).toMatchObject({
			applicant_type: 1, // APPLICANT_TYPES.ENTERPRISE
			business_vertical: "EPS",
		});
	});

	it("submits business_vertical=Eloka for the Get SaaS Access card", async () => {
		const { getByText } = render(
			<RoleSelection
				{...baseProps}
				businessVertical={undefined}
				showEnterprise
			/>
		);

		fireEvent.click(getByText("Get SaaS Access"));
		fireEvent.click(getByText("Continue"));

		await waitFor(() =>
			expect(mockExecutePipeline).toHaveBeenCalledTimes(1)
		);
		expect(submittedFormData().business_vertical).toBe("Eloka");
	});

	it("auto-submits the URL-pinned vertical without showing cards when ?bv is set", async () => {
		render(
			<RoleSelection
				{...baseProps}
				businessVertical="EPS"
				showEnterprise
			/>
		);

		// businessVertical present → no split → single card → auto-submit.
		await waitFor(() =>
			expect(mockExecutePipeline).toHaveBeenCalledTimes(1)
		);
		expect(submittedFormData().business_vertical).toBe("EPS");
	});
});
