import { Box, VStack, useToast } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { ParamType } from "constants/trxnFramework";
import {
	addressValidation,
	nameValidation,
	phoneValidation,
	pincodeValidation,
	shopNameValidation,
} from "constants/validation";
import { useCountryStates } from "hooks";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";
import { useOnboardingContext } from "../../context";
import type { CustomComponentProps } from "../ContentRenderer";

/**
 * Company type options for the dropdown
 */
const COMPANY_TYPE_OPTIONS = [
	{ label: "Private Ltd", value: 1 },
	{ label: "LLP", value: 2 },
	{ label: "Partnership", value: 3 },
	{ label: "Sole Proprietorship", value: 4 },
];

interface FormData {
	name: string;
	company_type: number | { value: number; label: string };
	authorized_signatory_name: string;
	contact_person_cell: string;
	alternate_mobile?: string;
	current_address_line1: string;
	current_address_line2?: string;
	current_address_pincode: string;
	current_address_district: string;
	current_address_state: string | { value: string; label: string };
	communication: number;
}

/**
 * BusinessDetailsStep - Custom component for business details onboarding
 * Uses validation constants from constants/validation.ts
 * NOTE: If shop types need to be dynamic in future, import and use useShopTypes hook
 * @param {CustomComponentProps} props - Standard custom step props
 * @returns {JSX.Element} The rendered component
 */
const BusinessDetailsStep = ({
	stepConfig,
	onSubmit,
	onAdvance,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	const toast = useToast();
	const { pipelineResults } = useOnboardingContext();
	const hasAdvancedRef = useRef(false);

	// Fetch states using the hook
	const { states, isLoading: isLoadingStates } = useCountryStates();

	const {
		register,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			name: "",
			company_type: undefined,
			authorized_signatory_name: "",
			contact_person_cell: "",
			alternate_mobile: "",
			current_address_line1: "",
			current_address_line2: "",
			current_address_pincode: "",
			current_address_district: "",
			current_address_state: undefined,
			communication: 1,
		},
	});

	const formValues = watch();

	// Build dynamic parameter_list for Form component
	const parameterList = useMemo(() => {
		return [
			{
				name: "name",
				label: "Company/Firm's Name",
				parameter_type_id: ParamType.TEXT,
				required: true,
				validations: {
					pattern: {
						value: shopNameValidation.regex,
						message: "Please enter a valid company name",
					},
					minLength: {
						value: shopNameValidation.minLength,
						message: `Company name must be at least ${shopNameValidation.minLength} characters`,
					},
					maxLength: {
						value: shopNameValidation.maxLength,
						message: `Company name cannot exceed ${shopNameValidation.maxLength} characters`,
					},
				},
			},

			{
				name: "company_type",
				label: "Company Type",
				parameter_type_id: ParamType.LIST,
				list_elements: COMPANY_TYPE_OPTIONS,
				required: true,
			},
			{
				name: "authorized_signatory_name",
				label: "Director/Authorised Signatory Full Name",
				parameter_type_id: ParamType.TEXT,
				required: true,
				validations: {
					pattern: {
						value: nameValidation.regex,
						message: "Please enter a valid name",
					},
					minLength: {
						value: nameValidation.minLength,
						message: `Name must be at least ${nameValidation.minLength} characters`,
					},
					maxLength: {
						value: nameValidation.maxLength,
						message: `Name cannot exceed ${nameValidation.maxLength} characters`,
					},
				},
			},
			{
				name: "contact_person_cell",
				label: "Contact Person's Mobile Number",
				parameter_type_id: ParamType.MOBILE,
				required: true,
				validations: {
					pattern: {
						value: phoneValidation.regex,
						message: "Please enter a valid 10-digit mobile number",
					},
					minLength: {
						value: phoneValidation.minLength,
						message: `Mobile number must be ${phoneValidation.minLength} digits`,
					},
					maxLength: {
						value: phoneValidation.maxLength,
						message: `Mobile number must be ${phoneValidation.maxLength} digits`,
					},
				},
			},
			{
				name: "alternate_mobile",
				label: "Alternate Mobile Number",
				parameter_type_id: ParamType.MOBILE,
				required: false,
				meta: { optional: true },
				validations: {
					pattern: {
						value: phoneValidation.regex,
						message: "Please enter a valid 10-digit mobile number",
					},
					minLength: {
						value: phoneValidation.minLength,
						message: `Mobile number must be ${phoneValidation.minLength} digits`,
					},
					maxLength: {
						value: phoneValidation.maxLength,
						message: `Mobile number must be ${phoneValidation.maxLength} digits`,
					},
				},
			},
			{
				name: "current_address_line1",
				label: "Registered Business Address (Line 1)",
				parameter_type_id: ParamType.TEXT,
				required: true,
				validations: {
					pattern: {
						value: addressValidation.regex,
						message: "Please enter a valid address",
					},
					minLength: {
						value: addressValidation.minLength,
						message: `Address must be at least ${addressValidation.minLength} characters`,
					},
					maxLength: {
						value: addressValidation.maxLength,
						message: `Address cannot exceed ${addressValidation.maxLength} characters`,
					},
				},
			},
			{
				name: "current_address_line2",
				label: "Registered Business Address (Line 2)",
				parameter_type_id: ParamType.TEXT,
				required: false,
				validations: {
					maxLength: {
						value: addressValidation.maxLength,
						message: `Address cannot exceed ${addressValidation.maxLength} characters`,
					},
				},
			},

			{
				name: "current_address_district",
				label: "City",
				parameter_type_id: ParamType.TEXT,
				required: true,
				validations: {
					pattern: {
						value: /^[a-zA-Z ]+$/,
						message: "Please enter a valid city name",
					},
					minLength: {
						value: 2,
						message: "City name must be at least 2 characters",
					},
					maxLength: {
						value: 50,
						message: "City name cannot exceed 50 characters",
					},
				},
			},
			{
				name: "current_address_state",
				label: "State",
				parameter_type_id: ParamType.LIST,
				list_elements: states,
				required: true,
				meta: {
					placeholder: isLoadingStates ? "Loading..." : "--Select--",
					disabled: isLoadingStates,
				},
			},
			{
				name: "current_address_pincode",
				label: "Pincode",
				parameter_type_id: ParamType.NUMERIC,
				required: true,
				validations: {
					pattern: {
						value: pincodeValidation.regex,
						message: "Please enter a valid 6-digit pincode",
					},
					minLength: {
						value: pincodeValidation.minLength,
						message: `Pincode must be ${pincodeValidation.minLength} digits`,
					},
					maxLength: {
						value: pincodeValidation.maxLength,
						message: `Pincode must be ${pincodeValidation.maxLength} digits`,
					},
				},
			},
		];
	}, [states, isLoadingStates]);

	/**
	 * Check pipeline result for step completion - auto-advance if already successful
	 */
	useEffect(() => {
		const result = pipelineResults[stepConfig.id];
		if (!result || hasAdvancedRef.current) return;

		if (result.status === "success") {
			hasAdvancedRef.current = true;
			toast({
				title:
					stepConfig.success_message ||
					"Business details saved successfully!",
				status: "success",
				duration: 2000,
			});
			onAdvance(stepConfig.id);
		}
	}, [
		pipelineResults,
		stepConfig.id,
		stepConfig.success_message,
		onAdvance,
		toast,
	]);

	// Handle form submission
	const onFormSubmit = (data: FormData) => {
		console.log("[BusinessDetailsStep] Form data to submit:", data);

		// Extract values from select objects
		const companyTypeValue =
			typeof data.company_type === "object"
				? data.company_type.value
				: data.company_type;

		const stateValue =
			typeof data.current_address_state === "object"
				? data.current_address_state.value
				: data.current_address_state;

		// Prepare form data for API submission (keys match parameter_list names)
		const formData: Record<string, any> = {
			name: data.name,
			company_type: companyTypeValue,
			authorized_signatory_name: data.authorized_signatory_name,
			contact_person_cell: data.contact_person_cell,
			alternate_mobile: data.alternate_mobile || "",
			current_address_line1: data.current_address_line1,
			current_address_line2: data.current_address_line2 || "",
			current_address_district: data.current_address_district,
			current_address_state: stateValue,
			current_address_pincode: data.current_address_pincode,
		};

		onSubmit({
			id: stepConfig.id,
			form_data: formData,
		});
	};

	return (
		<VStack gap={6} align="stretch" w="full">
			<Box>
				<Box fontSize="2xl" fontWeight="medium">
					{stepConfig.label}
				</Box>
				<Box fontSize="sm" color="gray.600" mt={3}>
					{stepConfig.description}
				</Box>
			</Box>

			<form onSubmit={handleSubmit(onFormSubmit)}>
				<VStack gap={6} align="stretch">
					<Form
						parameter_list={parameterList}
						register={register as any}
						control={control as any}
						errors={errors as any}
						formValues={formValues as any}
						size="md"
					/>

					<ActionButtonGroup
						isFixedOnMobile={false}
						buttonConfigList={[
							{
								type: "submit",
								label: isSubmitting
									? "Loading..."
									: stepConfig.primaryCTAText || "Next",
								loading: isSubmitting,
								disabled: isSubmitting,
							},
						]}
					/>
				</VStack>
			</form>
		</VStack>
	);
};

export default BusinessDetailsStep;
