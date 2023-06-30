import { Flex, Link, Text } from "@chakra-ui/react";
import { Button, Dropzone, Icon } from "components";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { useState } from "react";

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
	const [data, setData] = useState();
	console.log("data", data);

	const { accessToken } = useSession();

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
				console.log("[AirtelCms] data:", data);
				setData(data);
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	return (
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
				<Link
					// href={
					// 	applicantType == 0
					// 		? SAMPLE_DOWNLOAD_LINK.SELLER
					// 		: SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR
					// }
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
				<Text fontWeight="semibold">Upload your pricing</Text>
				<Dropzone
					file={file}
					setFile={setFile}
					accept="image/jpeg, image/jpg, image/png"
				/>
			</Flex>
			<Button onClick={handleFileUpload} size="lg" h="64px" w="215px">
				Upload
			</Button>
		</Flex>
	);
};

export default AirtelCms;
