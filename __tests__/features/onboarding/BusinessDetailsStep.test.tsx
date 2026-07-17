import BusinessDetailsStep from "features/onboarding/components/custom/BusinessDetailsStep";
import { useOnboardingContext } from "features/onboarding/context";
import { render } from "test-utils";

jest.mock("features/onboarding/context", () => ({
	useOnboardingContext: jest.fn(),
}));

jest.mock("hooks", () => ({
	useCountryStates: () => ({ states: [], isLoading: false }),
}));

jest.mock("@chakra-ui/react", () => {
	const actual = jest.requireActual("@chakra-ui/react");
	return {
		...actual,
		useToast: () => jest.fn(),
	};
});

jest.mock("components", () => ({
	ActionButtonGroup: ({
		buttonConfigList,
	}: {
		buttonConfigList: Array<{ label: string }>;
	}) => (
		<div>
			{buttonConfigList.map((button) => (
				<button key={button.label}>{button.label}</button>
			))}
		</div>
	),
}));

jest.mock("tf-components", () => ({
	Form: ({
		parameter_list,
	}: {
		parameter_list: Array<{
			name: string;
			label: string;
			readonly?: boolean;
			defaultValue?: string;
		}>;
	}) => (
		<div>
			{parameter_list.map((parameter) => (
				<div
					key={parameter.name}
					data-readonly={parameter.readonly ?? false}
				>
					{parameter.label}{" "}
					{parameter.defaultValue ? `:${parameter.defaultValue}` : ""}
				</div>
			))}
		</div>
	),
}));

const mockUseOnboardingContext = useOnboardingContext as jest.MockedFunction<
	typeof useOnboardingContext
>;

describe("BusinessDetailsStep", () => {
	beforeEach(() => {
		mockUseOnboardingContext.mockReturnValue({
			pipelineResults: {},
			userType: 2,
			userName: "Jane Doe",
			email: "jane@example.com",
		} as never);
	});

	it("prefills the business name from the profile and marks it read-only", () => {
		const { getByText } = render(
			<BusinessDetailsStep
				stepConfig={
					{
						id: 1,
						label: "Business Details",
						description: "Enter business details",
						isRequired: true,
						primaryCTAText: "Next",
					} as never
				}
				onSubmit={jest.fn()}
				onAdvance={jest.fn()}
				onSkip={jest.fn()}
			/>
		);

		expect(
			getByText(/Company\/Firm's Name :Jane Doe/i)
		).toBeInTheDocument();
	});
});
