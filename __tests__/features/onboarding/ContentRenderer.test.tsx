import type { OnboardingStep } from "features/onboarding/constants";
import { render } from "test-utils";

// Isolate the banner: stub the form renderer so we don't pull its data deps.
jest.mock("features/onboarding/components/LocalStepForm", () => ({
	__esModule: true,
	default: () => <div data-testid="local-step-form" />,
}));

import ContentRenderer from "features/onboarding/components/ContentRenderer";

const formStep = (orgConfig?: OnboardingStep["orgConfig"]): OnboardingStep =>
	({
		id: 1,
		name: "STEP",
		label: "Step",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		primaryCTAText: "Next",
		description: "desc",
		form_data: {},
		localRenderer: { type: "form", formFields: [] },
		orgConfig,
	}) as OnboardingStep;

const noop = () => {};

describe("ContentRenderer — org instruction banner", () => {
	it("renders the instruction text above the step when configured", () => {
		const { getByText, getByTestId } = render(
			<ContentRenderer
				stepConfig={formStep({
					instruction: "Bank account is needed for payouts.",
				})}
				onSubmit={noop}
				onAdvance={noop}
			/>
		);

		expect(
			getByText("Bank account is needed for payouts.")
		).toBeInTheDocument();
		// The step itself still renders below the banner.
		expect(getByTestId("local-step-form")).toBeInTheDocument();
	});

	it("renders no banner when there is no instruction", () => {
		const { queryByRole, getByTestId } = render(
			<ContentRenderer
				stepConfig={formStep(undefined)}
				onSubmit={noop}
				onAdvance={noop}
			/>
		);

		expect(queryByRole("note")).not.toBeInTheDocument();
		expect(getByTestId("local-step-form")).toBeInTheDocument();
	});
});
