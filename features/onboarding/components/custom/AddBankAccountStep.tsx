import { Alert, AlertIcon, Box, Skeleton, VStack } from "@chakra-ui/react";
import { ActionButtonGroup, Button } from "components";
import { ParamType } from "constants/trxnFramework";
import { useBankList } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";
import type { CustomComponentProps } from "../ContentRenderer";

interface BankDependentParam {
	name: string;
	value?: string | number;
	length_min?: number;
	length_max?: number;
	pattern_error?: string;
	is_visible?: number;
}

interface BankListElement {
	label: string;
	value: string | number;
	dependent_params?: BankDependentParam[];
	[key: string]: unknown;
}

interface AccountValidation {
	min: number;
	max: number;
	pattern_error: string;
}

interface IfscValidation {
	min: number;
	max: number;
	pattern: RegExp;
	pattern_error: string;
}

const IFSC_VALIDATION: IfscValidation = {
	min: 11,
	max: 11,
	pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
	pattern_error: "Invalid IFSC format (e.g., SBIN0000001)",
} as const;

interface FormData {
	bank_code: string | { value: string; label: string };
	account: string;
	ifsc: string;
	passbook_image: File | null;
}

/**
 * AddBankAccountStep - Custom component for bank account onboarding
 * Uses Form component with dynamic validation based on selected bank's dependent_params
 * @param {CustomComponentProps} props - Standard custom step props
 * @returns {JSX.Element} The rendered component
 */
const AddBankAccountStep = ({
	stepConfig,
	onSubmit,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	const {
		banks,
		isLoading: isBanksLoading,
		error: bankError,
		refetch,
	} = useBankList();

	const [accountValidation, setAccountValidation] =
		useState<AccountValidation>({
			min: 6,
			max: 20,
			pattern_error: "Please enter a valid account number",
		});

	const {
		register,
		control,
		watch,
		handleSubmit,
		setValue,
		trigger,
		formState: { errors },
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			bank_code: "",
			account: "",
			ifsc: "",
			passbook_image: null,
		},
	});

	const formValues = watch();
	const watchBankCode = watch("bank_code") as BankListElement | string;

	// Get selected bank object directly from watchBankCode (like PricingCommission pattern)
	const selectedBank =
		watchBankCode && typeof watchBankCode === "object"
			? (watchBankCode as BankListElement)
			: null;

	// Handle bank selection change - update validation rules
	useEffect(() => {
		if (!selectedBank) {
			// Reset to defaults if no bank selected
			setAccountValidation({
				min: 6,
				max: 20,
				pattern_error: "Please enter a valid account number",
			});
			return;
		}

		console.log("[AddBankAccount] Selected bank changed:", selectedBank);

		// Extract account validation from dependent_params
		const accountParam = selectedBank.dependent_params?.find(
			(p: BankDependentParam) => p.name === "account"
		);

		if (accountParam) {
			setAccountValidation({
				min: accountParam.length_min || 6,
				max: accountParam.length_max || 20,
				pattern_error:
					accountParam.pattern_error ||
					"Please enter a valid account number",
			});
		}

		// Reset account and ifsc fields when bank changes
		setValue("account", "");
		setValue("ifsc", "");
	}, [selectedBank, setValue]);

	// Re-trigger validation when validation rules change
	// This pattern follows PricingCommission implementation
	useEffect(() => {
		if (accountValidation) {
			trigger();
		}
	}, [accountValidation, trigger]);

	// Build dynamic parameter_list for Form component
	const parameterList = useMemo(() => {
		return [
			{
				name: "bank_code",
				label: "Select Your Bank",
				parameter_type_id: ParamType.LIST,
				list_elements: banks,
				required: true,
				helperText: "Choose your bank from the list",
			},
			{
				name: "account",
				label: "Bank Account Number",
				parameter_type_id: ParamType.TEXT,
				required: true,
				validations: {
					minLength: {
						value: accountValidation.min,
						message: `Minimum ${accountValidation.min} digits required`,
					},
					maxLength: {
						value: accountValidation.max,
						message: `Maximum ${accountValidation.max} digits allowed`,
					},
					pattern: {
						value: /^(?!0+$)[a-zA-Z0-9]*$/,
						message: accountValidation.pattern_error,
					},
				},
				helperText: selectedBank ? accountValidation.pattern_error : "",
			},
			{
				name: "ifsc",
				label: "IFSC Code",
				parameter_type_id: ParamType.TEXT,
				required: true,
				validations: {
					pattern: {
						value: IFSC_VALIDATION.pattern,
						message: IFSC_VALIDATION.pattern_error,
					},
					minLength: {
						value: IFSC_VALIDATION.min,
						message: `IFSC must be at least ${IFSC_VALIDATION.min} characters`,
					},
					maxLength: {
						value: IFSC_VALIDATION.max,
						message: `IFSC must be at most ${IFSC_VALIDATION.max} characters`,
					},
				},
				helperText: selectedBank
					? IFSC_VALIDATION.pattern_error
					: "Bank branch's IFSC code",
			},
			{
				name: "passbook_image",
				label: "Bank Passbook Image",
				parameter_type_id: ParamType.FILE,
				required: true,
				meta: {
					accept: "image/jpeg,image/png",
					watermark: false,
					options: {
						aspectRatio: 2,
					},
				},
			},
		];
	}, [banks, accountValidation, selectedBank]);

	// Handle form submission
	const onFormSubmit = (data: FormData) => {
		console.log("[AddBankAccount] Form data to submit:", data);
		console.log("[AddBankAccount] Selected bank:", selectedBank);

		// Extract bank_id from selected bank's dependent_params
		let bank_id = "";
		if (selectedBank) {
			const bankIdParam = selectedBank.dependent_params?.find(
				(p: BankDependentParam) => p.name === "bank_id"
			);
			console.log("[AddBankAccount] Found bankIdParam:", bankIdParam);
			if (bankIdParam && bankIdParam.value) {
				bank_id = String(bankIdParam.value);
			}
		}

		// Extract bank_code value (select returns object, we need the value)
		const bankCodeValue = selectedBank?.value
			? String(selectedBank.value)
			: "";

		console.log(
			"[AddBankAccount] Submitting bank account data:",
			{
				bank_code: bankCodeValue,
				account: data.account,
				ifsc: data.ifsc,
			},
			"with bank_id:",
			bank_id
		);

		// Prepare form data for API submission
		const formData: Record<string, any> = {
			bank_code: bankCodeValue,
			account: data.account,
			ifsc: data.ifsc,
			bank_id: bank_id,
		};

		// Add passbook image if uploaded (matches widget structure)
		if (data.passbook_image) {
			formData.passbookImage = {
				url: URL.createObjectURL(data.passbook_image),
				fileData: data.passbook_image,
			};
		}

		onSubmit({
			id: stepConfig.id,
			form_data: formData,
		});
	};

	// Loading state - show skeletons
	if (isBanksLoading) {
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
				<VStack gap={4} align="stretch">
					<Skeleton height="60px" />
					<Skeleton height="60px" />
					<Skeleton height="60px" />
					<Skeleton height="190px" />
				</VStack>
			</VStack>
		);
	}

	// Error state - show error with retry button
	if (bankError) {
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
				<Alert status="error" borderRadius="md">
					<AlertIcon />
					{bankError}
				</Alert>
				<Button onClick={refetch} colorScheme="primary" w="fit-content">
					Retry
				</Button>
			</VStack>
		);
	}

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
								disabled: isSubmitting || isBanksLoading,
							},
						]}
					/>
				</VStack>
			</form>
		</VStack>
	);
};

export default AddBankAccountStep;
