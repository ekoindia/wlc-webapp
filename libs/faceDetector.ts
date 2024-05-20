type RunningModeType = "IMAGE" | "VIDEO" | "LIVE_STREAM";

/**
 * Dynamically load and initialize the face detector (@mediaipe/tasks-vision)
 * @see https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector
 * @param {string} runningMode - The running mode for the face detector (IMAGE, VIDEO, LIVE_STREAM)
 */
const initializefaceDetector = async (runningMode) => {
	// Dynamically load @mediaipe/tasks-vision
	const { FaceDetector, FilesetResolver } = await import(
		"@mediapipe/tasks-vision"
	);

	const vision = await FilesetResolver.forVisionTasks(
		"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
	);
	const faceDetector = await FaceDetector.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath: `/wasm/mediapipe-models/blaze_face_short_range.tflite`,
			delegate: "GPU",
		},
		runningMode: runningMode,
	});
	return faceDetector;
};

export { type RunningModeType, initializefaceDetector };
