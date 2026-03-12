import { Box, Card, Text, VStack } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";
import type { VerificationService } from "../types";

interface ExecutorStepFormProps {
	/** Service configuration */
	service: VerificationService;
	/** Pre-computed parameter list for the Form component */
	parameterList: any[];
	/** Callback when valid form data is submitted */
	onSubmit: (_data: Record<string, any>) => void;
	/** Is this the final step in the workflow? */
	isLastStep: boolean;
	/** Submission loading state */
	isLoading: boolean;
	/** Initial data to prefill in the form (useful for transferring shared fields like 'pan_number' between steps) */
	initialData?: Record<string, any>;
}

/**
 * ExecutorStepForm - Renders the form for a single step within a workflow.
 * @param root0
 * @param root0.service
 * @param root0.parameterList
 * @param root0.onSubmit
 * @param root0.isLastStep
 * @param root0.isLoading
 * @param root0.initialData
 */
export const ExecutorStepForm = ({
	service,
	parameterList,
	onSubmit,
	isLastStep,
	isLoading,
	initialData = {},
}: ExecutorStepFormProps): JSX.Element => {
	const {
		register,
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: initialData,
	});

	const formValues = watch();

	// When moving to a new step, reset form with known shared keys to save user typing
	// (e.g., if step 1 asked for pan_number, step 2 might also require pan_number under the hood)
	useEffect(() => {
		// Filter initialData to only keys present in this step's parameterList
		const stepPrefill: Record<string, any> = {};
		parameterList.forEach((param) => {
			if (initialData[param.name] !== undefined) {
				stepPrefill[param.name] = initialData[param.name];
			}
		});

		reset(stepPrefill);
		// Note: Intentionally only running when service changes so we don't clobber user typing
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [service.serviceCode]);

	return (
		<Card p={6}>
			<Box mb={6}>
				<Text fontSize="xl" fontWeight="bold" color="gray.800" mb={2}>
					{service.name}
				</Text>
				{service.description && (
					<Text fontSize="sm" color="gray.600">
						{service.description}
					</Text>
				)}
			</Box>

			<Box as="form" onSubmit={handleSubmit(onSubmit)} w="100%">
				<VStack gap={6} align="stretch">
					{parameterList.length > 0 ? (
						<Form
							parameter_list={parameterList}
							register={register}
							control={control}
							errors={errors}
							formValues={formValues}
							size="md"
						/>
					) : (
						<Text color="gray.500" fontSize="sm" fontStyle="italic">
							No additional information required for this step.
						</Text>
					)}

					<Box mt={4}>
						<ActionButtonGroup
							buttonConfigList={[
								{
									type: "submit",
									label: isLastStep
										? "Finish Workflow"
										: "Next Step",
									loading: isLoading,
									disabled:
										isLoading ||
										(!isValid && parameterList.length > 0),
									icon: isLastStep
										? "check-circle"
										: "arrow-forward",
									iconStyle: { size: "sm" },
									width: "100%",
								},
							]}
						/>
					</Box>
				</VStack>
			</Box>
		</Card>
	);
};

export default ExecutorStepForm;
