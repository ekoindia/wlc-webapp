import { Flex, Radio, RadioGroup, Text } from "@chakra-ui/react";
import { Button, Input } from "components";
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
	console.log("file", file);
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
		<Flex direction="column" gap="10" fontSize="md">
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
								<Text fontSize={{ base: "sm", sm: "md" }}>
									{value}
								</Text>
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
				<DropZone {...{ setFile }} />
			</Flex>
			<Button onClick={handleFileUpload} size="md">
				Upload
			</Button>
		</Flex>
	);
};

export default Bbps;

const DropZone = ({ setFile }) => {
	const [inDropZone, setInDropZone] = useState(false);
	console.log("inDropZone", inDropZone);

	const handleFileInputChange = (event) => {
		const file = event.target.files[0];
		const fileUrl = URL.createObjectURL(file);
		setFile(fileUrl);
	};

	const handleDragOver = (event) => {
		event.preventDefault();
		setInDropZone(true);
	};

	const handleDragLeave = (event) => {
		event.preventDefault();
		setInDropZone(false);
	};

	const handleDrop = (event) => {
		event.preventDefault();
		setInDropZone(false);
		const file = event.dataTransfer.files[0];
		const fileUrl = URL.createObjectURL(file);
		setFile(fileUrl);
	};
	return (
		<Flex
			w={{ base: "100%", md: "500px" }}
			h="200px"
			// bg="divider"
			align="center"
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			border="2px dashed #d7dbe3"
		>
			<Flex direction="column" align="center" w="100%" gap="4">
				<Input
					hidden
					type="file"
					onChange={handleFileInputChange}
					id="fileInput"
					padding="120px"
					accept=".xls,.xlms" //TODO check on MIME type
				/>
				<Button
					variant="primary"
					size="md"
					onClick={() => document.getElementById("fileInput").click()}
				>
					You can select your file
				</Button>
				<Text fontSize="sm">or drag &amp; drop your file here</Text>
			</Flex>
		</Flex>
	);
};
//.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,
