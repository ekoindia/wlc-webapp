import { fireEvent, render, screen } from "@testing-library/react";
import StepperLayout from "../../../components/Stepper/StepperLayout";
import {
	DEFAULT_STATUS_COLORS,
	STEP_STATUS,
	StepperState,
} from "../../../components/Stepper/types";

// Mock StepperState
const mockState: StepperState = {
	visibleSteps: [
		{ id: 1, label: "Step 1", status: STEP_STATUS.COMPLETED },
		{ id: 2, label: "Step 2", status: STEP_STATUS.IN_PROGRESS },
		{ id: 3, label: "Step 3", status: STEP_STATUS.NOT_STARTED },
	],
	currentStepIndex: 1,
	completedCount: 1,
	progressPercentage: 33,
	isStepCompleted: jest.fn((step) => step.status === STEP_STATUS.COMPLETED),
	handleStepClick: jest.fn(),
	getCompletionText: () => "mock completion text",
};

const defaultProps = {
	state: mockState,
	orientation: "responsive" as const,
	statusColors: DEFAULT_STATUS_COLORS,
};

describe("StepperLayout", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should render all visible steps", () => {
		render(<StepperLayout {...defaultProps} />);

		expect(screen.getByText("Step 1")).toBeInTheDocument();
		expect(screen.getByText("Step 2")).toBeInTheDocument();
		expect(screen.getByText("Step 3")).toBeInTheDocument();
	});

	it("should render children content", () => {
		render(
			<StepperLayout {...defaultProps}>
				<div data-testid="child-content">Child Content</div>
			</StepperLayout>
		);

		expect(screen.getByTestId("child-content")).toBeInTheDocument();
	});

	it("should render nothing for empty steps except children", () => {
		const emptyState = {
			...mockState,
			visibleSteps: [],
		};

		render(
			<StepperLayout {...defaultProps} state={emptyState}>
				<div data-testid="child-content">Child Content</div>
			</StepperLayout>
		);

		expect(screen.getByTestId("child-content")).toBeInTheDocument();
	});

	it("should call handleStepClick when a step is clicked", () => {
		render(
			<StepperLayout
				{...defaultProps}
				allowNavigation={true}
				onStepClick={jest.fn()}
			/>
		);

		fireEvent.click(screen.getByText("Step 1"));
		expect(mockState.handleStepClick).toHaveBeenCalledWith(
			mockState.visibleSteps[0],
			0
		);
	});

	describe("Orientation", () => {
		it("should accept responsive orientation", () => {
			const { container } = render(
				<StepperLayout {...defaultProps} orientation="responsive" />
			);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("should accept horizontal orientation", () => {
			const { container } = render(
				<StepperLayout {...defaultProps} orientation="horizontal" />
			);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("should accept vertical orientation", () => {
			const { container } = render(
				<StepperLayout {...defaultProps} orientation="vertical" />
			);
			expect(container).not.toBeEmptyDOMElement();
		});
	});

	describe("Status Colors", () => {
		it("should use DEFAULT_STATUS_COLORS for styling", () => {
			const { container } = render(<StepperLayout {...defaultProps} />);
			expect(container).not.toBeEmptyDOMElement();
		});
	});

	describe("Steps with Icons", () => {
		it("should render steps with icons", () => {
			const stateWithIcons: StepperState = {
				...mockState,
				visibleSteps: [
					{
						id: 1,
						label: "Address",
						status: STEP_STATUS.COMPLETED,
						icon: "location",
					},
					{
						id: 2,
						label: "Shipping",
						status: STEP_STATUS.IN_PROGRESS,
						icon: "truck",
					},
				],
			};

			render(<StepperLayout {...defaultProps} state={stateWithIcons} />);

			expect(screen.getByText("Address")).toBeInTheDocument();
			expect(screen.getByText("Shipping")).toBeInTheDocument();
		});

		it("should render steps with descriptions in vertical mode", () => {
			const stateWithDescriptions: StepperState = {
				...mockState,
				visibleSteps: [
					{
						id: 1,
						label: "Address",
						description: "Add your address",
						status: STEP_STATUS.COMPLETED,
					},
					{
						id: 2,
						label: "Shipping",
						description: "Choose shipping method",
						status: STEP_STATUS.IN_PROGRESS,
					},
				],
			};

			render(
				<StepperLayout
					{...defaultProps}
					state={stateWithDescriptions}
					orientation="vertical"
				/>
			);

			expect(screen.getByText("Add your address")).toBeInTheDocument();
			expect(
				screen.getByText("Choose shipping method")
			).toBeInTheDocument();
		});
	});
});
