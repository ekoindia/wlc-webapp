import type { OnboardingStep } from "features/onboarding/constants";
import { render } from "test-utils";

jest.mock("hooks", () => ({
	useBankList: () => ({
		banks: [],
		isLoading: false,
		error: null,
		refetch: jest.fn(),
	}),
	usePlatform: () => ({ isMac: false }),
}));

jest.mock("features/onboarding/context", () => ({
	useOnboardingContext: () => ({ pipelineResults: {} }),
}));

// Stub the framework Form so the test exercises the parameter_list gating logic,
// not the heavy field renderers (Dropzone/camera).
jest.mock("tf-components", () => ({
	Form: ({
		parameter_list,
	}: {
		parameter_list: Array<{ name: string; label: string }>;
	}) => (
		<div>
			{parameter_list.map((p) => (
				<span key={p.name}>{p.label}</span>
			))}
		</div>
	),
}));

import AddBankAccountStep from "features/onboarding/components/custom/AddBankAccountStep";

const PASSBOOK_LABEL = "Bank Passbook Image";

const bankStep = (props?: Record<string, unknown>): OnboardingStep =>
	({
		id: 25,
		name: "ADD_BANK_ACCONT",
		label: "Add Bank Account",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		primaryCTAText: "Proceed",
		description: "desc",
		form_data: {},
		localRenderer: { type: "custom", component: "AddBankAccountStep" },
		orgConfig: props ? { props } : undefined,
	}) as OnboardingStep;

const noop = () => {};
const renderStep = (props?: Record<string, unknown>) =>
	render(
		<AddBankAccountStep
			stepConfig={bankStep(props)}
			onSubmit={noop}
			onAdvance={noop}
		/>
	);

describe("AddBankAccountStep — org passbook flags", () => {
	it("shows the passbook upload by default", () => {
		const { getByText } = renderStep();
		expect(getByText(PASSBOOK_LABEL)).toBeInTheDocument();
	});

	it("hides the passbook upload when hidePassbook is set", () => {
		const { queryByText } = renderStep({ hidePassbook: true });
		expect(queryByText(PASSBOOK_LABEL)).not.toBeInTheDocument();
	});

	it("keeps the passbook upload visible when passbookOptional is set", () => {
		const { getByText } = renderStep({ passbookOptional: true });
		expect(getByText(PASSBOOK_LABEL)).toBeInTheDocument();
	});
});
