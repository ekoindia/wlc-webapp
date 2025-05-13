// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/page-components/products/kyc/voter-id/VoterIdForm.tsx
import {
	Box,
	Card,
	Collapse,
	Flex,
	Grid,
	GridItem,
	Text,
} from "@chakra-ui/react";
import { Button, Input } from "components";
import { useEpsV3Fetch } from "hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResponseSection, ResponseToolbar } from "../../common";
import { VoterIdRequestParams, VoterIdResponseData } from "./types";

interface VoterIdFormValues {
	epicNumber: string;
	name?: string;
}

// Component to display personal information section
const PersonalInfoSection = ({
	data,
}: {
	data: VoterIdResponseData;
}): JSX.Element => (
	<ResponseSection heading="Personal Information">
		<Grid templateColumns="200px 1fr" gap={1}>
			<GridItem>
				<Text fontWeight="medium">Name:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.name}</Text>
			</GridItem>

			{data.name_in_regional_lang && (
				<>
					<GridItem>
						<Text fontWeight="medium">Name (Regional):</Text>
					</GridItem>
					<GridItem>
						<Text>{data.name_in_regional_lang}</Text>
					</GridItem>
				</>
			)}

			<GridItem>
				<Text fontWeight="medium">Age:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.age} years</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Gender:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.gender}</Text>
			</GridItem>

			{data.dob && (
				<>
					<GridItem>
						<Text fontWeight="medium">Date of Birth:</Text>
					</GridItem>
					<GridItem>
						<Text>{data.dob}</Text>
					</GridItem>
				</>
			)}

			<GridItem>
				<Text fontWeight="medium">Father Name:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.relation_name}</Text>
			</GridItem>

			{data.relation_name_in_regional_lang && (
				<>
					<GridItem>
						<Text fontWeight="medium">Father Name (Regional):</Text>
					</GridItem>
					<GridItem>
						<Text>{data.relation_name_in_regional_lang}</Text>
					</GridItem>
				</>
			)}

			{data.father_name && data.father_name !== data.relation_name && (
				<>
					<GridItem>
						<Text fontWeight="medium">Father's Name:</Text>
					</GridItem>
					<GridItem>
						<Text>{data.father_name}</Text>
					</GridItem>
				</>
			)}
		</Grid>
	</ResponseSection>
);

// Component to display address information
const AddressSection = ({
	data,
}: {
	data: VoterIdResponseData;
}): JSX.Element => (
	<ResponseSection heading="Address Information">
		<Grid templateColumns="200px 1fr" gap={1}>
			<GridItem>
				<Text fontWeight="medium">Complete Address:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.address}</Text>
			</GridItem>

			{data.split_address && (
				<>
					{data.split_address.address_line && (
						<>
							<GridItem>
								<Text fontWeight="medium">Address Line:</Text>
							</GridItem>
							<GridItem>
								<Text>{data.split_address.address_line}</Text>
							</GridItem>
						</>
					)}

					{data.split_address.city &&
						data.split_address.city.length > 0 && (
							<>
								<GridItem>
									<Text fontWeight="medium">City:</Text>
								</GridItem>
								<GridItem>
									<Text>
										{data.split_address.city.join(", ")}
									</Text>
								</GridItem>
							</>
						)}

					{data.split_address.district &&
						data.split_address.district.length > 0 && (
							<>
								<GridItem>
									<Text fontWeight="medium">District:</Text>
								</GridItem>
								<GridItem>
									<Text>
										{data.split_address.district.join(", ")}
									</Text>
								</GridItem>
							</>
						)}

					{data.split_address.state &&
						data.split_address.state.length > 0 && (
							<>
								<GridItem>
									<Text fontWeight="medium">State:</Text>
								</GridItem>
								<GridItem>
									<Text>
										{data.split_address.state
											.map((stateArr) =>
												stateArr.join(", ")
											)
											.join("; ")}
									</Text>
								</GridItem>
							</>
						)}

					{data.split_address.pincode && (
						<>
							<GridItem>
								<Text fontWeight="medium">PIN Code:</Text>
							</GridItem>
							<GridItem>
								<Text>{data.split_address.pincode}</Text>
							</GridItem>
						</>
					)}

					{data.split_address.country &&
						data.split_address.country.length > 0 && (
							<>
								<GridItem>
									<Text fontWeight="medium">Country:</Text>
								</GridItem>
								<GridItem>
									<Text>
										{data.split_address.country.join(", ")}
									</Text>
								</GridItem>
							</>
						)}
				</>
			)}
		</Grid>
	</ResponseSection>
);

// Component to display electoral information
const ElectoralSection = ({
	data,
}: {
	data: VoterIdResponseData;
}): JSX.Element => (
	<ResponseSection heading="Electoral Information">
		<Grid templateColumns="200px 1fr" gap={1}>
			<GridItem>
				<Text fontWeight="medium">EPIC Number:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.epic_number}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">State:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.state}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Assembly Constituency:</Text>
			</GridItem>
			<GridItem>
				<Text>
					{data.assembly_constituency} (No.{" "}
					{data.assembly_constituency_number})
				</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Parliamentary Constituency:</Text>
			</GridItem>
			<GridItem>
				<Text>
					{data.parliamentary_constituency} (No.{" "}
					{data.parliamentary_constituency_number})
				</Text>
			</GridItem>

			{data.part_number && data.part_name && (
				<>
					<GridItem>
						<Text fontWeight="medium">Part Details:</Text>
					</GridItem>
					<GridItem>
						<Text>
							{data.part_name} (No. {data.part_number})
						</Text>
					</GridItem>
				</>
			)}

			{data.serial_number && (
				<>
					<GridItem>
						<Text fontWeight="medium">Serial Number:</Text>
					</GridItem>
					<GridItem>
						<Text>{data.serial_number}</Text>
					</GridItem>
				</>
			)}

			{data.polling_station && (
				<>
					<GridItem>
						<Text fontWeight="medium">Polling Station:</Text>
					</GridItem>
					<GridItem>
						<Text>{data.polling_station}</Text>
					</GridItem>
				</>
			)}
		</Grid>
	</ResponseSection>
);

// Component for the entire Voter ID result display
const VoterIdResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: VoterIdResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			Voter ID Verification Result
		</Text>
		<PersonalInfoSection data={data} />
		<AddressSection data={data} />
		<ElectoralSection data={data} />

		<ResponseToolbar
			data={data}
			onBack={onBack}
			onReset={onReset}
			resetButtonText="Verify Another Voter ID"
		/>
	</Card>
);

export const VoterIdForm = (): JSX.Element => {
	const [voterIdResponse, setVoterIdResponse] =
		useState<VoterIdResponseData | null>(null);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fetchVoterId, isLoadingVoterId] = useEpsV3Fetch(
		"/tools/kyc/voter-id",
		{
			method: "POST",
		}
	);

	const voterIdForm = useForm<VoterIdFormValues>({ mode: "onChange" });
	const router = useRouter();

	// Handler to reset form and show input fields again
	const handleReset = () => {
		setCollapsed(false);
		setVoterIdResponse(null);
		setError(null);
		voterIdForm.reset();
	};

	// Handler to navigate back to Voter ID main page
	const handleBack = () => {
		router.push("/products/kyc");
	};

	// Handler to submit the Voter ID form
	const handleVoterIdSubmit = async (values: VoterIdFormValues) => {
		setCollapsed(false);
		setError(null);

		const requestPayload: VoterIdRequestParams = {
			epic_number: values.epicNumber.toUpperCase(),
		};

		// Add optional name parameter if provided
		if (values.name) {
			requestPayload.name = values.name;
		}

		const response = await fetchVoterId({
			body: requestPayload,
		});

		// Check for API response
		if (response?.data) {
			// Success case: status === 0
			if (response.data.status === 0 && response.data.data) {
				setVoterIdResponse(response.data.data);
				setCollapsed(true);
			}
			// Error case: status !== 0
			else {
				const errorMessage =
					response.data.message ||
					"Failed to verify Voter ID. Please check your input and try again.";
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

	return (
		<Box maxW="800px" mx="auto" mt={8}>
			<Card mb={4} p={4}>
				<Text fontSize="lg" fontWeight="semibold" mb={2}>
					Voter ID Verification
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Enter the Electoral Photo Identity Card (EPIC) number to
					verify its details and retrieve constituency information.
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
				<Collapse in={!collapsed} animateOpacity>
					<form
						onSubmit={voterIdForm.handleSubmit(handleVoterIdSubmit)}
					>
						<Flex direction="column" gap={4}>
							<Input
								label="EPIC Number"
								required
								maxlength={10}
								placeholder="Enter the Electoral Photo Identity Card Number"
								{...voterIdForm.register("epicNumber", {
									required: true,
									pattern: {
										value: /^[A-Z0-9]{10}$/,
										message:
											"Enter a valid EPIC Number (10 alphanumeric characters)",
									},
									onChange: (e) => {
										// Convert input to uppercase dynamically
										e.target.value =
											e.target.value.toUpperCase();
									},
								})}
								invalid={
									!!voterIdForm.formState.errors.epicNumber
								}
								errorMsg={
									voterIdForm.formState.errors.epicNumber
										? "EPIC Number is required"
										: ""
								}
							/>
							<Input
								label="Name (Optional)"
								maxlength={50}
								placeholder="Enter voter's name for additional verification"
								{...voterIdForm.register("name", {
									pattern: /^[A-Za-z\s.]+$/,
									minLength: 2,
								})}
								invalid={!!voterIdForm.formState.errors.name}
								errorMsg={
									voterIdForm.formState.errors.name
										?.message ?? ""
								}
							/>
							<Button
								type="submit"
								size="lg"
								loading={isLoadingVoterId}
								w={{ base: "100%", md: "200px" }}
							>
								Verify Voter ID
							</Button>
						</Flex>
					</form>
				</Collapse>
				{collapsed && voterIdForm.getValues("epicNumber") && (
					<Box mb={2}>
						<Text fontSize="sm" color="gray.600">
							EPIC Number: {voterIdForm.getValues("epicNumber")}
							{voterIdForm.getValues("name") &&
								`, Name: ${voterIdForm.getValues("name")}`}
						</Text>
					</Box>
				)}
			</Card>
			{voterIdResponse && (
				<VoterIdResultCard
					data={voterIdResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};
