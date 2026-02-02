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

	const [selectedBank, setSelectedBank] = useState<BankListElement | null>(
		null
	);
	const [accountValidation, setAccountValidation] =
		useState<AccountValidation>({
			min: 6,
			max: 20,
			pattern_error: "Please enter a valid account number",
		});
	const [ifscRequired, setIfscRequired] = useState<boolean>(true);
	const [ifscValidation, setIfscValidation] = useState<IfscValidation>({
		min: 11,
		max: 11,
		pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
		pattern_error: "Invalid IFSC format (e.g., SBIN0000001)",
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
	const watchBankCode = watch("bank_code");

	// Handle bank selection change - update validation rules
	useEffect(() => {
		if (!watchBankCode || !banks.length) return;

		const bank = banks.find(
			(b: BankListElement) => b.value === watchBankCode
		);
		setSelectedBank(bank || null);

		if (bank) {
			// Extract account validation from dependent_params
			const accountParam = bank.dependent_params?.find(
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

			// Extract ifsc_required from dependent_params (defaults to required)
			const ifscRequiredParam = bank.dependent_params?.find(
				(p: BankDependentParam) => p.name === "ifsc_required"
			);
			// ifsc_required: 0 = optional, 1 or undefined = required
			setIfscRequired(ifscRequiredParam?.value !== 0);

			// Extract IFSC validation from dependent_params
			const ifscParam = bank.dependent_params?.find(
				(p: BankDependentParam) => p.name === "ifsc"
			);

			if (ifscParam) {
				setIfscValidation({
					min: ifscParam.length_min || 11,
					max: ifscParam.length_max || 11,
					pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
					pattern_error:
						ifscParam.pattern_error ||
						"Invalid IFSC format (e.g., SBIN0000001)",
				});
			} else {
				// Reset to defaults if no IFSC param
				setIfscValidation({
					min: 11,
					max: 11,
					pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
					pattern_error: "Invalid IFSC format (e.g., SBIN0000001)",
				});
			}

			// Reset account and ifsc fields when bank changes
			setValue("account", "");
			setValue("ifsc", "");
		} else {
			// Reset to defaults if bank not found
			setAccountValidation({
				min: 6,
				max: 20,
				pattern_error: "Please enter a valid account number",
			});
			setIfscValidation({
				min: 11,
				max: 11,
				pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
				pattern_error: "Invalid IFSC format (e.g., SBIN0000001)",
			});
			setIfscRequired(true);
		}
	}, [watchBankCode, banks, setValue]);

	// Re-trigger validation when validation rules change
	// This pattern follows PricingCommission implementation
	useEffect(() => {
		if (accountValidation || ifscValidation) {
			trigger();
		}
	}, [accountValidation, ifscValidation, trigger]);

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
				required: ifscRequired,
				validations: ifscRequired
					? {
							pattern: {
								value: ifscValidation.pattern,
								message: ifscValidation.pattern_error,
							},
							minLength: {
								value: ifscValidation.min,
								message: `IFSC must be at least ${ifscValidation.min} characters`,
							},
							maxLength: {
								value: ifscValidation.max,
								message: `IFSC must be at most ${ifscValidation.max} characters`,
							},
						}
					: {},
				helperText: selectedBank
					? ifscRequired
						? ifscValidation.pattern_error
						: "Optional"
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
				},
			},
		];
	}, [banks, accountValidation, ifscValidation, ifscRequired, selectedBank]);

	// Handle form submission
	const onFormSubmit = (data: FormData) => {
		// Extract bank_id from selected bank's dependent_params
		let bank_id = "";
		if (selectedBank) {
			const bankIdParam = selectedBank.dependent_params?.find(
				(p: BankDependentParam) => p.name === "bank_id"
			);
			if (bankIdParam && bankIdParam.value) {
				bank_id = String(bankIdParam.value);
			}
		}

		// Extract bank_code value (select returns object, we need the value)
		const bankCodeValue =
			data.bank_code &&
			typeof data.bank_code === "object" &&
			"value" in data.bank_code
				? (data.bank_code as { value: string }).value
				: data.bank_code;

		// Prepare form data for API submission
		const formData: Record<string, any> = {
			bank_code: bankCodeValue,
			account: data.account,
			ifsc: data.ifsc,
			bank_id,
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
