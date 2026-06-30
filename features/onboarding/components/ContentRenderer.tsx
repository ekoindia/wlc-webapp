import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import type { ComponentType, ReactNode } from "react";
import { Suspense, useMemo } from "react";
import type { OnboardingStep } from "../constants";
import ContentSkeleton from "./ContentSkeleton";
import LocalStepForm from "./LocalStepForm";
import AddBankAccountStep from "./custom/AddBankAccountStep";
import BusinessDetailsStep from "./custom/BusinessDetailsStep";
import DigilockerRedirectionStep from "./custom/DigilockerRedirectionStep";
import SecretPinStep from "./custom/SecretPinStep";
import SignAgreementStep from "./custom/SignAgreementStep";
import VideoKycStep from "./custom/VideoKycStep";

/**
 * Registry of custom onboarding components
 * Maps component names to their component references
 */
const CUSTOM_COMPONENT_REGISTRY: Record<
	string,
	ComponentType<CustomComponentProps>
> = {
	// Add custom components here as they are created
	AddBankAccountStep: AddBankAccountStep,
	BusinessDetailsStep: BusinessDetailsStep,
	DigilockerRedirectionStep: DigilockerRedirectionStep,
	SecretPinStep: SecretPinStep,
	SignAgreementStep: SignAgreementStep,
	VideoKycStep: VideoKycStep,
};

/**
 * Props passed to custom onboarding components
 */
export interface CustomComponentProps {
	/** Current step configuration */
	stepConfig: OnboardingStep;
	/** Handler for form/step submission */
	onSubmit: (_data: { id: number; form_data?: Record<string, any> }) => void;
	/** Handler for advancing to next step after success validation */
	onAdvance: (_stepId: number) => void;
	/** Handler for skipping the step */
	onSkip?: (_stepId: number) => void;
	/** Loading state for actions */
	isLoading?: boolean;
	/** Any additional data passed to the component */
	additionalData?: Record<string, any>;
}

/**
 * Props for the ContentRenderer component
 */
export interface ContentRendererProps {
	/** Current step configuration from masterOnboardingSteps */
	stepConfig?: OnboardingStep;
	/** Handler for form/step submission */
	onSubmit: (_data: { id: number; form_data?: Record<string, any> }) => void;
	/** Handler for advancing to next step after success validation */
	onAdvance: (_stepId: number) => void;
	/** Handler for skipping the step */
	onSkip?: (_stepId: number) => void;
	/** Loading state for API calls */
	isLoading?: boolean;
	/** Additional data to pass to custom components */
	additionalData?: Record<string, any>;
	/** Fallback content when no step config is provided */
	fallbackContent?: ReactNode;
}

/**
 * Loading fallback component
 * @returns {JSX.Element} Loading spinner with message
 */
const LoadingFallback = (): JSX.Element => (
	<VStack justify="center" align="center" h="200px" gap={4}>
		<Spinner size="lg" color="primary.DEFAULT" />
		<Text color="gray.500" fontSize="sm">
			Loading...
		</Text>
	</VStack>
);

/**
 * Renders an org-configured instruction message above a step.
 * Text is rendered as plain text (never HTML) since it comes from org config.
 * @param {object} props - Component props
 * @param {string} [props.text] - Instruction text from `stepConfig.orgConfig.instruction`
 * @returns {JSX.Element | null} The banner, or null when there is no instruction
 */
const StepInstruction = ({ text }: { text?: string }): JSX.Element | null => {
	if (!text) return null;
	return (
		<Box
			mb={4}
			p={3}
			borderWidth="1px"
			borderColor="blue.200"
			bg="blue.50"
			borderRadius="md"
			role="note"
		>
			<Text fontSize="sm" color="blue.800">
				{text}
			</Text>
		</Box>
	);
};

/**
 * ContentRenderer - Handles conditional rendering of onboarding step content
 *
 * All steps are rendered locally via the stepConfig.localRenderer configuration.
 * 1. If localRenderer.type is "form" -> renders LocalStepForm
 * 2. If localRenderer.type is "custom" -> renders custom component
 * 3. Otherwise -> renders fallback content
 *
 * This component centralizes the rendering logic for all onboarding content types,
 * making it easier to manage and extend.
 * @example
 * ```tsx
 * <ContentRenderer
 *   stepConfig={currentStepConfig}
 *   onSubmit={handleStepDataSubmit}
 *   onSkip={handleOnboardingSkip}
 *   isLoading={state?.ui?.apiInProgress}
 * />
 * ```
 * @param {ContentRendererProps} props - Component props
 * @returns {JSX.Element} The rendered content based on step configuration
 */
const ContentRenderer = ({
	stepConfig,
	onSubmit,
	onAdvance,
	onSkip,
	isLoading = false,
	additionalData,
	fallbackContent,
}: ContentRendererProps): JSX.Element => {
	console.log("[ContentRenderer] Rendering with stepConfig:", stepConfig);
	/**
	 * Determine the content type to render
	 */
	const contentType = useMemo(() => {
		// If no stepConfig, return fallback
		if (!stepConfig) {
			return "fallback";
		}

		// Check if localRenderer is configured
		if (stepConfig.localRenderer) {
			return stepConfig.localRenderer.type; // "form" or "custom"
		}

		// Default to fallback when no localRenderer config
		return "fallback";
	}, [stepConfig]);

	/**
	 * Get the custom component if type is "custom"
	 */
	const CustomComponent = useMemo(() => {
		if (contentType !== "custom" || !stepConfig?.localRenderer?.component) {
			return null;
		}

		const componentName = stepConfig.localRenderer.component;
		const Component = CUSTOM_COMPONENT_REGISTRY[componentName];

		if (!Component) {
			console.warn(
				`[ContentRenderer] Custom component "${componentName}" not found in registry`
			);
			return null;
		}

		return Component;
	}, [contentType, stepConfig?.localRenderer?.component]);

	// Render based on content type
	switch (contentType) {
		case "form":
			// Render local form using LocalStepForm
			if (!stepConfig) return <>{fallbackContent}</>;
			return (
				<>
					<StepInstruction text={stepConfig.orgConfig?.instruction} />
					<LocalStepForm
						stepConfig={stepConfig}
						onSubmit={onSubmit}
						onAdvance={onAdvance}
						onSkip={onSkip}
						isLoading={isLoading}
					/>
				</>
			);

		case "custom":
			// Render custom component from registry
			if (!CustomComponent || !stepConfig) {
				return (
					<Box p={4} color="orange.500">
						<Text fontWeight="semibold">
							Custom component not available
						</Text>
						<Text fontSize="sm" color="gray.500">
							Component "{stepConfig?.localRenderer?.component}"
							is not registered.
						</Text>
					</Box>
				);
			}
			return (
				<>
					<StepInstruction text={stepConfig.orgConfig?.instruction} />
					<Suspense fallback={<LoadingFallback />}>
						<CustomComponent
							stepConfig={stepConfig}
							onSubmit={onSubmit}
							onAdvance={onAdvance}
							onSkip={onSkip}
							isLoading={isLoading}
							additionalData={additionalData}
						/>
					</Suspense>
				</>
			);

		case "fallback":
		default:
			// Render fallback content or empty state
			return (
				<>
					{fallbackContent ?? (
						<VStack justify="center" align="center" h="200px">
							<ContentSkeleton />
						</VStack>
					)}
				</>
			);
	}
};

/**
 * Register a custom component for use in onboarding steps
 *
 * Call this function to add custom components to the registry.
 * Components should match the CustomComponentProps interface.
 * @param {string} name - The component name (matches localRenderer.component in step config)
 * @param {ComponentType<CustomComponentProps>} component - The component to register
 * @example
 * ```tsx
 * // In your app initialization or a dedicated registry file:
 * import { registerCustomComponent } from 'features/onboarding/components/ContentRenderer';
 * import SignAgreementPage from './custom/SignAgreementPage';
 *
 * registerCustomComponent('SignAgreementPage', SignAgreementPage);
 * ```
 */
export const registerCustomComponent = (
	name: string,
	component: ComponentType<CustomComponentProps>
): void => {
	CUSTOM_COMPONENT_REGISTRY[name] = component;
};

/**
 * Get list of registered custom component names
 * @returns {string[]} Array of registered component names
 */
export const getRegisteredComponents = (): string[] => {
	return Object.keys(CUSTOM_COMPONENT_REGISTRY);
};

export default ContentRenderer;
