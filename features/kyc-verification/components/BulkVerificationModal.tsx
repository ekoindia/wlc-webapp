/**
 * BulkVerificationModal - Modal for bulk verification upload.
 * Allows users to select a bulk-enabled service, download sample file, and upload data.
 */

import { Alert, AlertIcon, Flex, Link, Text, useToast } from "@chakra-ui/react";
import {
	ActionButtonGroup,
	Button,
	Dropzone,
	Icon,
	InputLabel,
	Modal,
	Select,
} from "components";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { useMemo, useState } from "react";
import { BULK_UPLOAD_SUCCESS_RESPONSE_TYPE_ID } from "../constants";
import type { VerificationService } from "../types";

/** Base URL for sample file downloads */
const SAMPLE_FILE_BASE_URL =
	"https://files.eko.co.in/docs/bulk-verification/samples";

interface BulkVerificationModalProps {
	/** Whether the modal is open */
	isOpen: boolean;
	/** Callback to close the modal */
	onClose: () => void;
	/** All available services (will be filtered to bulk-enabled only) */
	services: VerificationService[];
}

interface ServiceOption {
	label: string;
	value: string;
	category: string;
	serviceCode: string;
}

/**
 * Modal component for bulk verification upload.
 * Provides a form to select a bulk-enabled verification service,
 * download a sample file template, and upload data for processing.
 * @param {BulkVerificationModalProps} props - The component props
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {VerificationService[]} props.services - Array of all verification services (will be filtered to bulk-enabled only)
 * @returns {JSX.Element} The rendered modal component
 */
export const BulkVerificationModal = ({
	isOpen,
	onClose,
	services,
}: BulkVerificationModalProps): JSX.Element => {
	const [selectedService, setSelectedService] =
		useState<ServiceOption | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const { accessToken } = useSession();
	const toast = useToast();

	// Filter services to only show bulk-enabled ones
	const bulkEnabledOptions = useMemo<ServiceOption[]>(() => {
		return services
			.filter((service) => service.supports_bulk_verification === true)
			.map((service) => ({
				label: service.name,
				value: service.serviceCode,
				category: service.category || "Other",
				serviceCode: service.serviceCode,
			}));
	}, [services]);

	// Generate download URL for the selected service
	const sampleDownloadUrl = useMemo(() => {
		if (!selectedService) return null;
		return `${SAMPLE_FILE_BASE_URL}/${selectedService.serviceCode}.xlsx`;
	}, [selectedService]);

	// Handle modal close - reset state
	const handleClose = () => {
		setSelectedService(null);
		setFile(null);
		onClose();
	};

	const handleFileUpload = async (service_code: string) => {
		const formDataObj = {
			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
			source: "WLC",
			service_code: service_code,
		};

		const formData = new FormData();
		formData.append(
			"formdata",
			new URLSearchParams(formDataObj).toString()
		);
		formData.append("file", file);

		setIsUploading(true);

		try {
			const res = await fetch(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"tf-req-method": "POST",
						"tf-req-uri-root-path": "/api/v1",
						"tf-req-uri": "/bulk-payout/process-records",
						// "x-forwarded-proto":
						// 	process.env.NEXT_PUBLIC_ENV !== "production"
						// 		? "http"
						// 		: "https",
					},
					body: formData,
				}
			);

			const data = await res.json();

			if (
				data.response_type_id === BULK_UPLOAD_SUCCESS_RESPONSE_TYPE_ID
			) {
				toast({
					title: "File Uploaded Successfully",
					description:
						data.message ||
						"Your file has been uploaded and is being processed.",
					status: "success",
					duration: 4000,
					isClosable: true,
				});
				handleClose();
			} else {
				toast({
					title: "Upload Failed",
					description:
						data.message ||
						"Failed to upload file. Please try again.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		} catch (err) {
			console.error("Error uploading file: ", err);
			toast({
				title: "Upload Error",
				description:
					"An error occurred while uploading the file. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsUploading(false);
		}
	};

	// Handle start verification
	const handleStartVerification = () => {
		if (!selectedService || !file) return;

		handleFileUpload(selectedService.serviceCode);
	};

	// Custom label to show service name with category
	const getOptionLabel = (option: ServiceOption) =>
		`${option.label} (${option.category})`;

	const isStartDisabled = !selectedService || !file || isUploading;

	// Action button configuration
	const buttonConfigList = [
		{
			label: "Start Verification",
			onClick: handleStartVerification,
			disabled: isStartDisabled,
			loading: isUploading,
			icon: "check-circle",
			styles: {
				borderRadius: "10px",
			},
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: handleClose,
			styles: {
				color: "primary.DEFAULT",
				_hover: { textDecoration: "none" },
			},
		},
	];

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Bulk Verification Upload"
			size="lg"
		>
			<Flex direction="column" gap="6">
				{/* Service Selection */}
				<Flex direction="column" gap="2">
					<Select
						label="Select Verification Service"
						placeholder="Choose a verification service"
						options={bulkEnabledOptions}
						value={selectedService}
						onChange={(option: ServiceOption | null) =>
							setSelectedService(option)
						}
						renderer={{ label: "label", value: "value" }}
						getOptionLabel={getOptionLabel}
						required
					/>
				</Flex>

				{/* Download Sample - Only show when service is selected */}
				{selectedService && sampleDownloadUrl && (
					<Flex direction="column" gap="2">
						<InputLabel hideOptionalMark>
							Download Sample File
						</InputLabel>
						<Link
							href={sampleDownloadUrl}
							w="fit-content"
							fontWeight="semibold"
							isExternal
						>
							<Button>
								<Icon name="file-download" size="sm" />
								&nbsp; Download
							</Button>
						</Link>
					</Flex>
				)}

				{/* File Upload */}
				<Flex direction="column" gap="2">
					<InputLabel required>Upload File</InputLabel>
					<Dropzone
						file={file}
						setFile={setFile}
						accept=".csv,.xls,.xlsx"
					/>
					<Text fontSize="xs" color="gray.500">
						Max file size: 10MB
					</Text>
				</Flex>

				{/* Info Alert */}
				<Alert status="warning" borderRadius="md" fontSize="sm">
					<AlertIcon />
					<Text>
						<Text as="span" fontWeight="semibold">
							Important:
						</Text>{" "}
						Ensure your file follows the template format exactly.
						Each row will be processed as a separate verification
						request.
					</Text>
				</Alert>

				{/* Actions */}
				<ActionButtonGroup
					w="full"
					pos="initial"
					direction="row"
					gap="8"
					buttonConfigList={buttonConfigList}
				/>
			</Flex>
		</Modal>
	);
};

export default BulkVerificationModal;
