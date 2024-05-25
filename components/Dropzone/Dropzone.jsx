import { Flex, Image, Text } from "@chakra-ui/react";
import { useOrgDetailContext, useUser } from "contexts";
import { useCamera, useFileView, useGeolocation, useImageEditor } from "hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdCameraAlt } from "react-icons/md";
import { Button, IcoButton, Input } from "..";

const IMAGE_MIME_TYPES = {
	"image/jpeg": true,
	"image/jpg": true,
	"image/png": true,
	"image/svg+xml": true,
	"image/webp": true,
};

/**
 * A Dropzone component to upload file either by selecting or by drag & drop
 * @param 	{object}	prop	Properties passed to the component
 * @param	{File}		prop.file	File object to be uploaded
 * @param	{function}	prop.setFile	Function to set the file object
 * @param	{string}	[prop.accept=""]	Accepted file types
 * @param	{boolean}	[prop.cameraOnly=false]	Only allow camera to capture image. No file upload or drag/drop.
 * @param	{object}	[prop.options={}]	Additional options for the dropzone
 * @param	{number}	[prop.options.maxLength]	Maximum length of the image
 * @param	{boolean}	[prop.options.detectFace]	Detect faces in the image?
 * @param	{number}	[prop.options.minFaceCount]	Minimum number of faces to be detected
 * @param	{number}	[prop.options.maxFaceCount]	Maximum number of faces to be detected
 * @param	{boolean}	[prop.options.autoCapture=false]	Auto-click camera when object is detected
 * @param	{number}	[prop.options.aspectRatio]	Aspect ratio for the image
 * @param	{number}	[prop.options.disableImageConfirm]	Accept image without the confirmation dialog (including the option to crop, rotate, etc)
 * @param	{number}	[prop.options.disableImageEdit]	Disable image editing (crop, rotate, etc)
 * @param	{boolean}	[prop.options.disableCrop=false]	Disable cropping the image
 * @param	{boolean}	[prop.options.disableRotate=false]	Disable rotating the image
 * @param	{boolean}	[prop.disabled=false]	Disable the dropzone
 * @param	{boolean}	[prop.watermark=false]	Add watermark to the Camera image. The following data is added to the image: timestamp, user name, usercode, org name, and geolocation.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Dropzone file={screenshot} setFile={setScreenshot} />` TODO: Fix example
 */
const Dropzone = ({
	file,
	setFile,
	accept = "",
	cameraOnly = false,
	options = {},
	disabled = false,
	watermark = false,
	...rest
}) => {
	const [inDropZone, setInDropZone] = useState(false);
	const [isValidDrop, setIsValidDrop] = useState(false);
	const [isImageAllowed, setIsImageAllowed] = useState(false);
	const [previewImage, setPreviewImage] = useState(null);

	// Reference for the Input element
	const fileInputRef = useRef(null);

	const { openCamera } = useCamera();
	const { showImage } = useFileView();
	const { editImage } = useImageEditor();

	const { userData } = useUser();
	const { userDetails } = userData;
	const { name, code } = userDetails ?? {};
	const { orgDetail } = useOrgDetailContext();
	const { org_id, app_name } = orgDetail ?? {};
	const [ip, setIp] = useState("");
	const {
		latitude,
		longitude,
		accuracy,
		error: locationError,
	} = useGeolocation({
		highAccuracy: true,
	});

	// Get the user's IP address, if watermark is enabled
	useEffect(() => {
		if (!watermark) return;
		if (ip) return;

		fetch("https://api.ipify.org?format=json")
			.then((res) => res.json())
			.then((data) => {
				console.log("User's IP address: ", data);
				setIp(data.ip);
			})
			.catch((err) => {
				console.error("Error fetching IP address: ", err);
			});
	}, [watermark]);

	// Generate memoised watermark text
	const watermarkText = useMemo(() => {
		if (!watermark) return "";

		const timestamp = new Date().toLocaleString();
		const _name = name || "";
		const _code = code || "";
		const _org = (app_name || "Org") + (org_id ? ` (${org_id})` : "");
		const _location = locationError
			? ""
			: `${latitude}, ${longitude} (${accuracy}m)`;

		return `${_name} (${_code})\n${_org}\n${_location} – ${
			ip || ""
		}\n${timestamp} @ ${window.location.host}`;
	}, [watermark, name, code, org_id, app_name, location, ip]);

	// Log file
	useEffect(() => {
		console.log("[Dropzone] file: ", file);
	}, [file]);

	// Detect if image is allowed (if accept is not provided, all files are allowed)
	useEffect(() => {
		if (!accept) {
			setIsImageAllowed(true);
		} else {
			const _accept = accept.split(",");
			const _isImageAllowed = _accept.some(
				(type) => IMAGE_MIME_TYPES[type]
			);
			setIsImageAllowed(_isImageAllowed);
		}
	}, [accept]);

	/**
	 * Open the Image Editor for the file
	 * @param {*} file
	 */
	const openImageEditor = (image, file) => {
		if (!image && !file) return;

		const _options = {
			fileName: file?.name || "",
			...options,
		};

		if (IMAGE_MIME_TYPES[file.type]) {
			// convertImage(_file);
			console.log("[Dropzone] Opening Image Editor: ", {
				image_type: typeof image,
				image,
				file,
				options,
			});

			// Check if the image confirmation dialog is disabled.
			// If disabled, directly accept the image without showing the confirmation dialog.
			if (options?.disableImageConfirm) {
				setFile(file);
				setPreviewImage(image);
				return;
			}

			if (image instanceof Blob || !image) {
				// Load image from File or  Blob object for ImageEditor
				const reader = new FileReader();
				reader.onloadend = () => {
					editImage(reader.result, _options, (data) =>
						handleImageEditorResponse(data)
					);
				};
				reader.readAsDataURL(image || file);
				return;
			}

			// Open ImageEditor with normal image data
			editImage(image, _options, (data) =>
				handleImageEditorResponse(data)
			);
		}
	};

	const handleFileUploadInputChange = (e) => {
		const _file = e.target.files[0];

		if (!_file) return;
		if (cameraOnly) return;

		if (IMAGE_MIME_TYPES[_file.type]) {
			// convertImage(_file);
			openImageEditor(null, _file);
		} else {
			setFile(_file);
		}
	};

	/**
	 * Convert image file/blob to preview image data URL
	 * @param {*} _file
	 * @param {*} type
	 */
	const convertImage = (_file, type = "file") => {
		if (type === "blob") {
			setPreviewImage(_file);
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewImage(reader.result);
		};
		reader.readAsDataURL(_file);
	};

	const handleDragOver = (event) => {
		if (cameraOnly) return;

		event.preventDefault();

		if (disabled || inDropZone) {
			return;
		}

		const dataTransfer = event.dataTransfer;
		const _file = event?.dataTransfer?.files[0];

		console.log("[Dropzone] DragOver event: ", {
			types: dataTransfer.types,
			files: JSON.stringify(event.dataTransfer.files, null, 2),
			accept,
			_file,
		});

		let _type = "";

		if (dataTransfer.items) {
			_type = dataTransfer?.items[0]?.type || "";
		}

		if (_type && (accept === "" || accept.indexOf(_type) >= 0)) {
			setIsValidDrop(true);
		} else {
			setIsValidDrop(false);
		}
		setInDropZone(true);
	};

	/**
	 * Handle drag leave event. It marks that the file
	 * @param {*} event
	 */
	const handleDragLeave = (event) => {
		event.preventDefault();
		setInDropZone(false);
		setIsValidDrop(false);
	};

	/**
	 * Handle file/image drop event. It sets the dropped file, if the format is allowed.
	 * @param {*} event
	 */
	const handleDrop = async (event) => {
		if (cameraOnly) return;

		event.preventDefault();

		setInDropZone(false);
		setIsValidDrop(false);

		if (disabled || !isValidDrop) return;

		const dataTransfer = event?.dataTransfer;

		if (!dataTransfer) return;

		let _file = dataTransfer.files[0];
		// const fileUrl = URL.createObjectURL(file);

		if (!_file && dataTransfer.items) {
			// Use DataTransferItemList interface to access the file(s)
			const _item = dataTransfer.items[0];
			if (_item.kind === "file") {
				_file = _item.getAsFile();
				console.log("FILE FOUND::: ", _file);
			} else if (_item.kind === "string") {
				_item.getAsString((url) => {
					fetch(url)
						.then((r) => r.blob())
						.then((blobFile) => {
							const _type = blobFile.type;

							// Check if the file type is allowed
							if (
								!(
									_type &&
									(accept === "" ||
										accept.indexOf(_type) >= 0)
								)
							) {
								return;
							}

							const timestamp = new Date()
								.toLocaleString()
								.replace(/[^0-9]+/g, "_");
							const filename = `FileDrop_${timestamp}.${
								_type.split("/")[1] || "jpg"
							}`;

							const fileObj = new File([blobFile], filename, {
								type: _type,
							});

							console.log("URL FILE FOUND::: ", fileObj);

							if (IMAGE_MIME_TYPES[fileObj.type]) {
								// convertImage(fileObj);
								openImageEditor(blobFile, fileObj);
							} else {
								setFile(fileObj);
							}
						})
						.catch((err) => {
							console.error("Error fetching file: ", err);
						});
				});
				return;
			}
		}

		if (!_file) return;

		if (IMAGE_MIME_TYPES[_file.type]) {
			// convertImage(_file);
			openImageEditor("", _file);
		} else {
			setFile(_file);
		}
		console.log("[Dropzone] Drop event end: ", { event, _file });
	};

	/**
	 * Handle the image returned from the Camera
	 * @param {object} data
	 * @param {boolean} data.accepted - Is the image accepted?
	 * @param {string} data.image - Image data URL
	 * @param {File} data.file - File object for the image
	 */
	const handleCameraResponse = (data) => {
		if (data.accepted) {
			// openImageEditor(data.image, data.file);	// Editor is not required for camera images
			setFile(data.file);
			convertImage(data.image, "blob");
		}
	};

	/**
	 * Handle the image returned from the Image Editor.
	 * Set the file and image preview.
	 * @param {object} data
	 * @param {boolean} data.accepted - Is the image accepted?
	 * @param {string} data.image - Image data URL
	 * @param {File} data.file - File object for the image
	 */
	const handleImageEditorResponse = (data) => {
		console.log("Image Editor result: ", data);
		if (data.accepted) {
			setFile(data.file);
			convertImage(data.image, "blob");
		}
	};

	return (
		<Flex
			bg={
				inDropZone
					? isValidDrop
						? "#00FF0010"
						: "#FF000020"
					: "initial"
			}
			w="100%"
			align="center"
			justify="center"
			// onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			border="2px"
			borderStyle="dashed"
			borderColor="divider"
			borderRadius="10px"
			color="light"
			p="5"
			cursor={disabled ? "default" : "pointer"}
			pointerEvents={disabled ? "none" : "auto"}
			opacity={disabled ? 0.5 : 1}
			{...rest}
		>
			{file === null || typeof file === "undefined" ? (
				<Flex direction="column" align="center" w="100%" gap="2">
					<Input
						ref={fileInputRef}
						hidden
						type="file"
						onChange={handleFileUploadInputChange}
						id="fileUploadInput"
						accept={accept}
						disabled={disabled}
					/>
					<Flex
						direction="row"
						align="center"
						gap="2"
						opacity={inDropZone ? 0 : 1}
						pointerEvents={inDropZone ? "none" : "auto"}
					>
						{cameraOnly ? null : (
							<Btn
								onClick={() => fileInputRef?.current?.click()}
								disabled={disabled}
							>
								Browse
							</Btn>
						)}
						{isImageAllowed ? (
							<Btn
								onClick={() =>
									openCamera(
										{
											watermark:
												watermark && watermarkText
													? watermarkText
													: "",
											...options,
										},
										handleCameraResponse
									)
								}
								disabled={disabled}
							>
								<MdCameraAlt size="20px" />
							</Btn>
						) : null}
					</Flex>
					<Text
						fontSize="sm"
						color="GrayText"
						pointerEvents={inDropZone ? "none" : "auto"}
					>
						{inDropZone
							? isValidDrop
								? "Drop your file here"
								: "File type not allowed"
							: "or, drag & drop your file here"}
					</Text>
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
						theme="primary"
						// boxShadow="0px 3px 10px #11299E1A"
						_hover={{ bg: "primary.dark" }}
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
							<Image
								src={previewImage}
								borderRadius="4px"
								boxShadow="rgba(0, 0, 0, 0.05) 0px 0px 0px 1px"
								onClick={() => showImage(previewImage)}
							/>
						) : (
							<Text
								w="100%"
								h="100%"
								fontSize="xxs"
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

/**
 * Custom Button component for Dropzone
 */
const Btn = ({ disabled, onClick, children, ...rest }) => {
	return (
		<Button
			variant="primary"
			size="md"
			onClick={onClick}
			disabled={disabled}
			{...rest}
		>
			{children}
		</Button>
	);
};

export default Dropzone;
