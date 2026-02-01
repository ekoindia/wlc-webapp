import { ReactNode } from "react";

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
 * Default status colors for the stepper
 */
export const DEFAULT_STATUS_COLORS: StatusColorConfig = {
	completed: "success",
	failed: "error",
	skipped: "hint",
	inProgress: "primary.DEFAULT",
	notStarted: "shade",
} as const;

/**
 * Configuration for status colors in the stepper
 */
export interface StatusColorConfig {
	/** Color for completed steps - default: 'success' */
	completed?: string;
	/** Color for failed steps - default: 'error' */
	failed?: string;
	/** Color for skipped steps - default: 'hint' */
	skipped?: string;
	/** Color for in-progress steps - default: 'primary.DEFAULT' */
	inProgress?: string;
	/** Color for not-started steps - default: 'shade' */
	notStarted?: string;
}

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
	/** Optional icon - can be a string (icon name from IconLibrary) or a ReactNode */
	icon?: string | ReactNode;
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
 * Orientation options for the stepper
 * - 'responsive': vertical on ≥md (768px), horizontal on <md (default)
 * - 'horizontal': always horizontal on all screens
 * - 'vertical': always vertical on all screens
 */
export type StepperOrientation = "responsive" | "vertical" | "horizontal";

/**
 * Props for the main Stepper component
 */
export interface StepperProps {
	/** Array of step objects */
	steps: StepItem[];
	/** ID of the currently active step */
	currentStepId?: number | string;
	/** Optional filter configuration */
	filterConfig?: StepFilterConfig;
	/** Callback when a step is clicked (for navigation) */
	onStepClick?: (_step: StepItem, _index: number) => void;
	/** Whether to allow clicking on completed steps to navigate back */
	allowNavigation?: boolean;
	/** Orientation of the stepper - 'responsive' (default), 'horizontal', or 'vertical' */
	orientation?: StepperOrientation;
	/** Custom status colors for step indicators (optional, uses theme defaults if not provided) */
	statusColorsProp?: StatusColorConfig;
	children?: React.ReactNode;
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
	/** Whether to show the connecting line after this step */
	showConnector: boolean;
	/** Whether any step in the stepper has an icon */
	hasAnyIcon: boolean;
	/** Click handler for navigation */
	onClick?: () => void;
	/** Whether clicking is enabled */
	isClickable?: boolean;
	/** Orientation of the stepper item */
	orientation: "vertical" | "horizontal";
	/** Status colors configuration */
	statusColors: Required<StatusColorConfig>;
}

/**
 * State object returned by useStepperState hook
 */
export interface StepperState {
	visibleSteps: StepItem[];
	currentStepIndex: number;
	completedCount: number;
	progressPercentage: number;
	isStepCompleted: (_step: StepItem, _index: number) => boolean;
	handleStepClick: (_step: StepItem, _index: number) => void;
	getCompletionText: () => string;
}

/**
 * Props for StepperLayout
 */
export interface StepperLayoutProps {
	state: StepperState;
	width?: string | object;
	orientation: StepperOrientation;
	statusColors: Required<StatusColorConfig>;
	onStepClick?: (_step: StepItem, _index: number) => void;
	allowNavigation?: boolean;
	className?: string;
	children?: React.ReactNode;
}

/**
 * @deprecated Use StepperLayoutProps instead
 */
export type VerticalStepperLayoutProps = StepperLayoutProps;
