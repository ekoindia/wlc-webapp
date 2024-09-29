import { Box, Flex } from "@chakra-ui/react";
import {
	ActionButtonGroup,
	Button,
	Dropzone,
	Icon,
	InputLabel,
} from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useState } from "react";
import { saveDataToFile } from "utils";

/**
 * Component to configure pricing for a product using file-upload
 * @param {*} props
 * @param {object} props.sampleFileDownloadParams - parameters to pass to the API for downloading the sample file. This may include interaction_type_id and service_code.
 * @param {string} props.fileUploadUri - File upload URI
 * @returns {JSX.Element}
 */
const FormFileUpload = ({ sampleFileDownloadParams, fileUploadUri }) => {
	const [file, setFile] = useState(null);
	const [data, setData] = useState(null);

	const { accessToken } = useSession();
	const router = useRouter();

	const handleFileDownload = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-is-file-download": "1",
			},
			body: {
				...sampleFileDownloadParams,
			},
			token: accessToken,
			controller: null,
		})
			.then((data) => {
				const _blob = data?.file?.blob;
				const _filename = data?.file?.name || "file";
				const _type = data?.file["content-type"];
				const _b64 = true;
				saveDataToFile(_blob, _filename, _type, _b64);
			})
			.catch((err) => {
				console.error("Error downloading sample file: ", err);
			});
	};

	const handleFileUpload = () => {
		const formDataObj = {
			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
			source: "WLC",
		};

		const formData = new FormData();
		formData.append(
			"formdata",
			new URLSearchParams(formDataObj).toString()
		);
		formData.append("file", file);

		fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD_CUSTOM_URL,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-method": "PUT",
					"tf-req-uri": fileUploadUri,
				},
				body: formData,
			}
		)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
			})
			.catch((err) => {
				console.error("Error uploading file: ", err);
			});
	};

	const buttonConfigList = [
		{
			type: "submit",
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
					<Flex direction="column">
						<InputLabel required={true}>
							Download Sample File &thinsp;
						</InputLabel>
						<Button onClick={handleFileDownload} w="136px">
							<Icon name="file-download" size="sm" />
							&nbsp; Download
						</Button>
					</Flex>
					<Flex direction="column">
						<InputLabel required={true}>
							Upload your pricing
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

					{/* {data?.data?.csp_list?.length > 0 && (
						<FileUploadResponse
							responseList={data?.data?.csp_list}
						/>
					)} */}
				</Flex>
			)}
		</Flex>
	);
};

// const FileUploadResponse = ({
// 	// totalRecords,
// 	// pageNumber,
// 	// setPageNumber,
// 	responseList,
// }) => {
// 	const renderer = [
// 		{ label: "Sr. No.", show: "#" },
// 		{ name: "name", label: "Name", sorting: true, show: "Avatar" },
// 		{ name: "mobile", label: "Mobile", sorting: true },
// 		{
// 			name: "status",
// 			label: "Status",
// 			sorting: true,
// 			show: "Tag",
// 		},
// 		{
// 			name: "reason",
// 			label: "Reason",
// 			show: "Description",
// 		},
// 	];
// 	return (
// 		<Table
// 			variant="stripedActionNone"
// 			renderer={renderer}
// 			// totalRecords={totalRecords}
// 			// pageNumber={pageNumber}
// 			// setPageNumber={setPageNumber}
// 			data={responseList}
// 		/>
// 	);
// };

export default FormFileUpload;
