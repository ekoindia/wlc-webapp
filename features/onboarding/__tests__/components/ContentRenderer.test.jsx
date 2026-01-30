import {
	ContentRenderer,
	registerCustomComponent,
} from "features/onboarding/components";
import { render, screen } from "test-utils";

// Mock step configurations
const mockFormStepConfig = {
	id: 3,
	name: "pan_verification",
	label: "PAN Verification",
	description: "Enter your PAN card details",
	isRequired: true,
	isVisible: true,
	stepStatus: 1,
	primaryCTAText: "Verify PAN",
	form_data: {},
	renderSource: "local",
	localRenderer: {
		type: "form",
		formFields: [
			{
				name: "pan_number",
				label: "PAN Number",
				parameter_type_id: 1,
				required: true,
			},
		],
	},
};

const mockCustomStepConfig = {
	id: 12,
	name: "sign_agreement",
	label: "Sign Agreement",
	description: "Review and sign the agreement",
	isRequired: true,
	isVisible: true,
	stepStatus: 1,
	primaryCTAText: "Sign",
	form_data: {},
	renderSource: "local",
	localRenderer: {
		type: "custom",
		component: "SignAgreementPage",
	},
};

const mockWidgetStepConfig = {
	id: 4,
	name: "aadhaar_verification",
	label: "Aadhaar Verification",
	description: "Verify your Aadhaar",
	isRequired: true,
	isVisible: true,
	stepStatus: 1,
	primaryCTAText: "Verify",
	form_data: {},
	renderSource: "widget",
};

// Mock handlers
const mockOnSubmit = jest.fn();
const mockOnSkip = jest.fn();

describe("ContentRenderer", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Form Rendering", () => {
		it("renders LocalStepForm when localRenderer.type is 'form'", () => {
			render(
				<ContentRenderer
					stepConfig={mockFormStepConfig}
					onSubmit={mockOnSubmit}
					onSkip={mockOnSkip}
				/>
			);

			// Should render the step label
			expect(screen.getByText("PAN Verification")).toBeInTheDocument();
			// Should render the description
			expect(
				screen.getByText("Enter your PAN card details")
			).toBeInTheDocument();
			// Should render the submit button
			expect(screen.getByText("Verify PAN")).toBeInTheDocument();
		});

		it("renders form fields from localRenderer.formFields", () => {
			render(
				<ContentRenderer
					stepConfig={mockFormStepConfig}
					onSubmit={mockOnSubmit}
				/>
			);

			// Form component should render - verify by checking the submit button exists
			// The actual form field rendering depends on tf-components Form implementation
			expect(
				screen.getByRole("button", { name: /verify pan/i })
			).toBeInTheDocument();
		});
	});

	describe("Custom Component Rendering", () => {
		it("shows fallback message when custom component is not registered", () => {
			render(
				<ContentRenderer
					stepConfig={mockCustomStepConfig}
					onSubmit={mockOnSubmit}
				/>
			);

			expect(
				screen.getByText("Custom component not available")
			).toBeInTheDocument();
			expect(
				screen.getByText(/SignAgreementPage.*is not registered/i)
			).toBeInTheDocument();
		});

		it("renders registered custom component", () => {
			// Register a mock custom component
			const MockSignAgreement = ({ stepConfig }) => (
				<div data-testid="custom-sign-agreement">
					Custom: {stepConfig.label}
				</div>
			);
			registerCustomComponent("SignAgreementPage", MockSignAgreement);

			render(
				<ContentRenderer
					stepConfig={mockCustomStepConfig}
					onSubmit={mockOnSubmit}
				/>
			);

			expect(
				screen.getByTestId("custom-sign-agreement")
			).toBeInTheDocument();
			expect(
				screen.getByText("Custom: Sign Agreement")
			).toBeInTheDocument();
		});
	});

	describe("Widget Rendering", () => {
		it("renders widget content when renderSource is 'widget'", () => {
			render(
				<ContentRenderer
					stepConfig={mockWidgetStepConfig}
					onSubmit={mockOnSubmit}
					widgetContent={
						<div data-testid="widget-content">Widget UI Here</div>
					}
				/>
			);

			expect(screen.getByTestId("widget-content")).toBeInTheDocument();
			expect(screen.getByText("Widget UI Here")).toBeInTheDocument();
		});

		it("renders widget content when no stepConfig is provided but widgetContent exists", () => {
			render(
				<ContentRenderer
					onSubmit={mockOnSubmit}
					widgetContent={<div>Default Widget</div>}
				/>
			);

			// Without stepConfig but with widgetContent, should render widget
			expect(screen.getByText("Default Widget")).toBeInTheDocument();
		});
	});

	describe("Fallback Rendering", () => {
		it("renders fallback content when no stepConfig provided", () => {
			render(
				<ContentRenderer
					onSubmit={mockOnSubmit}
					fallbackContent={
						<div data-testid="fallback">Loading Step...</div>
					}
				/>
			);

			expect(screen.getByTestId("fallback")).toBeInTheDocument();
		});

		it("renders default empty state when no fallback provided", () => {
			render(<ContentRenderer onSubmit={mockOnSubmit} />);

			expect(
				screen.getByText("No content available")
			).toBeInTheDocument();
		});
	});

	describe("Loading State", () => {
		it("passes isLoading to form component", () => {
			render(
				<ContentRenderer
					stepConfig={mockFormStepConfig}
					onSubmit={mockOnSubmit}
					isLoading={true}
				/>
			);

			// Submit button should be in loading state (disabled)
			const submitButton = screen.getByRole("button", {
				name: /verify pan/i,
			});
			expect(submitButton).toBeDisabled();
		});
	});

	describe("Skip Functionality", () => {
		it("shows skip button for non-required steps", () => {
			const optionalStepConfig = {
				...mockFormStepConfig,
				isRequired: false,
			};

			render(
				<ContentRenderer
					stepConfig={optionalStepConfig}
					onSubmit={mockOnSubmit}
					onSkip={mockOnSkip}
				/>
			);

			expect(
				screen.getByRole("button", { name: /skip/i })
			).toBeInTheDocument();
		});

		it("hides skip button for required steps", () => {
			render(
				<ContentRenderer
					stepConfig={mockFormStepConfig}
					onSubmit={mockOnSubmit}
					onSkip={mockOnSkip}
				/>
			);

			expect(
				screen.queryByRole("button", { name: /skip/i })
			).not.toBeInTheDocument();
		});
	});
});
