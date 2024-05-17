import { Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Dropzone } from "components";
import { useCamera, useFeatureFlag, useFileView, useImageEditor } from "hooks";
import { useCallback, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * A '/test' page-component
 * This page is used to test various components and features and is only accessible in development mode.
 * To add a new test, create a component and add it to the 'TestComponents' list at the bottom of the file.
 */
const TestPage = () => {
	const isTestPageEnabled = useFeatureFlag("TEST_PAGE");

	if (!isTestPageEnabled) {
		return null;
	}

	return (
		<>
			<Text fontSize="x-large" m="1em 2em 1em 1em">
				Test Page
			</Text>

			<SimpleGrid columns={{ base: 1, md: 2 }} p="10px" gap="15px">
				{TestComponents.map((component, index) => (
					<Section key={index} title={component.title}>
						<component.component />
					</Section>
				))}
			</SimpleGrid>
		</>
	);
};

/**
 * A Test Section component
 */
const Section = ({ title, children }) => (
	<Flex
		direction="column"
		// m={{ base: "5px", md: "2em" }}
		p={{ base: "5px", md: "1em" }}
		bg="white"
		borderRadius="6px"
	>
		<Text fontSize="x-large" mb="2em">
			{title}
		</Text>
		{children}
	</Flex>
);

/**
 * Testing the FileViewers
 * MARK: FileViewersTest
 */
const FileViewersTest = () => {
	const { showImage, showMedia, showWebpage } = useFileView();

	const onSelectFile = useCallback((e) => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener("load", () => showImage(reader.result));
			reader.readAsDataURL(e.target.files[0]);
		}
	}, []);

	return (
		<Flex gap="1em" wrap="wrap">
			<input type="file" accept="image/*" onChange={onSelectFile} />
			<Button
				onClick={() =>
					showImage(
						"https://www.artsandcollections.com/wp-content/uploads/2018/08/sherlockvintageWEB.jpg"
					)
				}
			>
				Show Image
			</Button>

			<Button
				onClick={() =>
					showMedia("https://www.youtube.com/watch?v=EzFXDvC-EwM")
				}
			>
				Show Youtube Video
			</Button>

			<Button onClick={() => showWebpage("https://abhi.page")}>
				Show Webpage
			</Button>
		</Flex>
	);
};

/**
 * Testing the screen capture API
 * MARK: ScreenshotTest
 */
const ScreenshotTest = () => {
	// https://developer.chrome.com/docs/web-platform/screen-sharing-controls/
	// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture

	// Ref for the video & canvas elements
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const imageRef = useRef(null);

	const displayMediaOptions = {
		video: {
			displaySurface: "browser",
		},
		audio: false,
		// audio: {
		// 	suppressLocalAudioPlayback: true,
		// },
		preferCurrentTab: true,
		selfBrowserSurface: "include", // allow the user to share the current tab
		systemAudio: "exclude",
		surfaceSwitching: "exclude", // allow the user to dynamically switch between shared tabs
		monitorTypeSurfaces: "exclude", // prevent the user from sharing an entire screen.
	};

	const captureScreen = () => {
		navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(
			(stream) => {
				videoRef.current.srcObject = stream;
			},
			(err) => {
				console.error("Error: " + err);
			}
		);
	};

	const stopCapture = () => {
		let tracks = videoRef.current.srcObject.getTracks();

		tracks.forEach((track) => track.stop());
		videoRef.current.srcObject = null;
	};

	const captureFrame = () => {
		// Call captureFrameDbc after 1 second
		setTimeout(captureFrameDbc, 100);
	};

	const captureFrameDbc = () => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		// Draw the video frame to the canvas
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		// Extract the image data from the canvas
		const imageData = context.getImageData(
			0,
			0,
			canvas.width,
			canvas.height
		);
		console.log("ImageData: ", imageData);

		// Set the image data to the image element
		imageRef.current.src = canvas.toDataURL("image/jpeg", 8.0);

		// Stop the screen capture
		stopCapture();
	};

	return (
		<Flex direction="column" align="center">
			{/* Add a video element with a ref */}
			<video
				ref={videoRef}
				controls
				autoPlay
				muted
				width="100%"
				height="auto"
				// onCanPlay={onVideoLoad}
				onLoadedData={captureFrame}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					maxWidth: "90%",
					maxHeight: "90%",
					zIndex: "-9999",
					pointerEvents: "none",
				}}
				// loadeddata={onVideoLoad}
			>
				Your browser does not support the video tag.
			</video>

			{/* Add a canvas element with a ref */}
			<canvas
				ref={canvasRef}
				style={{
					visibility: "hidden",
					position: "absolute",
					top: 0,
					left: 0,
					maxWidth: "90%",
					maxHeight: "90%",
					zIndex: "-9999",
				}}
			></canvas>

			{/* Add an image element with a ref */}
			<img
				ref={imageRef}
				style={{ maxHeight: "400px", maxWidth: "400px" }}
				alt="Screenshot"
			/>

			<Button onClick={captureScreen}>Take Screenshot</Button>
		</Flex>
	);
};

/**
 * Testing the ImageEditor
 * MARK: ImageEditorTest
 */
const ImageEditorTest = () => {
	const { editImage } = useImageEditor();
	const [image, setImage] = useState(null);
	const [imageDimensions, setImageDimensions] = useState("");
	const fileRef = useRef(null);

	const onResult = (data) => {
		console.log("Result Image: ", data);
		if (data.accepted) {
			setImage(data.image);
		}
		if (fileRef?.current?.value) {
			fileRef.current.value = null;
		}
	};

	const onImgLoad = (e) => {
		setImageDimensions(
			e.target.naturalWidth + "x" + e.target.naturalHeight
		);
		console.log(
			"Image Loaded: ",
			e.target.naturalWidth,
			e.target.naturalHeight
		);
	};

	const onSelectFile = useCallback((e) => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener("load", () =>
				editImage(
					reader.result,
					{
						maxLength: 1200,
						aspectRatio: 1,
					},
					(data) => onResult(data)
				)
			);
			reader.readAsDataURL(e.target.files[0]);
		}
	}, []);

	return (
		<Flex direction="column" align="center">
			<input
				ref={fileRef}
				type="file"
				accept="image/*"
				onChange={onSelectFile}
			/>
			{image ? (
				<img
					src={image}
					style={{ maxHeight: "400px", maxWidth: "400px" }}
					alt="Screenshot"
					onLoad={onImgLoad}
				/>
			) : null}
			{imageDimensions ? (
				<Text fontSize="sm" color="gray.500">
					{imageDimensions}
				</Text>
			) : null}
		</Flex>
	);
};

/**
 * Testing Camera
 * MARK: CameraTest
 */
const CameraTest = () => {
	const { openCamera } = useCamera();
	const [image, setImage] = useState(null);
	const [imageDimensions, setImageDimensions] = useState("");
	const fileRef = useRef(null);

	const onOpenCamera = (options = null) => {
		console.log("[TestPage] Opening Camera ", options);
		openCamera(
			options, // { aspectRatio: 1, facingMode: "environment" },
			(data) => onResult(data)
		);
	};

	const onResult = (data) => {
		console.log("Result Camera: ", data);
		if (data.accepted) {
			setImage(data.image);
		}
		if (fileRef?.current?.value) {
			fileRef.current.value = null;
		}
	};

	const onImgLoad = (e) => {
		setImageDimensions(
			e.target.naturalWidth + "x" + e.target.naturalHeight
		);
		console.log(
			"Camera Image Loaded: ",
			e.target.naturalWidth,
			e.target.naturalHeight
		);
	};

	return (
		<Flex direction="column" align="center">
			<Button onClick={onOpenCamera}>Open Camera</Button>
			{image ? (
				<img
					src={image}
					style={{ maxHeight: "400px", maxWidth: "400px" }}
					alt="Screenshot"
					onLoad={onImgLoad}
				/>
			) : null}
			{imageDimensions ? (
				<Text fontSize="sm" color="gray.500">
					{imageDimensions}
				</Text>
			) : null}
		</Flex>
	);
};

/**
 * Testing the DropZone component
 * MARK: DropZoneTest
 */
const DropZoneTest = () => {
	const [file, setFile] = useState(null);

	// const setFile = (file) => {
	// 	console.log("File: ", file);
	// };

	return (
		<Flex direction="column" align="center" justify="center">
			<Dropzone file={file} accept="" setFile={setFile} />
			<Text>{file ? file?.name : ""}</Text>
		</Flex>
	);
};

/**
 * Testing the Markdown component
 * MARK: MarkdownTest
 */
const MarkdownTest = () => {
	// const markdown1 = `A simple markdown with **bold** and *italic* text.

	// ## Testing Markdown
	// | Tables        | Are           | Cool  |
	// | ------------- | ------------- | ----- |
	// | col 3 is      | right-aligned | $1600 |
	// | col 2 is      | centered      |   $12 |
	// | zebra stripes | are neat      |    $1 |
	// `;

	// const markdown2 = `A simple markdown with **bold** and *italic* text.`;

	const markdown3 = `| Tables        | Are           |\n
	| ------------- | ------------- |
	| col 3 is      | right-aligned |`;

	return (
		<Flex
			sx={{
				".markdown-body strong": {
					color: "red",
				},
			}}
		>
			<Markdown remarkPlugins={[remarkGfm]} className="markdown-body">
				{markdown3}
			</Markdown>
		</Flex>
	);
};

// List of test components
// MARK: List of Tests
const TestComponents = [
	{
		title: "File Viewers",
		component: FileViewersTest,
	},
	{
		title: "Screenshot Capture",
		component: ScreenshotTest,
	},
	{
		title: "Image Editor",
		component: ImageEditorTest,
	},
	{
		title: "Camera",
		component: CameraTest,
	},
	{
		title: "File Upload (Dropzone)",
		component: DropZoneTest,
	},
	{
		title: "Markdown",
		component: MarkdownTest,
	},
];

export default TestPage;
