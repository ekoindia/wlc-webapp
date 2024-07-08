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
 * A AirtelCms tab page-component
 * @example	<AirtelCms/>
 */
const AirtelCms = () => {
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
		formData.append("formdata", new URLSearchParams(formDataObj));
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
					"tf-req-method": "PUT",
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
						<AirtelCmsResponse
							airtelCmsResponseList={data?.data?.csp_list}
						/>
					)} */}
				</Flex>
			)}
		</Flex>
	);
};

export default AirtelCms;

// const AirtelCmsResponse = ({
// 	// totalRecords,
// 	// pageNumber,
// 	// setPageNumber,
// 	airtelCmsResponseList,
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
// 			data={airtelCmsResponseList}
// 		/>
// 	);
// };
