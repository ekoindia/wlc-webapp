import { Box, Card, Collapse, Flex, Text } from "@chakra-ui/react";
import { Button, Input } from "components";
import { useEpsV3Fetch } from "hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResponseToolbar } from "../../common/ResponseToolbar";

interface SplitAddress {
	building_name?: string;
	street?: string;
	location?: string;
	district?: string;
	state?: string;
	city?: string;
	flat_number?: string;
	latitude?: string;
	longitude?: string;
	pincode?: string;
}

interface AdditionalAddress {
	address: string;
	split_address?: SplitAddress;
}

interface GstinResponseData {
	GSTIN: string;
	additional_address_array?: AdditionalAddress[];
	cancellation_date?: string;
	center_jurisdiction?: string;
	constitution_of_business?: string;
	date_of_registration?: string;
	gst_in_status?: string;
	last_update_date?: string;
	legal_name_of_business?: string;
	message?: string;
	nature_of_business_activities?: string;
	principal_place_address?: string;
	principal_place_split_address?: SplitAddress;
	state_jurisdiction?: string;
	status_code?: number;
	taxpayer_type?: string;
	valid?: boolean;
}

interface GstinFormValues {
	businessName: string;
	gstin: string;
}

// interface ApiResponse {
// 	status: number;
// 	response_status_id: number;
// 	response_type_id: number;
// 	message: string;
// 	data: GstinResponseData;
// }

// Component to display basic GSTIN information
const BasicInfoSection = ({
	data,
}: {
	data: GstinResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Basic Information
		</Text>
		<Flex direction="column" gap={1}>
			<Flex>
				<Text width="180px" fontWeight="medium">
					GSTIN:
				</Text>
				<Text>{data.GSTIN}</Text>
			</Flex>
			<Flex>
				<Text width="180px" fontWeight="medium">
					Legal Name:
				</Text>
				<Text>{data.legal_name_of_business}</Text>
			</Flex>
			<Flex>
				<Text width="180px" fontWeight="medium">
					Status:
				</Text>
				<Text
					color={
						data.gst_in_status?.toLowerCase() === "active"
							? "green.600"
							: "red.600"
					}
					fontWeight="medium"
				>
					{data.gst_in_status}
				</Text>
			</Flex>
			<Flex>
				<Text width="180px" fontWeight="medium">
					Valid:
				</Text>
				<Text
					color={data.valid ? "green.600" : "red.600"}
					fontWeight="medium"
				>
					{data.valid ? "Yes" : "No"}
				</Text>
			</Flex>
		</Flex>
	</Box>
);

// Component for business details
const BusinessDetailsSection = ({
	data,
}: {
	data: GstinResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Business Details
		</Text>
		<Flex direction="column" gap={1}>
			{data.constitution_of_business && (
				<Flex>
					<Text width="180px" fontWeight="medium">
						Constitution:
					</Text>
					<Text>{data.constitution_of_business}</Text>
				</Flex>
			)}
			{data.nature_of_business_activities && (
				<Flex>
					<Text width="180px" fontWeight="medium">
						Nature:
					</Text>
					<Text>{data.nature_of_business_activities}</Text>
				</Flex>
			)}
			{data.taxpayer_type && (
				<Flex>
					<Text width="180px" fontWeight="medium">
						Taxpayer Type:
					</Text>
					<Text>{data.taxpayer_type}</Text>
				</Flex>
			)}
			{data.state_jurisdiction && (
				<Flex>
					<Text width="180px" fontWeight="medium">
						Jurisdiction:
					</Text>
					<Text>{data.state_jurisdiction}</Text>
				</Flex>
			)}
			{data.center_jurisdiction && (
				<Flex>
					<Text width="180px" fontWeight="medium">
						Center Jurisdiction:
					</Text>
					<Text>{data.center_jurisdiction}</Text>
				</Flex>
			)}
		</Flex>
	</Box>
);

// Component for dates information
const DatesSection = ({ data }: { data: GstinResponseData }): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Dates
		</Text>
		<Flex direction="column" gap={1}>
			{data.date_of_registration && (
				<Flex>
					<Text width="180px" fontWeight="medium">
						Registration Date:
					</Text>
					<Text>{data.date_of_registration}</Text>
				</Flex>
			)}
			{data.last_update_date && (
				<Flex>
					<Text width="180px" fontWeight="medium">
						Last Updated:
					</Text>
					<Text>{data.last_update_date}</Text>
				</Flex>
			)}
			{data.cancellation_date && (
				<Flex>
					<Text width="180px" fontWeight="medium">
						Cancellation Date:
					</Text>
					<Text color="red.600">{data.cancellation_date}</Text>
				</Flex>
			)}
		</Flex>
	</Box>
);

// Component for split address display
const SplitAddressDisplay = ({
	address,
}: {
	address: SplitAddress;
}): JSX.Element => (
	<Box pl={3} mt={2}>
		<Flex direction="column" gap={1}>
			{address.building_name && (
				<Flex>
					<Text width="120px" fontWeight="medium">
						Building:
					</Text>
					<Text>{address.building_name}</Text>
				</Flex>
			)}
			{address.street && (
				<Flex>
					<Text width="120px" fontWeight="medium">
						Street:
					</Text>
					<Text>{address.street}</Text>
				</Flex>
			)}
			{address.location && (
				<Flex>
					<Text width="120px" fontWeight="medium">
						Location:
					</Text>
					<Text>{address.location}</Text>
				</Flex>
			)}
			{address.city && (
				<Flex>
					<Text width="120px" fontWeight="medium">
						City:
					</Text>
					<Text>{address.city}</Text>
				</Flex>
			)}
			{address.state && (
				<Flex>
					<Text width="120px" fontWeight="medium">
						State:
					</Text>
					<Text>{address.state}</Text>
				</Flex>
			)}
			{address.pincode && (
				<Flex>
					<Text width="120px" fontWeight="medium">
						Pincode:
					</Text>
					<Text>{address.pincode}</Text>
				</Flex>
			)}
		</Flex>
	</Box>
);

// Component for principal address
const PrincipalAddressSection = ({
	data,
}: {
	data: GstinResponseData;
}): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			Principal Address
		</Text>
		{data.principal_place_address && (
			<Text mb={2}>{data.principal_place_address}</Text>
		)}

		{data.principal_place_split_address && (
			<SplitAddressDisplay address={data.principal_place_split_address} />
		)}
	</Box>
);

// Component for additional addresses
const AdditionalAddressesSection = ({
	data,
}: {
	data: GstinResponseData;
}): JSX.Element | null => {
	if (!data.additional_address_array?.length) return null;

	return (
		<Box borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
			<Text fontWeight="medium" fontSize="md" mb={2}>
				Additional Addresses
			</Text>
			{data.additional_address_array.map((addr, index) => (
				<Box
					key={index}
					mb={
						index < data.additional_address_array!.length - 1
							? 3
							: 0
					}
				>
					<Text mb={2}>{addr.address}</Text>
					{addr.split_address && (
						<SplitAddressDisplay address={addr.split_address} />
					)}
				</Box>
			))}
		</Box>
	);
};

// Component for the entire GSTIN result display
const GstinResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: GstinResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			GSTIN Verification Result
		</Text>
		<BasicInfoSection data={data} />
		<BusinessDetailsSection data={data} />
		<DatesSection data={data} />
		<PrincipalAddressSection data={data} />
		<AdditionalAddressesSection data={data} />

		<ResponseToolbar
			data={data}
			onBack={onBack}
			onReset={onReset}
			resetButtonText="Verify Another GSTIN"
		/>
	</Card>
);

export const GstinVerifyForm = (): JSX.Element => {
	const [gstinResponse, setGstinResponse] =
		useState<GstinResponseData | null>(null);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fetchGstin, isLoadingGstin] = useEpsV3Fetch("/tools/kyc/gstin", {
		method: "POST",
	});
	const gstinForm = useForm<GstinFormValues>({ mode: "onChange" });
	const router = useRouter();

	// Handler to reset form and show input fields again
	const handleReset = () => {
		setCollapsed(false);
		setGstinResponse(null);
		setError(null);
		gstinForm.reset();
	};

	// Handler to navigate back to GSTIN main page
	const handleBack = () => {
		router.push("/products/gstin");
	};

	// Handler to submit the GSTIN form
	const handleGstinSubmit = async (values: GstinFormValues) => {
		setCollapsed(false);
		setError(null);
		const response = await fetchGstin({
			body: {
				gstin: values.gstin,
				business_name: values.businessName,
			},
		});

		// Check for API response
		if (response?.data) {
			// Success case: status === 0
			if (response.data.status === 0 && response.data.data) {
				setGstinResponse(response.data.data);
				setCollapsed(true);
			}
			// Error case: status !== 0
			else {
				const errorMessage =
					response.data.message ||
					"Failed to verify GSTIN. Please check your input and try again.";
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
					GSTIN Verification
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Enter the business name and GSTIN to verify its validity.
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
					<form onSubmit={gstinForm.handleSubmit(handleGstinSubmit)}>
						<Flex direction="column" gap={4}>
							<Input
								label="Business Name"
								required
								placeholder="Enter Business Name"
								{...gstinForm.register("businessName", {
									required: true,
									maxLength: 100,
								})}
								invalid={
									!!gstinForm.formState.errors.businessName
								}
								errorMsg={
									gstinForm.formState.errors.businessName
										? "Business Name is required"
										: ""
								}
							/>
							<Input
								label="GSTIN"
								required
								placeholder="Enter GSTIN"
								{...gstinForm.register("gstin", {
									required: true,
									minLength: 15,
									maxLength: 15,
								})}
								invalid={!!gstinForm.formState.errors.gstin}
								errorMsg={
									gstinForm.formState.errors.gstin
										? "GSTIN must be 15 characters"
										: ""
								}
							/>
							<Button
								type="submit"
								size="lg"
								loading={isLoadingGstin}
								w={{ base: "100%", md: "200px" }}
							>
								Verify GSTIN
							</Button>
						</Flex>
					</form>
				</Collapse>
				{collapsed && gstinForm.getValues("gstin") && (
					<Box mb={2}>
						<Text fontSize="sm" color="gray.600">
							GSTIN: {gstinForm.getValues("gstin")}
						</Text>
					</Box>
				)}
			</Card>
			{gstinResponse && (
				<GstinResultCard
					data={gstinResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};
