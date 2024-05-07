import { chakra } from "@chakra-ui/react";
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
const FileView = ({ file, type /*, options */ }: FileViewProps) => {
	const [fileType, setFileType] = useState<FileTypes>(null);

	// Deduce the file type from the file extension, if not provided
	useEffect(() => {
		if (!type) {
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
						setFileType("url");
						break;
				}
			}
		} else {
			setFileType(type);
		}
	}, [file, type]);

	// MARK: JSX

	// Return the appropriate component based on the file type
	switch (fileType) {
		case "pdf":
		case "url":
		case "html":
			return (
				<iframe
					src={file}
					width="100%"
					height="100%"
					title="File Viewer"
				/>
			);
		case "image":
			return <img src={file} alt="Image" />;
		case "video":
		case "audio":
		case "youtube":
		case "media":
			return (
				// <Flex
				// 	align="center"
				// 	justify="center"
				// 	width="100%"
				// 	height="100%"
				// >
				<ChakraReactPlayer
					url={file}
					width="auto"
					height="auto"
					controls
					maxH="100%"
					maxW="100%"
				/>
				// </Flex>
			);
		default:
			return null;
	}
};

export default FileView;
