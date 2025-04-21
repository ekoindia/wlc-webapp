import { Box, Card, Collapse, Flex, Text } from "@chakra-ui/react";
import { Button, Input } from "components";
import { useEpsV3Fetch } from "hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResponseSection, ResponseToolbar } from "../../common";
import { PanBasicResponseData } from "./types";

interface PanBasicFormValues {
	panNumber: string;
	purpose: string;
}

// Component for basic PAN information display
const BasicInfoSection = ({
	data,
}: {
	data: PanBasicResponseData;
}): JSX.Element => (
	<ResponseSection heading="PAN Information">
		<Flex direction="column" gap={1}>
			<Flex>
				<Text width="180px" fontWeight="medium">
					PAN Number:
				</Text>
				<Text>{data.pan_number}</Text>
			</Flex>
			<Flex>
				<Text width="180px" fontWeight="medium">
					Full Name:
				</Text>
				<Text>{data.pan_returned_name}</Text>
			</Flex>
			<Flex>
				<Text width="180px" fontWeight="medium">
					Title:
				</Text>
				<Text>{data.title}</Text>
			</Flex>
			<Flex>
				<Text width="180px" fontWeight="medium">
					First Name:
				</Text>
				<Text>{data.first_name}</Text>
			</Flex>
			{data.middle_name && (
				<Flex>
					<Text width="180px" fontWeight="medium">
						Middle Name:
					</Text>
					<Text>{data.middle_name}</Text>
				</Flex>
			)}
			<Flex>
				<Text width="180px" fontWeight="medium">
					Last Name:
				</Text>
				<Text>{data.last_name}</Text>
			</Flex>
			<Flex>
				<Text width="180px" fontWeight="medium">
					Gender:
				</Text>
				<Text>{data.gender}</Text>
			</Flex>
			<Flex>
				<Text width="180px" fontWeight="medium">
					Aadhaar Seeding Status:
				</Text>
				<Text>{data.aadhaar_seeding_status || "Not Available"}</Text>
			</Flex>
		</Flex>
	</ResponseSection>
);

// Component for the PAN result card
const PanResultCard = ({
	data,
	onReset,
	onBack,
}: {
	data: PanBasicResponseData;
	onReset: () => void;
	onBack: () => void;
}): JSX.Element => (
	<Card p={4} bg="gray.50">
		<Text fontWeight="bold" fontSize="lg" mb={4}>
			PAN Verification Result
		</Text>
		<BasicInfoSection data={data} />

		<ResponseToolbar
			data={data}
			onBack={onBack}
			onReset={onReset}
			resetButtonText="Verify Another PAN"
		/>
	</Card>
);

export const PanBasicForm = (): JSX.Element => {
	const [panResponse, setPanResponse] = useState<PanBasicResponseData | null>(
		null
	);
	const [collapsed, setCollapsed] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fetchPan, isLoadingPan] = useEpsV3Fetch("/tools/kyc/pan-basic", {
		method: "POST",
	});

	const panForm = useForm<PanBasicFormValues>({
		mode: "onChange",
		defaultValues: {
			purpose: "1",
		},
	});
	const router = useRouter();

	// Handler to reset form and show input fields again
	const handleReset = () => {
		setCollapsed(false);
		setPanResponse(null);
		setError(null);
		panForm.reset({ purpose: "1" });
	};

	// Handler to navigate back to PAN main page
	const handleBack = () => {
		router.push("/products/kyc/pan");
	};

	// Handler to submit the PAN form
	const handlePanSubmit = async (values: PanBasicFormValues) => {
		setCollapsed(false);
		setError(null);
		const response = await fetchPan({
			body: {
				pan_number: values.panNumber,
				purpose: parseInt(values.purpose, 10),
				purpose_desc: "KYC verification",
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
					PAN Basic Verification
				</Text>
				<Text fontSize="sm" color="gray.500" mb={4}>
					Enter the PAN number to verify basic details.
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
								label="PAN Number"
								required
								placeholder="Enter PAN Number"
								{...panForm.register("panNumber", {
									required: true,
									pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
									maxLength: 10,
								})}
								invalid={!!panForm.formState.errors.panNumber}
								errorMsg={
									panForm.formState.errors.panNumber
										? "Valid PAN format required (e.g., ABCDE1234F)"
										: ""
								}
							/>
							<Input
								label="Purpose"
								type="hidden"
								{...panForm.register("purpose")}
							/>

							<Button
								type="submit"
								size="lg"
								loading={isLoadingPan}
								w={{ base: "100%", md: "200px" }}
							>
								Verify PAN
							</Button>
						</Flex>
					</form>
				</Collapse>
				{collapsed && panForm.getValues("panNumber") && (
					<Box mb={2}>
						<Text fontSize="sm" color="gray.600">
							PAN: {panForm.getValues("panNumber")}
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
