import { Box, useToast, VStack } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";
import type { OnboardingStep } from "../constants";
import { useOnboardingContext } from "../context";

/**
 * Props for LocalStepForm component
 */
interface LocalStepFormProps {
	/** Step configuration with localRenderer */
	stepConfig: OnboardingStep;
	/** Called when form is submitted with valid data */
	onSubmit: (_data: { id: number; form_data: Record<string, any> }) => void;
	/** Called when step success is confirmed and ready to advance */
	onAdvance: (_stepId: number) => void;
	/** Called when skip button is clicked */
	onSkip?: (_stepId: number) => void;
	/** Loading state for buttons */
	isLoading?: boolean;
}

/**
 * LocalStepForm - Renders a local form for onboarding steps.
 *
 * This component acts as a bridge between the configuration-driven onboarding steps
 * and the `tf-components` Form engine. It manages form state using react-hook-form,
 * transforms the submission data to match the pipeline executor's expectations,
 * and watches its own step result from pipelineResults to call onAdvance when success is confirmed.
 * @param {LocalStepFormProps} props - Component props
 * @returns {JSX.Element} The rendered form component
 */
const LocalStepForm = ({
	stepConfig,
	onSubmit,
	onAdvance,
	onSkip,
	isLoading = false,
}: LocalStepFormProps) => {
	const toast = useToast();
	const { pipelineResults } = useOnboardingContext();
	const lastProcessedResultRef = useRef<any>(null);

	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const formValues = watch();

	/**
	 * Form fields to render, after applying org-metadata overrides.
	 *
	 * `LocalStepForm` is the generic form-step renderer, so it whitelists two generic
	 * keys off `stepConfig.orgConfig?.props` (the org-metadata "flag bag"), matched by
	 * field `name` — the form-step analog of the custom bank step's `hidePassbook` /
	 * `passbookOptional`:
	 * - `hideFields: string[]` — drops those fields entirely (not rendered, so no value
	 *   is captured or submitted for them).
	 * - `optionalFields: string[]` — relaxes only `required` to `false`; other field
	 *   validations (e.g. `pattern`) still apply.
	 *
	 * NOTE: hiding a field whose value the pipeline/API still expects can submit
	 * incomplete data — hiding must match pipeline/API expectations (e.g. hiding PAN's
	 * `pan_image` sends a number-only PAN, which the backend must accept).
	 */
	const formFields = useMemo(() => {
		const fields = stepConfig.localRenderer?.formFields ?? [];
		const orgProps = stepConfig.orgConfig?.props ?? {};
		const hideFields = Array.isArray(orgProps.hideFields)
			? orgProps.hideFields
			: [];
		const optionalFields = Array.isArray(orgProps.optionalFields)
			? orgProps.optionalFields
			: [];

		return fields
			.filter((field) => !hideFields.includes(field.name))
			.map((field) =>
				optionalFields.includes(field.name)
					? { ...field, required: false }
					: field
			);
	}, [stepConfig.localRenderer?.formFields, stepConfig.orgConfig?.props]);

	// Determine if step can be skipped (not required)
	const canSkip = !stepConfig.isRequired && onSkip;

	/**
	 * Watch this step's pipeline result and call onAdvance when success is confirmed
	 * Each step watches its own result from pipelineResults[stepConfig.id]
	 * Uses lastProcessedResultRef to track the last processed result and prevent duplicate toasts
	 */
	useEffect(() => {
		const result = pipelineResults[stepConfig.id];
		// Skip if no result or if we've already processed this exact result object
		if (!result || result === lastProcessedResultRef.current) return;

		// Check pipeline status (not individual response_type_id)
		if (result.status === "success") {
			// Success confirmed - advance to next step
			lastProcessedResultRef.current = result;
			toast({
				title: stepConfig.success_message || "Success",
				status: "success",
				duration: 2000,
			});
			onAdvance(stepConfig.id);
		} else if (result.status === "failed") {
			// Pipeline failed - show error from first failed API
			lastProcessedResultRef.current = result;
			const failedApi = result.list.find(
				(api) => api.status === "failed"
			);
			const errorMsg =
				failedApi?.response?.message ||
				"Verification failed. Please check your details and try again.";
			toast({
				title: errorMsg,
				status: "error",
				duration: 5000,
			});
		}
	}, [
		pipelineResults,
		stepConfig.id,
		stepConfig.success_message,
		onAdvance,
		toast,
	]);

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
				<ActionButtonGroup
					isFixedOnMobile={false}
					buttonConfigList={[
						{
							type: "submit",
							label: stepConfig.primaryCTAText || "Submit",
							loading: isLoading,
							disabled: isLoading,
						},
						...(canSkip
							? [
									{
										type: "button",
										variant: "link",
										label: "Skip",
										disabled: isLoading,
										onClick: () => onSkip?.(stepConfig.id),
										styles: {
											color: "primary.DEFAULT",
											bg: { base: "white", md: "none" },
											h: { base: "64px", md: "64px" },
											w: { base: "100%", md: "auto" },
											_hover: { textDecoration: "none" },
										},
									},
								]
							: []),
					]}
				/>
			</VStack>
		</Box>
	);
};

export default LocalStepForm;
