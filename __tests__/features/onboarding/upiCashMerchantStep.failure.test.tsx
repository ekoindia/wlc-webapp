import {
	masterOnboardingSteps,
	ONBOARDING_STEP_IDS,
	type OnboardingStep,
} from "features/onboarding/constants";
import { render } from "test-utils";

const merchantStep = masterOnboardingSteps.find(
	(s) => s.name === "UPI_CASH_MERCHANT"
) as OnboardingStep;

// Provider's failure reason for the 365 submit.
const PROVIDER_REASON = "Merchant PAN already registered with another agent";

// Drive the step's pipeline result via the onboarding context.
const pipelineResults: Record<string, any> = {};
jest.mock("features/onboarding/context", () => ({
	useOnboardingContext: () => ({ pipelineResults }),
}));

// Render the framework Form as a lightweight stub (keep the submit button visible
// so we can assert the agent can retry).
jest.mock("tf-components", () => ({
	Form: () => <div data-testid="merchant-form" />,
}));
jest.mock("components", () => ({
	ActionButtonGroup: () => <button type="submit">submit</button>,
}));

// Capture toast calls to assert the provider reason is surfaced.
const mockToast = jest.fn();
jest.mock("@chakra-ui/react", () => {
	const actual = jest.requireActual("@chakra-ui/react");
	return { ...actual, useToast: () => mockToast };
});

import LocalStepForm from "features/onboarding/components/LocalStepForm";

describe("UPI Cash merchant onboarding — failure + retry (AC-2.5)", () => {
	beforeEach(() => {
		mockToast.mockClear();
		for (const k of Object.keys(pipelineResults)) delete pipelineResults[k];
	});

	it("surfaces the provider reason and does NOT advance on failure", () => {
		const onAdvance = jest.fn();
		pipelineResults[ONBOARDING_STEP_IDS.UPI_CASH_MERCHANT] = {
			status: "failed",
			list: [
				{
					id: "submit",
					status: "failed",
					response: { message: PROVIDER_REASON },
				},
			],
		};

		const { getByTestId } = render(
			<LocalStepForm
				stepConfig={merchantStep}
				onSubmit={jest.fn()}
				onAdvance={onAdvance}
			/>
		);

		// Provider reason shown (not a generic success), agent never marked enabled…
		expect(mockToast).toHaveBeenCalledWith(
			expect.objectContaining({
				title: PROVIDER_REASON,
				status: "error",
			})
		);
		expect(onAdvance).not.toHaveBeenCalled();
		// …and the form is still on screen to retry.
		expect(getByTestId("merchant-form")).toBeInTheDocument();
	});

	it("advances only when the pipeline reports success", () => {
		const onAdvance = jest.fn();
		pipelineResults[ONBOARDING_STEP_IDS.UPI_CASH_MERCHANT] = {
			status: "success",
			list: [{ id: "submit", status: "success", response: {} }],
		};

		render(
			<LocalStepForm
				stepConfig={merchantStep}
				onSubmit={jest.fn()}
				onAdvance={onAdvance}
			/>
		);

		expect(onAdvance).toHaveBeenCalledWith(
			ONBOARDING_STEP_IDS.UPI_CASH_MERCHANT
		);
		expect(mockToast).toHaveBeenCalledWith(
			expect.objectContaining({ status: "success" })
		);
	});
});
