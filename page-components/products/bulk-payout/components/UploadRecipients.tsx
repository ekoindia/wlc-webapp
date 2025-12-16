import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { ActionButtonGroup, Dropzone, Icon, InputLabel } from "components";
import { ParamType } from "constants/trxnFramework";
import { useUser } from "contexts";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";
import { useBulkPayout } from "../context/BulkPayoutContext";
import { useBulkPayoutApi } from "../hooks/useBulkPayoutApi";

const SAMPLE_DOWNLOAD_LINK =
	"https://files.eko.co.in/docs/bulk_payout/sample_bulk_payout.xlsx";

interface UploadFormData {
	pintwin: string;
}

/**
 * UploadRecipients component for uploading Excel file with recipient data
 * Tab 1 in the main view
 */
const UploadRecipients = () => {
	const [file, setFile] = useState<File | null>(null);
	const {
		customer,
		uploadStatus,
		validationErrors,
		currentBatchNumber,
		error,
		resetUpload,
	} = useBulkPayout();
	const { processRecords } = useBulkPayoutApi();
	const { userData } = useUser();

	const {
		handleSubmit,
		register,
		control,
		reset,
		formState: { errors, isValid },
	} = useForm<UploadFormData>({
		mode: "onChange",
	});

	const watcher = useWatch({ control });

	const pintwinkParameterList = [
		{
			name: "pintwin",
			label: "Enter Pintwin to Confirm",
			parameter_type_id: ParamType.PINTWIN,
			placeholder: "Enter 4-digit pintwin",
		},
	];

	const isUploading = uploadStatus === "uploading";
	const isSuccess = uploadStatus === "success";
	const hasErrors = uploadStatus === "error";

	const handleFormSubmit = async (data: UploadFormData) => {
		if (!file || !customer) return;

		const payload = {
			bc: "1",
			sender_name: userData?.userDetails?.name || customer.customerName,
			source: "NEWCONNECT",
			locale: "en",
			user_code: userData?.user_code || "",
			pintwin: data.pintwin,
			is_consent: "1",
			latlong: "0,0,0",
			version: "v2",
			client_ref_id:
				Date.now() + "" + Math.floor(Math.random() * 1000000000),
			initiator_id: userData?.initiator_id || "",
			org_id: userData?.org_id || "1",
			customer_id: customer.customerId,
			service_code: "45",
		};

		await processRecords(file, payload);
	};

	const handleNewUpload = () => {
		setFile(null);
		reset();
		resetUpload();
	};

	const buttonConfigList = [
		{
			type: "submit" as const,
			size: "lg",
			label: "Upload",
			loading: isUploading,
			disabled: !file || !isValid || isUploading,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
	];

	// Success state
	if (isSuccess && currentBatchNumber) {
		return (
			<Flex direction="column" gap="6" maxW="600px">
				<Flex
					bg="green.50"
					p="6"
					borderRadius="12px"
					direction="column"
					gap="3"
				>
					<Flex align="center" gap="2">
						<Icon name="check-circle" color="green.500" size="md" />
						<Text fontWeight="semibold" color="green.700">
							Upload Successful
						</Text>
					</Flex>
					<Text fontSize="sm" color="green.700">
						Your batch has been submitted for processing.
					</Text>
					<Flex
						bg="green.100"
						p="3"
						borderRadius="8px"
						justify="space-between"
					>
						<Text fontSize="sm" color="green.800">
							Batch Number:
						</Text>
						<Text
							fontSize="sm"
							fontWeight="semibold"
							color="green.800"
						>
							{currentBatchNumber}
						</Text>
					</Flex>
				</Flex>
				<ActionButtonGroup
					buttonConfigList={[
						{
							size: "lg",
							label: "Upload Another File",
							onClick: handleNewUpload,
							variant: "outline",
							styles: { h: "56px", w: "100%" },
						},
					]}
				/>
			</Flex>
		);
	}

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="6" maxW="600px">
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
							sample_bulk_payout.xlsx
						</Flex>
					</Link>
				</Flex>

				{/* File upload */}
				<Flex direction="column" gap="2">
					<InputLabel textTransform="none" required>
						Upload Recipients List
					</InputLabel>
					<Dropzone
						file={file}
						setFile={setFile}
						accept=".xlsx,.xls"
					/>
				</Flex>

				{/* Pintwin */}
				<Form
					parameter_list={pintwinkParameterList}
					formValues={watcher}
					control={control}
					register={register}
					errors={errors}
				/>

				{/* Validation Errors */}
				{hasErrors && validationErrors.length > 0 && (
					<Flex
						bg="red.50"
						p="4"
						borderRadius="12px"
						direction="column"
						gap="2"
					>
						<Flex align="center" gap="2">
							<Icon
								name="alert-circle"
								color="red.500"
								size="sm"
							/>
							<Text
								fontWeight="semibold"
								color="red.600"
								fontSize="sm"
							>
								Validation Errors
							</Text>
						</Flex>
						<Box maxH="200px" overflowY="auto">
							{validationErrors.map((err, idx) => (
								<Flex
									key={idx}
									fontSize="xs"
									color="red.600"
									py="1"
									borderBottom={
										idx < validationErrors.length - 1
											? "1px solid"
											: "none"
									}
									borderColor="red.100"
								>
									<Text minW="60px">
										Row {err.rowNumber}:
									</Text>
									<Text>{err.errors.join(", ")}</Text>
								</Flex>
							))}
						</Box>
					</Flex>
				)}

				{/* General Error */}
				{error && validationErrors.length === 0 && (
					<Flex
						bg="red.50"
						color="red.600"
						p="3"
						borderRadius="8px"
						fontSize="sm"
					>
						{error}
					</Flex>
				)}

				<ActionButtonGroup buttonConfigList={buttonConfigList} />
			</Flex>
		</form>
	);
};

export default UploadRecipients;
