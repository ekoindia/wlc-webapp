import { centerCrop, makeAspectCrop, type Crop } from "react-image-crop";

type RunningModeType = "IMAGE" | "VIDEO" | "LIVE_STREAM";

/**
 * Dynamically load and initialize the face detector (@mediaipe/tasks-vision)
 * @see https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector
 * @param {string} runningMode - The running mode for the face detector (IMAGE, VIDEO, LIVE_STREAM)
 */
const initializeFaceDetector = async (runningMode) => {
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

type FaceDetection = {
	boundingBox: {
		originX: number;
		originY: number;
		width: number;
		height: number;
	};
};

/**
 * Get a common bounding-box (x, y, width, height) which should tightly contain all the detected faces in the image.
 * @param {array<FaceDetection>} faceDetections - An array of detected faces in the image. Each face detection should have a bounding-box (x, y, width, height).
 * @param {number} [maxFaceCount=1] - The maximum number of faces to consider. Default is 1.
 */
const getCompositeFaceBound = (
	faceDetections: FaceDetection[],
	maxFaceCount = 1
) => {
	let x1 = Number.MAX_VALUE,
		y1 = Number.MAX_VALUE,
		x2 = 0,
		y2 = 0;

	const faceCount = Math.min(faceDetections.length, maxFaceCount);

	for (let i = 0; i < faceCount; i++) {
		const { originX, originY, width, height } =
			faceDetections[i].boundingBox;
		x1 = Math.min(x1, originX);
		y1 = Math.min(y1, originY);
		x2 = Math.max(x2, originX + width);
		y2 = Math.max(y2, originY + height);
	}

	return {
		x: x1,
		y: y1,
		width: x2 - x1,
		height: y2 - y1,
	};
};

/**
 * Get a bounding-box (x, y, width, height) which should tightly contain the full face (i.e, hair, forehead, chin, ears).
 * The face recognition bounding-box is usually a tight crop around the eyes to lips. This function expands the bounding-box to include the full face.
 * @param {object} boundingBox - The bounding-box of the detected face
 */
const getFullFaceBound = (boundingBox) => {
	const { x, y, width, height } = boundingBox;
	const aspectRatio = width / height;
	const fullFaceWidth = width;
	const fullFaceHeight = fullFaceWidth / aspectRatio;
	const fullFaceY = y - (fullFaceHeight - height) / 2;
	return {
		x: x,
		y: fullFaceY,
		width: fullFaceWidth,
		height: fullFaceHeight,
	};
};

/**
 * Returns the default crop area based on the image dimensions & aspect ratio. Centers the crop area, if required.
 * @param {number} width - The width of the image
 * @param {number} height - The height of the image
 * @param {number} aspectRatio - The aspect ratio of the crop area. E.g., 1 for square, 16/9 for landscape, etc.
 * @returns {Crop} - The default crop area
 */
const getDefaultCrop = (width, height, aspectRatio) => {
	let _crop: Crop = {
		unit: "px",
		x: 0,
		y: 0,
		width: width,
		height: height,
	};

	if (aspectRatio > 0) {
		_crop = centerCrop(
			makeAspectCrop(
				{
					unit: "px",
					x: 0,
					y: 0,
					width: width,
					height: height,
				},
				aspectRatio,
				width,
				height
			),
			width,
			height
		);
	}

	return _crop;
};

export {
	type RunningModeType,
	initializeFaceDetector,
	getDefaultCrop,
	getFullFaceBound,
	getCompositeFaceBound,
};
