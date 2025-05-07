import {
	Box,
	Card,
	Collapse,
	Flex,
	IconButton,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from "@chakra-ui/react";
import { Button, Icon, Input } from "components";
import { useEpsV3Fetch } from "hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ResponseSection, ResponseToolbar } from "../../common";
import {
	BulkPanEntry,
	BulkPanResponseData,
	BulkPanStatusResponseData,
} from "./types";

interface PanBulkFormValues {
	entries: BulkPanEntry[];
	referenceId?: string;
	bulkVerificationId?: string;
}

// Component for displaying the bulk verification result
const BulkSubmitResultCard = ({
	data,
	onCheckStatus,
	onReset,
	onBack,
}: {
	data: BulkPanResponseData;
	onCheckStatus: () => void;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			Bulk PAN Verification Submitted
		</Text>

		<ResponseSection heading="Reference Information">
			<Flex direction="column" gap={1}>
				<Flex>
					<Text width="200px" fontWeight="medium">
						Reference ID:
					</Text>
					<Text fontWeight="semibold">{data.reference_id}</Text>
				</Flex>
				<Flex>
					<Text width="200px" fontWeight="medium">
						Bulk Verification ID:
					</Text>
					<Text fontWeight="semibold">
						{data.bulk_verification_id}
					</Text>
				</Flex>

				<Flex align="center" mt={2}>
					<Text>
						Your bulk PAN verification request has been submitted
						successfully. Use the Reference ID to check the status.
					</Text>
				</Flex>
			</Flex>
		</ResponseSection>

		<Flex justify="space-between" mt={4}>
			<Button onClick={onCheckStatus} size="lg">
				Check Status
			</Button>
			<ResponseToolbar
				data={data}
				onBack={onBack}
				onReset={onReset}
				resetButtonText="Submit Another Batch"
			/>
		</Flex>
	</Card>
);

// Component for displaying bulk PAN verification status results
const BulkStatusResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: BulkPanStatusResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			Bulk PAN Verification Results
		</Text>

		<ResponseSection heading="Results">
			<Flex direction="column">
				<Text mb={2}>Total PANs processed: {data.count}</Text>

				<Box overflowX="auto">
					<Table size="sm" variant="simple">
						<Thead>
							<Tr>
								<Th>PAN</Th>
								<Th>Name</Th>
								<Th>Registered Name</Th>
								<Th>Status</Th>
								<Th>Aadhaar Status</Th>
							</Tr>
						</Thead>
						<Tbody>
							{data.entries.map((entry, index) => (
								<Tr key={index}>
									<Td>{entry.pan}</Td>
									<Td>{entry.name_provided || "-"}</Td>
									<Td>{entry.registered_name || "-"}</Td>
									<Td>
										<Text
											fontWeight="medium"
											color={
												entry.valid === "true"
													? "green.500"
													: "red.500"
											}
										>
											{entry.valid === "true"
												? "Valid"
												: "Invalid"}
										</Text>
									</Td>
									<Td>
										{entry.aadhaar_seeding_status_desc ||
											"-"}
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			</Flex>
		</ResponseSection>

		<ResponseToolbar
			data={data}
			onBack={onBack}
			onReset={onReset}
			resetButtonText="Verify Another Batch"
		/>
	</Card>
);

export const PanBulkForm = (): JSX.Element => {
	const [bulkResponse, setBulkResponse] =
		useState<BulkPanResponseData | null>(null);
	const [statusResponse, setStatusResponse] =
		useState<BulkPanStatusResponseData | null>(null);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fetchBulkPan, isLoadingBulkSubmit] = useEpsV3Fetch(
		"/tools/kyc/pan/bulk",
		{
			method: "POST",
		}
	);

	const bulkForm = useForm<PanBulkFormValues>({
		mode: "onChange",
		defaultValues: {
			entries: [{ pan: "", name: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: bulkForm.control,
		name: "entries",
	});

	const router = useRouter();

	// Handler to reset form and show input fields again
	const handleReset = () => {
		setCollapsed(false);
		setBulkResponse(null);
		setStatusResponse(null);
		setError(null);
		bulkForm.reset({
			entries: [{ pan: "", name: "" }],
		});
	};

	// Handler to navigate back to PAN main page
	const handleBack = () => {
		router.push("/products/kyc/pan");
	};

	// Handler to submit the bulk PAN verification form
	const handleBulkSubmit = async (values: PanBulkFormValues) => {
		setCollapsed(false);
		setError(null);
		setStatusResponse(null);

		// Filter out entries with empty PAN
		const validEntries = values.entries.filter(
			(entry) => entry.pan.trim() !== ""
		);

		if (validEntries.length === 0) {
			setError("Please enter at least one PAN number");
			return;
		}

		const response = await fetchBulkPan({
			body: {
				entries: validEntries,
			},
		});

		// Check for API response
		if (response?.data) {
			// Success case: status === 0
			if (response.data.status === 0 && response.data.data) {
				setBulkResponse(response.data.data);
				setCollapsed(true);
				// Store reference ID for status check
				bulkForm.setValue(
					"referenceId",
					response.data.data.reference_id.toString()
				);
				bulkForm.setValue(
					"bulkVerificationId",
					response.data.data.bulk_verification_id.toString()
				);
			}
			// Error case: status !== 0
			else {
				const errorMessage =
					response.data.message ||
					"Failed to submit bulk PAN verification. Please check your input and try again.";
				setError(errorMessage);
				console.error("API Error Response:", response.data);
			}
		} else if (response?.error) {
			// Network or fetch error
			setError(
				"Network error. Please check your connection and try again."
			);
			console.error("Fetch Error:", response);
		} else {
			// Handle unexpected response format
			setError("Invalid response from server. Please try again later.");
			console.error("Invalid API response format", response);
		}
	};

	const [fetchBulkStatus, isLoadingBulkStatus] = useEpsV3Fetch(
		"/tools/kyc/pan/bulk/status",
		{
			method: "GET",
		}
	);

	// Handler to check bulk PAN verification status
	const handleCheckStatus = async () => {
		setError(null);
		try {
			// Make the API call with query parameters in the URL
			const response = await fetchBulkStatus({
				body: {
					reference_id:
						bulkResponse?.reference_id ??
						bulkForm.getValues("referenceId"),
					bulk_verification_id:
						bulkResponse?.bulk_verification_id ??
						bulkForm.getValues("bulkVerificationId"),
				},
			});

			console.log("Check Status API Response:", response);

			if (response?.data) {
				if (response.data.status === 0 && response.data.data) {
					setStatusResponse(response.data.data);
					bulkForm.resetField("referenceId");
					bulkForm.resetField("bulkVerificationId");
				} else {
					setError(
						response.data.message ||
							"Failed to get bulk PAN verification status. Please try again."
					);
				}
			} else if (response?.error) {
				setError(
					"Network error. Please check your connection and try again."
				);
			} else {
				setError(
					"Invalid response from server. Please try again later."
				);
			}
		} catch (error) {
			setError("An unexpected error occurred. Please try again later.");
			console.error("Unexpected Error:", error);
		}
	};

	// Function to add another PAN entry field
	const addEntry = () => {
		append({ pan: "", name: "" });
	};

	return (
		<Box maxW="800px" mx="auto" mt={8}>
			<Card mb={4} p={4}>
				<Text fontSize="lg" fontWeight="semibold" mb={2}>
					Bulk PAN Verification
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Verify multiple PAN numbers in a batch. Optionally include
					names for validation.
				</Text>
				{error && (
					<Box
						p={3}
						bg="red.50"
						color="red.800"
						borderRadius="md"
						borderLeft="4px"
						borderLeftColor="red.500"
						mb={4}
					>
						<Flex align="center">
							<Text fontWeight="medium">{error}</Text>
						</Flex>
					</Box>
				)}
				<Collapse in={!collapsed || !statusResponse} animateOpacity>
					<form onSubmit={bulkForm.handleSubmit(handleBulkSubmit)}>
						<Box mb={4}>
							<Text mb={2} fontWeight="medium">
								Already have a Reference ID & Bulk Verification
								ID?
							</Text>
							<Flex gap={2}>
								<Input
									placeholder="Enter Reference ID"
									{...bulkForm.register("referenceId")}
								/>
								<Input
									placeholder="Enter Reference ID"
									{...bulkForm.register("bulkVerificationId")}
								/>
							</Flex>
						</Box>
						<Flex justify="space-between" mb={4}>
							<Button
								onClick={handleCheckStatus}
								isLoading={isLoadingBulkStatus}
								loadingText="Checking"
								size="lg"
							>
								Check Status
							</Button>
						</Flex>
						{!statusResponse && (
							<>
								<Box mt={6} mb={2}>
									<Text fontWeight="medium" mb={2}>
										Enter PAN details:
									</Text>
								</Box>
								<VStack spacing={2} align="stretch" mb={4}>
									{fields.map((field, index) => (
										<Flex
											key={field.id}
											gap={2}
											align="flex-end"
										>
											<Box flex={2}>
												<Input
													label={
														index === 0
															? "PAN Number"
															: ""
													}
													placeholder="PAN Number"
													{...bulkForm.register(
														`entries.${index}.pan`,
														{
															pattern:
																/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
														}
													)}
													invalid={
														!!bulkForm.formState
															.errors.entries?.[
															index
														]?.pan
													}
													errorMsg={
														bulkForm.formState
															.errors.entries?.[
															index
														]?.pan
															? "Valid PAN format required"
															: ""
													}
												/>
											</Box>
											<Box flex={2}>
												<Input
													label={
														index === 0
															? "Name (Optional)"
															: ""
													}
													placeholder="Name (Optional)"
													{...bulkForm.register(
														`entries.${index}.name`
													)}
												/>
											</Box>
											{index > 0 && (
												<IconButton
													aria-label="Remove PAN"
													icon={
														<Icon name="delete" />
													}
													onClick={() =>
														remove(index)
													}
													colorScheme="red"
													variant="ghost"
													mb={
														bulkForm.formState
															.errors.entries?.[
															index
														]
															? "8"
															: "0"
													}
												/>
											)}
										</Flex>
									))}
								</VStack>

								<Flex justify="space-between" mb={4}>
									<Button
										leftIcon={<Icon name="add" />}
										onClick={addEntry}
										variant="outline"
										size="lg"
									>
										Add Another PAN
									</Button>
									<Button
										type="submit"
										size="lg"
										loading={isLoadingBulkSubmit}
										loadingText="Submitting"
										colorScheme="blue"
									>
										Submit Batch
									</Button>
								</Flex>
							</>
						)}
					</form>
				</Collapse>
			</Card>

			{bulkResponse && !statusResponse && (
				<BulkSubmitResultCard
					data={bulkResponse}
					onCheckStatus={handleCheckStatus}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}

			{statusResponse && (
				<BulkStatusResultCard
					data={statusResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};
