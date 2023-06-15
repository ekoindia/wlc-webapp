import { Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Button, IcoButton, Input } from "..";

// const EXCEL_MIME_TYPES = {
// 	"application/vnd.ms-excel": true,
// 	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": true,
// 	"application/vnd.ms-excel.sheet.macroEnabled.12": true,
// 	"application/vnd.ms-excel.sheet.binary.macroEnabled.12": true,
// 	"text/csv": true,
// 	"application/vnd.ms-excel": true,
// 	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": true,
// 	"application/vnd.ms-excel.addin.macroEnabled.12": true,
// };

const IMAGE_MIME_TYPES = {
	"image/jpeg": true,
	"image/png": true,
	"image/svg+xml": true,
	"image/webp": true,
};

/**
 * A Dropzone component to upload file either by selecting or by drag n drop
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Dropzone></Dropzone>` TODO: Fix example
 */
const Dropzone = ({ file, setFile, accept = "" }) => {
	const [inDropZone, setInDropZone] = useState(false);
	const [previewImage, setPreviewImage] = useState(null);

	console.log("[Dropzone] file", file);
	console.log("[Dropzone] previewImage", previewImage);

	const handleFileUploadInputChange = (e) => {
		const _file = e.target.files[0];
		console.log("[Dropzone] _file", _file);
		setFile(_file);

		if (IMAGE_MIME_TYPES[_file.type]) {
			convertImage(_file);
		}

		// if (EXCEL_MIME_TYPES[_file.type]) {
		// 	// const _fileUrl = URL.createObjectURL(_file);
		// 	// setFile(_fileUrl);
		// 	setFile(_file);
		// } else {
		// 	console.log("Please upload file of correct format");
		// }
	};

	const convertImage = (_file) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewImage(reader.result);
		};
		reader.readAsDataURL(_file);
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
		const _file = event.dataTransfer.files[0];
		// const fileUrl = URL.createObjectURL(file);
		setFile(_file);
	};

	return (
		<Flex
			bg={inDropZone ? "overlayBg" : "initial"}
			w="100%"
			align="center"
			justify="center"
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			border="2px dashed #d7dbe3"
			borderRadius="10px"
			color="light"
			p="5"
		>
			{file === null ? (
				<Flex direction="column" align="center" w="100%" gap="2">
					<Input
						hidden
						type="file"
						onChange={handleFileUploadInputChange}
						id="fileUploadInput"
						accept={accept}
					/>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							document.getElementById("fileUploadInput").click()
						}
					>
						Browse
					</Button>
					<Text fontSize="sm">or drag &amp; drop your file here</Text>
				</Flex>
			) : (
				<Flex
					w="40%"
					minH="60%"
					align="center"
					direction="column"
					bg="overlayBg"
					borderRadius="inherit"
					position="relative"
				>
					<IcoButton
						iconName="close"
						title="Discard"
						size="xs"
						theme="accent"
						// boxShadow="0px 3px 10px #11299E1A"
						_hover={{ bg: "accent.dark" }}
						position="absolute"
						top="-10px"
						right="-10px"
						onClick={() => {
							setFile(null);
							if (previewImage) {
								setPreviewImage(null);
							}
						}}
					/>

					<Flex p="10px" w="100%" h="100%">
						{previewImage ? (
							<Image src={previewImage} borderRadius="10px" />
						) : (
							<Text
								w="100%"
								h="100%"
								fontSize="xs"
								noOfLines={1}
								align="center"
								cursor="default"
								title={file.name}
							>
								{file.name}
							</Text>
						)}
					</Flex>
				</Flex>
			)}
		</Flex>
	);
};

export default Dropzone;
