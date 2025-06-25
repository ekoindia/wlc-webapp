import { Box, Flex, Link } from "@chakra-ui/react";
import {
	ActionButtonGroup,
	Button,
	Dropzone,
	Icon,
	InputLabel,
	Radio,
} from "components";
import { Endpoints } from "constants";
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

const AGENT_TYPE = {
	RETAILER: "0",
	DISTRIBUTOR: "2",
};

const applicantTypeObj = {
	0: "Retailers",
	2: "Distributors",
};

const onboardAgentTypeList = [
	{ value: AGENT_TYPE.RETAILER, label: "Retailers" },
	{ value: AGENT_TYPE.DISTRIBUTOR, label: "Distributors" },
];

/**
 * A OnboardViaFile component
 * @param {object} props - Component props
 * @param {object} props.permissions - User permissions for onboarding
 * @example	`<OnboardViaFile permissions={permissions}></OnboardViaFile>`
 */
const OnboardViaFile = ({ permissions }) => {
	const [file, setFile] = useState(null);
	const [data, setData] = useState(null);
	// const [loading, setLoading] = useState(false);
	const [applicantType, setApplicantType] = useState("0");
	const { accessToken /* , userId, userCode */ } = useSession();
	const router = useRouter();

	// Set default applicant type based on permissions
	useEffect(() => {
		// If user can only onboard retailers, set it by default
		if (
			permissions?.allowedAgentTypes?.length === 1 &&
			permissions.allowedAgentTypes[0] === 2
		) {
			setApplicantType(AGENT_TYPE.RETAILER);
		}
	}, [permissions]);

	// Check if user can onboard multiple agent types
	const canOnboardMultipleTypes = permissions?.allowedAgentTypes?.length > 1;

	// Determine which sample file to download based on autoMapDistributor
	const getSampleDownloadLink = () => {
		if (applicantType === AGENT_TYPE.RETAILER) {
			return permissions?.autoMapDistributor
				? SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR
				: SAMPLE_DOWNLOAD_LINK.RETAILER;
		}
		return SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR;
	};

	const handleFileUpload = () => {
		const formDataObj = {
			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
			// initiator_id: userId,
			// user_code: userCode,
			// org_id: org_id,
			applicant_type: applicantType,
			source: "WLC",
		};

		const formData = new FormData();
		formData.append("formdata", new URLSearchParams(formDataObj));
		formData.append("file_name", file);

		fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD_CUSTOM_URL,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					// "Content-Type": "multipart/form-data",
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": "/network/agent/bulk_onboarding",
					"tf-req-method": "POST",
				},
				body: formData,
				// token: accessToken,
			}
		)
			.then((res) => res.json())
			.then((data) => {
				console.log("[BulkOnboarding] data:", data);
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
				<Flex
					direction="column"
					gap="8"
					w={{ base: "100%", md: "500px" }}
				>
					{canOnboardMultipleTypes && (
						<Radio
							value={applicantType}
							label="Select Agent Type"
							options={onboardAgentTypeList}
							onChange={(value) => setApplicantType(value)}
						/>
					)}
					<Flex direction="column">
						<InputLabel required={true}>
							Download Sample File (for Onboarding{" "}
							{applicantTypeObj[applicantType]})
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
							Upload the List of {applicantTypeObj[applicantType]}{" "}
							to Onboard
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
				<Flex direction="column" gap="2">
					<Flex fontSize="sm" direction="column" gap="1">
						<span>{data?.message || "Something went wrong"}!!</span>
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
