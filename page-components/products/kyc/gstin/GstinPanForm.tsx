import { Box, Card, Collapse, Flex, Text } from "@chakra-ui/react";
import { Button, Input } from "components";
import { useEpsV3Fetch } from "hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResponseToolbar } from "../../common/ResponseToolbar";

interface GstinItem {
	gstin: string;
	status: string;
	state: string;
}

interface PanResponseData {
	pan: string;
	gstin_list?: GstinItem[];
}

interface PanFormValues {
	pan: string;
}

// interface ApiResponse {
// 	status: number;
// 	response_status_id: number;
// 	response_type_id: number;
// 	message: string;
// 	data: PanResponseData;
// }

// Component for PAN information section
const PanInfoSection = ({ data }: { data: PanResponseData }): JSX.Element => (
	<Box mb={4} borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={2}>
			PAN Information
		</Text>
		<Flex>
			<Text width="120px" fontWeight="medium">
				PAN:
			</Text>
			<Text fontWeight="medium">{data.pan}</Text>
		</Flex>
	</Box>
);

// Component for GSTIN list header
const GstinListHeader = (): JSX.Element => (
	<Flex bg="gray.100" p={2} borderRadius="md" mb={2} fontWeight="medium">
		<Text flex="1">GSTIN</Text>
		<Text width="100px">Status</Text>
		<Text width="120px">State</Text>
	</Flex>
);

// Component for individual GSTIN item
const GstinListItem = ({ item }: { item: GstinItem }): JSX.Element => (
	<Flex
		p={2}
		borderBottomWidth="1px"
		borderBottomColor="gray.200"
		_hover={{ bg: "gray.50" }}
	>
		<Text flex="1" fontFamily="mono">
			{item.gstin}
		</Text>
		<Text
			width="100px"
			color={
				item.status?.toLowerCase() === "active"
					? "green.600"
					: "red.600"
			}
			fontWeight="medium"
		>
			{item.status}
		</Text>
		<Text width="120px">{item.state}</Text>
	</Flex>
);

// Component for empty GSTIN list state
const EmptyGstinList = (): JSX.Element => (
	<Flex
		direction="column"
		align="center"
		justify="center"
		py={8}
		bg="gray.100"
		borderRadius="md"
	>
		<Text fontSize="md" color="gray.500">
			No GSTINs found for this PAN.
		</Text>
	</Flex>
);

// Component for GSTIN list section
const GstinListSection = ({ data }: { data: PanResponseData }): JSX.Element => (
	<Box borderLeft="4px" borderLeftColor="primary.DEFAULT" pl={3}>
		<Text fontWeight="medium" fontSize="md" mb={3}>
			Linked GSTINs
		</Text>
		{data.gstin_list?.length ? (
			<Box>
				<GstinListHeader />
				{data.gstin_list.map((item) => (
					<GstinListItem key={item.gstin} item={item} />
				))}
			</Box>
		) : (
			<EmptyGstinList />
		)}
	</Box>
);

// Component for the entire PAN result display
const PanResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: PanResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			GSTINs Linked to PAN
		</Text>
		<PanInfoSection data={data} />
		<GstinListSection data={data} />

		<ResponseToolbar
			data={data}
			onBack={onBack}
			onReset={onReset}
			resetButtonText="Check Another PAN"
		/>
	</Card>
);

export const GstinPanForm = (): JSX.Element => {
	const [panResponse, setPanResponse] = useState<PanResponseData | null>(
		null
	);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fetchPan, isLoadingPan] = useEpsV3Fetch(
		"/tools/kyc/gstin-with-pan",
		{ method: "POST" }
	);
	const panForm = useForm<PanFormValues>({ mode: "onChange" });
	const router = useRouter();

	// Handler to reset form and show input fields again
	const handleReset = () => {
		setCollapsed(false);
		setPanResponse(null);
		setError(null);
		panForm.reset();
	};

	// Handler to navigate back to GSTIN main page
	const handleBack = () => {
		router.push("/products/gstin");
	};

	// Handler to submit the PAN form
	const handlePanSubmit = async (values: PanFormValues) => {
		setCollapsed(false);
		setError(null);
		const response = await fetchPan({ body: { pan: values.pan } });

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
					"Failed to fetch GSTINs. Please verify your PAN and try again.";
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
					GSTINs by PAN
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Enter the PAN to fetch all GSTINs linked to it.
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
						<Flex direction="column" gap={4}>
							<Input
								label="PAN"
								required
								placeholder="Enter PAN (ABCDE1234F)"
								{...panForm.register("pan", {
									required: true,
									pattern: /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
								})}
								invalid={!!panForm.formState.errors.pan}
								errorMsg={
									panForm.formState.errors.pan
										? "Invalid PAN format"
										: ""
								}
							/>
							<Button
								type="submit"
								size="lg"
								loading={isLoadingPan}
								w={{ base: "100%", md: "200px" }}
							>
								Fetch GSTINs
							</Button>
						</Flex>
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
				<PanResultCard
					data={panResponse}
					onReset={handleReset}
					onBack={handleBack}
				/>
			)}
		</Box>
	);
};
