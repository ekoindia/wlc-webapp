import { Box, Flex, useToast } from "@chakra-ui/react";
import { IcoButton } from "components";
import { IconNameType } from "constants/IconLibrary";
import { useFeatureFlag } from "hooks";
import {
	getCompositeFaceBound,
	getDefaultCrop,
	initializeFaceDetector,
} from "libs/faceDetector";
import { useEffect, useRef, useState } from "react";
import {
	MdClose,
	MdOutlineCrop,
	MdOutlineRotate90DegreesCw,
} from "react-icons/md";
import ReactCrop, { type Crop } from "react-image-crop";

// Declare the props interface
interface ImageEditorProps {
	image: string;
	fileName?: string;
	maxLength?: number;
	aspectRatio?: number;
	disableCrop?: boolean;
	disableRotate?: boolean;
	disableImageEdit?: boolean;
	detectFace?: boolean;
	minFaceCount?: number;
	maxFaceCount?: number;
	watermark?: string;
	onClose: (_result: {
		image: string;
		file?: File;
		accepted: boolean;
	}) => void;
}

// MARK: CSS Styles...
const toolbar_height = "60px";
const rc_image_max_height = `calc(100vh - ${toolbar_height})`;
const rc_drag_handle_size = "16px";
const rc_drag_handle_mobile_size = "24px";
const rc_drag_handle_bg_colour = "rgba(0, 0, 0, 0.4)";
const rc_drag_bar_size = "6px";
const rc_border_color = "rgba(255, 255, 255, 0.7)";
const rc_focus_color = "#0088ff";
const rc_drag_handle_offset = "2px"; // "50%" for centering the drag handles at corners
const rc_mask_opacity = 0.8; // Default = 0.5

/**
 * A <ImageEditor> component with crop functionality to edit an image.
 *
 * @see https://github.com/sekoyo/react-image-crop
 * @see https://codesandbox.io/s/72py4jlll6
 *
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.image - The image to be edited
 * @param {string} [prop.fileName] - The name of the image file being edited
 * @param {number} [prop.maxLength] - The maximum length of the image (longer side) in pixels
 * @param {number} [prop.aspectRatio] - The fixed aspect ratio of the crop area. E.g., 1 for square, 16/9 for landscape, etc.  If not provided, the crop area can be resized freely.
 * @param {boolean} [prop.detectFace=false] - Whether to enable face detection in the image for auto-cropping.
 * @param {number} [prop.minFaceCount=0] - The minimum number of faces required to be detected in the image (if face detection is enabled)
 * @param {number} [prop.maxFaceCount=1] - The maximum number of faces to be detected in the image (if face detection is enabled)
 * @param {boolean} [prop.disableCrop=false] - Whether to disable the crop functionality
 * @param {boolean} [prop.disableRotate=false] - Whether to disable the rotate functionality
 * @param {boolean} [prop.disableImageEdit=false] - Whether to disable the all image editing functionalities
 * @param {string} [prop.watermark] - The watermark text to be displayed on the bottom-left corner of the edited image
 * @param {function} prop.onClose - Callback function to close the editor (when the user accepted or rejected the changes/image)
 * @example	`<ImageEditor image="..." onResult={...} onClose={...} />`
 */
const ImageEditor = ({
	image,
	fileName,
	maxLength,
	aspectRatio,
	detectFace = false,
	minFaceCount = 0,
	maxFaceCount = 1,
	disableCrop = false,
	disableRotate = false,
	disableImageEdit = false,
	watermark,
	onClose,
}: ImageEditorProps) => {
	const [sourceImage, setSourceImage] = useState<string>(image);
	const [crop, setCrop] = useState<Crop>(null);
	const [cropEnabled, setCropEnabled] = useState(
		disableCrop || disableImageEdit ? false : true
	);
	const [enableCropAfterImageLoad, setEnableCropAfterImageLoad] =
		useState(false);
	const [rotation, setRotation] = useState(0);
	const [imageLoaded, setImageLoaded] = useState(false);

	const toast = useToast();
	const imageRef = useRef(null);

	// For face detection
	const isFaceDetectionEnabled = useFeatureFlag("FACE_DETECTOR");
	const [faceDetector, setFaceDetector] = useState<any>(null);
	const [detectedFaceCount, setDetectedFaceCount] = useState(0);
	const [confidence, setConfidence] = useState("");

	// FaceDetector dynamic initialization
	useEffect(() => {
		if (!detectFace) return;
		if (!isFaceDetectionEnabled) return;

		initializeFaceDetector("IMAGE").then((detector) => {
			setFaceDetector(detector);
		});
	}, [detectFace, isFaceDetectionEnabled]);

	// Detect Face when the image is loaded and the faceDetector is ready
	useEffect(() => {
		if (imageLoaded && imageRef && faceDetector) {
			const detections = faceDetector.detect(imageRef.current).detections;

			console.log("🙄 FACE DETECTED::: ", detections);

			const face = detections[0]?.boundingBox;

			if (detections?.length > 0 && face) {
				const score = detections[0]?.categories[0]?.score;
				setConfidence(
					detections.length === 1
						? "Face detected: " +
								Math.round(score * 100) +
								"% confidence"
						: detections.length +
								" faces detected: " +
								Math.round(score * 100) +
								"% confidence, ..."
				);

				setDetectedFaceCount(detections.length);

				// const fullFace = getFullFaceBound(face);

				const fullFace = getCompositeFaceBound(
					detections,
					maxFaceCount
				);

				console.log("🙄 FACE 1 ::: ", {
					face,
					fullFace,
					crop,
					width: imageRef.current.width,
					naturalWidth: imageRef.current.naturalWidth,
				});

				// Set the crop area to the detected face
				const scaleFactor =
					imageRef.current.height / imageRef.current.naturalHeight;
				const faceX = fullFace.x * scaleFactor;
				const faceY = fullFace.y * scaleFactor;
				const faceWidth = fullFace.width * scaleFactor;
				const faceHeight = fullFace.height * scaleFactor;

				setCrop({
					unit: "px",
					x: faceX, // face.originX,
					y: faceY, // face.originY,
					width: faceWidth,
					height: faceHeight,
				});
			}
		}
	}, [imageLoaded, imageRef, faceDetector]);

	// Set defaut crop area when the image is loaded & the crop is enabled
	useEffect(() => {
		if (imageLoaded && cropEnabled && crop === null) {
			const { width, height } = imageRef.current;

			setCrop(getDefaultCrop(width, height, aspectRatio));
		}
	}, [imageRef, imageLoaded, cropEnabled, aspectRatio, rotation]);

	const onImageLoad = () => {
		// Mark image as loaded
		setImageLoaded(true);

		// Set the default crop area when the image is loaded
		if (enableCropAfterImageLoad && !(disableCrop || disableImageEdit)) {
			setEnableCropAfterImageLoad(false);
			setCropEnabled(true);
		}
	};

	/**
	 * Function to "Rotate Image"
	 */
	const rotateImage = () => {
		if (crop !== null && cropEnabled) {
			setCrop(null);
			setEnableCropAfterImageLoad(true);
		}
		setRotation((rotation) => {
			const newRotation = rotation + 90;
			return newRotation >= 360 ? 0 : newRotation;
		});
		const newImage = getRotatedImage(imageRef.current, { degree: 90 });
		// imageRef.current.src = newImage;
		setImageLoaded(false);
		setSourceImage(newImage);
	};

	/**
	 * Callback function for the "Reject Image" button
	 */
	const onReject = () => {
		onClose && onClose({ image: image, accepted: false });
	};

	/**
	 * Callback function for the "Accept Image" button
	 */
	const onAccept = async () => {
		if (!imageRef.current) {
			// Dispatch the result with original image & close the editor
			const imageFile = await getFileFromImageUrl(image);
			onClose &&
				onClose({ image: image, file: imageFile, accepted: true });
			return;
		}

		// Check if minimum face count is satisfied
		if (
			detectFace &&
			minFaceCount > 0 &&
			detectedFaceCount < minFaceCount
		) {
			const errorMsg =
				minFaceCount === 1
					? "No face detected."
					: `Minimum ${minFaceCount} faces required.`;
			toast({
				title: errorMsg + " Please try again",
				status: "error",
				duration: 6000,
			});
			return;
		}

		// Get the cropped image
		try {
			// Get the edited image (cropped, rotated, resized, watermarked, etc.)
			let croppedImageUrl = getProcessedImg({
				image: imageRef.current,
				cropEnabled,
				crop,
				maxLength,
				watermark,
			});

			// Create a file-version of the cropped image
			const imageFile = await getFileFromImageUrl(croppedImageUrl);

			// Close the editor with result
			onClose &&
				onClose({
					image: croppedImageUrl || sourceImage || image,
					file: imageFile,
					accepted: true,
				});
		} catch (err) {
			console.error("[getProcessedImg] Error: ", err);
			onClose && onClose({ image: image, accepted: false });
		}
	};

	const getFileFromImageUrl = async (imageUrl: string) => {
		const blob = await fetch(imageUrl).then((res) => res.blob());
		let _fileName = fileName;
		if (!_fileName) {
			const timestamp = new Date()
				.toLocaleString()
				.replace(/[^0-9]+/g, "_");
			_fileName = `Image_${timestamp}.${
				blob.type.split("/")[1] || "jpg"
			}`;
		}
		return new File([blob], _fileName, {
			type: blob.type,
		});
	};

	// MARK: JSX
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
				<Box
					position="relative"
					maxH="100%"
					maxW="100%"
					sx={{
						".ReactCrop": {
							position: "relative",
							display: "inline-block",
							cursor: "crosshair",
							maxWidth: "100%",
							maxHeight: "100%",
						},
						".ReactCrop *, .ReactCrop *::before, .ReactCrop *::after":
							{
								boxSizing: "border-box",
							},
						".ReactCrop--disabled, .ReactCrop--locked": {
							cursor: "inherit",
						},
						".ReactCrop__child-wrapper": {
							overflow: "hidden",
							maxHeight: "inherit",
						},
						".ReactCrop__child-wrapper > img, .ReactCrop__child-wrapper > video":
							{
								display: "block",
								maxWidth: "100%",
								maxHeight: "inherit",
							},
						".ReactCrop:not(.ReactCrop--disabled) .ReactCrop__child-wrapper > img, .ReactCrop:not(.ReactCrop--disabled) .ReactCrop__child-wrapper > video":
							{
								touchAction: "none",
							},
						".ReactCrop:not(.ReactCrop--disabled) .ReactCrop__crop-selection":
							{
								touchAction: "none",
							},
						".ReactCrop__crop-mask": {
							position: "absolute",
							top: "0",
							right: "0",
							bottom: "0",
							left: "0",
							pointerEvents: "none",
						},
						".ReactCrop__crop-mask rect": {
							fillOpacity: rc_mask_opacity,
						},
						".ReactCrop__crop-selection": {
							position: "absolute",
							top: "0",
							left: "0",
							transform: "translate3d(0, 0, 0)",
							cursor: "move",
						},
						".ReactCrop--disabled .ReactCrop__crop-selection": {
							cursor: "inherit",
							display: "none",
						},
						".ReactCrop--disabled .ReactCrop__crop-mask": {
							display: "none",
						},
						".ReactCrop--circular-crop .ReactCrop__crop-selection":
							{
								borderRadius: "50%",
							},
						".ReactCrop--circular-crop .ReactCrop__crop-selection::after":
							{
								pointerEvents: "none",
								content: '""',
								position: "absolute",
								top: "-1px",
								right: "-1px",
								bottom: "-1px",
								left: "-1px",
								border: "1px solid " + rc_border_color,
								opacity: 0.3,
							},
						".ReactCrop--no-animate .ReactCrop__crop-selection": {
							outline: "1px dashed white",
						},
						".ReactCrop__crop-selection:not(.ReactCrop--no-animate .ReactCrop__crop-selection)":
							{
								animation: "marching-ants 1s",
								backgroundImage:
									"linear-gradient(to right, #fff 50%, #444 50%), linear-gradient(to right, #fff 50%, #444 50%), linear-gradient(to bottom, #fff 50%, #444 50%), linear-gradient(to bottom, #fff 50%, #444 50%)",
								backgroundSize:
									"10px 1px, 10px 1px, 1px 10px, 1px 10px",
								backgroundPosition: "0 0, 0 100%, 0 0, 100% 0",
								backgroundRepeat:
									"repeat-x, repeat-x, repeat-y, repeat-y",
								color: "#fff",
								animationPlayState: "running",
								animationTimingFunction: "linear",
								animationIterationCount: "infinite",
							},
						"@keyframes marching-ants": {
							"0%": {
								backgroundPosition: "0 0, 0 100%, 0 0, 100% 0",
							},
							"100%": {
								backgroundPosition:
									"20px 0, -20px 100%, 0 -20px, 100% 20px",
							},
						},
						".ReactCrop__crop-selection:focus": {
							outline: "2px solid " + rc_focus_color,
							outlineOffset: "-1px",
						},
						".ReactCrop--invisible-crop .ReactCrop__crop-mask, .ReactCrop--invisible-crop .ReactCrop__crop-selection":
							{
								display: "none",
							},
						".ReactCrop__rule-of-thirds-vt::before, .ReactCrop__rule-of-thirds-vt::after, .ReactCrop__rule-of-thirds-hz::before, .ReactCrop__rule-of-thirds-hz::after":
							{
								content: '""',
								display: "block",
								position: "absolute",
								backgroundColor: "rgba(255, 255, 255, 0.4)",
							},
						".ReactCrop__rule-of-thirds-vt::before, .ReactCrop__rule-of-thirds-vt::after":
							{
								width: "1px",
								height: "100%",
							},
						".ReactCrop__rule-of-thirds-vt::before": {
							left: ["33.3333%", "33.3333333333%"],
						},
						".ReactCrop__rule-of-thirds-vt::after": {
							left: ["66.6666%", "66.6666666667%"],
						},
						".ReactCrop__rule-of-thirds-hz::before, .ReactCrop__rule-of-thirds-hz::after":
							{
								width: "100%",
								height: "1px",
							},
						".ReactCrop__rule-of-thirds-hz::before": {
							top: ["33.3333%", "33.3333333333%"],
						},
						".ReactCrop__rule-of-thirds-hz::after": {
							top: ["66.6666%", "66.6666666667%"],
						},
						".ReactCrop__drag-handle": {
							position: "absolute",
							width: rc_drag_handle_size,
							height: rc_drag_handle_size,
							backgroundColor: rc_drag_handle_bg_colour,
							border: "1px solid " + rc_border_color,
						},
						".ReactCrop__drag-handle:focus": {
							background: rc_focus_color,
						},
						".ReactCrop .ord-nw": {
							top: "0",
							left: "0",
							transform: `translate(-${rc_drag_handle_offset}, -${rc_drag_handle_offset})`,
							cursor: "nw-resize",
						},
						".ReactCrop .ord-n": {
							top: "0",
							left: "50%",
							transform: `translate(-${rc_drag_handle_offset}, -${rc_drag_handle_offset})`,
							cursor: "n-resize",
						},
						".ReactCrop .ord-ne": {
							top: "0",
							right: "0",
							transform: `translate(${rc_drag_handle_offset}, -${rc_drag_handle_offset})`,
							cursor: "ne-resize",
						},
						".ReactCrop .ord-e": {
							top: "50%",
							right: "0",
							transform: `translate(${rc_drag_handle_offset}, -${rc_drag_handle_offset})`,
							cursor: "e-resize",
						},
						".ReactCrop .ord-se": {
							bottom: "0",
							right: "0",
							transform: `translate(${rc_drag_handle_offset}, ${rc_drag_handle_offset})`,
							cursor: "se-resize",
						},
						".ReactCrop .ord-s": {
							bottom: "0",
							left: "50%",
							transform: `translate(-${rc_drag_handle_offset}, ${rc_drag_handle_offset})`,
							cursor: "s-resize",
						},
						".ReactCrop .ord-sw": {
							bottom: "0",
							left: "0",
							transform: `translate(-${rc_drag_handle_offset}, ${rc_drag_handle_offset})`,
							cursor: "sw-resize",
						},
						".ReactCrop .ord-w": {
							top: "50%",
							left: "0",
							transform: `translate(-${rc_drag_handle_offset}, -${rc_drag_handle_offset})`,
							cursor: "w-resize",
						},
						".ReactCrop__disabled .ReactCrop__drag-handle": {
							cursor: "inherit",
						},
						".ReactCrop__drag-bar": { position: "absolute" },
						".ReactCrop__drag-bar.ord-n": {
							top: "0",
							left: "0",
							width: "100%",
							height: rc_drag_bar_size,
							transform: "translateY(-50%)",
						},
						".ReactCrop__drag-bar.ord-e": {
							right: "0",
							top: "0",
							width: rc_drag_bar_size,
							height: "100%",
							transform: "translateX(50%)",
						},
						".ReactCrop__drag-bar.ord-s": {
							bottom: "0",
							left: "0",
							width: "100%",
							height: rc_drag_bar_size,
							transform: "translateY(50%)",
						},
						".ReactCrop__drag-bar.ord-w": {
							top: "0",
							left: "0",
							width: rc_drag_bar_size,
							height: "100%",
							transform: "translateX(-50%)",
						},
						".ReactCrop--new-crop .ReactCrop__drag-bar, .ReactCrop--new-crop .ReactCrop__drag-handle, .ReactCrop--fixed-aspect .ReactCrop__drag-bar":
							{
								display: "none",
							},
						".ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-n, .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-e, .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-s, .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-w":
							{
								display: "none",
							},
						"@media (pointer: coarse)": {
							".ReactCrop .ord-n,\n.ReactCrop .ord-e,\n.ReactCrop .ord-s,\n.ReactCrop .ord-w":
								{
									display: "none",
								},
							".ReactCrop__drag-handle": {
								width: rc_drag_handle_mobile_size,
								height: rc_drag_handle_mobile_size,
							},
						},
					}}
				>
					<ReactCrop
						keepSelection={true}
						aspect={aspectRatio > 0 ? aspectRatio : undefined}
						crop={crop}
						minWidth={100}
						minHeight={100}
						disabled={!cropEnabled}
						onChange={(c) => {
							setCrop(c);
						}}
					>
						<img
							src={sourceImage} // image
							ref={imageRef}
							style={{
								display: "block",
								maxHeight: rc_image_max_height,
								maxWidth: "100vw",
								// transform: `rotate(${rotation}deg)`,
							}}
							alt="Image to be edited"
							onLoad={onImageLoad}
						/>
					</ReactCrop>
					{confidence ? (
						<Box
							position="absolute"
							bottom="0"
							left="0"
							p="5px"
							fontSize="xs"
							bg="#00000080"
							color="yellow.300"
							pointerEvents="none"
						>
							{confidence}
						</Box>
					) : null}
				</Box>
				<Box height={toolbar_height} width="100%" />
				<Flex
					position="fixed"
					direction="row-reverse"
					bottom="0"
					left="0"
					right="0"
					height={toolbar_height}
					align="center"
					justify="center"
					gap={{ base: "10px", md: "25px" }}
					pointerEvents="auto"
					bg="gray.200"
					borderRadius={{ base: "0", md: "md" }}
				>
					<IcoBtn
						iconName="check"
						label="Accept Image"
						isMain
						onClick={onAccept}
					/>
					<IcoBtn
						icon={MdClose}
						label="Reject Image"
						bg="error"
						color="white"
						onClick={onReject}
					/>
					{disableCrop || disableImageEdit ? null : (
						<IcoBtn
							icon={MdOutlineCrop}
							label="Crop Image"
							selected={cropEnabled}
							onClick={() =>
								setCropEnabled((cropEnabled) => !cropEnabled)
							}
						/>
					)}
					{disableRotate || disableImageEdit ? null : (
						<IcoBtn
							icon={MdOutlineRotate90DegreesCw}
							label="Rotate Image"
							onClick={() => {
								rotateImage();
								// setRotation((rotation) => {
								// 	const newRotation = rotation + 90;
								// 	return newRotation >= 360 ? 0 : newRotation;
								// });
							}}
						/>
					)}
				</Flex>
			</Box>
		</Flex>
	);
};

/**
 * Rounded icon button component for the bottom toolbar
 * @param {object} props - Properties passed to the component
 * @param {IconNameType} [props.iconName] - The icon name for the button
 * @param {JSX.Element} [props.icon] - The icon to be displayed
 * @param {string} [props.label] - The label for the button
 * @param {boolean} [props.selected=false] - Whether the button is selected (toggled on)
 * @param {boolean} [props.isMain=false] - The main button flag
 * @param {function} props.onClick - The callback function for the button click event
 * @returns {JSX.Element} - The JSX element
 */
const IcoBtn = ({
	iconName,
	icon,
	label,
	selected = false,
	isMain = false,
	onClick,
	...rest
}: {
	iconName?: IconNameType;
	icon?: React.FC<any>;
	label: string;
	selected?: boolean;
	isMain?: boolean;
	onClick: () => void;
	[key: string]: any;
}) => {
	return (
		<IcoButton
			iconName={iconName}
			icon={icon || undefined}
			aria-label={label}
			title={label}
			onClick={onClick}
			bg={selected ? "primary.DEFAULT" : isMain ? "success" : "white"}
			color={selected || isMain ? "white" : "black"}
			borderRadius="full"
			boxShadow="md"
			p="10px"
			h="48px"
			minW={isMain ? "100px" : "initial"}
			alignItems="center"
			justifyContent="center"
			_hover={{ filter: "brightness(0.9)" }}
			{...rest}
		>
			{icon}
		</IcoButton>
	);
};

/**
 * Returns the processed image (as a file URL string) after doing the following:
 * MARK: Process Image
 * 1. Cropping the image based on the crop area
 * 2. Rotating the image based on the rotation angle
 * 3. Resizing the cropped image to fit the maxLength
 * @param {object} params - The parameters for the image processing
 * @param {HTMLImageElement} params.image - The image to be processed
 * @param {boolean} [params.cropEnabled] - Whether the crop is enabled
 * @param {object} [params.crop] - The crop area
 * @param {number} [params.maxLength] - The maximum length of the image (longer side) in pixels
 * @param {string} [params.watermark] - The watermark text to be displayed on the bottom-left of the edited image
 * @returns {string} - The edited image as a file URL string
 */
const getProcessedImg = ({
	image,
	cropEnabled,
	crop,
	maxLength,
	watermark,
}: {
	image: HTMLImageElement;
	cropEnabled?: boolean;
	crop?: Crop;
	maxLength?: number;
	watermark?: string;
}) => {
	if (!cropEnabled || !crop) {
		// Use a default crop area which is the entire image
		crop = {
			unit: "px",
			x: 0,
			y: 0,
			width: image.width,
			height: image.height,
		};
	}

	// Scale image to the original size...
	// const pixelRatio = window.devicePixelRatio;
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;

	// const width = crop.width * pixelRatio * scaleX;
	// const height = crop.height * pixelRatio * scaleY;

	const croppedWidth = crop.width * scaleX;
	const croppedHeight = crop.height * scaleY;

	// Get the desired (<= max) width & height
	const { finalWidth, finalHeight } = getFinalImageDimensions({
		width: croppedWidth,
		height: croppedHeight,
		maxLength,
	});

	// const canvas = new OffscreenCanvas(finalWidth, finalHeight);
	const canvas = document.createElement("canvas");
	canvas.width = Math.floor(finalWidth);
	canvas.height = Math.floor(finalHeight);
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

	// ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	// ctx.imageSmoothingQuality = "high";
	ctx.drawImage(
		image,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		finalWidth,
		finalHeight
	);

	// Add watermark text to the bottom-left corner of the image
	if (watermark) {
		const fontSize = Math.max(7, Math.min(12, finalWidth / 20));
		ctx.font = `${fontSize}px Arial`;
		ctx.fillStyle = "rgba(255, 255, 0)";
		// Add black shadow behind the text
		ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.shadowBlur = 3;
		const text = watermark.split("\n");
		text.forEach((line, index) => {
			ctx.fillText(
				line,
				10,
				finalHeight - 2 - (text.length - index) * fontSize
			);
		});
	}

	return canvas.toDataURL("image/jpeg", 0.8); // TODO: get quality value from options

	// return canvas.convertToBlob({ type: "image/jpeg", quality: 0.8 }).then(
	// 	(blob) => URL.createObjectURL(blob),
	// 	(err) => {
	// 		console.error("Canvas convertToBlob Error: ", err);
	// 	}
	// );
};

/**
 * Returns the final image dimensions (width & height) based on the maxLength. The longer side of the image will be scaled down to the maxLength, if it exceeds.
 * @param {object} params - The parameters for the image processing
 * @param params.width - The width of the image
 * @param params.height - The height of the image
 * @param params.maxLength - The maximum length of the image (longer side) in pixels
 * @returns {object} - The final image dimensions (width & height)
 */
const getFinalImageDimensions = ({ width, height, maxLength }) => {
	let finalWidth = width;
	let finalHeight = height;

	const isLandscape = width > height;
	const longerSide = isLandscape ? width : height;

	// Get the final width & height based on the maxLength

	const currentAspectRatio = width / height;

	if (maxLength && longerSide > maxLength) {
		if (isLandscape) {
			finalWidth = maxLength;
			finalHeight = maxLength / currentAspectRatio;
		} else {
			finalHeight = maxLength;
			finalWidth = maxLength * currentAspectRatio;
		}
	}

	return { finalWidth, finalHeight };
};

/**
 * Returns the rotated image as a base64 data URL string
 * MARK: Rotate Image
 * @param {HTMLImageElement} image
 * @param {object} angle
 * @property {number} angle.degree
 * @property {number} angle.rad
 * @returns {string} - The rotated image as a base64 data URL string
 */
const getRotatedImage = (image, angle) => {
	const canvas = document.createElement("canvas");
	const { degree, rad: _rad } = angle;

	const rad = _rad || (degree * Math.PI) / 180 || 0;

	const orig_width = image.naturalWidth;
	const orig_height = image.naturalHeight;
	const boundaryRad = Math.atan(orig_width / orig_height);

	const { width, height } = calcProjectedRectSizeOfRotatedRect(
		{ width: orig_width, height: orig_height },
		rad
	);
	canvas.width = Math.ceil(width);
	canvas.height = Math.ceil(height);

	const ctx = canvas.getContext("2d");
	ctx.save();

	const sin_Height = orig_height * Math.abs(Math.sin(rad));
	const cos_Height = orig_height * Math.abs(Math.cos(rad));
	const cos_Width = orig_width * Math.abs(Math.cos(rad));
	const sin_Width = orig_width * Math.abs(Math.sin(rad));

	let xOrigin, yOrigin;

	if (rad < boundaryRad) {
		xOrigin = Math.min(sin_Height, cos_Width);
		yOrigin = 0;
	} else if (rad < Math.PI / 2) {
		xOrigin = Math.max(sin_Height, cos_Width);
		yOrigin = 0;
	} else if (rad < Math.PI / 2 + boundaryRad) {
		xOrigin = width;
		yOrigin = Math.min(cos_Height, sin_Width);
	} else if (rad < Math.PI) {
		xOrigin = width;
		yOrigin = Math.max(cos_Height, sin_Width);
	} else if (rad < Math.PI + boundaryRad) {
		xOrigin = Math.max(sin_Height, cos_Width);
		yOrigin = height;
	} else if (rad < (Math.PI / 2) * 3) {
		xOrigin = Math.min(sin_Height, cos_Width);
		yOrigin = height;
	} else if (rad < (Math.PI / 2) * 3 + boundaryRad) {
		xOrigin = 0;
		yOrigin = Math.max(cos_Height, sin_Width);
	} else if (rad < Math.PI * 2) {
		xOrigin = 0;
		yOrigin = Math.min(cos_Height, sin_Width);
	}

	ctx.translate(xOrigin, yOrigin);
	ctx.rotate(rad);
	ctx.drawImage(image, 0, 0);
	// if (DEBUG) drawMarker(ctx, "red");

	ctx.restore();

	return canvas.toDataURL("image/jpeg");
};

/**
 * Helper function for roating an image.
 * NOTE : When source rect is rotated at some rad or degrees,
 * it's original width and height is no longer usable in the rendered page.
 * So, calculate projected rect size, that each edge are sum of the
 * width projection and height projection of the original rect.
 */
const calcProjectedRectSizeOfRotatedRect = (size, rad) => {
	const { width, height } = size;

	const rectProjectedWidth =
		Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad));
	const rectProjectedHeight =
		Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));

	return { width: rectProjectedWidth, height: rectProjectedHeight };
};

export default ImageEditor;
