import { Box, Flex, Link, Radio, RadioGroup, Text } from "@chakra-ui/react";
import { Button, Dropzone, Headings, Icon } from "components";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { useState } from "react";
import { BulkOnboardingResponse } from ".";

// const DUMMY = {
// 	response_status_id: 0,
// 	response_type_id: 1900,
// 	totalRecords: 5,
// 	processed_records: 4,
// 	failed_records: 1,
// 	list: [
// 		{
// 			name: "Vishal Kumar",
// 			mobile: "0123456789",
// 			status: "Failed",
// 			reason: "Duplicate Mobile",
// 		},
// 		{
// 			name: "Vishal Kumar",
// 			mobile: "0123456789",
// 			status: "Failed",
// 			reason: "Duplicate Mobile",
// 		},
// 		{
// 			name: "Vishal Kumar",
// 			mobile: "0123456789",
// 			status: "Failed",
// 			reason: "Duplicate Mobile",
// 		},
// 	],
// 	message: "Files processed successfully",
// 	status: 0,
// };

const SAMPLE_DOWNLOAD_LINK = {
	SELLER: "https://files.eko.co.in/docs/onboarding/sample_files/Bulk_Agent_Onboarding.xlsx",
	DISTRIBUTOR:
		"https://files.eko.co.in/docs/onboarding/sample_files/Bulk_Distributor_Onboarding.xlsx",
};

/**
 * A <BulkOnboarding> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<BulkOnboarding></BulkOnboarding>` TODO: Fix example
 */
const BulkOnboarding = () => {
	const [file, setFile] = useState(null);
	const [data, setData] = useState(null);
	// const [loading, setLoading] = useState(false);
	const [applicantType, setApplicantType] = useState("0");
	const { accessToken /* , userId, userCode */ } = useSession();

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

	const applicantTypeObj = {
		0: "Seller",
		2: "Distributor",
	};

	return (
		<>
			<Headings title="Bulk Onboarding" hasIcon={false} />
			<Flex
				direction="column"
				w="100%"
				p={{ base: "1em", md: "2em" }}
				bg="white"
				borderRadius={8}
				fontSize="md"
				gap="6"
			>
				{data === null ? (
					<Flex
						direction="column"
						gap="10"
						w={{ base: "100%", md: "500px" }}
					>
						<Flex direction="column" gap="2">
							<Text fontWeight="semibold">Select User Type</Text>
							<RadioGroup
								defaultValue="0"
								value={applicantType}
								onChange={(value) => setApplicantType(value)}
							>
								<Flex
									direction={{ base: "column", sm: "row" }}
									gap={{ base: "4", md: "16" }}
								>
									{Object.entries(applicantTypeObj).map(
										([key, value]) => (
											<Radio
												size="lg"
												key={key}
												value={key}
											>
												<Text fontSize="sm">
													{value}
												</Text>
											</Radio>
										)
									)}
								</Flex>
							</RadioGroup>
						</Flex>
						<Flex direction="column" gap="2">
							<Text fontWeight="semibold">
								Download Sample File &thinsp;
								<Box as="span" textTransform="lowercase">
									(for {applicantTypeObj[applicantType]})
								</Box>
							</Text>
							<Link
								href={
									applicantType == 0
										? SAMPLE_DOWNLOAD_LINK.SELLER
										: SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR
								}
								w="fit-content"
								fontWeight="semibold"
								isExternal
							>
								<Button>
									<Icon name="file-download" size="sm" />
									&nbsp; Download
								</Button>
							</Link>
						</Flex>

						<Flex direction="column" gap="2">
							<Text fontWeight="semibold">
								Upload the list of users to onboard
							</Text>
							<Dropzone
								file={file}
								setFile={setFile}
								accept=".xls,.xlsx"
							/>
						</Flex>
						{file && (
							<Button
								onClick={handleFileUpload}
								size="lg"
								h="64px"
								w="215px"
							>
								Upload
							</Button>
						)}
					</Flex>
				) : (
					<Flex direction="column" gap="2">
						<Flex fontSize="sm" direction="column" gap="1">
							<span>{data?.message}!!</span>
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

						{data?.data?.csp_list.length > 0 && (
							<BulkOnboardingResponse
								bulkOnboardingResponseList={
									data?.data?.csp_list
								}
							/>
						)}
					</Flex>
				)}
			</Flex>
		</>
	);
};

export default BulkOnboarding;
