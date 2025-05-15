import {
	Box,
	Card,
	Divider,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	GridItem,
	Text,
} from "@chakra-ui/react";
import { Button, Input } from "components";
import { useEpsV3Fetch } from "hooks";
import { useRouter } from "next/router";
import {
	ResponseSection,
	ResponseToolbar,
} from "page-components/products/common";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PassportFormValues, PassportResponseData } from "./types";

/**
 * Form for verifying Indian passport details
 */
export const PassportForm = (): JSX.Element => {
	const router = useRouter();
	const [passportResponse, setPassportResponse] =
		useState<PassportResponseData | null>(null);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Initialize fetch hook for passport verification
	const [fetchPassport, fetchLoading] = useEpsV3Fetch("/tools/kyc/passport", {
		method: "POST",
	});

	// Initialize React Hook Form
	const passportForm = useForm<PassportFormValues>({
		mode: "onChange",
		defaultValues: {
			fileNumber: "",
			dob: "",
			name: "",
		},
	});

	const { register, handleSubmit, formState, reset } = passportForm;
	const { errors } = formState;

	// Handler to reset the form and clear response
	const handleReset = () => {
		setPassportResponse(null);
		setCollapsed(false);
		setError(null);
		reset();
	};

	// Handler to navigate back to KYC main page
	const handleBack = () => {
		router.push("/products/kyc");
	};

	// Handler to submit the passport verification form
	const handlePassportSubmit = async (values: PassportFormValues) => {
		setCollapsed(false);
		setError(null);

		// Format date from YYYY-MM-DD to proper API format
		const response = await fetchPassport({
			body: {
				file_number: values.fileNumber.toUpperCase(),
				dob: values.dob,
				name: values.name || undefined, // Only include name if provided
			},
		});

		// Check for API response
		if (response?.data) {
			// Success case: status === 0
			if (response.data.status === 0 && response.data.data) {
				setPassportResponse(response.data.data);
				setCollapsed(true);
			}
			// Error case: status !== 0
			else {
				const errorMessage =
					response.data.message ||
					"Failed to verify passport. Please check your input and try again.";
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
			{!collapsed && (
				<Card mb={4} p={4}>
					<Text fontSize="lg" fontWeight="semibold" mb={2}>
						Passport Verification
					</Text>
					<Text fontSize="sm" color="gray.500" mb={4}>
						Enter the passport file number, date of birth, and
						optionally the name to verify passport details.
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
							{error}
						</Box>
					)}
					<form onSubmit={handleSubmit(handlePassportSubmit)}>
						<FormControl
							isInvalid={!!errors.fileNumber}
							mb={4}
							isRequired
						>
							<FormLabel>File Number</FormLabel>
							<Input
								{...register("fileNumber", {
									required: "File number is required",
									minLength: {
										value: 15,
										message:
											"File number must be exactly 15 characters",
									},
									maxLength: {
										value: 15,
										message:
											"File number must be exactly 15 characters",
									},
									pattern: {
										value: /^[A-Za-z0-9]+$/,
										message:
											"Enter a valid file number (alphanumeric characters only)",
									},
								})}
								placeholder="Enter passport file number"
								maxLength={15}
							/>

							<FormErrorMessage>
								{errors.fileNumber?.message}
							</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={!!errors.dob} mb={4} isRequired>
							<FormLabel>Date of Birth</FormLabel>
							<Input
								{...register("dob", {
									required: "Date of birth is required",
								})}
								type="date"
								placeholder="YYYY-MM-DD"
							/>
							<FormErrorMessage>
								{errors.dob?.message}
							</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={!!errors.name} mb={4}>
							<FormLabel>Name (Optional)</FormLabel>
							<Input
								{...register("name")}
								placeholder="Enter name as on passport"
							/>
							<FormErrorMessage>
								{errors.name?.message}
							</FormErrorMessage>
						</FormControl>

						<Button
							type="submit"
							size="lg"
							isLoading={fetchLoading}
							w={{ base: "100%", md: "200px" }}
						>
							Verify Passport
						</Button>
					</form>
				</Card>
			)}

			{passportResponse && collapsed && (
				<PassportResponseCard
					data={passportResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};

/**
 * Card component for displaying passport verification response
 * @param root0
 * @param root0.data
 * @param root0.onReset
 * @param root0.onBack
 */
const PassportResponseCard = ({
	data,
	onReset,
	onBack,
}: {
	data: PassportResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4}>
		<Box mb={4}>
			<Text fontSize="lg" fontWeight="semibold" mb={2}>
				Passport Verification Results
			</Text>
			<Text fontSize="sm" color="gray.500">
				The following information was retrieved from the passport
				database.
			</Text>
		</Box>

		<Divider my={4} />

		<PassportDetailsSection data={data} />

		<ResponseToolbar onReset={onReset} onBack={onBack} data={data} />
	</Card>
);

/**
 * Section for displaying passport details
 * @param root0
 * @param root0.data
 */
const PassportDetailsSection = ({
	data,
}: {
	data: PassportResponseData;
}): JSX.Element => (
	<ResponseSection heading="Passport Information">
		<Grid templateColumns="150px 1fr" gap={2}>
			<GridItem>
				<Text fontWeight="medium">File Number:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.file_number}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Name:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.name}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Date of Birth:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.dob}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Application Type:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.application_type}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Application Date:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.application_received_date}</Text>
			</GridItem>
		</Grid>
	</ResponseSection>
);
