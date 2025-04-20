// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/page-components/products/kyc/vehicle-rc/VehicleRcForm.tsx
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
import { ResponseToolbar } from "../../common/ResponseToolbar";

// Type definitions for Vehicle RC API response
interface SplitAddress {
	district: string[];
	state: string[][];
	city: string[];
	pincode: string;
	country: string[];
	address_line: string;
}

interface BlacklistDetails {
	// Define fields for blacklist details as needed
}

interface ChallanDetails {
	// Define fields for challan details as needed
}

interface NocDetails {
	// Define fields for NOC details as needed
}

interface VehicleRcResponseData {
	reference_id: number;
	status: string;
	reg_no: string;
	class: string;
	chassis: string;
	engine: string;
	vehicle_manufacturer_name: string;
	model: string;
	vehicle_color: string;
	type: string;
	norms_type: string;
	body_type: string;
	owner_count: string;
	owner: string;
	owner_father_name: string;
	mobile_number: string;
	rc_status: string;
	status_as_on: string;
	reg_authority: string;
	reg_date: string;
	vehicle_manufacturing_month_year: string;
	rc_expiry_date: string;
	vehicle_tax_upto: string;
	vehicle_insurance_company_name: string;
	vehicle_insurance_upto: string;
	vehicle_insurance_policy_number: string;
	rc_financer: string;
	present_address: string;
	split_present_address: SplitAddress;
	permanent_address: string;
	split_permanent_address: SplitAddress;
	vehicle_cubic_capacity: string;
	gross_vehicle_weight: string;
	unladen_weight: string;
	vehicle_category: string;
	rc_standard_cap?: string;
	vehicle_cylinders_no: string;
	vehicle_seat_capacity: string;
	vehicle_sleeper_capacity: string;
	vehicle_standing_capacity: string;
	wheelbase: string;
	vehicle_number: string;
	pucc_number: string;
	pucc_upto: string;
	blacklist_status: string;
	blacklist_details: BlacklistDetails;
	challan_details: ChallanDetails;
	permit_issue_date: string;
	permit_number: string;
	permit_type: string;
	permit_valid_from: string;
	permit_valid_upto: string;
	non_use_status: string;
	non_use_from: string;
	non_use_to: string;
	national_permit_number: string;
	national_permit_upto: string;
	national_permit_issued_by: string;
	is_commercial: boolean;
	noc_details: NocDetails;
}

interface VehicleRcFormValues {
	vehicleNumber: string;
}

// Component to display vehicle basic information
const BasicInfoSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Basic Information
		</Text>
		<Grid templateColumns="repeat(2, 1fr)" gap={3}>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Registration No:
					</Text>
					<Text>{data.reg_no}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Status:
					</Text>
					<Text
						color={
							data.rc_status?.toLowerCase() === "active"
								? "green.600"
								: "red.600"
						}
						fontWeight="medium"
					>
						{data.status}
					</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Reference ID:
					</Text>
					<Text>{data.reference_id}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						RC Status:
					</Text>
					<Text
						color={
							data.rc_status?.toLowerCase() === "active"
								? "green.600"
								: "red.600"
						}
						fontWeight="medium"
					>
						{data.rc_status}
					</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Class:
					</Text>
					<Text>{data.class}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Type:
					</Text>
					<Text>{data.type}</Text>
				</Flex>
			</GridItem>
		</Grid>
	</Box>
);

// Component for vehicle details
const VehicleDetailsSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Vehicle Details
		</Text>
		<Grid templateColumns="repeat(2, 1fr)" gap={3}>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Manufacturer:
					</Text>
					<Text>{data.vehicle_manufacturer_name}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Model:
					</Text>
					<Text>{data.model}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Color:
					</Text>
					<Text>{data.vehicle_color}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Body Type:
					</Text>
					<Text>{data.body_type}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Chassis Number:
					</Text>
					<Text>{data.chassis}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Engine Number:
					</Text>
					<Text>{data.engine}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Manufacturing Date:
					</Text>
					<Text>{data.vehicle_manufacturing_month_year}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Norms Type:
					</Text>
					<Text>{data.norms_type}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Vehicle Category:
					</Text>
					<Text>{data.vehicle_category}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Is Commercial:
					</Text>
					<Text>{data.is_commercial ? "Yes" : "No"}</Text>
				</Flex>
			</GridItem>
		</Grid>
	</Box>
);

// Component for owner information
const OwnerSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Owner Information
		</Text>
		<Grid templateColumns="repeat(2, 1fr)" gap={3}>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Owner Name:
					</Text>
					<Text>{data.owner}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Father's Name:
					</Text>
					<Text>{data.owner_father_name}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Mobile Number:
					</Text>
					<Text>{data.mobile_number}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Owner Count:
					</Text>
					<Text>{data.owner_count}</Text>
				</Flex>
			</GridItem>
		</Grid>
	</Box>
);

// Component for registration dates
const RegistrationSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Registration Information
		</Text>
		<Grid templateColumns="repeat(2, 1fr)" gap={3}>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Registration Date:
					</Text>
					<Text>{data.reg_date}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						RC Expiry Date:
					</Text>
					<Text>{data.rc_expiry_date}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Registration Authority:
					</Text>
					<Text>{data.reg_authority}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Status As On:
					</Text>
					<Text>{data.status_as_on}</Text>
				</Flex>
			</GridItem>
		</Grid>
	</Box>
);

// Component for insurance and tax information
const InsuranceSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Insurance & Tax Information
		</Text>
		<Grid templateColumns="repeat(2, 1fr)" gap={3}>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Insurance Company:
					</Text>
					<Text>{data.vehicle_insurance_company_name}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Insurance Valid Till:
					</Text>
					<Text>{data.vehicle_insurance_upto}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Policy Number:
					</Text>
					<Text>{data.vehicle_insurance_policy_number}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Tax Valid Till:
					</Text>
					<Text>{data.vehicle_tax_upto}</Text>
				</Flex>
			</GridItem>
		</Grid>
	</Box>
);

// Component for pollution certificate information
const PollutionSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Pollution Certificate
		</Text>
		<Grid templateColumns="repeat(2, 1fr)" gap={3}>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						PUCC Number:
					</Text>
					<Text>{data.pucc_number}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						PUCC Valid Till:
					</Text>
					<Text>{data.pucc_upto}</Text>
				</Flex>
			</GridItem>
		</Grid>
	</Box>
);

// Component for finance and permit details
const FinanceSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Finance & Permits
		</Text>
		<Grid templateColumns="repeat(2, 1fr)" gap={3}>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Financer:
					</Text>
					<Text>{data.rc_financer || "N/A"}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Permit Type:
					</Text>
					<Text>{data.permit_type || "N/A"}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Permit Number:
					</Text>
					<Text>{data.permit_number || "N/A"}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Permit Valid Till:
					</Text>
					<Text>{data.permit_valid_upto || "N/A"}</Text>
				</Flex>
			</GridItem>
			{data.national_permit_number && (
				<>
					<GridItem>
						<Flex>
							<Text width="180px" fontWeight="medium">
								National Permit:
							</Text>
							<Text>{data.national_permit_number}</Text>
						</Flex>
					</GridItem>
					<GridItem>
						<Flex>
							<Text width="180px" fontWeight="medium">
								National Permit Till:
							</Text>
							<Text>{data.national_permit_upto}</Text>
						</Flex>
					</GridItem>
				</>
			)}
		</Grid>
	</Box>
);

// Component for technical specifications
const TechnicalSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Technical Specifications
		</Text>
		<Grid templateColumns="repeat(2, 1fr)" gap={3}>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Cubic Capacity:
					</Text>
					<Text>{data.vehicle_cubic_capacity}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Cylinder Count:
					</Text>
					<Text>{data.vehicle_cylinders_no}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Gross Weight:
					</Text>
					<Text>{data.gross_vehicle_weight}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Unladen Weight:
					</Text>
					<Text>{data.unladen_weight}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Wheelbase:
					</Text>
					<Text>{data.wheelbase}</Text>
				</Flex>
			</GridItem>
			<GridItem>
				<Flex>
					<Text width="180px" fontWeight="medium">
						Seats:
					</Text>
					<Text>{data.vehicle_seat_capacity}</Text>
				</Flex>
			</GridItem>
		</Grid>
	</Box>
);

// Component for address information
const AddressSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Address Information
		</Text>

		<Box mb={3}>
			<Text fontWeight="medium" mb={1}>
				Present Address:
			</Text>
			<Text mb={2}>{data.present_address}</Text>

			{data.split_present_address && (
				<Box pl={3} mt={2}>
					<Grid templateColumns="repeat(2, 1fr)" gap={3}>
						{data.split_present_address.city &&
							data.split_present_address.city.length > 0 && (
								<GridItem>
									<Flex>
										<Text width="120px" fontWeight="medium">
											City:
										</Text>
										<Text>
											{data.split_present_address.city.join(
												", "
											)}
										</Text>
									</Flex>
								</GridItem>
							)}
						{data.split_present_address.district &&
							data.split_present_address.district.length > 0 && (
								<GridItem>
									<Flex>
										<Text width="120px" fontWeight="medium">
											District:
										</Text>
										<Text>
											{data.split_present_address.district.join(
												", "
											)}
										</Text>
									</Flex>
								</GridItem>
							)}
						{data.split_present_address.state &&
							data.split_present_address.state.length > 0 && (
								<GridItem>
									<Flex>
										<Text width="120px" fontWeight="medium">
											State:
										</Text>
										<Text>
											{data.split_present_address.state
												.map((s) => s.join(", "))
												.join("; ")}
										</Text>
									</Flex>
								</GridItem>
							)}
						{data.split_present_address.pincode && (
							<GridItem>
								<Flex>
									<Text width="120px" fontWeight="medium">
										Pincode:
									</Text>
									<Text>
										{data.split_present_address.pincode}
									</Text>
								</Flex>
							</GridItem>
						)}
					</Grid>
				</Box>
			)}
		</Box>

		<Box>
			<Text fontWeight="medium" mb={1}>
				Permanent Address:
			</Text>
			<Text mb={2}>{data.permanent_address}</Text>

			{data.split_permanent_address && (
				<Box pl={3} mt={2}>
					<Grid templateColumns="repeat(2, 1fr)" gap={3}>
						{data.split_permanent_address.city &&
							data.split_permanent_address.city.length > 0 && (
								<GridItem>
									<Flex>
										<Text width="120px" fontWeight="medium">
											City:
										</Text>
										<Text>
											{data.split_permanent_address.city.join(
												", "
											)}
										</Text>
									</Flex>
								</GridItem>
							)}
						{data.split_permanent_address.district &&
							data.split_permanent_address.district.length >
								0 && (
								<GridItem>
									<Flex>
										<Text width="120px" fontWeight="medium">
											District:
										</Text>
										<Text>
											{data.split_permanent_address.district.join(
												", "
											)}
										</Text>
									</Flex>
								</GridItem>
							)}
						{data.split_permanent_address.state &&
							data.split_permanent_address.state.length > 0 && (
								<GridItem>
									<Flex>
										<Text width="120px" fontWeight="medium">
											State:
										</Text>
										<Text>
											{data.split_permanent_address.state
												.map((s) => s.join(", "))
												.join("; ")}
										</Text>
									</Flex>
								</GridItem>
							)}
						{data.split_permanent_address.pincode && (
							<GridItem>
								<Flex>
									<Text width="120px" fontWeight="medium">
										Pincode:
									</Text>
									<Text>
										{data.split_permanent_address.pincode}
									</Text>
								</Flex>
							</GridItem>
						)}
					</Grid>
				</Box>
			)}
		</Box>
	</Box>
);

// Component for blacklist information
const BlacklistSection = ({
	data,
}: {
	data: VehicleRcResponseData;
}): JSX.Element | null => {
	if (data.blacklist_status.toLowerCase() !== "yes") return null;

	return (
		<Box mb={4} borderLeft="4px" borderLeftColor="red.500" pl={3}>
			<Text fontWeight="medium" fontSize="md" mb={2} color="red.600">
				Blacklist Information
			</Text>
			<Text>Vehicle is blacklisted. Check authorities for details.</Text>
		</Box>
	);
};

// Component for the entire Vehicle RC result display
const VehicleRcResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: VehicleRcResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			Vehicle RC Details
		</Text>
		<BasicInfoSection data={data} />
		<VehicleDetailsSection data={data} />
		<OwnerSection data={data} />
		<RegistrationSection data={data} />
		<InsuranceSection data={data} />
		<PollutionSection data={data} />
		<FinanceSection data={data} />
		<TechnicalSection data={data} />
		<AddressSection data={data} />
		<BlacklistSection data={data} />

		<ResponseToolbar
			data={data}
			onBack={onBack}
			onReset={onReset}
			resetButtonText="Verify Another Vehicle"
		/>
	</Card>
);

export const VehicleRcForm = (): JSX.Element => {
	const [vehicleRcResponse, setVehicleRcResponse] =
		useState<VehicleRcResponseData | null>(null);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fetchVehicleRc, isLoadingVehicleRc] = useEpsV3Fetch(
		"/tools/kyc/vehicle-rc",
		{
			method: "POST",
		}
	);
	const vehicleRcForm = useForm<VehicleRcFormValues>({ mode: "onChange" });
	const router = useRouter();

	// Handler to reset form and show input fields again
	const handleReset = () => {
		setCollapsed(false);
		setVehicleRcResponse(null);
		setError(null);
		vehicleRcForm.reset();
	};

	// Handler to navigate back to KYC main page
	const handleBack = () => {
		router.push("/products/kyc");
	};

	// Handler to submit the Vehicle RC form
	const handleVehicleRcSubmit = async (values: VehicleRcFormValues) => {
		setCollapsed(false);
		setError(null);
		const response = await fetchVehicleRc({
			body: {
				vehicle_number: values.vehicleNumber,
			},
		});

		// Check for API response
		if (response?.data) {
			// Success case: status === 0
			if (response.data.status === 0 && response.data.data) {
				setVehicleRcResponse(response.data.data);
				setCollapsed(true);
			}
			// Error case: status !== 0
			else {
				const errorMessage =
					response.data.message ||
					"Failed to verify Vehicle RC. Please check your input and try again.";
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
					Vehicle RC Verification
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Enter the vehicle registration number to verify its
					registration details.
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
						onSubmit={vehicleRcForm.handleSubmit(
							handleVehicleRcSubmit
						)}
					>
						<Flex direction="column" gap={4}>
							<Input
								label="Vehicle Registration Number"
								required
								placeholder="Enter vehicle registration number (e.g., DL1234567890)"
								{...vehicleRcForm.register("vehicleNumber", {
									required: true,
									pattern: {
										value: /^[A-Z0-9]+$/i,
										message:
											"Please enter a valid registration number",
									},
									minLength: {
										value: 8,
										message:
											"Registration number must be at least 8 characters",
									},
									maxLength: {
										value: 15,
										message:
											"Registration number must not exceed 15 characters",
									},
								})}
								invalid={
									!!vehicleRcForm.formState.errors
										.vehicleNumber
								}
								errorMsg={
									vehicleRcForm.formState.errors.vehicleNumber
										? vehicleRcForm.formState.errors
												.vehicleNumber.message
										: ""
								}
								helperText="Enter vehicle registration number without spaces or special characters"
							/>
							<Button
								type="submit"
								size="lg"
								loading={isLoadingVehicleRc}
								w={{ base: "100%", md: "200px" }}
							>
								Verify Vehicle RC
							</Button>
						</Flex>
					</form>
				</Collapse>
				{collapsed && vehicleRcForm.getValues("vehicleNumber") && (
					<Box mb={2}>
						<Text fontSize="sm" color="gray.600">
							Vehicle Number:{" "}
							{vehicleRcForm.getValues("vehicleNumber")}
						</Text>
					</Box>
				)}
			</Card>
			{vehicleRcResponse && (
				<VehicleRcResultCard
					data={vehicleRcResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};
