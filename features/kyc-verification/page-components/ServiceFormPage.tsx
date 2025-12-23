/**
 * ServiceFormPage - Dynamic form page for single or multi-service verification.
 * Renders form fields from requestParams and handles submission.
 * Form dynamically updates when services are removed.
 */

import { Box, Card, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { Button, PaddingBox, PageTitle } from "components";
import ActionButtonGroup from "components/ActionButtonGroup/ActionButtonGroup";
import { ParamType } from "constants/trxnFramework";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";
import { SelectedServicesPill } from "../components";
import { useKycServices, useServiceSelection } from "../hooks";
import type { FormField, RequestParam, VerificationService } from "../types";

interface ServiceFormPageProps {
	/** Service codes from the route */
	serviceCodes: string[];
}

/**
 * Map API parameter type to Form component's parameter_type_id.
 * @param type
 */
const mapTypeToParamType = (type: string): ParamType => {
	switch (type) {
		case "number":
			return ParamType.NUMERIC;
		case "date":
			return ParamType.FROM_DATE;
		case "array":
			return ParamType.TEXT; // Arrays handled as JSON text for now
		default:
			return ParamType.TEXT;
	}
};

/**
 * Convert API validations to react-hook-form validations.
 * @param param
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
 * Merge parameters from multiple services, keeping track of which service(s) require each param.
 * @param services
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
						...(existing.requiredBy || []),
						service.name,
					];
				}
			} else {
				// New param
				paramMap.set(param.name, {
					name: param.name,
					label: param.label,
					required: param.is_required === 1,
					parameter_type_id: mapTypeToParamType(param.type),
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
 * Service form page component.
 * @param root0
 * @param root0.serviceCodes
 */
export const ServiceFormPage = ({
	serviceCodes: initialServiceCodes,
}: ServiceFormPageProps): JSX.Element => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Local state to track active service codes - allows dynamic removal
	const [activeServiceCodes, setActiveServiceCodes] =
		useState<string[]>(initialServiceCodes);

	// Sync with initial service codes when they change (e.g., on navigation)
	useEffect(() => {
		setActiveServiceCodes(initialServiceCodes);
	}, [initialServiceCodes]);

	// Get services data
	const { loading, error, getServicesByCodes } = useKycServices();

	// Get selection state for validation
	const { removeService: removeFromGlobalState, resetAll } =
		useServiceSelection();

	// Get selected services from active codes (not URL codes)
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
		unregister,
		formState: { errors },
	} = useForm();

	const formValues = watch();

	// Handle service removal - updates local state and URL
	const handleRemoveService = useCallback(
		(serviceCode: string) => {
			// Remove from local active codes
			const newCodes = activeServiceCodes.filter(
				(code) => code !== serviceCode
			);

			// Also remove from global selection state
			removeFromGlobalState(serviceCode);

			if (newCodes.length === 0) {
				// No services left, redirect back to listing
				router.replace("/products/kyc-verification");
				return;
			}

			if (newCodes.length === 1) {
				// Only one service left, update URL to single service route
				router.replace(
					`/products/kyc-verification/${newCodes[0]}`,
					undefined,
					{ shallow: true }
				);
			} else {
				// Multiple services, update URL to reflect remaining services
				router.replace(
					`/products/kyc-verification/${newCodes.join("/")}`,
					undefined,
					{ shallow: true }
				);
			}

			// Update local state to trigger form re-render
			setActiveServiceCodes(newCodes);

			// Find fields that are no longer needed (only belonged to removed service)
			const removedService = selectedServiceObjects.find(
				(s) => s.serviceCode === serviceCode
			);
			if (removedService) {
				const remainingServices = selectedServiceObjects.filter(
					(s) => s.serviceCode !== serviceCode
				);
				const remainingParamNames = new Set<string>();
				remainingServices.forEach((service) => {
					service.requestParams.forEach((param) => {
						if (param.name !== "eko_tid") {
							remainingParamNames.add(param.name);
						}
					});
				});

				// Unregister fields that are no longer needed
				removedService.requestParams.forEach((param) => {
					if (!remainingParamNames.has(param.name)) {
						unregister(param.name);
					}
				});
			}
		},
		[
			activeServiceCodes,
			removeFromGlobalState,
			router,
			selectedServiceObjects,
			unregister,
		]
	);

	// Handle form submission
	const onSubmit = useCallback(
		async (data: Record<string, unknown>) => {
			setIsSubmitting(true);
			setSubmitError(null);

			try {
				// TODO: Implement actual API call for each service
				// For now, just log the data
				console.log("Form submitted with data:", data);
				console.log("Services to verify:", selectedServiceObjects);

				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Clear selection state after successful submission
				resetAll();

				// Navigate to results page (to be implemented in future phase)
				// For now, redirect back to listing
				router.push("/products/kyc-verification");
			} catch (err) {
				setSubmitError(
					"Failed to submit verification. Please try again."
				);
				console.error("Submission error:", err);
			} finally {
				setIsSubmitting(false);
			}
		},
		[selectedServiceObjects, resetAll, router]
	);

	// Handle back button
	const handleBack = () => {
		router.back();
	};

	// Loading state
	if (loading) {
		return (
			<PaddingBox>
				<PageTitle title="Verification Form" />
				<Flex justify="center" align="center" minH="200px">
					<Spinner size="lg" color="primary.DEFAULT" />
				</Flex>
			</PaddingBox>
		);
	}

	// Error state
	if (error) {
		return (
			<PaddingBox>
				<PageTitle title="Verification Form" />
				<Card p="6" bg="red.50">
					<Text color="red.600">{error}</Text>
				</Card>
			</PaddingBox>
		);
	}

	// No services found
	if (selectedServiceObjects.length === 0) {
		return (
			<PaddingBox>
				<PageTitle title="Verification Form" />
				<Card p="6">
					<VStack spacing="4">
						<Text>No services selected or services not found.</Text>
						<Button
							onClick={() =>
								router.push("/products/kyc-verification")
							}
						>
							Go to Services
						</Button>
					</VStack>
				</Card>
			</PaddingBox>
		);
	}

	const pageTitle =
		selectedServiceObjects.length === 1
			? selectedServiceObjects[0].name
			: `Verify ${selectedServiceObjects.length} Services`;

	return (
		<>
			<PageTitle title={pageTitle} />
			<Flex justify="center" w="100%">
				<Flex
					direction="column"
					gap="4"
					px={{ base: "4", md: "0" }}
					align="stretch"
					maxW="600px"
					w="100%"
				>
					{/* Selected services display - show when more than 1 service */}
					{selectedServiceObjects.length > 1 && (
						<Card p="6">
							<SelectedServicesPill
								services={selectedServiceObjects}
								onRemove={handleRemoveService}
								removable
							/>
						</Card>
					)}

					{/* Form Card */}
					<Card p="6">
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
											variant: "outline",
											label: "Back",
											onClick: handleBack,
											disabled: isSubmitting,
										},
										{
											type: "submit",
											label:
												selectedServiceObjects.length ===
												1
													? "Verify"
													: `Verify ${selectedServiceObjects.length} Services`,
											loading: isSubmitting,
											icon: "arrow-forward",
										},
									]}
								/>
							</VStack>
						</form>
					</Card>
				</Flex>
			</Flex>
		</>
	);
};

export default ServiceFormPage;
