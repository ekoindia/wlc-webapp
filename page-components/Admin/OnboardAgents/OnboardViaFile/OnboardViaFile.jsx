import { Box, Flex, Link } from "@chakra-ui/react";
import {
	ActionButtonGroup,
	Button,
	Dropzone,
	Icon,
	InputLabel,
	Radio,
} from "components";
import { Endpoints, UserType } from "constants";
import { useSession } from "contexts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { OnboardAgentResponse } from "..";

const SAMPLE_DOWNLOAD_LINK = {
	RETAILER:
		"https://files.eko.co.in/docs/onboarding/sample_files/Bulk_Agent_Onboarding.xlsx",
	DISTRIBUTOR:
		"https://files.eko.co.in/docs/onboarding/sample_files/Bulk_Distributor_Onboarding.xlsx",
};

/**
 * Component for onboarding multiple agents at once via file upload.
 * Provides a file upload interface, download links for sample templates, and shows results after upload.
 * @param {object} props - Component props
 * @param {object} props.permissions - User permissions for onboarding, controls which agent types can be onboarded
 * @param {Array<{label: string, value: string}>} props.agentTypeList - List of agent types that can be onboarded
 * @param {object} props.agentTypeValueToApi - Mapping between frontend and API values for agent types
 * @returns {JSX.Element} File upload interface or results display based on process state
 * @example
 * ```jsx
 * <OnboardViaFile permissions={permissions} agentTypeList={[{label: 'Retailer', value: '1'}]} agentTypeValueToApi={{1: '2'}} />
 * ```
 */
const OnboardViaFile = ({
	permissions,
	agentTypeList,
	agentTypeValueToApi,
}) => {
	const [file, setFile] = useState(null);
	const [data, setData] = useState(null);
	const [applicantType, setApplicantType] = useState("");
	const { accessToken } = useSession();
	const router = useRouter();

	// Initialize applicantType with the first available agent type
	useEffect(() => {
		if (applicantType === "" && agentTypeList.length > 0) {
			setApplicantType(agentTypeList[0].value);
		}
	}, [agentTypeList, applicantType]);

	// Get the display label for the selected agent type
	let _label = agentTypeList.find(
		(type) => type.value === applicantType
	)?.label;

	// Check if user can onboard multiple agent types to show/hide the agent type selector
	const canOnboardMultipleTypes = permissions?.allowedAgentTypes?.length > 1;

	/**
	 * Determines the appropriate sample file download link based on applicant type and permissions
	 * - For MERCHANT type: Uses either retailer or distributor template based on autoMapDistributor setting
	 * - For other types: Always uses distributor template
	 * @returns {string} URL to the appropriate sample file
	 */
	const getSampleDownloadLink = () => {
		if (applicantType == UserType.MERCHANT) {
			return permissions?.autoMapDistributor
				? SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR
				: SAMPLE_DOWNLOAD_LINK.RETAILER;
		}
		return SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR;
	};

	/**
	 * Handles the file upload process for bulk agent onboarding
	 * 1. Creates a unique client reference ID
	 * 2. Prepares the form data with file and metadata
	 * 3. Sends the data to the bulk onboarding API endpoint
	 * 4. Updates state with response data for display
	 */
	const handleFileUpload = () => {
		// Create a unique reference ID using timestamp + random number
		const formDataObj = {
			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
			applicant_type: agentTypeValueToApi[applicantType], // Convert frontend value to API value
			source: "WLC",
		};

		// Prepare the multipart form data
		const formData = new FormData();
		formData.append("formdata", new URLSearchParams(formDataObj));
		formData.append("file_name", file);

		// Send bulk onboarding request to API
		fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD_CUSTOM_URL,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": "/network/agent/bulk_onboarding",
					"tf-req-method": "POST",
				},
				body: formData,
			}
		)
			.then((res) => res.json())
			.then((data) => {
				// Update state with API response data to show results
				setData(data);
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	const buttonConfigList = [
		{
			size: "lg",
			label: "Upload",
			onClick: () => handleFileUpload(),
			disabled: file === null || file === undefined,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	return (
		<Flex direction="column" gap="8">
			{data === null ? (
				// File upload form - shown before submission
				<Flex
					direction="column"
					gap="8"
					w={{ base: "100%", md: "500px" }}
				>
					{/* Agent type selector - only shown if multiple agent types are allowed */}
					{canOnboardMultipleTypes && (
						<Radio
							value={applicantType}
							label="Select Agent Type"
							options={agentTypeList}
							onChange={(value) => setApplicantType(value)}
							required
						/>
					)}
					<Flex direction="column">
						<InputLabel required={true}>
							Download Sample File (for Onboarding {_label})
						</InputLabel>
						<Link
							href={getSampleDownloadLink()}
							w="fit-content"
							fontWeight="semibold"
							prefetch={false}
							isExternal
						>
							<Button>
								<Icon name="file-download" size="sm" />
								&nbsp; Download
							</Button>
						</Link>
					</Flex>

					<Flex direction="column">
						<InputLabel required={true}>
							Upload the List of {_label} to Onboard
						</InputLabel>
						<Dropzone
							file={file}
							setFile={setFile}
							accept=".xls,.xlsx"
						/>
					</Flex>

					<ActionButtonGroup {...{ buttonConfigList }} />
				</Flex>
			) : (
				// Results display - shown after file submission
				<Flex direction="column" gap="2">
					{/* Response message and statistics summary */}
					<Flex fontSize="sm" direction="column" gap="1">
						{/* API response message or fallback */}
						<span>{data?.message || "Something went wrong"}!!</span>

						{/* Show accepted records count if any */}
						{data?.data?.processed_records > 0 && (
							<Flex gap="1">
								<Box as="span" fontWeight="semibold">
									Accepted:
								</Box>
								<span>{data?.data?.processed_records}</span>
								<span>
									{data?.data?.processed_records === 1
										? "record"
										: "records"}
								</span>
							</Flex>
						)}

						{/* Show rejected records count if any */}
						{data?.data?.failed_count > 0 && (
							<Flex gap="1">
								<Box as="span" fontWeight="semibold">
									Rejected:
								</Box>
								<span>{data?.data?.failed_count}</span>
								<span>
									{data?.data?.failed_count === 1
										? "record"
										: "records"}
								</span>
							</Flex>
						)}
					</Flex>

					{/* Display detailed results table if there are records to show */}
					{data?.data?.csp_list?.length > 0 && (
						<OnboardAgentResponse
							responseList={data?.data?.csp_list}
							applicantType={applicantType}
						/>
					)}
				</Flex>
			)}
		</Flex>
	);
};

export default OnboardViaFile;
