import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";
import type { OnboardingStep } from "../constants";

/**
 * Props for LocalStepForm component
 */
interface LocalStepFormProps {
	/** Step configuration with localRenderer */
	stepConfig: OnboardingStep;
	/** Called when form is submitted with valid data */
	onSubmit: (_data: { id: number; form_data: Record<string, any> }) => void;
	/** Called when skip button is clicked */
	onSkip?: (_stepId: number) => void;
	/** Loading state for buttons */
	isLoading?: boolean;
}

/**
 * LocalStepForm - Renders a local form for onboarding steps.
 *
 * This component acts as a bridge between the configuration-driven onboarding steps
 * and the `tf-components` Form engine. It manages form state using react-hook-form
 * and transforms the submission data to match the pipeline executor's expectations.
 * @param {LocalStepFormProps} props - Component props
 * @returns {JSX.Element} The rendered form component
 */
const LocalStepForm = ({
	stepConfig,
	onSubmit,
	onSkip,
	isLoading = false,
}: LocalStepFormProps) => {
	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const formValues = watch();

	// Get form fields from localRenderer config
	const formFields = stepConfig.localRenderer?.formFields ?? [];

	// Determine if step can be skipped (not required)
	const canSkip = !stepConfig.isRequired && onSkip;

	/**
	 * Handle form submission - transforms data to pipeline format
	 * @param {Record<string, any>} _data - Form data from react-hook-form
	 * @returns {void}
	 */
	const handleFormSubmit = (_data: Record<string, any>) => {
		console.log("[LocalStepForm] Form submitted:", _data);

		// Submit in the format expected by handleStepDataSubmit
		onSubmit({
			id: stepConfig.id,
			form_data: _data,
		});
	};

	return (
		<Box as="form" onSubmit={handleSubmit(handleFormSubmit)} w="100%">
			<VStack gap={6} align="stretch">
				{/* Step label */}
				<Box fontSize="lg" fontWeight="bold" color="gray.800">
					{stepConfig.label}
				</Box>

				{/* Step description */}
				<Box fontSize="sm" color="gray.600">
					{stepConfig.description}
				</Box>

				{/* Dynamic form fields */}
				<Form
					parameter_list={formFields}
					register={register}
					control={control}
					errors={errors}
					formValues={formValues}
				/>

				{/* Action buttons */}
				<HStack gap={4} w="100%" justifyContent="flex-end">
					{/* Skip button - only shown if step is not required */}
					{canSkip && (
						<Button
							type="button"
							variant="outline"
							colorScheme="gray"
							size="lg"
							onClick={() => onSkip && onSkip(stepConfig.id)}
							isDisabled={isLoading}
						>
							Skip
						</Button>
					)}

					{/* Submit button */}
					<Button
						type="submit"
						colorScheme="primary"
						size="lg"
						flex={canSkip ? undefined : 1}
						isLoading={isLoading}
						isDisabled={isLoading}
					>
						{stepConfig.primaryCTAText || "Submit"}
					</Button>
				</HStack>
			</VStack>
		</Box>
	);
};

export default LocalStepForm;
