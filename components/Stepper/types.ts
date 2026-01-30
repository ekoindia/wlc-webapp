/**
 * Step status values representing the current state of a step
 */
export const STEP_STATUS = {
	NOT_STARTED: 0,
	IN_PROGRESS: 1,
	COMPLETED: 2,
	FAILED: 3,
	SKIPPED: 4,
} as const;

export type StepStatus = (typeof STEP_STATUS)[keyof typeof STEP_STATUS];

/**
 * Represents a single step item in the stepper
 */
export interface StepItem {
	/** Unique identifier for the step */
	id: number | string;
	/** Display label for the step */
	label: string;
	/** Current status of the step */
	status: StepStatus;
	/** Whether the step should be visible in the stepper */
	isVisible?: boolean;
	/** Optional description text for the step */
	description?: string;
	/** Optional icon name to display for this step */
	icon?: string;
}

/**
 * Configuration for step filtering based on user context
 */
export interface StepFilterConfig {
	/** Array of step IDs to exclude from display */
	excludeStepIds?: (number | string)[];
	/** Custom filter function for advanced filtering */
	filterFn?: (_step: StepItem) => boolean;
}

/**
 * Props for the main Stepper component
 */
export interface StepperProps {
	/** Array of step objects */
	steps: StepItem[];
	/** ID of the currently active step */
	currentStepId?: number | string;
	/** Title text displayed above the progress bar */
	title?: string;
	/** Optional filter configuration */
	filterConfig?: StepFilterConfig;
	/** Callback when a step is clicked (for navigation) */
	onStepClick?: (_step: StepItem, _index: number) => void;
	/** Whether to allow clicking on completed steps to navigate back */
	allowNavigation?: boolean;
	/** Custom width for the stepper container */
	width?: string | object;
	/** Background color for the header section */
	headerBg?: string;
	/** Text color for the header section */
	headerColor?: string;
	/** Whether to show step numbers */
	showStepNumbers?: boolean;
	/** Whether to show the progress bar */
	showProgressBar?: boolean;
	/** Custom step status labels for badges */
	statusLabels?: {
		inProgress?: string;
		skipped?: string;
		completed?: string;
		failed?: string;
	};
	/** Custom class name for additional styling */
	className?: string;
}

/**
 * Props for individual step item component
 */
export interface StepperItemProps {
	/** The step data */
	step: StepItem;
	/** Zero-based index of this step */
	index: number;
	/** Whether this step is the current active step */
	isActive: boolean;
	/** Whether this step has been completed */
	isCompleted: boolean;
	/** Whether to show the connecting line below this step */
	showConnector: boolean;
	/** Whether to show step numbers instead of icons */
	showStepNumbers?: boolean;
	/** Click handler for navigation */
	onClick?: () => void;
	/** Whether clicking is enabled */
	isClickable?: boolean;
	/** Custom status labels */
	statusLabels?: StepperProps["statusLabels"];
}
