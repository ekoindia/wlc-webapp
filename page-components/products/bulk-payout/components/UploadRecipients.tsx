import { Box, Flex, Link, useToast } from "@chakra-ui/react";
import {
	ActionButtonGroup,
	Card,
	Dropzone,
	Icon,
	InputLabel,
} from "components";
import { Endpoints } from "constants/EndPoints";
import { useSession, useUser } from "contexts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputPintwin from "tf-components/InputPintwin";
import { useBulkPayout } from "../context/BulkPayoutContext";

const SAMPLE_DOWNLOAD_LINK =
	"https://files.eko.co.in/docs/sample_files/bulk-upload/bulk_imps_sample.xlsx";

const BULK_PAYOUT_TF_URIS = {
	UPLOAD: "/bulk/upload",
} as const;

const TF_ROOT_PATH = "/api/v1";

/**
 * UploadRecipients component for uploading Excel file with recipient data
 * Tab 1 in the main view
 * @returns {JSX.Element} Upload form component
 */
const UploadRecipients: React.FC = (): JSX.Element => {
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const { setTab } = useBulkPayout();
	const { accessToken } = useSession();
	const { userData } = useUser();
	const toast = useToast();
	const [pintwinEncoded, setPintwinEncoded] = useState<string>("");
	const [pinLength, setPinLength] = useState(0);
	const { customerParams, processingBatchCount } = useBulkPayout();
	const [pinResetTrigger, setPinResetTrigger] = useState(0);

	const {
		handleSubmit,
		reset,
		formState: { isValid },
	} = useForm({
		mode: "onChange",
	});

	const canUpload = processingBatchCount < 10;

	// Limit to 10 concurrent processing batches
	const uploadLimit = 10;

	const handleFormSubmit = async () => {
		if (!file || !accessToken) return;

		// Check if we've exceeded the processing batch limit
		if (processingBatchCount >= uploadLimit) {
			toast({
				title: "Upload Limit Reached",
				description:
					"You cannot upload more than 10 files at a time. Please wait for some files to finish processing before uploading another file.",
				status: "warning",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		setIsUploading(true);

		try {
			const userCode = userData?.userDetails?.code;

			const payload = {
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
						"tf-req-uri-root-path": TF_ROOT_PATH,
						"tf-req-uri": BULK_PAYOUT_TF_URIS.UPLOAD,
						"tf-req-method": "POST",
						"x-forwarded-proto":
							process.env.NEXT_PUBLIC_ENV !== "production"
								? "http"
								: "https",
					},
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`
				);
			}

			const data = await response.json();

			// Handle success case (status: 0)
			if (data?.status === 0) {
				toast({
					title: "Success",
					description:
						data?.message || "File upload processed successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				// === RESET STATES AFTER SUCCESS ===
				setFile(null); // Clear selected file
				setPintwinEncoded(""); // Clear encoded PIN
				setPinLength(0); // Reset PIN length
				setPinResetTrigger((prev) => prev + 1);
				reset(); // Reset react-hook-form if you add fields later

				// Redirect to batch history tab
				setTimeout(() => {
					setTab("history");
				}, 500);
			} else if (data?.status === 1) {
				// Handle failure case (status: 1)
				const errorMessage = data?.message || "File upload failed";

				// Check if error is PIN-related based on response_type_id
				// 2413 = Invalid PIN error
				const isPinError = data?.response_type_id === 2413;

				toast({
					title: "Upload Failed",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				// Always clear the file on failure
				setFile(null);

				// Only reset PIN if it's a PIN-related error (2413)
				// For other errors (2410 = duplicate file, etc.), keep PIN valid
				if (isPinError) {
					setPintwinEncoded("");
					setPinLength(0);
					setPinResetTrigger((prev) => prev + 1);
				}

				reset();
			} else {
				// Unexpected response
				throw new Error(data?.message || "Unexpected response format");
			}
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : "Upload failed";
			toast({
				title: "Error",
				description: errorMsg,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsUploading(false);
		}
	};

	const buttonConfigList = [
		{
			type: "submit" as const,
			size: "lg",
			label: "Upload",

			loading: isUploading,
			disabled:
				pinLength < 4 || !file || !isValid || isUploading || !canUpload,
			styles: {
				h: "45px",
				w: { base: "100%", md: "50%" },
			},
		},
	];

	return (
		<form
			onSubmit={handleSubmit(handleFormSubmit)}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
				}
			}}
		>
			<Card maxW="100%" w="100%" h="auto" p={{ base: 4, md: 6 }}>
				<Flex direction="column" gap="6">
					{/* Sample file download */}
					<Flex direction="column" gap="2">
						<InputLabel textTransform="none">
							Download Sample File
						</InputLabel>
						<Link
							href={SAMPLE_DOWNLOAD_LINK}
							w="fit-content"
							fontWeight="semibold"
							isExternal
							_hover={{ textDecoration: "none" }}
						>
							<Flex
								as="span"
								align="center"
								gap="2"
								color="primary.DEFAULT"
								fontSize="sm"
							>
								<Icon name="file-download" size="sm" />
								sample_bulk_payment.xlsx
							</Flex>
						</Link>
					</Flex>

					{/* File upload */}
					<Flex direction="column" gap="2">
						<InputLabel textTransform="none" required>
							Upload File
						</InputLabel>
						<Dropzone
							file={file}
							setFile={setFile}
							accept=".xlsx,.xls"
						/>
					</Flex>

					{/* Pintwin */}
					<Box maxW={{ base: "100%", md: "300px" }}>
						<InputPintwin
							label="Secret PIN"
							lengthMin={4}
							lengthMax={4}
							required={true}
							pintwinApp={true}
							resetTrigger={pinResetTrigger}
							// useMockData={true}
							onChange={(value, masked) => {
								setPintwinEncoded(value);
								// Track PIN length based on masked value (which shows actual digit count)
								setPinLength(masked.length);
							}}
						/>
					</Box>

					<ActionButtonGroup buttonConfigList={buttonConfigList} />
				</Flex>
			</Card>
		</form>
	);
};

export default UploadRecipients;
