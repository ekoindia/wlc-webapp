import { Box, Flex, Text } from "@chakra-ui/react";
import { Button, Dropzone, Icon, Table } from "components";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useState } from "react";
import { saveDataToFile } from "utils/FileSave";

/**
 * A AirtelCms page-component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<AirtelCms></AirtelCms>` TODO: Fix example
 */
const AirtelCms = () => {
	const [file, setFile] = useState(null);
	const [data, setData] = useState(null);

	const { accessToken } = useSession();

	const handleFileDownload = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-is-file-download": "1",
			},
			body: {
				interaction_type_id: 707,
				service_code: 57,
			},
			token: accessToken,
		})
			.then((data) => {
				const _blob = data?.file?.blob;
				const _filename = data?.file?.name || "file";
				const _type = data?.file["content-type"];
				const _b64 = true;
				saveDataToFile(_blob, _filename, _type, _b64);
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	const handleFileUpload = () => {
		const formDataObj = {
			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
			source: "WLC",
		};

		const formData = new FormData();
		formData.append("form-data", new URLSearchParams(formDataObj));
		formData.append("file", file);

		console.log("formData", formData);

		fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD_CUSTOM_URL,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": `/network/pricing_commissions/airtel_cms_bulk_update_commercial`,
					"tf-req-method": "POST",
				},
				body: formData,
			}
		)
			.then((res) => res.json())
			.then((data) => {
				// console.log("[AirtelCms] data:", data);
				setData(data);
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	return (
		<>
			{data === null ? (
				<Flex
					direction="column"
					gap="10"
					fontSize="md"
					w={{ base: "100%", md: "500px" }}
				>
					<Flex direction="column" gap="2">
						<Text fontWeight="semibold">
							Download Sample File &thinsp;
							{/* <Box as="span" textTransform="lowercase">
						(for onboarding {applicantTypeObj[applicantType]}s)
					</Box> */}
						</Text>

						<Button onClick={handleFileDownload} w="136px">
							<Icon name="file-download" size="sm" />
							&nbsp; Download
						</Button>
					</Flex>
					<Flex direction="column" gap="2">
						<Text fontWeight="semibold">Upload your pricing</Text>
						<Dropzone
							file={file}
							setFile={setFile}
							accept=".xls,.xlsx"
						/>
					</Flex>
					<Button
						onClick={handleFileUpload}
						size="lg"
						h="64px"
						w="215px"
					>
						Upload
					</Button>
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

					{data?.data?.csp_list.length > 0 && (
						<AirtelCmsResponse
							airtelCmsResponseList={data?.data?.csp_list}
						/>
					)}
				</Flex>
			)}
		</>
	);
};

export default AirtelCms;

const AirtelCmsResponse = ({
	// totalRecords,
	// pageNumber,
	// setPageNumber,
	airtelCmsResponseList,
}) => {
	const renderer = [
		{ field: "Sr. No.", show: "#" },
		{ name: "name", field: "Name", sorting: true, show: "Avatar" },
		{ name: "mobile", field: "Mobile Number", sorting: true },
		{
			name: "status",
			field: "Status",
			sorting: true,
			show: "Tag",
		},
		{
			name: "reason",
			field: "Reason",
			show: "Description",
		},
	];
	return (
		<Table
			tableName="BulkOnboarding"
			variant="stripedActionNone"
			renderer={renderer}
			// totalRecords={totalRecords}
			// pageNumber={pageNumber}
			// setPageNumber={setPageNumber}
			data={airtelCmsResponseList}
		/>
		//TODO table responsive card
	);
};
