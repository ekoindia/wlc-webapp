import { Flex, Radio, RadioGroup, Text } from "@chakra-ui/react";
import { Button, Dropzone } from "components";
import { useState } from "react";

/**
 * A <Bbps> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Bbps></Bbps>` TODO: Fix example
 */
const Bbps = () => {
	const [file, setFile] = useState(null);
	const modeObj = {
		0: "Online",
		1: "Offline",
	};
	const handleFileUpload = async (event) => {
		event.preventDefault();

		try {
			if (!file) return;
			const formData = new FormData();
			formData.append("file", file);

			// hitQuery()
			// // const response = await fetch("/api/upload", {
			// // 	method: "POST",
			// // 	body: formData,
			// // });

			// if (response.ok) {
			// 	console.log("File uploaded successfully");
			// } else {
			// 	console.error("Error uploading file");
			// }
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Flex
			direction="column"
			gap="10"
			fontSize="md"
			w={{ base: "100%", md: "500px" }}
		>
			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">Select Mode</Text>
				<RadioGroup
					defaultValue="0"
					// value={commissionType}
					// onChange={(value) => setCommissionType(value)}
				>
					<Flex
						direction={{ base: "column", sm: "row" }}
						gap={{ base: "4", md: "16" }}
					>
						{Object.entries(modeObj).map(([key, value]) => (
							<Radio size="lg" key={key} value={key}>
								<Text fontSize="sm">{value}</Text>
							</Radio>
						))}
					</Flex>
				</RadioGroup>
			</Flex>
			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">Download your current pricing</Text>
				{/* <Button variant="link">Download</Button> */}
			</Flex>
			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">Upload your pricing</Text>
				<Dropzone
					file={file}
					setFile={setFile}
					accept=".xls,.xlsx,.xlsm,.xlsb,.csv,.xlt,.xltx,.xlam"
				/>
			</Flex>
			<Button onClick={handleFileUpload} size="lg" h="64px" w="215px">
				Upload
			</Button>
		</Flex>
	);
};

export default Bbps;
