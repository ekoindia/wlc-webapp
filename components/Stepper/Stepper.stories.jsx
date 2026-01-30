import { Box } from "@chakra-ui/react";
import { STEP_STATUS, Stepper } from "./index";

export default {
	title: "Components/Stepper",
	component: Stepper,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		title: {
			control: "text",
			description: "Title text displayed above the progress bar",
		},
		showProgressBar: {
			control: "boolean",
			description: "Whether to show the progress bar",
		},
		showStepNumbers: {
			control: "boolean",
			description: "Whether to show step numbers",
		},
		allowNavigation: {
			control: "boolean",
			description: "Whether to allow clicking on completed steps",
		},
		headerBg: {
			control: "color",
			description: "Background color for the header section",
		},
		headerColor: {
			control: "color",
			description: "Text color for the header section",
		},
	},
};

// Sample data for stories
const onboardingSteps = [
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
		status: STEP_STATUS.COMPLETED,
		isVisible: true,
	},
	{
		id: 4,
		label: "Selfie KYC",
		status: STEP_STATUS.IN_PROGRESS,
		isVisible: true,
	},
	{
		id: 5,
		label: "Add Bank Account",
		status: STEP_STATUS.NOT_STARTED,
		isVisible: true,
	},
	{
		id: 6,
		label: "Sign Agreement",
		status: STEP_STATUS.NOT_STARTED,
		isVisible: true,
	},
];

const mixedStatusSteps = [
	{
		id: 1,
		label: "Step 1: Completed",
		status: STEP_STATUS.COMPLETED,
		isVisible: true,
	},
	{
		id: 2,
		label: "Step 2: Skipped",
		status: STEP_STATUS.SKIPPED,
		isVisible: true,
	},
	{
		id: 3,
		label: "Step 3: In Progress",
		status: STEP_STATUS.IN_PROGRESS,
		isVisible: true,
	},
	{
		id: 4,
		label: "Step 4: Failed",
		status: STEP_STATUS.FAILED,
		isVisible: true,
	},
	{
		id: 5,
		label: "Step 5: Not Started",
		status: STEP_STATUS.NOT_STARTED,
		isVisible: true,
	},
];

/**
 * Default stepper showing onboarding progress
 */
export const Default = {
	args: {
		steps: onboardingSteps,
		currentStepId: 4,
		title: "Onboarding Progress",
		showProgressBar: true,
		showStepNumbers: true,
	},
};

/**
 * Stepper with all step statuses demonstrated
 */
export const AllStatuses = {
	args: {
		steps: mixedStatusSteps,
		currentStepId: 3,
		title: "All Step Statuses",
		showProgressBar: true,
		showStepNumbers: true,
	},
};

/**
 * Stepper at the beginning (no completed steps)
 */
export const AtBeginning = {
	args: {
		steps: [
			{
				id: 1,
				label: "Welcome",
				status: STEP_STATUS.IN_PROGRESS,
				isVisible: true,
			},
			{
				id: 2,
				label: "Personal Details",
				status: STEP_STATUS.NOT_STARTED,
				isVisible: true,
			},
			{
				id: 3,
				label: "Verification",
				status: STEP_STATUS.NOT_STARTED,
				isVisible: true,
			},
			{
				id: 4,
				label: "Complete",
				status: STEP_STATUS.NOT_STARTED,
				isVisible: true,
			},
		],
		currentStepId: 1,
		title: "Getting Started",
	},
};

/**
 * Stepper showing completion state
 */
export const AllCompleted = {
	args: {
		steps: onboardingSteps.map((step) => ({
			...step,
			status: STEP_STATUS.COMPLETED,
		})),
		title: "All Steps Complete",
	},
};

/**
 * Stepper without progress bar
 */
export const WithoutProgressBar = {
	args: {
		steps: onboardingSteps,
		currentStepId: 4,
		title: "Steps List",
		showProgressBar: false,
	},
};

/**
 * Stepper with custom colors (accent theme)
 */
export const CustomColors = {
	args: {
		steps: onboardingSteps,
		currentStepId: 4,
		title: "Custom Theme",
		headerBg: "accent.DEFAULT",
		headerColor: "dark",
	},
};

/**
 * Stepper with navigation enabled (clickable completed steps)
 */
export const WithNavigation = {
	args: {
		steps: onboardingSteps,
		currentStepId: 4,
		title: "Click Completed Steps",
		allowNavigation: true,
		onStepClick: (step, index) => {
			alert(`Clicked step ${index + 1}: ${step.label}`);
		},
	},
};

/**
 * Stepper with custom status labels
 */
export const CustomLabels = {
	args: {
		steps: mixedStatusSteps,
		currentStepId: 3,
		title: "Custom Labels",
		statusLabels: {
			inProgress: "Current",
			skipped: "Bypassed",
			completed: "Done",
			failed: "Error",
		},
	},
};

/**
 * Stepper with step filtering (excluding certain steps)
 */
export const WithFiltering = {
	args: {
		steps: onboardingSteps,
		currentStepId: 4,
		title: "Filtered Steps",
		filterConfig: {
			excludeStepIds: [5], // Exclude "Add Bank Account"
		},
	},
	render: (args) => (
		<Box>
			<Stepper {...args} />
			<Box mt="4" p="3" bg="gray.100" borderRadius="md" fontSize="sm">
				Note: Step 5 (Add Bank Account) is filtered out
			</Box>
		</Box>
	),
};

/**
 * Mobile responsive width
 */
export const MobileWidth = {
	args: {
		steps: onboardingSteps,
		currentStepId: 4,
		title: "Mobile View",
		width: "280px",
	},
};
