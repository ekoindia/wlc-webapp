import { Box, Card, Collapse, Flex, Text, VStack } from "@chakra-ui/react";
import { Button, Input } from "components";
import { useEpsV3Fetch } from "hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResponseSection, ResponseToolbar } from "../../common";
import { PanLiteResponseData } from "./types";

interface PanLiteFormValues {
	pan: string;
	name: string;
	dob: string;
}

// Component for displaying PAN lite verification results
const PanLiteInfoSection = ({
	data,
}: {
	data: PanLiteResponseData;
}): JSX.Element => (
	<ResponseSection heading="PAN Verification Results">
		<Flex direction="column" gap={1}>
			<Flex>
				<Text width="200px" fontWeight="medium">
					PAN Number:
				</Text>
				<Text>{data.pan}</Text>
			</Flex>
			<Flex>
				<Text width="200px" fontWeight="medium">
					Name:
				</Text>
				<Text>{data.name}</Text>
			</Flex>
			<Flex>
				<Text width="200px" fontWeight="medium">
					Date of Birth:
				</Text>
				<Text>{data.dob}</Text>
			</Flex>
			<Flex>
				<Text width="200px" fontWeight="medium">
					Name Match:
				</Text>
				<Text
					fontWeight="medium"
					color={data.name_match === "Y" ? "green.500" : "red.500"}
				>
					{data.name_match === "Y"
						? "Yes"
						: data.name_match === "N"
							? "No"
							: "Unknown"}
				</Text>
			</Flex>
			<Flex>
				<Text width="200px" fontWeight="medium">
					DOB Match:
				</Text>
				<Text
					fontWeight="medium"
					color={data.dob_match === "Y" ? "green.500" : "red.500"}
				>
					{data.dob_match === "Y"
						? "Yes"
						: data.dob_match === "N"
							? "No"
							: "Unknown"}
				</Text>
			</Flex>
			<Flex>
				<Text width="200px" fontWeight="medium">
					Status:
				</Text>
				<Text
					fontWeight="medium"
					color={data.status === "VALID" ? "green.500" : "red.500"}
				>
					{data.status}
				</Text>
			</Flex>
			<Flex>
				<Text width="200px" fontWeight="medium">
					PAN Status Code:
				</Text>
				<Text>{data.pan_status}</Text>
			</Flex>
			<Flex>
				<Text width="200px" fontWeight="medium">
					Aadhaar Seeding Status:
				</Text>
				<Text>{data.aadhaar_seeding_status || "Unknown"}</Text>
			</Flex>
			{data.aadhaar_seeding_status_desc && (
				<Flex>
					<Text width="200px" fontWeight="medium">
						Aadhaar Status Description:
					</Text>
					<Text>{data.aadhaar_seeding_status_desc}</Text>
				</Flex>
			)}
		</Flex>
	</ResponseSection>
);

// Component for the PAN Lite result card
const PanLiteResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: PanLiteResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			PAN Lite Verification Result
		</Text>
		<PanLiteInfoSection data={data} />

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

export const PanLiteForm = (): JSX.Element => {
	const [panResponse, setPanResponse] = useState<PanLiteResponseData | null>(
		null
	);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fetchPan, isLoadingPan] = useEpsV3Fetch("/tools/kyc/pan-lite", {
		method: "POST",
	});

	const panForm = useForm<PanLiteFormValues>({
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
	const handlePanSubmit = async (values: PanLiteFormValues) => {
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
		<Box maxW="500px" mx="auto" mt={8}>
			<Card mb={4} p={4}>
				<Text fontSize="lg" fontWeight="semibold" mb={2}>
					PAN Lite Verification
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Enter PAN number, name, and date of birth to verify the
					details.
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
				<PanLiteResultCard
					data={panResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};
