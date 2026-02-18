/**
 * ServiceFormPageModal - Modal-specific variant of ServiceFormPage.
 * Designed for use within RetryFormModal, with callback-based submission.
 * Does not navigate - instead calls onSubmitComplete with results.
 */

import {
	Alert,
	AlertIcon,
	Box,
	Card,
	Flex,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Button } from "components";
import ActionButtonGroup from "components/ActionButtonGroup/ActionButtonGroup";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";
import { useKycServices, useKycVerification } from "../hooks";
import type {
	FormField,
	RequestParam,
	VerificationResult,
	VerificationService,
} from "../types";

interface ServiceFormPageModalProps {
	/** Service codes to render form for */
	serviceCodes: string[];
	/** Initial form data to prefill */
	initialFormData?: Record<string, unknown>;
	/** Whether this is a retry mode */
	isRetryMode?: boolean;
	/** Callback when verification completes with results */
	onSubmitComplete: (_results: VerificationResult[]) => void;
	/** Callback when user cancels */
	onCancel: () => void;
	/** Callback when form data is edited (for tracking changes) */
	onFormDataChange?: (_formData: Record<string, unknown>) => void;
	/** Base path for navigation (not used in modal, kept for compatibility) */
	basePath?: string;
}

/**
 * Converts API validations to react-hook-form validation rules.
 * @param {RequestParam} param - The request parameter with validation rules
 * @returns {FormField['validations'] | undefined} React-hook-form compatible validation object or undefined
 */
const mapValidations = (
	param: RequestParam
): FormField["validations"] | undefined => {
	const validations: FormField["validations"] = {};

	if (param.is_required) {
		validations.required = `${param.label} is required`;
	}

	if (param.validations) {
		if (param.validations.pattern) {
			validations.pattern = {
				value: new RegExp(param.validations.pattern),
				message: `Invalid ${param.label} format`,
			};
		}
		if (param.validations.minLength) {
			validations.minLength = {
				value: param.validations.minLength,
				message: `${param.label} must be at least ${param.validations.minLength} characters`,
			};
		}
		if (param.validations.maxLength) {
			validations.maxLength = {
				value: param.validations.maxLength,
				message: `${param.label} must be at most ${param.validations.maxLength} characters`,
			};
		}
		if (param.validations.min !== undefined) {
			validations.min = {
				value: param.validations.min,
				message: `${param.label} must be at least ${param.validations.min}`,
			};
		}
		if (param.validations.max !== undefined) {
			validations.max = {
				value: param.validations.max,
				message: `${param.label} must be at most ${param.validations.max}`,
			};
		}
	}

	return Object.keys(validations).length > 0 ? validations : undefined;
};

/**
 * Merges parameters from multiple services, tracking which service(s) require each param.
 * Deduplicates parameters by name and aggregates requiredBy arrays.
 * @param {VerificationService[]} services - Array of services to merge parameters from
 * @returns {FormField[]} Deduplicated array of form fields with requiredBy metadata
 */
const mergeServiceParams = (services: VerificationService[]): FormField[] => {
	const paramMap = new Map<string, FormField>();

	services.forEach((service) => {
		service.requestParams.forEach((param) => {
			// Skip internal params like eko_tid
			if (param.name === "eko_tid") return;

			if (paramMap.has(param.name)) {
				// Param already exists, add this service to requiredBy
				const existing = paramMap.get(param.name)!;
				if (!existing.requiredBy?.includes(service.name)) {
					existing.requiredBy = [
						...(existing.requiredBy ?? []),
						service.name,
					];
				}
			} else {
				// New param
				paramMap.set(param.name, {
					name: param.name,
					label: param.label,
					required: param.is_required === 1,
					parameter_type_id: param.type,
					validations: mapValidations(param),
					helperText:
						services.length > 1
							? `Required by: ${service.name}`
							: undefined,
					placeholder: param.placeholder,
					requiredBy: [service.name],
				});
			}
		});
	});

	return Array.from(paramMap.values());
};

/**
 * Modal-specific variant of ServiceFormPage for retry functionality.
 * Executes verification and calls onSubmitComplete with results.
 * Does not use router navigation.
 * @param {ServiceFormPageModalProps} props - Component props
 * @returns {JSX.Element} Rendered form within modal body
 */
export const ServiceFormPageModal = ({
	serviceCodes: initialServiceCodes,
	initialFormData,
	isRetryMode = false,
	onSubmitComplete,
	onCancel,
	onFormDataChange,
	basePath: _basePath,
}: ServiceFormPageModalProps): JSX.Element => {
	const [submitError, setSubmitError] = useState<string | null>(null);

	// NEW: Use a ref to track the last data sent to parent to prevent loops
	const lastNotifiedDataRef = useRef<string>("");
	// NEW: Track if we have already prefilled the form
	const hasPrefilledRef = useRef(false);

	// Local state to track active service codes
	const [activeServiceCodes, setActiveServiceCodes] =
		useState<string[]>(initialServiceCodes);

	// Sync with initial service codes when they change
	useEffect(() => {
		setActiveServiceCodes(initialServiceCodes);
	}, [initialServiceCodes]);

	// Get services data
	const { loading, error, getServicesByCodes } = useKycServices();

	// Get verification hook for API calls
	const { state, startVerification, isVerifying, progressText, reset } =
		useKycVerification();

	// Get selected services from active codes
	const selectedServiceObjects = useMemo(
		() => getServicesByCodes(activeServiceCodes),
		[getServicesByCodes, activeServiceCodes]
	);

	// Merge form fields from all selected services
	const formFields = useMemo(
		() => mergeServiceParams(selectedServiceObjects),
		[selectedServiceObjects]
	);

	// Convert to Form component parameter_list format
	const parameterList = useMemo(
		() =>
			formFields.map((field) => ({
				name: field.name,
				label: field.label,
				required: field.required,
				parameter_type_id: field.parameter_type_id,
				validations: field.validations,
				helperText: field.helperText,
				placeholder: field.placeholder,
			})),
		[formFields]
	);

	// Form handling
	const {
		register,
		control,
		handleSubmit,
		watch,
		reset: resetForm,
		formState: { errors, isValid, isDirty },
	} = useForm({
		defaultValues: initialFormData ?? {},
	});

	const formValues = watch();

	// Prefill form with initial data after fields are registered
	useEffect(() => {
		if (
			initialFormData &&
			formFields.length > 0 &&
			!hasPrefilledRef.current
		) {
			resetForm(initialFormData);
			hasPrefilledRef.current = true; // Mark as done

			// Small delay to ensure form fields are registered
			// const timer = setTimeout(() => {
			// 	resetForm(initialFormData);
			// }, 100);
			// return () => clearTimeout(timer);
		}
	}, [initialFormData, resetForm, formFields.length]);

	// Track form data changes and notify parent
	useEffect(() => {
		if (
			onFormDataChange &&
			formValues &&
			Object.keys(formValues).length > 0
		) {
			const currentDataString = JSON.stringify(formValues);

			// Only notify parent if the data is actually different from last time
			if (
				currentDataString !== lastNotifiedDataRef.current &&
				Object.keys(formValues).length > 0
			) {
				lastNotifiedDataRef.current = currentDataString;
				onFormDataChange(formValues);
			}

			// onFormDataChange(formValues);
		}
	}, [formValues, onFormDataChange]);

	// Watch for verification completion
	useEffect(() => {
		if (state.status === "completed" && state.results.length > 0) {
			// Pass results back to parent
			onSubmitComplete(state.results);
			// Reset verification state for potential future use
			reset();
		}
	}, [state.status, state.results, onSubmitComplete, reset]);

	// Handle "Clear All" button - reset form to empty values
	const handleClearAll = useCallback(() => {
		const emptyValues: Record<string, string> = {};
		formFields.forEach((field) => {
			emptyValues[field.name] = "";
		});
		resetForm(emptyValues);
	}, [resetForm, formFields]);

	// Handle service removal - updates local state only (no URL changes in modal)
	// const handleRemoveService = useCallback(
	// 	(serviceCode: string) => {
	// 		const newCodes = activeServiceCodes.filter(
	// 			(code) => code !== serviceCode
	// 		);

	// 		if (newCodes.length === 0) {
	// 			// No services left, close modal
	// 			onCancel();
	// 			return;
	// 		}

	// 		// Find fields that are no longer needed BEFORE updating state
	// 		const removedService = selectedServiceObjects.find(
	// 			(s) => s.serviceCode === serviceCode
	// 		);
	// 		if (removedService) {
	// 			const remainingServicesForFields =
	// 				selectedServiceObjects.filter(
	// 					(s) => s.serviceCode !== serviceCode
	// 				);
	// 			const remainingParamNames = new Set<string>();
	// 			remainingServicesForFields.forEach((service) => {
	// 				service.requestParams.forEach((param) => {
	// 					if (param.name !== "eko_tid") {
	// 						remainingParamNames.add(param.name);
	// 					}
	// 				});
	// 			});

	// 			// Unregister and clear fields that are only in the removed service
	// 			removedService.requestParams.forEach((param) => {
	// 				if (!remainingParamNames.has(param.name)) {
	// 					unregister(param.name);
	// 				}
	// 			});
	// 		}

	// 		// Update local state to trigger form re-render with updated formFields
	// 		setActiveServiceCodes(newCodes);
	// 	},
	// 	[activeServiceCodes, selectedServiceObjects, unregister, onCancel]
	// );

	// Handle form submission - start verification directly
	const onSubmit = useCallback(
		async (data: Record<string, unknown>) => {
			setSubmitError(null);

			try {
				// Build service objects with required info for verification
				const servicesToVerify = selectedServiceObjects.map((s) => ({
					serviceCode: s.serviceCode,
					name: s.name,
					endpointPath: s.endpointPath,
					requestParams: s.requestParams,
				})) as VerificationService[];

				// Start verification - results will be handled in useEffect
				await startVerification(servicesToVerify, data);
			} catch (err) {
				setSubmitError(
					"Failed to start verification. Please try again."
				);
				console.error("Submission error:", err);
			}
		},
		[selectedServiceObjects, startVerification]
	);

	// Loading state
	if (loading) {
		return (
			<Flex justify="center" align="center" minH="200px" p={6}>
				<Spinner size="lg" color="primary.DEFAULT" />
			</Flex>
		);
	}

	// Error state
	if (error) {
		return (
			<Box p={6}>
				<Card p="6" bg="red.50">
					<Text color="red.600">{error}</Text>
				</Card>
			</Box>
		);
	}

	// No services found
	if (selectedServiceObjects.length === 0) {
		return (
			<Box p={6}>
				<VStack spacing="4">
					<Text>No services selected or services not found.</Text>
					<Button onClick={onCancel}>Close</Button>
				</VStack>
			</Box>
		);
	}

	// Verifying state
	if (isVerifying) {
		return (
			<Flex
				direction="column"
				justify="center"
				align="center"
				minH="200px"
				p={6}
				gap={4}
			>
				<Spinner size="lg" color="primary.DEFAULT" />
				<Text fontWeight="medium" color="gray.700">
					Verifying {progressText}...
				</Text>
				<Text fontSize="sm" color="gray.500">
					Please wait while we verify your services.
				</Text>
			</Flex>
		);
	}

	return (
		<Flex direction="column" gap="4" p={6}>
			{/* Selected services display - show when more than 1 service */}
			{/* {selectedServiceObjects.length > 1 && (
				<Card p="4">
					<SelectedServicesPill
						services={selectedServiceObjects}
						onRemove={handleRemoveService}
						removable
					/>
				</Card>
			)} */}

			{/* Form */}
			<Box>
				{selectedServiceObjects.length === 1 && (
					<Text fontSize="sm" color="gray.500" mb="4">
						{selectedServiceObjects[0].description}
					</Text>
				)}

				{submitError && (
					<Box
						p="3"
						bg="red.50"
						color="red.800"
						borderRadius="md"
						borderLeft="4px"
						borderLeftColor="red.500"
						mb="4"
					>
						<Text fontWeight="medium">{submitError}</Text>
					</Box>
				)}

				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing="6" align="stretch">
						{/* Retry Mode Banner */}
						{isRetryMode && (
							<Alert status="info" borderRadius="md">
								<AlertIcon />
								<Box flex="1">
									<Text fontSize="sm" fontWeight="medium">
										Retrying failed verifications
									</Text>
									<Text fontSize="xs" color="gray.600">
										Review and update the values if needed
										before submitting.
									</Text>
								</Box>
								<Button
									size="sm"
									variant="outline"
									onClick={handleClearAll}
								>
									Clear All
								</Button>
							</Alert>
						)}

						<Form
							parameter_list={parameterList}
							register={register}
							control={control}
							errors={errors}
							formValues={formValues}
							size="md"
						/>

						<ActionButtonGroup
							buttonConfigList={[
								{
									type: "submit",
									label:
										selectedServiceObjects.length === 1
											? "Verify"
											: `Verify ${selectedServiceObjects.length} Services`,
									loading: isVerifying,
									disabled:
										!isValid || (!isDirty && !isRetryMode),
									icon: "verified-user",
									iconStyle: { size: "sm" },
								},
								{
									variant: "link",
									label: "Cancel",
									onClick: onCancel,
									disabled: isVerifying,
									styles: {
										color: "primary.DEFAULT",
										bg: { base: "white", md: "none" },
										h: { base: "64px", md: "64px" },
										w: { base: "100%", md: "auto" },
										_hover: {
											textDecoration: "none",
										},
									},
								},
							]}
						/>
					</VStack>
				</form>
			</Box>
		</Flex>
	);
};

export default ServiceFormPageModal;
