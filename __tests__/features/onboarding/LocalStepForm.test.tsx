import { ParamType } from "constants/trxnFramework";
import type { OnboardingStep } from "features/onboarding/constants";
import { render } from "test-utils";

jest.mock("features/onboarding/context", () => ({
	useOnboardingContext: () => ({ pipelineResults: {} }),
}));

// Capture the parameter_list handed to the framework Form so the test can assert
// the org-metadata field gating (hideFields / optionalFields) without rendering the
// heavy field engine (Dropzone/inputs).
let capturedFields: Array<{ name: string; label: string; required?: boolean }> =
	[];

jest.mock("tf-components", () => ({
	Form: ({
		parameter_list,
	}: {
		parameter_list: Array<{
			name: string;
			label: string;
			required?: boolean;
		}>;
	}) => {
		capturedFields = parameter_list;
		return (
			<div>
				{parameter_list.map((p) => (
					<span key={p.name}>{p.label}</span>
				))}
			</div>
		);
	},
}));

import LocalStepForm from "features/onboarding/components/LocalStepForm";

const DOC_ID_LABEL = "PAN";
const PAN_IMAGE_LABEL = "PAN Card Image";

// Mirrors the PAN_VERIFICATION step: a form with a required text field (doc_id) and a
// required file field (pan_image).
const panStep = (props?: Record<string, unknown>): OnboardingStep =>
	({
		id: 8,
		name: "PAN_VERIFICATION",
		label: "PAN Verification",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		primaryCTAText: "Proceed",
		description: "desc",
		form_data: {},
		localRenderer: {
			type: "form",
			formFields: [
				{
					name: "doc_id",
					label: DOC_ID_LABEL,
					parameter_type_id: ParamType.TEXT,
					required: true,
				},
				{
					name: "pan_image",
					label: PAN_IMAGE_LABEL,
					parameter_type_id: ParamType.FILE,
					required: true,
				},
			],
		},
		orgConfig: props ? { props } : undefined,
	}) as OnboardingStep;

const noop = () => {};
const renderStep = (props?: Record<string, unknown>) =>
	render(
		<LocalStepForm
			stepConfig={panStep(props)}
			onSubmit={noop}
			onAdvance={noop}
		/>
	);

const field = (name: string) => capturedFields.find((f) => f.name === name);

describe("LocalStepForm — generic org field flags", () => {
	beforeEach(() => {
		capturedFields = [];
	});

	it("renders all fields required by default", () => {
		const { getByText } = renderStep();
		expect(getByText(DOC_ID_LABEL)).toBeInTheDocument();
		expect(getByText(PAN_IMAGE_LABEL)).toBeInTheDocument();
		expect(field("pan_image")?.required).toBe(true);
	});

	it("drops a field listed in hideFields", () => {
		const { getByText, queryByText } = renderStep({
			hideFields: ["pan_image"],
		});
		expect(getByText(DOC_ID_LABEL)).toBeInTheDocument();
		expect(queryByText(PAN_IMAGE_LABEL)).not.toBeInTheDocument();
		expect(field("pan_image")).toBeUndefined();
	});

	it("relaxes only required for a field listed in optionalFields", () => {
		const { getByText } = renderStep({ optionalFields: ["pan_image"] });
		expect(getByText(PAN_IMAGE_LABEL)).toBeInTheDocument();
		expect(field("pan_image")?.required).toBe(false);
		// Unlisted fields are untouched.
		expect(field("doc_id")?.required).toBe(true);
	});

	it("ignores malformed props (non-array) and renders defaults", () => {
		renderStep({ hideFields: "pan_image", optionalFields: 3 });
		expect(field("doc_id")).toBeDefined();
		expect(field("pan_image")?.required).toBe(true);
	});
});
