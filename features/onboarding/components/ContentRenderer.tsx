import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import type { ComponentType, ReactNode } from "react";
import { Suspense, useMemo } from "react";
import type { OnboardingStep } from "../constants";
import LocalStepForm from "./LocalStepForm";
import AddBankAccountStep from "./custom/AddBankAccountStep";
import BusinessDetailsStep from "./custom/BusinessDetailsStep";
import DigilockerRedirectionStep from "./custom/DigilockerRedirectionStep";
import SecretPinStep from "./custom/SecretPinStep";
import SignAgreementStep from "./custom/SignAgreementStep";

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
};

/**
 * Props passed to custom onboarding components
 */
export interface CustomComponentProps {
	/** Current step configuration */
	stepConfig: OnboardingStep;
	/** Handler for form/step submission */
	onSubmit: (_data: { id: number; form_data?: Record<string, any> }) => void;
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
	/** Handler for skipping the step */
	onSkip?: (_stepId: number) => void;
	/** Loading state for API calls */
	isLoading?: boolean;
	/** Additional data to pass to custom components */
	additionalData?: Record<string, any>;
	/** Widget content to render when renderSource is "widget" or undefined */
	widgetContent?: ReactNode;
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
 * ContentRenderer - Handles conditional rendering of onboarding step content
 *
 * Determines what to render based on the step configuration:
 * 1. If renderSource is "local" and localRenderer.type is "form" -> renders LocalStepForm
 * 2. If renderSource is "local" and localRenderer.type is "custom" -> renders custom component
 * 3. If renderSource is "widget" or undefined -> renders widget content
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
 *   widgetContent={<ExternalOnboardingWidget {...widgetProps} />}
 * />
 * ```
 * @param {ContentRendererProps} props - Component props
 * @returns {JSX.Element} The rendered content based on step configuration
 */
const ContentRenderer = ({
	stepConfig,
	onSubmit,
	onSkip,
	isLoading = false,
	additionalData,
	widgetContent,
	fallbackContent,
}: ContentRendererProps): JSX.Element => {
	console.log("[ContentRenderer] Rendering with stepConfig:", stepConfig);
	/**
	 * Determine the content type to render
	 */
	const contentType = useMemo(() => {
		// If no stepConfig, check if we have widget content to show
		if (!stepConfig) {
			return widgetContent ? "widget" : "fallback";
		}

		// Check if this step should render locally
		if (stepConfig.renderSource === "local" && stepConfig.localRenderer) {
			return stepConfig.localRenderer.type; // "form" or "custom"
		}

		// Default to widget
		return "widget";
	}, [stepConfig, widgetContent]);

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
				<LocalStepForm
					stepConfig={stepConfig}
					onSubmit={onSubmit}
					onSkip={onSkip}
					isLoading={isLoading}
				/>
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
				<Suspense fallback={<LoadingFallback />}>
					<CustomComponent
						stepConfig={stepConfig}
						onSubmit={onSubmit}
						onSkip={onSkip}
						isLoading={isLoading}
						additionalData={additionalData}
					/>
				</Suspense>
			);

		case "widget":
			// Render widget content
			return <>{widgetContent}</>;

		case "fallback":
		default:
			// Render fallback content or empty state
			return (
				<>
					{fallbackContent ?? (
						<VStack justify="center" align="center" h="200px">
							<Text color="gray.400">No content available</Text>
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
