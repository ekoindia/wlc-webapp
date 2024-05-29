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

	console.log("[getCompositeFaceBound] faceDetections: ", faceDetections);

	const faceCount = Math.min(faceDetections.length, maxFaceCount);

	for (let i = 0; i < faceCount; i++) {
		const { x, y, width, height } = getFullFaceBound(
			faceDetections[i].boundingBox
		);
		x1 = Math.min(x1, x);
		y1 = Math.min(y1, y);
		x2 = Math.max(x2, x + width);
		y2 = Math.max(y2, y + height);
	}

	return {
		x: x1,
		y: y1,
		width: x2 - x1,
		height: y2 - y1,
	};
};

/**
 * Get a bounding-box (originX, originY, width, height) which should tightly contain the full face (i.e, hair, forehead, chin, ears).
 * The face recognition bounding-box is usually a tight crop around the eyes to lips. This function expands the bounding-box to include the full face.
 * @param {object} boundingBox - The bounding-box of the detected face
 */
const getFullFaceBound = (boundingBox) => {
	const { originX: x, originY: y, width, height } = boundingBox;

	// Extra height to include the full face (hair, forehead, chin, ears)
	const extraHeight = height * 0.55;
	const extraChinHeight = height * 0.1;
	const fullFaceY = y - extraHeight;
	const fullFaceHeight = height + extraHeight + extraChinHeight;

	// Increase the width to make it a square crop
	let fullFaceWidth = width;
	let fullFaceX = x;
	if (width < fullFaceHeight) {
		const extraWidth = (fullFaceHeight - width) / 2;
		fullFaceWidth = fullFaceHeight;
		fullFaceX -= extraWidth;
	}

	return {
		x: fullFaceX < 0 ? 0 : fullFaceX,
		y: fullFaceY < 0 ? 0 : fullFaceY,
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
	getCompositeFaceBound,
	getDefaultCrop,
	getFullFaceBound,
	initializeFaceDetector,
	type RunningModeType,
};
