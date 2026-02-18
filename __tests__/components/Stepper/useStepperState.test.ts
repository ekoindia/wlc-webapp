import { renderHook } from "@testing-library/react";
import { STEP_STATUS } from "../../../components/Stepper/types";
import { useStepperState } from "../../../components/Stepper/useStepperState";

// Mock step data
const mockSteps = [
	{ id: 1, label: "Step 1", status: STEP_STATUS.COMPLETED, isVisible: true },
	{
		id: 2,
		label: "Step 2",
		status: STEP_STATUS.IN_PROGRESS,
		isVisible: true,
	},
	{
		id: 3,
		label: "Step 3",
		status: STEP_STATUS.NOT_STARTED,
		isVisible: true,
	},
];

describe("useStepperState", () => {
	it("should filter steps based on isVisible prop", () => {
		const stepsWithHidden = [
			...mockSteps,
			{
				id: 4,
				label: "Hidden",
				status: STEP_STATUS.NOT_STARTED,
				isVisible: false,
			},
		];

		const { result } = renderHook(() =>
			useStepperState({ steps: stepsWithHidden })
		);

		expect(result.current.visibleSteps).toHaveLength(3);
		expect(
			result.current.visibleSteps.find((s) => s.id === 4)
		).toBeUndefined();
	});

	it("should filter steps based on excludeStepIds", () => {
		const { result } = renderHook(() =>
			useStepperState({
				steps: mockSteps,
				filterConfig: { excludeStepIds: [2] },
			})
		);

		expect(result.current.visibleSteps).toHaveLength(2);
		expect(result.current.visibleSteps.map((s) => s.id)).toEqual([1, 3]);
	});

	it("should filter steps based on custom filterFn", () => {
		const { result } = renderHook(() =>
			useStepperState({
				steps: mockSteps,
				filterConfig: {
					filterFn: (step) => step.status === STEP_STATUS.COMPLETED,
				},
			})
		);

		expect(result.current.visibleSteps).toHaveLength(1);
		expect(result.current.visibleSteps[0].id).toEqual(1);
	});

	it("should calculate currentStepIndex correctly from currentStepId", () => {
		const { result } = renderHook(() =>
			useStepperState({ steps: mockSteps, currentStepId: 2 })
		);

		expect(result.current.currentStepIndex).toBe(1); // 0-based index
	});

	it("should calculate currentStepIndex based on first pending step if currentStepId is undefined", () => {
		const { result } = renderHook(
			() => useStepperState({ steps: mockSteps }) // currentStepId undefined
		);

		// First step is COMPLETED, second is IN_PROGRESS (so not completed).
		// Logic: firstPendingIndex = findIndex(step != COMPLETED && step != SKIPPED)
		// Step 1: COMPLETED (skip)
		// Step 2: IN_PROGRESS (match) -> index 1
		expect(result.current.currentStepIndex).toBe(1);
	});

	it("should calculate completedCount correctly", () => {
		const { result } = renderHook(() =>
			useStepperState({ steps: mockSteps })
		);

		expect(result.current.completedCount).toBe(1); // Only step 1 is COMPLETED
	});

	it("should calculate progressPercentage correctly", () => {
		const { result } = renderHook(() =>
			useStepperState({ steps: mockSteps })
		);

		// 1 completed / 3 total = 33% (floor)
		expect(result.current.progressPercentage).toBe(33);
	});

	it("should return correct isStepCompleted check", () => {
		const { result } = renderHook(() =>
			useStepperState({ steps: mockSteps, currentStepId: 2 })
		);

		// Step 1: COMPLETED -> true
		expect(result.current.isStepCompleted(mockSteps[0], 0)).toBe(true);
		// Step 2: IN_PROGRESS (current) -> not completed
		expect(result.current.isStepCompleted(mockSteps[1], 1)).toBe(false);
		// Step 3: NOT_STARTED -> not completed
		expect(result.current.isStepCompleted(mockSteps[2], 2)).toBe(false);
	});

	it("should handle step click logic", () => {
		const onStepClick = jest.fn();
		const { result } = renderHook(() =>
			useStepperState({
				steps: mockSteps,
				currentStepId: 2,
				onStepClick,
				allowNavigation: false,
			})
		);

		// Clicking completed step (allowed if completed)
		result.current.handleStepClick(mockSteps[0], 0);
		expect(onStepClick).toHaveBeenCalledWith(mockSteps[0], 0);

		onStepClick.mockClear();

		// Clicking future step (not allowed if !allowNavigation)
		result.current.handleStepClick(mockSteps[2], 2);
		expect(onStepClick).not.toHaveBeenCalled();
	});

	it("should allow navigation to any step if allowNavigation is true", () => {
		const onStepClick = jest.fn();
		const { result } = renderHook(() =>
			useStepperState({
				steps: mockSteps,
				currentStepId: 2,
				onStepClick,
				allowNavigation: true,
			})
		);

		// Clicking future step
		result.current.handleStepClick(mockSteps[2], 2);
		expect(onStepClick).toHaveBeenCalledWith(mockSteps[2], 2);
	});

	it("should return correct completion text", () => {
		const { result } = renderHook(() =>
			useStepperState({ steps: mockSteps })
		);

		expect(result.current.getCompletionText()).toBe("1 Step Completed");
	});
});
