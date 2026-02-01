import {
	DEFAULT_STATUS_COLORS,
	STEP_STATUS,
	Stepper,
	StepperItem,
} from "components/Stepper";
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

const mockStepsWithIcons = [
	{
		id: 1,
		label: "Address",
		description: "Add your address here",
		status: STEP_STATUS.COMPLETED,
		icon: "location",
	},
	{
		id: 2,
		label: "Shipping",
		description: "Set your preferred shipping method",
		status: STEP_STATUS.IN_PROGRESS,
		icon: "truck",
	},
	{
		id: 3,
		label: "Payment",
		description: "Add any payment information you have",
		status: STEP_STATUS.NOT_STARTED,
		icon: "card",
	},
];

describe("Stepper Component", () => {
	describe("Rendering", () => {
		it("renders without error with required props", () => {
			const { container } = render(<Stepper steps={mockSteps} />);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("renders children content correctly", () => {
			render(
				<Stepper steps={mockSteps} currentStepId={1}>
					<div data-testid="child-content">Child Content</div>
				</Stepper>
			);
			expect(screen.getByTestId("child-content")).toBeInTheDocument();
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

		it("renders nothing when steps array is empty", () => {
			const { container } = render(<Stepper steps={[]} />);
			expect(container.firstChild).toBeEmptyDOMElement();
		});
	});

	describe("Orientation", () => {
		it("defaults to responsive orientation", () => {
			const { container } = render(<Stepper steps={mockSteps} />);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("accepts horizontal orientation", () => {
			const { container } = render(
				<Stepper steps={mockSteps} orientation="horizontal" />
			);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("accepts vertical orientation", () => {
			const { container } = render(
				<Stepper steps={mockSteps} orientation="vertical" />
			);
			expect(container).not.toBeEmptyDOMElement();
		});
	});

	describe("Status Colors", () => {
		it("uses default status colors when none provided", () => {
			const { container } = render(<Stepper steps={mockSteps} />);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("accepts custom status colors", () => {
			const customColors = {
				completed: "green.500",
				failed: "red.500",
				skipped: "gray.400",
			};
			const { container } = render(
				<Stepper steps={mockSteps} statusColorsProp={customColors} />
			);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("exports DEFAULT_STATUS_COLORS constant", () => {
			expect(DEFAULT_STATUS_COLORS).toBeDefined();
			expect(DEFAULT_STATUS_COLORS.completed).toBe("success");
			expect(DEFAULT_STATUS_COLORS.failed).toBe("error");
			expect(DEFAULT_STATUS_COLORS.skipped).toBe("hint");
			expect(DEFAULT_STATUS_COLORS.inProgress).toBe("primary.DEFAULT");
			expect(DEFAULT_STATUS_COLORS.notStarted).toBe("shade");
		});
	});

	describe("Icons", () => {
		it("renders steps with string icons", () => {
			render(<Stepper steps={mockStepsWithIcons} />);
			expect(screen.getByText("Address")).toBeInTheDocument();
			expect(screen.getByText("Shipping")).toBeInTheDocument();
			expect(screen.getByText("Payment")).toBeInTheDocument();
		});

		it("renders steps with descriptions", () => {
			render(<Stepper steps={mockStepsWithIcons} />);
			expect(
				screen.getByText("Add your address here")
			).toBeInTheDocument();
			expect(
				screen.getByText("Set your preferred shipping method")
			).toBeInTheDocument();
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
});

describe("StepperItem Component", () => {
	const baseProps = {
		step: { id: 1, label: "Test Step", status: STEP_STATUS.NOT_STARTED },
		index: 0,
		isActive: false,
		isCompleted: false,
		showConnector: false,
		hasAnyIcon: false,
		orientation: "vertical",
		statusColors: DEFAULT_STATUS_COLORS,
	};

	it("renders without error", () => {
		const { container } = render(<StepperItem {...baseProps} />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("displays the step label", () => {
		render(<StepperItem {...baseProps} />);
		expect(screen.getByText("Test Step")).toBeInTheDocument();
	});

	it("displays step number when hasAnyIcon is false", () => {
		render(<StepperItem {...baseProps} />);
		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("displays description when provided", () => {
		render(
			<StepperItem
				{...baseProps}
				step={{ ...baseProps.step, description: "Step description" }}
			/>
		);
		expect(screen.getByText("Step description")).toBeInTheDocument();
	});

	it("renders in horizontal orientation", () => {
		const { container } = render(
			<StepperItem {...baseProps} orientation="horizontal" />
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders completed step", () => {
		const { container } = render(
			<StepperItem
				{...baseProps}
				step={{ ...baseProps.step, status: STEP_STATUS.COMPLETED }}
				isCompleted={true}
			/>
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders skipped step", () => {
		const { container } = render(
			<StepperItem
				{...baseProps}
				step={{ ...baseProps.step, status: STEP_STATUS.SKIPPED }}
			/>
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders failed step", () => {
		const { container } = render(
			<StepperItem
				{...baseProps}
				step={{ ...baseProps.step, status: STEP_STATUS.FAILED }}
			/>
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders active step", () => {
		const { container } = render(
			<StepperItem {...baseProps} isActive={true} />
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders step with string icon", () => {
		const { container } = render(
			<StepperItem
				{...baseProps}
				step={{ ...baseProps.step, icon: "check" }}
				hasAnyIcon={true}
			/>
		);
		expect(container).not.toBeEmptyDOMElement();
	});
});
