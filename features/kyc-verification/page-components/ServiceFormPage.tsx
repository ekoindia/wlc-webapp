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
	/** Base path for navigation (defaults to /products/kyc-verification) */
	basePath?: string;
}

/**
 * Maps API parameter type to Form component's parameter_type_id.
 * @param {string} type - The API parameter type ('number' | 'date' | 'array' | 'string')
 * @returns {ParamType} Form component parameter type enum value
 */
const mapTypeToParamType = (type: string): ParamType => {
	switch (type) {
		case "number":
			return ParamType.NUMERIC;
		case "date":
			return ParamType.DATETIME;
		case "array":
			return ParamType.TEXT; // Arrays handled as JSON text for now
		default:
			return ParamType.TEXT;
	}
};

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
 * Dynamic form page for single or multi-service KYC verification.
 * Renders form fields from requestParams and handles submission to verification results.
 * @param {ServiceFormPageProps} props - Component props
 * @param {string[]} props.serviceCodes - Service codes from the route to render form for
 * @param {string} [props.basePath] - Base path for navigation (defaults to /products/kyc-verification)
 * @returns {JSX.Element} Rendered form page with dynamic fields and service pills
 */
export const ServiceFormPage = ({
	serviceCodes: initialServiceCodes,
	basePath = "/products/kyc-verification",
}: ServiceFormPageProps): JSX.Element => {
	const router = useRouter();
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
		formState: { errors, isValid, isDirty, isSubmitting },
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
				router.replace(basePath);
				return;
			}

			if (newCodes.length === 1) {
				// Only one service left, update URL to single service route
				router.replace(`${basePath}/${newCodes[0]}`, undefined, {
					shallow: true,
				});
			} else {
				// Multiple services, update URL to reflect remaining services
				router.replace(`${basePath}/${newCodes.join("/")}`, undefined, {
					shallow: true,
				});
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
			setSubmitError(null);

			try {
				console.log("Form submitted with data:", data);
				console.log("Services to verify:", selectedServiceObjects);

				// Store verification data in sessionStorage for results page
				const verificationData = {
					formData: data,
					services: selectedServiceObjects.map((s) => ({
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

				// Clear selection state
				resetAll();

				// Navigate to results page
				router.push(`${basePath}/results`);
			} catch (err) {
				setSubmitError(
					"Failed to submit verification. Please try again."
				);
				console.error("Submission error:", err);
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
						<Button onClick={() => router.push(basePath)}>
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
			<Flex justify="center" w="100%" mb={{ base: "128px", md: "64px" }}>
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
											type: "submit",
											label:
												selectedServiceObjects.length ===
												1
													? "Verify"
													: `Verify ${selectedServiceObjects.length} Services`,
											loading: isSubmitting,
											disabled: !isValid || !isDirty,
											styles: {
												h: "64px",
												w: {
													base: "100%",
													md: "200px",
												},
											},
											icon: "arrow-forward",
										},
										{
											variant: "link",
											label: "Back",
											onClick: handleBack,
											disabled: isSubmitting,
											styles: {
												color: "primary.DEFAULT",
												bg: {
													base: "white",
													md: "none",
												},
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
					</Card>
				</Flex>
			</Flex>
		</>
	);
};

export default ServiceFormPage;
