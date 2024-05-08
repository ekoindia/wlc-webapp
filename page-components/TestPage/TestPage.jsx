import { Button, Flex, Text } from "@chakra-ui/react";
import { useFeatureFlag, useFileView } from "hooks";
import { useRef } from "react";

/**
 * A TestPage page-component
 * @example	`<TestPage></TestPage>` TODO: Fix example
 */
const TestPage = () => {
	const isTestPageEnabled = useFeatureFlag("TEST_PAGE");
	const { showImage, showMedia, showWebpage } = useFileView();

	if (!isTestPageEnabled) {
		return null;
	}

	return (
		<>
			<Text fontSize="x-large" m="1em 2em 1em 1em">
				Test Page
			</Text>

			<Section title="File Viewers">
				<Flex gap="2em" wrap="wrap">
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
							showMedia(
								"https://www.youtube.com/watch?v=EzFXDvC-EwM"
							)
						}
					>
						Show Youtube Video
					</Button>

					<Button onClick={() => showWebpage("https://abhi.page")}>
						Show Webpage
					</Button>
				</Flex>
			</Section>

			<Section title="Screenshot Capture">
				<ScreenshotTest />
			</Section>
		</>
	);
};

const Section = ({ title, children }) => (
	<Flex
		direction="column"
		m={{ base: "5px", md: "2em" }}
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
 * Testing the screen capture API
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

export default TestPage;
