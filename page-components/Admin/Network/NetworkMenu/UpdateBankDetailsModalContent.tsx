import {
	Alert,
	AlertIcon,
	Box,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Skeleton,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { ActionButtonGroup, Button } from "components";
import { Endpoints } from "constants/index";
import { ParamType } from "constants/trxnFramework";
import { useOrgDetailContext, useSession } from "contexts";
import { fetcher } from "helpers";
import { useBankList, useRefreshToken } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";

const IFSC_VALIDATION = {
	min: 11,
	max: 11,
	pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
	pattern_error: "Invalid IFSC format (e.g., SBIN0000001)",
};

interface FormData {
	bank_code: string | { value: string; label: string };
	account: string;
	ifsc: string;
	passbook_image: File | null;
}

// Updated — onUpdateBankDetails now receives bankData too
interface UpdateBankDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	eko_code: string;
	agentMobile: string;
	accessToken: string;
	onUpdateBankDetails?: (_eko_code: string, _bankData: any) => void;
}

const UpdateBankDetailsModalContent = ({
	isOpen,
	onClose,
	eko_code,
	agentMobile,
	accessToken,
	onUpdateBankDetails,
}: UpdateBankDetailsModalProps) => {
	const {
		banks,
		isLoading: isBanksLoading,
		error: bankError,
		refetch,
	} = useBankList();
	const toast = useToast();
	const { generateNewToken } = useRefreshToken();
	const { userId } = useSession();
	const { orgDetail } = useOrgDetailContext();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// console.log("Bank list data:", banks);

	const [accountValidation, setAccountValidation] = useState({
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
	const watchBankCode = watch("bank_code") as any;

	const selectedBank =
		watchBankCode && typeof watchBankCode === "object"
			? watchBankCode
			: null;

	useEffect(() => {
		if (!selectedBank) {
			setAccountValidation({
				min: 6,
				max: 20,
				pattern_error: "Please enter a valid account number",
			});
			return;
		}

		const accountParam = selectedBank.dependent_params?.find(
			(p: any) => p.name === "account"
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

		setValue("account", "");
		setValue("ifsc", "");
	}, [selectedBank, setValue]);

	useEffect(() => {
		if (accountValidation) trigger();
	}, [accountValidation, trigger]);

	const parameterList = useMemo(
		() => [
			{
				name: "bank_code",
				label: "Select Your Bank",
				parameter_type_id: ParamType.LIST,
				list_elements: banks,
				required: true,
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
						message: `IFSC must be ${IFSC_VALIDATION.min} characters`,
					},
					maxLength: {
						value: IFSC_VALIDATION.max,
						message: `IFSC must be ${IFSC_VALIDATION.max} characters`,
					},
				},
			},
			{
				name: "passbook_image",
				label: "Bank Passbook Image",
				parameter_type_id: ParamType.FILE,
				required: true,
				meta: {
					accept: "image/jpeg,image/png",
					watermark: false,
					options: { aspectRatio: 2 },
				},
			},
		],
		[banks, accountValidation]
	);

	// Updated — passes bank data to callback
	const onFormSubmit = async (data: FormData) => {
		const bankData = {
			bank_name: selectedBank?.label || "",
			account: data.account,
			ifsc: data.ifsc,
		};

		setIsSubmitting(true);
		try {
			console.log("=== Starting bank update submission ===");

			// Generate client_ref_id here to mirror cURL and for easier logging
			const clientRefId =
				Date.now() + "" + Math.floor(Math.random() * 1000);

			// Attempt to pick a realtime source IP from org metadata or env var
			let realSourceIp =
				orgDetail?.metadata?.realsourceip ||
				process.env.NEXT_PUBLIC_REAL_SOURCE_IP ||
				undefined;

			// If we don't have a real source IP, try fetching it from the server
			if (!realSourceIp) {
				try {
					console.log("Fetching realsourceip from server...");
					const ipResp: any = await fetcher(
						process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.GET_IP,
						{ token: accessToken, timeout: 20000, body: {} },
						generateNewToken
					);
					if (ipResp && ipResp.ip) realSourceIp = ipResp.ip;
					console.log("Fetched realsourceip:", ipResp);
				} catch (err) {
					console.warn(
						"Could not fetch realsourceip (non-blocking error):",
						err
					);
				}
			}

			const payloadUserCode = String(eko_code);
			const requestOptions = {
				body: {
					interaction_type_id: "1060",
					client_ref_id: clientRefId,
					bc: "3",
					operation_type: 1,
					data: JSON.stringify({
						ifsc: String(data.ifsc),
						accountNumber: String(data.account),
					}),
					csp_id: agentMobile ? String(agentMobile) : "",
					user_code: payloadUserCode || "",
					initiator_id: userId ? String(userId) : "",
					org_id: orgDetail?.org_id ? String(orgDetail.org_id) : "",
					realsourceip: realSourceIp,
					lang: "null",
					source: "WLC",
					version: "v2",
				},
				token: accessToken,
			};
			// console.log(
			// 	"Endpoint:",
			// 	process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION
			// );
			// console.log(
			// 	"Request body:",
			// 	JSON.stringify(requestOptions.body, null, 2)
			// );

			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				requestOptions,
				generateNewToken
			);
			console.log("Received response from fetcher");
			// console.log("Full response:", JSON.stringify(response, null, 2));

			if (response && response.status === 0) {
				toast({
					title:
						response.message ||
						"Bank details updated successfully!",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				onUpdateBankDetails?.(eko_code, bankData); // pass to ProfilePanel
				onClose();
			} else {
				toast({
					title: response.message || "Failed to update bank details",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error("Error updating bank details:", error);
			console.error("Error stack:", (error as any)?.stack);
			console.error("Error details:", {
				message: (error as any)?.message,
				name: (error as any)?.name,
				response: (error as any)?.response,
				status: (error as any)?.status,
			});
			toast({
				title: "Network error. Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};
	if (isBanksLoading) {
		return (
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Update Bank Details</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<VStack gap={4} align="stretch">
							<Skeleton height="60px" />
							<Skeleton height="60px" />
							<Skeleton height="60px" />
							<Skeleton height="190px" />
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	}

	if (bankError) {
		return (
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Update Bank Details</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Alert status="error" borderRadius="md">
							<AlertIcon />
							{bankError}
						</Alert>
						<Button onClick={refetch} mt={4}>
							Retry
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="lg">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Update Bank Details</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
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
							<Box w="100%" overflow="hidden">
								<ActionButtonGroup
									isFixedOnMobile={false}
									buttonConfigList={[
										{
											type: "submit",
											label: isSubmitting
												? "Updating..."
												: "Update",
											disabled:
												isBanksLoading || isSubmitting,
											loading: isSubmitting,
										},
										{
											variant: "link",
											label: "Cancel",
											onClick: onClose,
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
							</Box>
						</VStack>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export const UpdateBankDetailsModal = ({
	isOpen,
	onClose,
	eko_code,
	agentMobile,
	accessToken,
	onUpdateBankDetails,
}: UpdateBankDetailsModalProps) => {
	return (
		<UpdateBankDetailsModalContent
			isOpen={isOpen}
			onClose={onClose}
			eko_code={eko_code}
			agentMobile={agentMobile} // add this
			accessToken={accessToken}
			onUpdateBankDetails={onUpdateBankDetails}
		/>
	);
};

export default UpdateBankDetailsModal;
