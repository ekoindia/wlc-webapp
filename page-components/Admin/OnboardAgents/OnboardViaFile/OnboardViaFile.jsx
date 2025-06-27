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
 * A OnboardViaFile component
 * @param {object} props - Component props
 * @param {object} props.permissions - User permissions for onboarding
 * @param props.agentTypeList
 * @param props.agentTypeValueToApi
 * @example	`<OnboardViaFile permissions={permissions}></OnboardViaFile>`
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

	useEffect(() => {
		if (applicantType === "" && agentTypeList.length > 0) {
			setApplicantType(agentTypeList[0].value);
		}
	}, [agentTypeList]);

	let _label = agentTypeList.find(
		(type) => type.value === applicantType
	)?.label;

	// Check if user can onboard multiple agent types
	const canOnboardMultipleTypes = permissions?.allowedAgentTypes?.length > 1;

	// Determine which sample file to download based on autoMapDistributor
	const getSampleDownloadLink = () => {
		if (applicantType == UserType.MERCHANT) {
			return permissions?.autoMapDistributor
				? SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR
				: SAMPLE_DOWNLOAD_LINK.RETAILER;
		}
		return SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR;
	};

	const handleFileUpload = () => {
		const formDataObj = {
			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
			applicant_type: agentTypeValueToApi[applicantType],
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
							options={agentTypeList}
							onChange={(value) => setApplicantType(value)}
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
