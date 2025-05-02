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
import { EmploymentFormValues, EmploymentResponseData } from "./types";

/**
 * Component to display input information
 * @param data.data
 * @param data - Response data containing input details
 */
const InputSection = ({
	data,
}: {
	data: EmploymentResponseData;
}): JSX.Element | null => {
	if (!data?.input) return null;

	return (
		<ResponseSection heading="Input Details">
			<Grid templateColumns="200px 1fr" gap={2}>
				{data.input.phone && (
					<>
						<GridItem>
							<Text fontWeight="medium">Phone:</Text>
						</GridItem>
						<GridItem>
							<Text>{data.input.phone}</Text>
						</GridItem>
					</>
				)}

				{data.input.pan && (
					<>
						<GridItem>
							<Text fontWeight="medium">PAN:</Text>
						</GridItem>
						<GridItem>
							<Text>{data.input.pan}</Text>
						</GridItem>
					</>
				)}

				{data.input.uan && (
					<>
						<GridItem>
							<Text fontWeight="medium">UAN:</Text>
						</GridItem>
						<GridItem>
							<Text>{data.input.uan}</Text>
						</GridItem>
					</>
				)}

				{data.input.dob && (
					<>
						<GridItem>
							<Text fontWeight="medium">Date of Birth:</Text>
						</GridItem>
						<GridItem>
							<Text>{data.input.dob}</Text>
						</GridItem>
					</>
				)}

				{data.input.employee_name && (
					<>
						<GridItem>
							<Text fontWeight="medium">Employee Name:</Text>
						</GridItem>
						<GridItem>
							<Text>{data.input.employee_name}</Text>
						</GridItem>
					</>
				)}

				{data.input.employer_name && (
					<>
						<GridItem>
							<Text fontWeight="medium">Employer Name:</Text>
						</GridItem>
						<GridItem>
							<Text>{data.input.employer_name}</Text>
						</GridItem>
					</>
				)}
			</Grid>
		</ResponseSection>
	);
};

/**
 * Component to display all UAN details
 * @param data.data
 * @param data - Response data containing UAN details
 */
const UanDetailsSections = ({
	data,
}: {
	data: EmploymentResponseData;
}): JSX.Element | null => {
	if (!data?.uan_details || data.uan_details.length === 0) return null;

	return (
		<ResponseSection heading="UAN Details">
			{data.uan_details.map((uanDetails, index) => (
				<Box
					key={`uan-details-${index}`}
					mb={index < data.uan_details.length - 1 ? 6 : 0}
				>
					{index > 0 && <Box h="1px" bg="gray.200" my={4} />}

					<ResponseSection
						heading={`UAN: ${uanDetails.uan ?? "N/A"}`}
					>
						<Grid templateColumns="200px 1fr" gap={2} mb={3}>
							{uanDetails.source && (
								<>
									<GridItem>
										<Text fontWeight="medium">Source:</Text>
									</GridItem>
									<GridItem>
										<Text>{uanDetails.source}</Text>
									</GridItem>
								</>
							)}

							{uanDetails.source_score !== undefined && (
								<>
									<GridItem>
										<Text fontWeight="medium">
											Source Score:
										</Text>
									</GridItem>
									<GridItem>
										<Text>{uanDetails.source_score}%</Text>
									</GridItem>
								</>
							)}
						</Grid>

						{uanDetails.basic_details && (
							<ResponseSection heading="Basic Details">
								<Grid templateColumns="200px 1fr" gap={2}>
									{uanDetails.basic_details.employee_name && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Name:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails.basic_details
															.employee_name
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.basic_details.dob && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Date of Birth:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails.basic_details
															.dob
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.basic_details.gender && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Gender:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails.basic_details
															.gender
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.basic_details.phone && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Phone:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails.basic_details
															.phone
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.basic_details
										.employee_confidence_score !==
										undefined && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Confidence Score:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails.basic_details
															.employee_confidence_score
													}
													%
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.basic_details
										.aadhaar_verified !== undefined && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Aadhaar Verified:
												</Text>
											</GridItem>
											<GridItem>
												<Text
													color={
														uanDetails.basic_details
															.aadhaar_verified
															? "green.500"
															: "red.500"
													}
													fontWeight="medium"
												>
													{uanDetails.basic_details
														.aadhaar_verified
														? "Yes"
														: "No"}
												</Text>
											</GridItem>
										</>
									)}
								</Grid>
							</ResponseSection>
						)}

						{uanDetails.employment_details && (
							<ResponseSection heading="Employment Details">
								<Grid templateColumns="200px 1fr" gap={2}>
									{uanDetails.employment_details
										.member_id && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Member ID:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.employment_details
															.member_id
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.employment_details
										.establishment_id && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Establishment ID:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.employment_details
															.establishment_id
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.employment_details
										.establishment_name && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Employer Name:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.employment_details
															.establishment_name
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.employment_details
										.joining_date && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Joining Date:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.employment_details
															.joining_date
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.employment_details
										.exit_date && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Exit Date:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.employment_details
															.exit_date
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.employment_details
										.leave_reason && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Exit Reason:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.employment_details
															.leave_reason
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.employment_details
										.employer_confidence_score !==
										undefined && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Employer Confidence Score:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.employment_details
															.employer_confidence_score
													}
													%
												</Text>
											</GridItem>
										</>
									)}
								</Grid>
							</ResponseSection>
						)}

						{uanDetails.additional_details && (
							<ResponseSection heading="Additional Details">
								<Grid templateColumns="200px 1fr" gap={2}>
									{uanDetails.additional_details.aadhaar && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Aadhaar:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.additional_details
															.aadhaar
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.additional_details.email && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													Email:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.additional_details
															.email
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.additional_details.PAN && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													PAN:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.additional_details
															.PAN
													}
												</Text>
											</GridItem>
										</>
									)}

									{uanDetails.additional_details
										.relative_name && (
										<>
											<GridItem>
												<Text fontWeight="medium">
													{uanDetails
														.additional_details
														.relation
														? `${uanDetails.additional_details.relation}'s Name`
														: "Relative's Name"}
													:
												</Text>
											</GridItem>
											<GridItem>
												<Text>
													{
														uanDetails
															.additional_details
															.relative_name
													}
												</Text>
											</GridItem>
										</>
									)}
								</Grid>

								{(uanDetails.additional_details.bank_account ||
									uanDetails.additional_details.ifsc ||
									uanDetails.additional_details
										.bank_address) && (
									<ResponseSection heading="Bank Details">
										<Grid
											templateColumns="200px 1fr"
											gap={2}
										>
											{uanDetails.additional_details
												.bank_account && (
												<>
													<GridItem>
														<Text fontWeight="medium">
															Account Number:
														</Text>
													</GridItem>
													<GridItem>
														<Text>
															{
																uanDetails
																	.additional_details
																	.bank_account
															}
														</Text>
													</GridItem>
												</>
											)}

											{uanDetails.additional_details
												.ifsc && (
												<>
													<GridItem>
														<Text fontWeight="medium">
															IFSC Code:
														</Text>
													</GridItem>
													<GridItem>
														<Text>
															{
																uanDetails
																	.additional_details
																	.ifsc
															}
														</Text>
													</GridItem>
												</>
											)}

											{uanDetails.additional_details
												.bank_address && (
												<>
													<GridItem>
														<Text fontWeight="medium">
															Bank Address:
														</Text>
													</GridItem>
													<GridItem>
														<Text>
															{
																uanDetails
																	.additional_details
																	.bank_address
															}
														</Text>
													</GridItem>
												</>
											)}
										</Grid>
									</ResponseSection>
								)}
							</ResponseSection>
						)}
					</ResponseSection>
				</Box>
			))}
		</ResponseSection>
	);
};

/**
 * Component to display recent employment details
 * @param data.data
 * @param data - Response data containing recent employment details
 */
const RecentEmploymentSection = ({
	data,
}: {
	data: EmploymentResponseData;
}): JSX.Element | null => {
	if (!data?.recent_employment_details) return null;
	const { employee_details, employer_details } =
		data.recent_employment_details;

	return (
		<ResponseSection heading="Recent Employment Details">
			{employee_details && (
				<ResponseSection heading="Employee Details">
					<Grid templateColumns="200px 1fr" gap={2}>
						{employee_details.member_id && (
							<>
								<GridItem>
									<Text fontWeight="medium">Member ID:</Text>
								</GridItem>
								<GridItem>
									<Text>{employee_details.member_id}</Text>
								</GridItem>
							</>
						)}

						{employee_details.uan && (
							<>
								<GridItem>
									<Text fontWeight="medium">UAN:</Text>
								</GridItem>
								<GridItem>
									<Text>{employee_details.uan}</Text>
								</GridItem>
							</>
						)}

						{employee_details.joining_date && (
							<>
								<GridItem>
									<Text fontWeight="medium">
										Joining Date:
									</Text>
								</GridItem>
								<GridItem>
									<Text>{employee_details.joining_date}</Text>
								</GridItem>
							</>
						)}

						{employee_details.exit_date && (
							<>
								<GridItem>
									<Text fontWeight="medium">Exit Date:</Text>
								</GridItem>
								<GridItem>
									<Text>{employee_details.exit_date}</Text>
								</GridItem>
							</>
						)}

						{employee_details.employed !== undefined && (
							<>
								<GridItem>
									<Text fontWeight="medium">
										Currently Employed:
									</Text>
								</GridItem>
								<GridItem>
									<Text
										fontWeight="medium"
										color={
											employee_details.employed
												? "green.500"
												: "red.500"
										}
									>
										{employee_details.employed
											? "Yes"
											: "No"}
									</Text>
								</GridItem>
							</>
						)}

						{employee_details.employee_name_match !== undefined && (
							<>
								<GridItem>
									<Text fontWeight="medium">Name Match:</Text>
								</GridItem>
								<GridItem>
									<Text
										fontWeight="medium"
										color={
											employee_details.employee_name_match
												? "green.500"
												: "red.500"
										}
									>
										{employee_details.employee_name_match
											? "Matched"
											: "Not Matched"}
									</Text>
								</GridItem>
							</>
						)}

						{employee_details.exit_date_marked !== undefined && (
							<>
								<GridItem>
									<Text fontWeight="medium">
										Exit Date Marked:
									</Text>
								</GridItem>
								<GridItem>
									<Text
										fontWeight="medium"
										color={
											employee_details.exit_date_marked
												? "green.500"
												: "yellow.500"
										}
									>
										{employee_details.exit_date_marked
											? "Yes"
											: "No"}
									</Text>
								</GridItem>
							</>
						)}
					</Grid>

					{employee_details.epfo && (
						<ResponseSection heading="EPFO Status">
							<Grid templateColumns="200px 1fr" gap={2}>
								{employee_details.epfo.recent !== undefined && (
									<>
										<GridItem>
											<Text fontWeight="medium">
												Recent:
											</Text>
										</GridItem>
										<GridItem>
											<Text
												fontWeight="medium"
												color={
													employee_details.epfo.recent
														? "green.500"
														: "yellow.500"
												}
											>
												{employee_details.epfo.recent
													? "Yes"
													: "No"}
											</Text>
										</GridItem>
									</>
								)}

								{employee_details.epfo.name_unique !==
									undefined && (
									<>
										<GridItem>
											<Text fontWeight="medium">
												Unique Name:
											</Text>
										</GridItem>
										<GridItem>
											<Text
												fontWeight="medium"
												color={
													employee_details.epfo
														.name_unique
														? "green.500"
														: "yellow.500"
												}
											>
												{employee_details.epfo
													.name_unique
													? "Yes"
													: "No"}
											</Text>
										</GridItem>
									</>
								)}

								{employee_details.epfo.pf_filings_details !==
									undefined && (
									<>
										<GridItem>
											<Text fontWeight="medium">
												PF Filing Details:
											</Text>
										</GridItem>
										<GridItem>
											<Text
												fontWeight="medium"
												color={
													employee_details.epfo
														.pf_filings_details
														? "green.500"
														: "yellow.500"
												}
											>
												{employee_details.epfo
													.pf_filings_details
													? "Available"
													: "Not Available"}
											</Text>
										</GridItem>
									</>
								)}
							</Grid>
						</ResponseSection>
					)}
				</ResponseSection>
			)}

			{employer_details && (
				<ResponseSection heading="Employer Details">
					<Grid templateColumns="200px 1fr" gap={2}>
						{employer_details.establishment_name && (
							<>
								<GridItem>
									<Text fontWeight="medium">Name:</Text>
								</GridItem>
								<GridItem>
									<Text>
										{employer_details.establishment_name}
									</Text>
								</GridItem>
							</>
						)}

						{employer_details.establishment_id && (
							<>
								<GridItem>
									<Text fontWeight="medium">
										Establishment ID:
									</Text>
								</GridItem>
								<GridItem>
									<Text>
										{employer_details.establishment_id}
									</Text>
								</GridItem>
							</>
						)}

						{employer_details.setup_date && (
							<>
								<GridItem>
									<Text fontWeight="medium">Setup Date:</Text>
								</GridItem>
								<GridItem>
									<Text>{employer_details.setup_date}</Text>
								</GridItem>
							</>
						)}

						{employer_details.ownership_type && (
							<>
								<GridItem>
									<Text fontWeight="medium">
										Ownership Type:
									</Text>
								</GridItem>
								<GridItem>
									<Text>
										{employer_details.ownership_type}
									</Text>
								</GridItem>
							</>
						)}

						{employer_details.employer_confidence_score !==
							undefined && (
							<>
								<GridItem>
									<Text fontWeight="medium">
										Confidence Score:
									</Text>
								</GridItem>
								<GridItem>
									<Text>
										{
											employer_details.employer_confidence_score
										}
										%
									</Text>
								</GridItem>
							</>
						)}

						{employer_details.employer_name_match !== undefined && (
							<>
								<GridItem>
									<Text fontWeight="medium">Name Match:</Text>
								</GridItem>
								<GridItem>
									<Text
										fontWeight="medium"
										color={
											employer_details.employer_name_match
												? "green.500"
												: "red.500"
										}
									>
										{employer_details.employer_name_match
											? "Matched"
											: "Not Matched"}
									</Text>
								</GridItem>
							</>
						)}
					</Grid>

					{employer_details.pf_filing_details &&
						employer_details.pf_filing_details.length > 0 && (
							<ResponseSection heading="PF Filing Details">
								{employer_details.pf_filing_details.map(
									(filing, index) => (
										<Box
											key={`pf-filing-${index}`}
											p={3}
											borderWidth="1px"
											borderRadius="md"
											borderColor="gray.200"
											mt={index > 0 ? 2 : 0}
										>
											<Grid
												templateColumns="200px 1fr"
												gap={2}
											>
												{filing.wage_month && (
													<>
														<GridItem>
															<Text fontWeight="medium">
																Wage Month:
															</Text>
														</GridItem>
														<GridItem>
															<Text>
																{
																	filing.wage_month
																}
															</Text>
														</GridItem>
													</>
												)}

												{filing.employees_count !==
													undefined && (
													<>
														<GridItem>
															<Text fontWeight="medium">
																Employees Count:
															</Text>
														</GridItem>
														<GridItem>
															<Text>
																{
																	filing.employees_count
																}
															</Text>
														</GridItem>
													</>
												)}

												{filing.total_amount !==
													undefined && (
													<>
														<GridItem>
															<Text fontWeight="medium">
																Total Amount:
															</Text>
														</GridItem>
														<GridItem>
															<Text>
																₹
																{filing.total_amount.toLocaleString()}
															</Text>
														</GridItem>
													</>
												)}
											</Grid>
										</Box>
									)
								)}
							</ResponseSection>
						)}
				</ResponseSection>
			)}
		</ResponseSection>
	);
};

/**
 * Component for displaying the employment verification results
 * @param data.data
 * @param data - Processed employment response data
 * @param onReset - Handler for resetting the form
 * @param onBack - Handler for navigation back
 * @param data.onReset
 * @param data.onBack
 */
const EmploymentResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: EmploymentResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={6} bg="white" boxShadow="md" borderRadius="md">
		<Text fontWeight="bold" fontSize="2xl" mb={6} color="#1A365D">
			Employee Verification Result
		</Text>

		<InputSection data={data} />
		<UanDetailsSections data={data} />
		<RecentEmploymentSection data={data} />

		<Box mt={6}>
			<ResponseToolbar
				data={data}
				onBack={onBack}
				onReset={onReset}
				resetButtonText="Verify Another Employee"
			/>
		</Box>
	</Card>
);

/**
 * Form component for verifying employee details
 */
export const EmploymentForm = (): JSX.Element => {
	// State management
	const [employmentResponse, setEmploymentResponse] =
		useState<EmploymentResponseData | null>(null);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAtLeastOneFieldFilled, setIsAtLeastOneFieldFilled] =
		useState(false);

	// API fetch hook
	const [fetchEmploymentDetails, isLoading] = useEpsV3Fetch(
		"/tools/kyc/advance-employment",
		{
			method: "POST",
		}
	);

	// Form handling
	const employmentForm = useForm<EmploymentFormValues>({ mode: "onChange" });
	const router = useRouter();

	// Field validation function to check if at least one field has a value
	const validateAtLeastOneField = () => {
		const values = employmentForm.getValues();
		const hasValue =
			!!values.phone ||
			!!values.pan ||
			!!values.uan ||
			!!values.dob ||
			!!values.employeeName ||
			!!values.employerName;

		setIsAtLeastOneFieldFilled(hasValue);
		return hasValue || "At least one field is required";
	};

	// Handler to reset form and show input fields again
	const handleReset = () => {
		setCollapsed(false);
		setEmploymentResponse(null);
		setError(null);
		employmentForm.reset();
		setIsAtLeastOneFieldFilled(false);
	};

	// Handler to navigate back to KYC main page
	const handleBack = () => {
		router.push("/products/kyc");
	};

	// Handler to submit the employment verification form
	const handleEmploymentSubmit = async (values: EmploymentFormValues) => {
		setCollapsed(false);
		setError(null);

		// Build request body, only including fields with values
		const requestBody: Record<string, string> = {};
		if (values.phone) requestBody.phone = values.phone;
		if (values.pan) requestBody.pan = values.pan.toUpperCase();
		if (values.uan) requestBody.uan = values.uan;
		if (values.dob) requestBody.dob = values.dob;
		if (values.employeeName)
			requestBody.employee_name = values.employeeName.toUpperCase();
		if (values.employerName)
			requestBody.employer_name = values.employerName;

		// Make the API call
		const response = await fetchEmploymentDetails({
			body: requestBody,
		});

		// Process the API response
		if (response?.data) {
			// Success case: status === 0
			if (response.data.status === 0 && response.data.data) {
				setEmploymentResponse(response.data.data);
				setCollapsed(true);
			}
			// Error case: status !== 0
			else {
				const errorMessage =
					response.data.message ||
					"Failed to verify employee details. Please check your input and try again.";
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
					Employee Verification
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Enter employee details to verify employment information. At
					least one field is required.
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
						onSubmit={employmentForm.handleSubmit(
							handleEmploymentSubmit
						)}
					>
						<VStack spacing={4} align="stretch">
							<Input
								label="Phone Number"
								maxlength={10}
								placeholder="Enter employee phone number"
								{...employmentForm.register("phone", {
									validate: validateAtLeastOneField,
									pattern: {
										value: /^[6-9][0-9]{9}$/,
										message:
											"Enter a valid 10-digit phone number",
									},
								})}
								invalid={
									!!employmentForm.formState.errors.phone
								}
								errorMsg={
									employmentForm.formState.errors.phone
										?.message
								}
							/>

							<Input
								label="PAN"
								maxlength={10}
								placeholder="Enter employee PAN number"
								{...employmentForm.register("pan", {
									validate: validateAtLeastOneField,
									pattern: {
										value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
										message: "Enter a valid PAN number",
									},
									onChange: (e) => {
										// Convert input to uppercase dynamically
										e.target.value =
											e.target.value.toUpperCase();
									},
								})}
								invalid={!!employmentForm.formState.errors.pan}
								errorMsg={
									employmentForm.formState.errors.pan?.message
								}
							/>

							<Input
								label="UAN"
								placeholder="Enter employee UAN number"
								maxlength={12}
								{...employmentForm.register("uan", {
									validate: validateAtLeastOneField,
									pattern: {
										value: /^\d{12}$/,
										message: "Enter a valid 12-digit UAN",
									},
								})}
								invalid={!!employmentForm.formState.errors.uan}
								errorMsg={
									employmentForm.formState.errors.uan?.message
								}
							/>
							<Input
								label="Date of Birth"
								type="date"
								placeholder="YYYY-MM-DD"
								{...employmentForm.register("dob", {})}
								invalid={!!employmentForm.formState.errors.dob}
								errorMsg={
									employmentForm.formState.errors.dob?.message
								}
							/>

							<Input
								label="Employee Name"
								maxlength={50}
								placeholder="Enter employee's full name"
								{...employmentForm.register("employeeName", {
									validate: validateAtLeastOneField,
									onChange: (e) => {
										// Convert input to uppercase dynamically
										e.target.value =
											e.target.value.toUpperCase();
									},
								})}
								invalid={
									!!employmentForm.formState.errors
										.employeeName
								}
								errorMsg={
									employmentForm.formState.errors.employeeName
										?.message
								}
							/>

							<Input
								label="Employer Name"
								placeholder="Enter employer's name"
								maxlength={200}
								{...employmentForm.register("employerName", {
									validate: validateAtLeastOneField,
								})}
								invalid={
									!!employmentForm.formState.errors
										.employerName
								}
								errorMsg={
									employmentForm.formState.errors.employerName
										?.message
								}
							/>

							<Text fontSize="sm" color="red.500" mt={-2}>
								{!isAtLeastOneFieldFilled &&
									employmentForm.formState.isSubmitted &&
									"At least one field must be filled"}
							</Text>

							<Button
								type="submit"
								size="lg"
								loading={isLoading}
								w={{ base: "100%", md: "220px" }}
								disabled={!isAtLeastOneFieldFilled}
							>
								Verify Employee
							</Button>
						</VStack>
					</form>
				</Collapse>

				{collapsed && (
					<Box mb={2}>
						<Text fontSize="sm" color="gray.600">
							Verification request submitted successfully
						</Text>
					</Box>
				)}
			</Card>

			{employmentResponse && (
				<EmploymentResultCard
					data={employmentResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};
