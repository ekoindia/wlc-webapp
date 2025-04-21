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
import {
	DrivingLicenseRequestParams,
	DrivingLicenseResponseData,
} from "./types";

/**
 * Component for displaying license holder's personal information
 * @param root0
 * @param root0.data
 */
const PersonalInfoSection = ({
	data,
}: {
	data: DrivingLicenseResponseData;
}): JSX.Element => {
	const details = data.details_of_driving_licence;

	return (
		<ResponseSection heading="Personal Information">
			<Grid templateColumns="200px 1fr" gap={1}>
				<GridItem>
					<Text fontWeight="medium">Name:</Text>
				</GridItem>
				<GridItem>
					<Text>{details.name}</Text>
				</GridItem>

				<GridItem>
					<Text fontWeight="medium">Father/Husband Name:</Text>
				</GridItem>
				<GridItem>
					<Text>{details.father_or_husband_name}</Text>
				</GridItem>

				<GridItem>
					<Text fontWeight="medium">Date of Birth:</Text>
				</GridItem>
				<GridItem>
					<Text>{data.dob}</Text>
				</GridItem>

				{details.photo && (
					<>
						<GridItem>
							<Text fontWeight="medium">Photo:</Text>
						</GridItem>
						<GridItem>
							<Box
								as="img"
								src={details.photo}
								alt="License holder photo"
								maxH="100px"
								border="1px solid"
								borderColor="gray.200"
							/>
						</GridItem>
					</>
				)}
			</Grid>
		</ResponseSection>
	);
};

/**
 * Component for displaying license details
 * @param root0
 * @param root0.data
 */
const LicenseDetailsSection = ({
	data,
}: {
	data: DrivingLicenseResponseData;
}): JSX.Element => {
	const details = data.details_of_driving_licence;

	return (
		<ResponseSection heading="License Information">
			<Grid templateColumns="200px 1fr" gap={1}>
				<GridItem>
					<Text fontWeight="medium">DL Number:</Text>
				</GridItem>
				<GridItem>
					<Text fontWeight="semibold">{data.dl_number}</Text>
				</GridItem>

				<GridItem>
					<Text fontWeight="medium">Status:</Text>
				</GridItem>
				<GridItem>
					<Text
						fontWeight="medium"
						color={
							data.status.toLowerCase() === "valid"
								? "green.500"
								: "red.500"
						}
					>
						{data.status}
					</Text>
				</GridItem>

				<GridItem>
					<Text fontWeight="medium">Issue Date:</Text>
				</GridItem>
				<GridItem>
					<Text>{details.date_of_issue}</Text>
				</GridItem>

				<GridItem>
					<Text fontWeight="medium">Last Transaction:</Text>
				</GridItem>
				<GridItem>
					<Text>{details.date_of_last_transaction}</Text>
				</GridItem>
			</Grid>
		</ResponseSection>
	);
};

/**
 * Component for displaying license validity information
 * @param root0
 * @param root0.data
 */
const ValiditySection = ({
	data,
}: {
	data: DrivingLicenseResponseData;
}): JSX.Element => {
	const validity = data.dl_validity;

	return (
		<ResponseSection heading="Validity Period">
			<Grid templateColumns="200px 1fr" gap={1}>
				<GridItem>
					<Text fontWeight="medium">Transport:</Text>
				</GridItem>
				<GridItem>
					<Text>
						From {validity.transport.from} to{" "}
						{validity.transport.to}
					</Text>
				</GridItem>

				<GridItem>
					<Text fontWeight="medium">Non-Transport:</Text>
				</GridItem>
				<GridItem>
					<Text>
						From {validity.non_transport.from} to{" "}
						{validity.non_transport.to}
					</Text>
				</GridItem>

				<GridItem>
					<Text fontWeight="medium">Hill Valid Until:</Text>
				</GridItem>
				<GridItem>
					<Text>{validity.hill_valid_till}</Text>
				</GridItem>

				<GridItem>
					<Text fontWeight="medium">Hazardous Valid Until:</Text>
				</GridItem>
				<GridItem>
					<Text>{validity.hazardous_valid_till}</Text>
				</GridItem>
			</Grid>
		</ResponseSection>
	);
};

/**
 * Component for displaying address information
 * @param root0
 * @param root0.data
 */
const AddressSection = ({
	data,
}: {
	data: DrivingLicenseResponseData;
}): JSX.Element => {
	const addresses = data.details_of_driving_licence.address_list;

	if (!addresses || addresses.length === 0) {
		return <></>;
	}

	return (
		<ResponseSection heading="Address Information">
			{addresses.map((address, index) => (
				<Box key={index} mb={index !== addresses.length - 1 ? 4 : 0}>
					{addresses.length > 1 && (
						<Text fontWeight="semibold" mb={1}>
							{address.type} Address
						</Text>
					)}
					<Text mb={2}>{address.complete_address}</Text>

					{address.split_address && (
						<Box pl={3} mt={2}>
							<Grid templateColumns="repeat(2, 1fr)" gap={3}>
								{address.split_address.city &&
									address.split_address.city.length > 0 && (
										<GridItem>
											<Flex>
												<Text
													width="120px"
													fontWeight="medium"
												>
													City:
												</Text>
												<Text>
													{address.split_address.city.join(
														", "
													)}
												</Text>
											</Flex>
										</GridItem>
									)}
								{address.split_address.district &&
									address.split_address.district.length >
										0 && (
										<GridItem>
											<Flex>
												<Text
													width="120px"
													fontWeight="medium"
												>
													District:
												</Text>
												<Text>
													{address.split_address.district.join(
														", "
													)}
												</Text>
											</Flex>
										</GridItem>
									)}
								{address.split_address.state &&
									address.split_address.state.length > 0 && (
										<GridItem>
											<Flex>
												<Text
													width="120px"
													fontWeight="medium"
												>
													State:
												</Text>
												<Text>
													{address.split_address.state
														.map((s) =>
															Array.isArray(s)
																? s.join(", ")
																: s
														)
														.join("; ")}
												</Text>
											</Flex>
										</GridItem>
									)}
								{address.split_address.pincode && (
									<GridItem>
										<Flex>
											<Text
												width="120px"
												fontWeight="medium"
											>
												Pincode:
											</Text>
											<Text>
												{address.split_address.pincode}
											</Text>
										</Flex>
									</GridItem>
								)}
								{address.split_address.country &&
									address.split_address.country.length >
										0 && (
										<GridItem>
											<Flex>
												<Text
													width="120px"
													fontWeight="medium"
												>
													Country:
												</Text>
												<Text>
													{address.split_address.country.join(
														", "
													)}
												</Text>
											</Flex>
										</GridItem>
									)}
								{address.split_address.address_line && (
									<GridItem colSpan={2}>
										<Flex>
											<Text
												width="120px"
												fontWeight="medium"
											>
												Address Line:
											</Text>
											<Text>
												{
													address.split_address
														.address_line
												}
											</Text>
										</Flex>
									</GridItem>
								)}
							</Grid>
						</Box>
					)}
				</Box>
			))}
		</ResponseSection>
	);
};

/**
 * Component for displaying vehicle class information
 * @param root0
 * @param root0.data
 */
const VehicleClassSection = ({
	data,
}: {
	data: DrivingLicenseResponseData;
}): JSX.Element => {
	const covDetails = data.details_of_driving_licence.cov_details;
	const badges = data.badge_details;

	return (
		<ResponseSection heading="Vehicle Class Information">
			<Grid templateColumns="200px 1fr" gap={1}>
				<GridItem>
					<Text fontWeight="medium">Classes:</Text>
				</GridItem>
				<GridItem>
					<VStack align="start" spacing={0}>
						{covDetails.map((cov, index) => (
							<Text key={index}>{cov.class_of_vehicle}</Text>
						))}
					</VStack>
				</GridItem>
			</Grid>

			{badges && badges.length > 0 && (
				<Box mt={4}>
					<Text fontWeight="semibold" mb={2}>
						Badge Details
					</Text>
					{badges.map((badge, index) => (
						<Grid
							key={index}
							templateColumns="200px 1fr"
							gap={1}
							mt={index > 0 ? 3 : 0}
						>
							<GridItem>
								<Text fontWeight="medium">Badge Number:</Text>
							</GridItem>
							<GridItem>
								<Text>{badge.badge_no}</Text>
							</GridItem>

							<GridItem>
								<Text fontWeight="medium">
									Badge Issue Date:
								</Text>
							</GridItem>
							<GridItem>
								<Text>{badge.badge_issue_date}</Text>
							</GridItem>

							<GridItem>
								<Text fontWeight="medium">
									Vehicle Classes:
								</Text>
							</GridItem>
							<GridItem>
								<VStack align="start" spacing={0}>
									{badge.class_of_vehicle.map((cls, i) => (
										<Text key={i}>{cls}</Text>
									))}
								</VStack>
							</GridItem>
						</Grid>
					))}
				</Box>
			)}
		</ResponseSection>
	);
};

/**
 * Component for displaying the complete driving license verification result
 * @param root0
 * @param root0.data
 * @param root0.onReset
 * @param root0.onBack
 */
const DrivingLicenseResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: DrivingLicenseResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			Driving License Verification Result
		</Text>

		<VStack spacing={4} align="stretch">
			<PersonalInfoSection data={data} />
			<LicenseDetailsSection data={data} />
			<ValiditySection data={data} />
			<AddressSection data={data} />
			<VehicleClassSection data={data} />
		</VStack>

		<ResponseToolbar
			data={data}
			onBack={onBack}
			onReset={onReset}
			resetButtonText="Verify Another License"
		/>
	</Card>
);

/**
 * Date format helper function
 * @param dateString
 */
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

/**
 * Main component for Driving License verification form
 */
export const DrivingLicenseForm = (): JSX.Element => {
	const [dlResponse, setDlResponse] =
		useState<DrivingLicenseResponseData | null>(null);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fetchDl, isLoadingDl] = useEpsV3Fetch("/tools/kyc/driving-license", {
		method: "POST",
	});

	const dlForm = useForm<DrivingLicenseRequestParams>({
		mode: "onChange",
		defaultValues: {
			dl_number: "",
			dob: "",
		},
	});

	const router = useRouter();

	// Handler to reset form and show input fields again
	const handleReset = () => {
		setCollapsed(false);
		setDlResponse(null);
		setError(null);
		dlForm.reset();
	};

	// Handler to navigate back to driving license main page
	const handleBack = () => {
		router.push("/products/kyc");
	};

	// Handler to submit the driving license verification form
	const handleDlSubmit = async (values: DrivingLicenseRequestParams) => {
		setCollapsed(false);
		setError(null);

		// Format the date in YYYY-MM-DD format for the API
		const formattedDob = formatDateForApi(values.dob);

		const response = await fetchDl({
			body: {
				dl_number: values.dl_number,
				dob: formattedDob,
			},
		});

		// Check for API response
		if (response?.data) {
			// Success case: status === 0
			if (response.data.status === 0 && response.data.data) {
				setDlResponse(response.data.data);
				setCollapsed(true);
			}
			// Error case: status !== 0
			else {
				const errorMessage =
					response.data.message ||
					"Failed to verify driving license. Please check your input and try again.";
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
					Driving License Verification
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Verify driving license details including license number,
					validity, vehicle classes, and more.
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
					<form onSubmit={dlForm.handleSubmit(handleDlSubmit)}>
						<VStack spacing={4} align="stretch">
							<Input
								label="Driving License Number"
								required
								placeholder="Enter DL Number (e.g., DL1234567890)"
								{...dlForm.register("dl_number", {
									required: true,
									minLength: 5,
									maxLength: 20,
								})}
								invalid={!!dlForm.formState.errors.dl_number}
								errorMsg={
									dlForm.formState.errors.dl_number
										? "Valid DL number required"
										: ""
								}
							/>

							<Input
								label="Date of Birth"
								required
								placeholder="YYYY-MM-DD"
								{...dlForm.register("dob", {
									required: true,
									pattern:
										/^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/,
								})}
								invalid={!!dlForm.formState.errors.dob}
								errorMsg={
									dlForm.formState.errors.dob
										? "Enter valid date (YYYY-MM-DD or DD/MM/YYYY)"
										: ""
								}
							/>

							<Button
								type="submit"
								size="lg"
								loading={isLoadingDl}
								w={{ base: "100%", md: "200px" }}
							>
								Verify License
							</Button>
						</VStack>
					</form>
				</Collapse>

				{collapsed && dlForm.getValues("dl_number") && (
					<Box mb={2}>
						<Text fontSize="sm" color="gray.600">
							DL: {dlForm.getValues("dl_number")}
						</Text>
					</Box>
				)}
			</Card>

			{dlResponse && (
				<DrivingLicenseResultCard
					data={dlResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};
