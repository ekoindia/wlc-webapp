import { Box, Text } from "@chakra-ui/react";
import { STEP_STATUS, Stepper } from "./index";

export default {
	title: "Components/Stepper",
	component: Stepper,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: ["responsive", "horizontal", "vertical"],
			description:
				"Orientation of the stepper. 'responsive' (default) shows vertical on large screens, horizontal on small",
		},
		allowNavigation: {
			control: "boolean",
			description: "Whether to allow clicking on completed steps",
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

const stepsWithIcons = [
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
	{
		id: 4,
		label: "Checkout",
		description: "Confirm your order",
		status: STEP_STATUS.NOT_STARTED,
		icon: "check",
	},
];

/**
 * Default stepper showing onboarding progress with responsive orientation
 */
export const Default = {
	args: {
		steps: onboardingSteps,
		currentStepId: 4,
		orientation: "responsive",
	},
};

/**
 * Stepper with all step statuses demonstrated
 */
export const AllStatuses = {
	args: {
		steps: mixedStatusSteps,
		currentStepId: 3,
		orientation: "vertical",
	},
};

/**
 * Stepper with icons and descriptions (modern checkout flow)
 */
export const WithIcons = {
	args: {
		steps: stepsWithIcons,
		currentStepId: 2,
		orientation: "horizontal",
	},
	render: (args) => (
		<Box w="600px" p="6" bg="gray.900" borderRadius="lg">
			<Stepper {...args} />
		</Box>
	),
};

/**
 * Vertical orientation stepper with descriptions
 */
export const VerticalWithDescriptions = {
	args: {
		steps: stepsWithIcons,
		currentStepId: 2,
		orientation: "vertical",
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
	},
};

/**
 * Stepper with custom status colors
 */
export const CustomStatusColors = {
	args: {
		steps: mixedStatusSteps,
		currentStepId: 3,
		orientation: "vertical",
		statusColors: {
			completed: "green.500",
			failed: "red.600",
			skipped: "gray.400",
			inProgress: "blue.500",
			notStarted: "gray.200",
		},
	},
};

/**
 * Stepper with navigation enabled (clickable completed steps)
 */
export const WithNavigation = {
	args: {
		steps: onboardingSteps,
		currentStepId: 4,
		allowNavigation: true,
		onStepClick: (step, index) => {
			alert(`Clicked step ${index + 1}: ${step.label}`);
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
 * Horizontal orientation (always horizontal)
 */
export const AlwaysHorizontal = {
	args: {
		steps: onboardingSteps.slice(0, 4),
		currentStepId: 2,
		orientation: "horizontal",
	},
	render: (args) => (
		<Box w="700px">
			<Text mb="4" fontSize="sm" color="gray.600">
				This stepper will always be horizontal regardless of screen size
			</Text>
			<Stepper {...args} />
		</Box>
	),
};

/**
 * Vertical orientation (always vertical)
 */
export const AlwaysVertical = {
	args: {
		steps: onboardingSteps,
		currentStepId: 4,
		orientation: "vertical",
	},
	render: (args) => (
		<Box w="300px">
			<Text mb="4" fontSize="sm" color="gray.600">
				This stepper will always be vertical regardless of screen size
			</Text>
			<Stepper {...args} />
		</Box>
	),
};
