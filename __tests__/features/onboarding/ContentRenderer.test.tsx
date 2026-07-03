import type { OnboardingStep } from "features/onboarding/constants";
import { render } from "test-utils";

// Isolate the renderer: stub the form renderer so we don't pull its data deps.
jest.mock("features/onboarding/components/LocalStepForm", () => ({
	__esModule: true,
	default: () => <div data-testid="local-step-form" />,
}));

import ContentRenderer, {
	registerCustomComponent,
} from "features/onboarding/components/ContentRenderer";

const baseStep = (overrides: Partial<OnboardingStep> = {}): OnboardingStep =>
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
		...overrides,
	}) as OnboardingStep;

const noop = () => {};

// The org instruction banner was removed in favour of label/description overrides,
// so no step renderer should emit a role="note" callout anymore.
describe("ContentRenderer — no instruction banner", () => {
	it("renders the form step without a note banner", () => {
		const { getByTestId, queryByRole } = render(
			<ContentRenderer
				stepConfig={baseStep()}
				onSubmit={noop}
				onAdvance={noop}
			/>
		);

		expect(getByTestId("local-step-form")).toBeInTheDocument();
		expect(queryByRole("note")).not.toBeInTheDocument();
	});

	it("renders a custom step without a note banner", () => {
		registerCustomComponent("SmokeTestStep", () => (
			<div data-testid="custom-step" />
		));

		const { getByTestId, queryByRole } = render(
			<ContentRenderer
				stepConfig={baseStep({
					localRenderer: {
						type: "custom",
						component: "SmokeTestStep",
					},
				})}
				onSubmit={noop}
				onAdvance={noop}
			/>
		);

		expect(getByTestId("custom-step")).toBeInTheDocument();
		expect(queryByRole("note")).not.toBeInTheDocument();
	});
});
