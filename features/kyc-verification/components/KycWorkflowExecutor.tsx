import { Box, Flex, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { PaddingBox, PageTitle } from "components";
import Stepper from "components/Stepper/Stepper";
import { type StepItem, STEP_STATUS } from "components/Stepper/types";
import type { SerializedWorkflow } from "components/WorkflowBuilder/types";
import { linearizeWorkflow } from "components/WorkflowBuilder/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useKycServices } from "../hooks";
import { mergeServiceParams } from "../utils";
import { ExecutorStepForm } from "./ExecutorStepForm";

interface KycWorkflowExecutorProps {
	/** The serialized workflow to execute */
	workflow: SerializedWorkflow;
	/** Base path for navigation */
	basePath?: string;
}

/**
 * KycWorkflowExecutor - Executes a built workflow.
 * Transforms workflow nodes into a linear sequence of stepper steps and
 * renders the dynamic form for the current step.
 * @param {KycWorkflowExecutorProps} props - Component props
 * @param {SerializedWorkflow} props.workflow - The serialized workflow to execute
 * @param {string} [props.basePath] - Base path for navigation
 * @returns {JSX.Element} Workflow execution UI
 */
export const KycWorkflowExecutor = ({
	workflow,
	basePath = "/products/kyc-verification",
}: KycWorkflowExecutorProps): JSX.Element => {
	const router = useRouter();
	const toast = useToast();
	const { loading, error, getServicesByCodes } = useKycServices();

	// Linearly sequence nodes
	const orderedNodes = useMemo(
		() => linearizeWorkflow(workflow.nodes, workflow.edges),
		[workflow]
	);

	console.log("[KycWorkflow] Ordered Nodes for Execution:", orderedNodes);

	// Extract service codes logically required for execution
	// Use n.data.item.id (always the serviceCode) rather than n.id, which may
	// carry an old generated suffix (e.g. "27355_1773298967494") from prior formats.
	const serviceCodes = useMemo(
		() => orderedNodes.map((n) => n.data.item.id),
		[orderedNodes]
	);

	console.log("[KycWorkflow] Service Codes for Execution:", serviceCodes);

	// Fetch full service objects
	const services = useMemo(
		() => getServicesByCodes(serviceCodes),
		[getServicesByCodes, serviceCodes]
	);

	console.log("[KycWorkflow] Service Objects for Execution:", services);

	// Execution states
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [collectedData, setCollectedData] = useState<Record<string, any>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Track completion status to handle redirects safely
	const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);

	// Prepare steps for Stepper component
	const steps: StepItem[] = useMemo(() => {
		return orderedNodes.map((node, index) => {
			let status: StepItem["status"] = STEP_STATUS.NOT_STARTED;
			if (index < currentStepIndex) {
				status = STEP_STATUS.COMPLETED as any;
			} else if (index === currentStepIndex) {
				status = STEP_STATUS.IN_PROGRESS as any;
			}

			// Add visual distinction for final step
			const isLastStep = index === orderedNodes.length - 1;

			return {
				id: node.id,
				label: node.data.label || "Step",
				status,
				description: isLastStep ? "Final Step" : `Step ${index + 1}`,
				icon: node.data.item.icon,
			};
		});
	}, [orderedNodes, currentStepIndex]);

	// Current node/service context
	const currentServiceCode = serviceCodes[currentStepIndex];
	const currentService = services.find(
		(s) => s.serviceCode === currentServiceCode
	);

	const isLastStep = currentStepIndex === orderedNodes.length - 1;

	// True while services data hasn't arrived yet:
	// useApiFetch starts with loading=false before the first fetch call fires,
	// so we also treat an empty services list (with known service codes) as loading.
	const isServicesLoading =
		loading || (serviceCodes.length > 0 && services.length === 0);

	// Merge params into formFields
	const formFields = useMemo(() => {
		if (!currentService) return [];
		return mergeServiceParams([currentService]);
	}, [currentService]);

	// Convert to Form component parameter_list format
	const parameterList = useMemo(() => {
		return formFields.map((field) => ({
			name: field.name,
			label: field.label,
			required: field.required,
			parameter_type_id: field.parameter_type_id,
			validations: field.validations,
			helperText: field.helperText,
			placeholder: field.placeholder,
		}));
	}, [formFields]);

	// Handle successful step submission
	const handleStepSubmit = useCallback(
		(stepData: Record<string, any>) => {
			// Save data locally for the entire workflow
			const updatedCollectedData = {
				...collectedData,
				...stepData, // this assumes keys don't destructively overlap, or if they do it's intended (e.g. pan number)
			};
			setCollectedData(updatedCollectedData);

			if (isLastStep) {
				// We reached the end
				setIsSubmitting(true);

				// Prepare to redirect to results
				try {
					const verificationData = {
						formData: updatedCollectedData,
						services: services.map((s) => ({
							serviceCode: s.serviceCode,
							name: s.name,
							endpointPath: s.endpointPath,
							requestParams: s.requestParams,
						})),
						timestamp: Date.now(),
					};
					sessionStorage.setItem(
						"kyc_verification_data",
						JSON.stringify(verificationData)
					);

					// toast({
					// 	title: "Workflow completed",
					// 	status: "success",
					// 	duration: 2000,
					// });

					setIsWorkflowComplete(true);
				} catch (err) {
					console.error("Error storing verification data", err);
					toast({
						title: "Error finishing workflow",
						status: "error",
						duration: 3000,
					});
					setIsSubmitting(false);
				}
			} else {
				// Proceed to next step
				setCurrentStepIndex((prev) => prev + 1);
			}
		},
		[collectedData, isLastStep, services, toast]
	);

	// Effect to handle redirection when complete
	useEffect(() => {
		if (isWorkflowComplete) {
			router.replace(`${basePath}/results`);
		}
	}, [isWorkflowComplete, router, basePath]);

	// Loading/Error states
	if (isServicesLoading) {
		return (
			<PaddingBox>
				<PageTitle title={`${workflow.name}`} />
				<Flex justify="center" align="center" minH="200px">
					<Spinner size="lg" color="primary.DEFAULT" />
				</Flex>
			</PaddingBox>
		);
	}

	if (error) {
		return (
			<PaddingBox>
				<PageTitle title={`${workflow.name}`} />
				<Box p="6" bg="red.50" color="red.800" borderRadius="md">
					<Text>{error}</Text>
				</Box>
			</PaddingBox>
		);
	}

	if (orderedNodes.length === 0) {
		return (
			<PaddingBox>
				<PageTitle title={`${workflow.name}`} />
				<Box p="6" bg="orange.50" color="orange.800" borderRadius="md">
					<Text>
						This workflow has no steps. Add services in the builder
						before running.
					</Text>
				</Box>
			</PaddingBox>
		);
	}

	if (!currentService) {
		return (
			<PaddingBox>
				<PageTitle title={`${workflow.name}`} />
				<Box p="6" bg="red.50" color="red.800" borderRadius="md">
					<Text>
						Service &ldquo;{currentServiceCode}&rdquo; is no longer
						available. Please update the workflow.
					</Text>
				</Box>
			</PaddingBox>
		);
	}

	return (
		<Flex
			direction="column"
			w="100%"
			gap={{ base: 4, md: 8 }}
			pb={{ base: "100px", md: "0" }}
		>
			<PageTitle title={`${workflow.name}`} />

			<Flex
				direction={{ base: "column", md: "row" }}
				w="100%"
				gap={8}
				align="flex-start"
			>
				{/* Stepper Side */}
				<Box
					w={{ base: "100%", md: "300px" }}
					position={{ base: "static", md: "sticky" }}
					top={{ base: "auto", md: "100px" }}
				>
					<Stepper
						steps={steps}
						currentStepId={currentServiceCode}
						orientation="vertical"
						allowNavigation={false} // Disable back navigation since data is tied linearly for now
					/>
				</Box>

				{/* Form Side */}
				<Box flex="1" maxW="600px" w="100%">
					<VStack gap={6} align="stretch" w="100%">
						<ExecutorStepForm
							service={currentService}
							parameterList={parameterList}
							onSubmit={handleStepSubmit}
							isLastStep={isLastStep}
							isLoading={isSubmitting}
							initialData={collectedData} // Prefill data if keys overlap (e.g. they already typed 'pan_number')
						/>
					</VStack>
				</Box>
			</Flex>
		</Flex>
	);
};

export default KycWorkflowExecutor;
