import { Box, chakra, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";

const ChakraReactPlayer = chakra(ReactPlayer);

/**
 * Types of files that can be displayed
 * MARK: FileTypes
 */
type FileTypes =
	| null
	| "pdf"
	| "image"
	| "youtube"
	| "video"
	| "audio"
	| "media"
	| "url"
	| "html";

// Declare the props interface
interface FileViewProps {
	file: string;
	type?: FileTypes;
	options?: any;
	[key: string]: any;
}

/**
 * FileView component to display a file of the following types: pdf, image, video, audio, URL, HTML, etc.
 *
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.file - File to be displayed
 * @param {FileTypes} prop.type - Type of the file to be displayed (pdf, image, video, audio, URL, HTML, etc.)
 * @param {any} prop.options - Options for the file to be displayed
 * @param {...*} rest - Rest of the props
 * @example	`<FileView type="image" file="..." />`
 */
const FileView = ({ file, type, options }: FileViewProps) => {
	const [fileType, setFileType] = useState<FileTypes>(null);
	const [isReady, setIsReady] = useState<boolean>(false);

	// Deduce the file type from the file extension, if not provided
	useEffect(() => {
		if (!file) return;

		if (type) {
			// Use the provided file type
			setFileType(type);
		} else {
			// Deduce the file type from the file extension
			const ext = file.split(".").pop();
			if (ext) {
				switch (ext.toLowerCase()) {
					case "pdf":
						setFileType("pdf");
						break;
					case "jpg":
					case "jpeg":
					case "png":
					case "gif":
						setFileType("image");
						break;
					case "mp4":
					case "avi":
					case "mov":
					case "mkv":
						setFileType("video");
						break;
					case "mp3":
					case "wav":
					case "ogg":
						setFileType("audio");
						break;
					case "html":
						setFileType("html");
						break;
					default:
						setFileType("html");
						break;
				}
			}
		}
	}, [file, type]);

	return (
		<Flex
			bg="transparent"
			pointerEvents="none"
			direction="column"
			align="center"
			justify="center"
			width="100%"
			height="100vh"
		>
			<Box pointerEvents="auto" maxH="100%" maxW="100%">
				<FileViewContent
					file={file}
					fileType={fileType}
					options={options}
					setIsReady={setIsReady}
				/>
				{!isReady ? (
					<Flex
						position="fixed"
						top="0"
						right="0"
						bottom="0"
						left="0"
						direction="row"
						align="center"
						justify="center"
						pointerEvents="none"
					>
						<Spinner
							thickness="4px"
							speed="0.65s"
							color="white"
							size="xl"
						/>
					</Flex>
				) : null}
			</Box>
		</Flex>
	);
};

/**
 * File View Content
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.file - File to be displayed
 * @param {FileTypes} prop.fileType - Type of the file to be displayed (pdf, image, video, audio, URL, HTML, etc.)
 * @param {any} [prop.options] - Options for the file to be displayed
 * @param {Function} [prop.setIsReady] - Function to mark the view as loaded (iframe, image, etc)
 */
const FileViewContent = ({
	file,
	fileType,
	options,
	setIsReady,
}: {
	file: string;
	fileType: FileTypes;
	options?: any;
	setIsReady?: Function;
}) => {
	// MARK: Main JSX
	// Return the appropriate component based on the file type
	switch (fileType) {
		case "pdf":
		case "url":
		case "html":
			return (
				<Flex direction="column">
					<Flex h={{ base: "42px", md: "50px" }} bg="primary.DEFAULT">
						{options?.label || options?.header || ""}
					</Flex>
					<iframe
						src={file}
						style={{ width: "100vw", height: "calc(100vh - 50px)" }}
						title={options?.label || options?.header || ""}
						onLoad={() => setIsReady(true)}
					/>
				</Flex>
				// TODO: Add HTTP POST form submission for iframe
			);
		case "image":
			return (
				<img
					src={file}
					style={{ maxHeight: "100%", maxWidth: "100%" }}
					alt="Image Preview"
					onLoad={() => setIsReady(true)}
				/>
			);
		case "video":
		case "audio":
		case "youtube":
		case "media":
			return (
				<ChakraReactPlayer
					url={file}
					width="auto"
					height="auto"
					controls
					maxH="100%"
					maxW="100%"
					borderRadius="6px"
					overflow="hidden"
					onReady={() => setIsReady(true)}
				/>
			);
		default:
			return <Box>Unsupported File Type</Box>;
	}
};

export default FileView;
