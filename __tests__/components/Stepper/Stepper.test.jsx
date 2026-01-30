import { STEP_STATUS, Stepper, StepperItem } from "components/Stepper";
import { render, screen } from "test-utils";

const mockSteps = [
	{
		id: 1,
		label: "Location Capturing",
		status: STEP_STATUS.COMPLETED,
		isVisible: true,
	},
	{
		id: 2,
		label: "Aadhaar Verification",
		status: STEP_STATUS.COMPLETED,
		isVisible: true,
	},
	{
		id: 3,
		label: "PAN Verification",
		status: STEP_STATUS.IN_PROGRESS,
		isVisible: true,
	},
	{
		id: 4,
		label: "Selfie KYC",
		status: STEP_STATUS.NOT_STARTED,
		isVisible: true,
	},
	{
		id: 5,
		label: "Add Bank Account",
		status: STEP_STATUS.SKIPPED,
		isVisible: true,
	},
];

describe("Stepper Component", () => {
	describe("Rendering", () => {
		it("renders without error with required props", () => {
			const { container } = render(<Stepper steps={mockSteps} />);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("renders all visible steps", () => {
			render(<Stepper steps={mockSteps} currentStepId={3} />);

			expect(screen.getByText("Location Capturing")).toBeInTheDocument();
			expect(
				screen.getByText("Aadhaar Verification")
			).toBeInTheDocument();
			expect(screen.getByText("PAN Verification")).toBeInTheDocument();
			expect(screen.getByText("Selfie KYC")).toBeInTheDocument();
			expect(screen.getByText("Add Bank Account")).toBeInTheDocument();
		});

		it("renders the title correctly", () => {
			render(<Stepper steps={mockSteps} title="Onboarding Progress" />);

			expect(screen.getByText("Onboarding Progress")).toBeInTheDocument();
		});

		it("renders nothing when steps array is empty", () => {
			const { container } = render(<Stepper steps={[]} />);
			expect(container.firstChild).toBeEmptyDOMElement();
		});
	});

	describe("Step Statuses", () => {
		it("shows 'In Progress' badge for current step", () => {
			render(<Stepper steps={mockSteps} currentStepId={3} />);

			expect(screen.getByText("In Progress")).toBeInTheDocument();
		});

		it("shows 'Skipped' badge for skipped steps", () => {
			render(<Stepper steps={mockSteps} currentStepId={3} />);

			expect(screen.getByText("Skipped")).toBeInTheDocument();
		});

		it("displays custom status labels when provided", () => {
			render(
				<Stepper
					steps={mockSteps}
					currentStepId={3}
					statusLabels={{
						inProgress: "Current Step",
						skipped: "Bypassed",
					}}
				/>
			);

			expect(screen.getByText("Current Step")).toBeInTheDocument();
			expect(screen.getByText("Bypassed")).toBeInTheDocument();
		});
	});

	describe("Progress Calculation", () => {
		it("displays correct completion count", () => {
			render(<Stepper steps={mockSteps} currentStepId={3} />);

			// 2 completed + 1 skipped = 3 steps completed
			expect(screen.getByText("3 Steps Completed")).toBeInTheDocument();
		});

		it("displays singular 'Step' when only one completed", () => {
			const singleCompletedSteps = [
				{
					id: 1,
					label: "Step 1",
					status: STEP_STATUS.COMPLETED,
					isVisible: true,
				},
				{
					id: 2,
					label: "Step 2",
					status: STEP_STATUS.IN_PROGRESS,
					isVisible: true,
				},
			];

			render(<Stepper steps={singleCompletedSteps} currentStepId={2} />);

			expect(screen.getByText("1 Step Completed")).toBeInTheDocument();
		});
	});

	describe("Step Filtering", () => {
		it("filters out steps with isVisible=false", () => {
			const stepsWithHidden = [
				...mockSteps,
				{
					id: 6,
					label: "Hidden Step",
					status: STEP_STATUS.NOT_STARTED,
					isVisible: false,
				},
			];

			render(<Stepper steps={stepsWithHidden} currentStepId={3} />);

			expect(screen.queryByText("Hidden Step")).not.toBeInTheDocument();
		});

		it("excludes steps based on filterConfig.excludeStepIds", () => {
			render(
				<Stepper
					steps={mockSteps}
					currentStepId={3}
					filterConfig={{ excludeStepIds: [4, 5] }}
				/>
			);

			expect(screen.queryByText("Selfie KYC")).not.toBeInTheDocument();
			expect(
				screen.queryByText("Add Bank Account")
			).not.toBeInTheDocument();
		});

		it("applies custom filter function", () => {
			render(
				<Stepper
					steps={mockSteps}
					currentStepId={3}
					filterConfig={{
						filterFn: (step) => step.status !== STEP_STATUS.SKIPPED,
					}}
				/>
			);

			expect(
				screen.queryByText("Add Bank Account")
			).not.toBeInTheDocument();
		});
	});

	describe("Navigation", () => {
		it("calls onStepClick when allowNavigation is true and completed step clicked", () => {
			const onStepClick = jest.fn();

			render(
				<Stepper
					steps={mockSteps}
					currentStepId={3}
					allowNavigation={true}
					onStepClick={onStepClick}
				/>
			);

			const completedStep = screen.getByText("Location Capturing");
			completedStep.click();

			expect(onStepClick).toHaveBeenCalledWith(mockSteps[0], 0);
		});

		it("does not call onStepClick when allowNavigation is false", () => {
			const onStepClick = jest.fn();

			render(
				<Stepper
					steps={mockSteps}
					currentStepId={3}
					allowNavigation={false}
					onStepClick={onStepClick}
				/>
			);

			const completedStep = screen.getByText("Location Capturing");
			completedStep.click();

			expect(onStepClick).not.toHaveBeenCalled();
		});
	});

	describe("Progress Bar", () => {
		it("hides progress bar when showProgressBar is false", () => {
			render(
				<Stepper
					steps={mockSteps}
					currentStepId={3}
					showProgressBar={false}
				/>
			);

			expect(
				screen.queryByText(/Steps? Completed/)
			).not.toBeInTheDocument();
		});
	});
});

describe("StepperItem Component", () => {
	const baseProps = {
		step: { id: 1, label: "Test Step", status: STEP_STATUS.NOT_STARTED },
		index: 0,
		isActive: false,
		isCompleted: false,
		showConnector: false,
	};

	it("renders without error", () => {
		const { container } = render(<StepperItem {...baseProps} />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("displays the step label", () => {
		render(<StepperItem {...baseProps} />);
		expect(screen.getByText("Test Step")).toBeInTheDocument();
	});

	it("shows 'In Progress' badge when isActive is true", () => {
		render(<StepperItem {...baseProps} isActive={true} />);
		expect(screen.getByText("In Progress")).toBeInTheDocument();
	});

	it("shows 'Skipped' badge for skipped steps", () => {
		render(
			<StepperItem
				{...baseProps}
				step={{ ...baseProps.step, status: STEP_STATUS.SKIPPED }}
			/>
		);
		expect(screen.getByText("Skipped")).toBeInTheDocument();
	});

	it("shows 'Failed' badge for failed steps", () => {
		render(
			<StepperItem
				{...baseProps}
				step={{ ...baseProps.step, status: STEP_STATUS.FAILED }}
			/>
		);
		expect(screen.getByText("Failed")).toBeInTheDocument();
	});
});
