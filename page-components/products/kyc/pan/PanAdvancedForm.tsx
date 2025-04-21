import {
	Box,
	Card,
	Collapse,
	Flex,
	Grid,
	GridItem,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Button, Input } from "components";
import { useEpsV3Fetch } from "hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResponseSection, ResponseToolbar } from "../../common";
import { PanAdvancedResponseData } from "./types";

interface PanAdvancedFormValues {
	pan: string;
	name: string;
	dob: string;
}

// Component for displaying personal information from PAN advanced verification
const PersonalInfoSection = ({
	data,
}: {
	data: PanAdvancedResponseData;
}): JSX.Element => (
	<ResponseSection heading="Personal Information">
		<Grid templateColumns="200px 1fr" gap={1}>
			<GridItem>
				<Text fontWeight="medium">PAN Number:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.pan}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Provided Name:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.name_provided}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Registered Name:</Text>
			</GridItem>
			<GridItem>
				<Text fontWeight="semibold">{data.registered_name}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">First Name:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.first_name}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Last Name:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.last_name}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Gender:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.gender}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">PAN Type:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.type}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Date of Birth:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.date_of_birth}</Text>
			</GridItem>
		</Grid>
	</ResponseSection>
);

// Component for displaying contact information from PAN advanced verification
const ContactInfoSection = ({
	data,
}: {
	data: PanAdvancedResponseData;
}): JSX.Element => {
	// Only show this section if we have at least one contact field
	const hasContactInfo = !!(data.email || data.mobile_number || data.address);

	if (!hasContactInfo) {
		return <></>;
	}

	return (
		<ResponseSection heading="Contact Information">
			<Grid templateColumns="200px 1fr" gap={1}>
				{data.email && (
					<>
						<GridItem>
							<Text fontWeight="medium">Email:</Text>
						</GridItem>
						<GridItem>
							<Text>{data.email}</Text>
						</GridItem>
					</>
				)}

				{data.mobile_number && (
					<>
						<GridItem>
							<Text fontWeight="medium">Mobile Number:</Text>
						</GridItem>
						<GridItem>
							<Text>{data.mobile_number}</Text>
						</GridItem>
					</>
				)}

				{data.address && (
					<>
						<GridItem>
							<Text fontWeight="medium">Full Address:</Text>
						</GridItem>
						<GridItem>
							<Text>{data.address.full_address}</Text>
						</GridItem>

						{data.address.street && (
							<>
								<GridItem>
									<Text fontWeight="medium">Street:</Text>
								</GridItem>
								<GridItem>
									<Text>{data.address.street}</Text>
								</GridItem>
							</>
						)}

						{data.address.city && (
							<>
								<GridItem>
									<Text fontWeight="medium">City:</Text>
								</GridItem>
								<GridItem>
									<Text>{data.address.city}</Text>
								</GridItem>
							</>
						)}

						{data.address.state && (
							<>
								<GridItem>
									<Text fontWeight="medium">State:</Text>
								</GridItem>
								<GridItem>
									<Text>{data.address.state}</Text>
								</GridItem>
							</>
						)}

						{data.address.pincode && (
							<>
								<GridItem>
									<Text fontWeight="medium">PIN Code:</Text>
								</GridItem>
								<GridItem>
									<Text>{data.address.pincode}</Text>
								</GridItem>
							</>
						)}

						{data.address.country && (
							<>
								<GridItem>
									<Text fontWeight="medium">Country:</Text>
								</GridItem>
								<GridItem>
									<Text>{data.address.country}</Text>
								</GridItem>
							</>
						)}
					</>
				)}
			</Grid>
		</ResponseSection>
	);
};

// Component for displaying KYC status from PAN advanced verification
const KycStatusSection = ({
	data,
}: {
	data: PanAdvancedResponseData;
}): JSX.Element => (
	<ResponseSection heading="KYC Status">
		<Grid templateColumns="200px 1fr" gap={1}>
			{data.masked_aadhaar_number && (
				<>
					<GridItem>
						<Text fontWeight="medium">Masked Aadhaar:</Text>
					</GridItem>
					<GridItem>
						<Text>{data.masked_aadhaar_number}</Text>
					</GridItem>
				</>
			)}

			<GridItem>
				<Text fontWeight="medium">Aadhaar Linked:</Text>
			</GridItem>
			<GridItem>
				<Text
					fontWeight="medium"
					color={data.aadhaar_linked ? "green.500" : "orange.500"}
				>
					{data.aadhaar_linked ? "Yes" : "No"}
				</Text>
			</GridItem>
		</Grid>
	</ResponseSection>
);

// Component for the PAN advanced result card
const PanAdvancedResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: PanAdvancedResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			PAN Advanced Verification Result
		</Text>

		<VStack spacing={4} align="stretch">
			<PersonalInfoSection data={data} />
			<ContactInfoSection data={data} />
			<KycStatusSection data={data} />
		</VStack>

		<ResponseToolbar
			data={data}
			onBack={onBack}
			onReset={onReset}
			resetButtonText="Verify Another PAN"
		/>
	</Card>
);

// Helper to format date correctly for the API (YYYY-MM-DD)
const formatDateForApi = (dateString: string): string => {
	if (!dateString) return "";

	// Check if already in YYYY-MM-DD format
	if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
		return dateString;
	}

	// Otherwise, assume DD/MM/YYYY format and convert
	const parts = dateString.split("/");
	if (parts.length === 3) {
		const [day, month, year] = parts;
		return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
	}

	return dateString;
};

export const PanAdvancedForm = (): JSX.Element => {
	const [panResponse, setPanResponse] =
		useState<PanAdvancedResponseData | null>(null);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fetchPan, isLoadingPan] = useEpsV3Fetch("/tools/kyc/pan-advanced", {
		method: "POST",
	});

	const panForm = useForm<PanAdvancedFormValues>({
		mode: "onChange",
		defaultValues: {
			dob: "",
		},
	});
	const router = useRouter();

	// Handler to reset form and show input fields again
	const handleReset = () => {
		setCollapsed(false);
		setPanResponse(null);
		setError(null);
		panForm.reset();
	};

	// Handler to navigate back to PAN main page
	const handleBack = () => {
		router.push("/products/kyc/pan");
	};

	// Handler to submit the PAN form
	const handlePanSubmit = async (values: PanAdvancedFormValues) => {
		setCollapsed(false);
		setError(null);

		// Format the date in YYYY-MM-DD format for the API
		const formattedDob = formatDateForApi(values.dob);

		const response = await fetchPan({
			body: {
				pan: values.pan,
				name: values.name,
				dob: formattedDob,
			},
		});

		// Check for API response
		if (response?.data) {
			// Success case: status === 0
			if (response.data.status === 0 && response.data.data) {
				setPanResponse(response.data.data);
				setCollapsed(true);
			}
			// Error case: status !== 0
			else {
				const errorMessage =
					response.data.message ||
					"Failed to verify PAN. Please check your input and try again.";
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
		<Box maxW="600px" mx="auto" mt={8}>
			<Card mb={4} p={4}>
				<Text fontSize="lg" fontWeight="semibold" mb={2}>
					PAN Advanced Verification
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Enter PAN number, name, and date of birth to get detailed
					information including contact details and KYC status.
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
					<form onSubmit={panForm.handleSubmit(handlePanSubmit)}>
						<VStack spacing={4} align="stretch">
							<Input
								label="PAN Number"
								required
								placeholder="Enter PAN Number (e.g., ABCDE1234F)"
								{...panForm.register("pan", {
									required: true,
									pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
									maxLength: 10,
								})}
								invalid={!!panForm.formState.errors.pan}
								errorMsg={
									panForm.formState.errors.pan
										? "Valid PAN format required (e.g., ABCDE1234F)"
										: ""
								}
							/>
							<Input
								label="Full Name"
								required
								placeholder="Enter Full Name as per PAN"
								{...panForm.register("name", {
									required: true,
									minLength: 3,
								})}
								invalid={!!panForm.formState.errors.name}
								errorMsg={
									panForm.formState.errors.name
										? "Please enter a valid name"
										: ""
								}
							/>
							<Input
								label="Date of Birth"
								required
								placeholder="YYYY-MM-DD"
								{...panForm.register("dob", {
									required: true,
									pattern:
										/^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/,
								})}
								invalid={!!panForm.formState.errors.dob}
								errorMsg={
									panForm.formState.errors.dob
										? "Enter valid date (YYYY-MM-DD or DD/MM/YYYY)"
										: ""
								}
							/>
							<Button
								type="submit"
								size="lg"
								loading={isLoadingPan}
								w={{ base: "100%", md: "200px" }}
							>
								Verify PAN
							</Button>
						</VStack>
					</form>
				</Collapse>
				{collapsed && panForm.getValues("pan") && (
					<Box mb={2}>
						<Text fontSize="sm" color="gray.600">
							PAN: {panForm.getValues("pan")}
						</Text>
					</Box>
				)}
			</Card>
			{panResponse && (
				<PanAdvancedResultCard
					data={panResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};
