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

const ScreenshotTest = () => {
	// https://developer.chrome.com/docs/web-platform/screen-sharing-controls/
	// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture

	// Ref for the video & canvas elements
	const videoRef = useRef(null);
	const canvasRef = useRef(null);

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
		// const screenshot = window.document.documentElement;
		// console.log(screenshot);
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

	const onVideoLoad = () => {
		console.log("Video loaded");

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		// Add "loadeddata" event listener to the video element
		video.addEventListener("loadeddata", () => {
			console.log("Video loadeddata");
			// Draw the video frame to the canvas
			context.drawImage(video, 0, 0, canvas.width, canvas.height);

			// Extract the image data from the canvas
			const imageData = context.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			);
			console.log(imageData);

			// Stop the screen capture
			stopCapture();
		});
	};

	const captureFrame = () => {
		// Call captureFrameDbc after 1 second
		setTimeout(captureFrameDbc, 100);
	};

	const captureFrameDbc = () => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

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
				width="50%"
				onCanPlay={onVideoLoad}
				onLoadedData={captureFrame}
				// loadeddata={onVideoLoad}
			>
				{/* <source src="movie.mp4" type="video/mp4" /> */}
				{/* <source src="movie.ogg" type="video/ogg" /> */}
				Your browser does not support the video tag.
			</video>

			{/* Add a canvas element with a ref */}
			<canvas ref={canvasRef} width="640" height="480"></canvas>

			<Button onClick={captureScreen}>Take Screenshot</Button>
		</Flex>
	);
};

export default TestPage;
