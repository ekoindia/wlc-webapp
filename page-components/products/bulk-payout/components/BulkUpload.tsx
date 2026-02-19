import { Box, Flex, Link, useToast } from "@chakra-ui/react";
import {
	ActionButtonGroup,
	Card,
	Dropzone,
	Icon,
	InputLabel,
	Select,
} from "components";
import { Endpoints } from "constants/EndPoints";
import { useSession, useUser } from "contexts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pintwin } from "tf-components/Pintwin";
import { useBulkPayout } from "../context/BulkPayoutContext";

export interface ServiceOption {
	label: string;
	value: string;
	serviceCode: string;
}

interface BulkUploadProps {
	sampleDownloadLink?: string;
	sampleFileName?: string;
	serviceCode?: string;
	tfUri?: string;
	tfRootPath?: string;
	showPinInput?: boolean;
	externalSetTab?: (_tab: string) => void;
	externalBatchCount?: number;
	showServiceSelect?: boolean;
	serviceOptions?: ServiceOption[];
	onServiceChange?: (_option: ServiceOption | null) => void;
	selectedService?: ServiceOption | null;
	customerParamsProp?: { customerName: string; customerNumber: string };
}

export const BulkUploadUI: React.FC<BulkUploadProps> = ({
	sampleDownloadLink = "https://files.eko.co.in/docs/sample_files/bulk-upload/bulk_imps_sample.xlsx",
	sampleFileName = "sample_bulk_payment.xlsx",
	serviceCode = "45",
	tfUri = "/bulk/upload",
	tfRootPath = "/api/v1",
	showPinInput = true,
	externalSetTab,
	externalBatchCount,
	showServiceSelect = false,
	serviceOptions = [],
	onServiceChange,
	selectedService,
	customerParamsProp,
}) => {
	const { accessToken } = useSession();
	const { userData } = useUser();
	const toast = useToast();

	// Defaults for generic use
	const setTab = externalSetTab;
	const processingBatchCount = externalBatchCount ?? 0;
	const customerParams = customerParamsProp || {
		customerName: "",
		customerNumber: "",
	};

	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [pintwinEncoded, setPintwinEncoded] = useState<string>("");
	const [pinLength, setPinLength] = useState(0);

	const {
		handleSubmit,
		reset,
		formState: { isValid },
	} = useForm({ mode: "onChange" });

	const uploadLimit = 10;
	const canUpload = processingBatchCount < uploadLimit;

	const handleFormSubmit = async () => {
		if (!file || !accessToken) return;

		// Check if we need the full payout payload or just the verification one
		// If showPinInput is false, we assume it's the Verification/Generic flow
		const isVerificationFlow = !showPinInput;

		setIsUploading(true);

		try {
			const userCode = userData?.userDetails?.code;
			// Define payload based on the use case
			const payload: Record<string, any> = isVerificationFlow
				? {
						user_code: userCode,
						service_code: serviceCode,
						client_ref_id:
							Date.now() + "" + Math.floor(Math.random() * 1000),
					}
				: {
						sender_name: customerParams.customerName,
						user_code: userCode,
						pintwin: pintwinEncoded,
						client_ref_id:
							Date.now() + "" + Math.floor(Math.random() * 1000),
						customer_id: customerParams.customerNumber,
						service_code: "45",
					};

			const formData = new FormData();
			formData.append(
				"formdata",
				new URLSearchParams(payload).toString()
			);
			formData.append("file", file);

			const response = await fetch(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"tf-req-uri-root-path": tfRootPath,
						"tf-req-uri": tfUri,
						"tf-req-method": "POST",
					},
					body: formData,
				}
			);

			const data = await response.json();

			if (data?.status === 0) {
				toast({
					title: "Success",
					description: data?.message,
					status: "success",
				});

				// CLEANUP LOGIC
				setFile(null);
				reset();

				// Only reset PIN if it was actually used
				if (showPinInput) {
					setPintwinEncoded("");
					setPinLength(0);
				}

				setTimeout(() => setTab("history"), 500);
			} else {
				toast({
					title: "Error",
					description: data?.message,
					status: "error",
				});

				// Handle PIN error reset only if used
				if (showPinInput && data?.response_type_id === 2413) {
					setPintwinEncoded("");
				}
			}
		} catch (error) {
			toast({
				title: "Upload Failed",
				description: error?.message,
				status: "error",
			});
		} finally {
			setIsUploading(false);
		}
	};

	const buttonConfigList = [
		{
			type: "submit" as const,
			label: "Upload",
			loading: isUploading,
			disabled:
				(showPinInput && pinLength < 4) ||
				!file ||
				!isValid ||
				isUploading ||
				!canUpload ||
				// Use selectedService here because serviceCode has a default of "45"
				(showServiceSelect && !selectedService),
			styles: { h: "45px", w: { base: "100%", md: "50%" } },
		},
	];

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Card p={{ base: 4, md: 6 }}>
				<Flex direction="column" gap="6">
					{/* Optional Service Select */}
					{showServiceSelect && (
						<Box>
							<InputLabel required>
								Select Verification Service
							</InputLabel>
							<Select
								placeholder="Choose service"
								options={serviceOptions}
								value={selectedService}
								onChange={onServiceChange}
								renderer={{ label: "label", value: "value" }}
								getOptionLabel={(opt: any) => opt.label}
							/>
						</Box>
					)}

					{/* Download Sample - Only show when service is selected */}
					<Flex direction="column" gap="2">
						<InputLabel>Download Sample File</InputLabel>
						<Link
							onClick={(e) => {
								if (!sampleDownloadLink) {
									e.preventDefault(); // Stop the browser from trying to open a null link
									toast({
										title: "Action Required",
										description:
											"Please select a service first to download the sample file.",
										status: "warning",
										duration: 3000,
										isClosable: true,
									});
								}
							}}
							// Only provide href if it exists, otherwise use '#' to keep link styling
							href={sampleDownloadLink || "#"}
							isExternal
							color="primary.DEFAULT"
						>
							<Flex align="center" gap="2" fontSize="sm">
								<Icon name="file-download" size="sm" />
								{sampleFileName}
							</Flex>
						</Link>
					</Flex>

					<Flex direction="column" gap="2">
						<InputLabel required>Upload File</InputLabel>
						<Dropzone
							file={file}
							setFile={setFile}
							accept=".xlsx,.xls"
						/>
					</Flex>

					{showPinInput && (
						<Box maxW="300px">
							<Pintwin
								label="Secret PIN"
								onPinChange={(value) => {
									setPinLength(value.length);
								}}
								onPinComplete={(_raw, encoded) => {
									setPintwinEncoded(encoded);
									setPinLength(_raw.length);
								}}
							/>
						</Box>
					)}
					<ActionButtonGroup buttonConfigList={buttonConfigList} />
				</Flex>
			</Card>
		</form>
	);
};

/**
 * Context Wrapper for Bulk Payout.
 * @param {BulkUploadProps} props - The component props.
 * @returns {JSX.Element} The wrapped BulkUploadUI component.
 */
const BulkUpload: React.FC<BulkUploadProps> = (props) => {
	const context = useBulkPayout();
	return (
		<BulkUploadUI
			externalSetTab={context?.setTab}
			externalBatchCount={context?.processingBatchCount}
			customerParamsProp={context?.customerParams}
			{...props}
		/>
	);
};

export default BulkUpload;
