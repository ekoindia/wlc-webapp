// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/page-components/products/kyc/cin/CinForm.tsx
import {
	Box,
	Card,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	GridItem,
	Text,
	useToast,
} from "@chakra-ui/react";
import { Button, Input } from "components";
import { useEpsV3Fetch } from "hooks";
import router from "next/router";
import {
	ResponseSection,
	ResponseToolbar,
} from "page-components/products/common";
import { useState } from "react";

/**
 * Interface for the director details in the CIN response
 */
interface DirectorDetail {
	dob: string;
	designation: string;
	address: string;
	din: string;
	name: string;
}

/**
 * Interface for the CIN verification response data
 */
interface CinResponseData {
	cin: string;
	company_name: string;
	registration_number: number;
	incorporation_date: string;
	cin_status: string;
	email: string;
	incorporation_country: string;
	director_details: DirectorDetail[];
}

/**
 * Component for CIN verification form
 */
export const CinForm = (): JSX.Element => {
	const [cin, setCin] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [cinResponse, setCinResponse] = useState<CinResponseData | null>(
		null
	);
	const [collapsed, setCollapsed] = useState<boolean>(false);

	const toast = useToast();
	const [makeApiCall, { isLoading }] = useEpsV3Fetch("/tools/kyc/cin", {
		method: "POST",
	});

	// Validate and handle form submission
	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();

		// Reset states
		setError("");
		setCinResponse(null);

		// Validate input
		if (!cin.trim()) {
			setError("CIN is required");
			return;
		}

		// Pattern check for CIN format validation
		const cinPattern = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
		if (!cinPattern.test(cin)) {
			setError("Please enter a valid CIN format");
			return;
		}

		// Make API call
		const response = await makeApiCall({
			body: {
				cin: cin.trim(),
			},
		});
		console.log("response:", response);

		// Check for API response
		if (response?.data) {
			// Success case: status === 0
			if (response.data.status === 0 && response.data.data) {
				setCinResponse(response.data.data);
				setCollapsed(true);
				// Reset form on success
				setCin("");
			}
			// Error case: status !== 0
			else {
				const errorMessage =
					response.data.message ||
					"Failed to verify CIN. Please check your input and try again.";
				setError(errorMessage);
				toast({
					title: "Verification Failed",
					description: errorMessage,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		} else if (response?.error) {
			// Network or fetch error
			setError(
				"Network error. Please check your connection and try again."
			);
		} else {
			// Handle unexpected response format
			setError("Invalid response from server. Please try again later.");
		}
	};

	// Reset the form and response
	const handleReset = (): void => {
		setCin("");
		setError("");
		setCinResponse(null);
		setCollapsed(false);
	};

	// Go back to the form
	const handleBack = () => {
		router.push("/products/kyc");
	};

	return (
		<Box maxW="800px" mx="auto" mt={8}>
			{!collapsed && (
				<Card mb={4} p={4}>
					<Text fontSize="lg" fontWeight="semibold" mb={2}>
						CIN Verification
					</Text>
					<Text fontSize="sm" color="gray.500" mb={4}>
						Enter the Corporate Identification Number (CIN) to
						retrieve company and director information.
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

					<form onSubmit={handleSubmit}>
						<FormControl isInvalid={!!error} isRequired mb={4}>
							<FormLabel htmlFor="cin">
								Corporate Identification Number (CIN)
							</FormLabel>
							<Input
								id="cin"
								value={cin}
								onChange={(e) =>
									setCin(e.target.value.toUpperCase())
								}
								placeholder="Enter CIN (e.g., U12345DL1999PTC012345)"
								maxLength={21}
							/>
							{error && (
								<FormErrorMessage>{error}</FormErrorMessage>
							)}
						</FormControl>

						<Button
							size="lg"
							type="submit"
							isLoading={isLoading}
							loadingText="Verifying"
							w={{ base: "100%", md: "200px" }}
						>
							Verify CIN
						</Button>
					</form>
				</Card>
			)}

			{cinResponse && (
				<>
					<Card p={4} mb={4}>
						<Box mb={4}>
							<Text fontSize="xl" fontWeight="bold">
								CIN Verification Results
							</Text>
						</Box>

						{/* Company Information Section */}
						<CompanyInfoSection data={cinResponse} />

						{/* Director Details Section */}
						<DirectorDetailsSection
							directors={cinResponse.director_details}
						/>

						{/* Response Toolbar */}
						<ResponseToolbar
							onReset={handleReset}
							onBack={handleBack}
							data={cinResponse}
						/>
					</Card>
				</>
			)}
		</Box>
	);
};

// Component for displaying company information from CIN verification
const CompanyInfoSection = ({
	data,
}: {
	data: CinResponseData;
}): JSX.Element => (
	<ResponseSection heading="Company Information">
		<Grid templateColumns="200px 1fr" gap={1}>
			<GridItem>
				<Text fontWeight="medium">CIN:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.cin}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Company Name:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.company_name}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Registration Number:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.registration_number}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Incorporation Date:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.incorporation_date}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Status:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.cin_status}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Email:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.email}</Text>
			</GridItem>

			<GridItem>
				<Text fontWeight="medium">Country:</Text>
			</GridItem>
			<GridItem>
				<Text>{data.incorporation_country}</Text>
			</GridItem>
		</Grid>
	</ResponseSection>
);

// Component for displaying director details from CIN verification
const DirectorDetailsSection = ({
	directors,
}: {
	directors: DirectorDetail[];
}): JSX.Element => (
	<ResponseSection heading="Director Details">
		{directors.map((director, index) => (
			<Box
				key={index}
				p={3}
				bg="gray.50"
				borderRadius="md"
				mb={index < directors.length - 1 ? 3 : 0}
			>
				<Grid templateColumns="200px 1fr" gap={1}>
					<GridItem>
						<Text fontWeight="medium">Name:</Text>
					</GridItem>
					<GridItem>
						<Text>{director.name}</Text>
					</GridItem>

					<GridItem>
						<Text fontWeight="medium">Designation:</Text>
					</GridItem>
					<GridItem>
						<Text>{director.designation}</Text>
					</GridItem>

					<GridItem>
						<Text fontWeight="medium">DIN:</Text>
					</GridItem>
					<GridItem>
						<Text>{director.din}</Text>
					</GridItem>

					<GridItem>
						<Text fontWeight="medium">Date of Birth:</Text>
					</GridItem>
					<GridItem>
						<Text>{director.dob}</Text>
					</GridItem>

					<GridItem>
						<Text fontWeight="medium">Address:</Text>
					</GridItem>
					<GridItem>
						<Text>{director.address}</Text>
					</GridItem>
				</Grid>
			</Box>
		))}
	</ResponseSection>
);
