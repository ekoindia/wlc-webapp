import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { IcoButton } from "components";
import { IconNameType } from "constants/IconLibrary";
import React, { useCallback, useRef, useState } from "react";
import { MdCamera, MdCameraswitch, MdClose } from "react-icons/md";
import Webcam from "react-webcam";
import {
	FACING_MODE_ENVIRONMENT,
	FACING_MODE_USER,
	resolutions,
} from "./cameraConfig";

const CAMERA_WEBCAM_PATTERN = /webcam|usb/i;
const FACING_MODE_USER_PATTERN = /front|self|user/i;
const FACING_MODE_ENVIRONMENT_PATTERN = /back|rear/i;

const toolbar_height = "80px";

type DeviceList = {
	label: string;
	deviceId: string;
	type?: string;
	mirrored?: boolean;
}[];

type CameraProps = {
	mediaRecorderRef?: any | null;
	capturing?: boolean;
	recordedChunks?: any;
	type: string;
	cameraType: string;
	imagesVal: any;
	preferredFacingMode?: "user" | "environment";
	onClose?: (_result: {
		image: string;
		file?: File;
		accepted: boolean;
	}) => void;
};

/**
 * Camera Component
 * @param {CameraProps} props - The properties of the component
 * @param {string} [props.preferredFacingMode="environment"] - The preferred facing mode for the camera
 * @param {function} [props.onClose] - The callback function for image capture or on cancel
 * @returns {JSX.Element} - The Camera component
 */
const Camera = ({
	preferredFacingMode = FACING_MODE_ENVIRONMENT,
	onClose,
}: CameraProps) => {
	const webcamRef = useRef<any | null>(null);
	// const [resolutionIndex] = useState<number>(0);
	const [camDevices, setCamDevices] = useState<DeviceList>([]);
	const [deviceIdx, setDeviceIdx] = useState<number>(-1);
	const [videoConstraints, setVideoConstraints] = useState<Object>({
		width: 1280,
		height: 720,
		// aspectRatio: 0.8,
	});
	const [status, setStatus] = useState<"init" | "ready" | "error">("init"); // chrome://settings/content/notifications, chrome://settings/content/camera, chrome://settings/content/location, etc
	const [errorMessage, setErrorMessage] = useState<string>("");

	/**
	 * To close the camera
	 */
	const onCancel = () => {
		onClose({ image: "", accepted: false });
	};

	/**
	 * To capture the image
	 */
	const onCapture = async () => {
		const { imageSrc, imageFile } = await capture();
		onClose({ image: imageSrc, file: imageFile, accepted: true });
	};

	/**
	 * To get all the connected devices
	 */
	const getDevices = useCallback(
		(mediaDevices: any) => {
			const _videoMediaDevices = mediaDevices.filter(
				({ kind }: any) => kind === "videoinput"
			);
			const _mediaDevices: DeviceList = _videoMediaDevices.map(
				({ label, deviceId }: { label: string; deviceId: string }) => ({
					label,
					deviceId,
				})
			);

			const deviceList: DeviceList = getModifiedDeviceList(_mediaDevices);

			if (deviceList.length > 0) {
				const deviceIdx = getDeviceIdx(deviceList);
				initCamera(deviceList, deviceIdx);
				setDeviceIdx(deviceIdx);
				setCamDevices(deviceList);
			}
		},
		[setCamDevices]
	);

	/**
	 * Function to get camera device list based on different conditions like priority and preferred facing mode
	 */
	const getModifiedDeviceList = (_mediaDevices: DeviceList) => {
		const _deviceList: DeviceList = _mediaDevices;

		/* Step 1: Modify the list */
		_deviceList?.forEach((device) => {
			const _label = device.label.toLowerCase();

			if (FACING_MODE_USER_PATTERN.test(_label)) {
				device.type = FACING_MODE_USER;
				device.mirrored = true;
			} else if (FACING_MODE_ENVIRONMENT_PATTERN.test(_label)) {
				device.type = FACING_MODE_ENVIRONMENT;
				device.mirrored = false;
			} else if (CAMERA_WEBCAM_PATTERN.test(_label)) {
				device.type = "webcam";
				device.mirrored =
					preferredFacingMode === FACING_MODE_USER ? true : false;
			} else {
				device.type = "other";
				device.mirrored =
					preferredFacingMode === FACING_MODE_USER ? true : false;
			}
		});

		return _deviceList;
	};

	/**
	 * Function to get camera index
	 */
	const getDeviceIdx = (deviceList: DeviceList) => {
		/* Step 2: Get the device index */
		let _activeDeviceIdx = 0;

		const deviceIdxObj: { [key: string]: number } = {};

		for (let idx in deviceList) {
			let type: string = deviceList[idx]?.type || "other";

			if (!deviceIdxObj[type]) {
				deviceIdxObj[type] = +idx;
			}
		}

		if (deviceIdxObj["webcam"]) {
			_activeDeviceIdx = +deviceIdxObj["webcam"];
		} else if (deviceIdxObj[preferredFacingMode]) {
			_activeDeviceIdx = deviceIdxObj[preferredFacingMode];
		}

		return _activeDeviceIdx;
	};

	/**
	 * Initializing Camera
	 */
	const initCamera = (
		camDevices: DeviceList,
		deviceIdx: number,
		resolutionIndex: number = 0
	) => {
		const res = resolutions[resolutionIndex];
		const _deviceId = camDevices?.[deviceIdx]?.deviceId;
		setVideoConstraints((prev) => ({
			...prev,
			width: res.w,
			height: res.h,
			deviceId: _deviceId,
		}));
	};

	/**
	 * To switch between cameras
	 */
	const switchCamera = () => {
		console.log("[Camera] switchCamera", deviceIdx, camDevices);

		if (camDevices?.length <= 1) {
			return;
		}

		let _deviceIdx = deviceIdx < camDevices?.length - 1 ? deviceIdx + 1 : 0;

		initCamera(camDevices, _deviceIdx);
		setDeviceIdx(_deviceIdx);
	};

	/**
	 * To capture image
	 */
	const capture = useCallback(async () => {
		const imageSrc = webcamRef?.current?.getScreenshot();
		const blob = await fetch(imageSrc).then((res) => res.blob());
		const timestamp = new Date().toLocaleString().replace(/[^0-9]+/g, "_");
		const filename = `Cam_${timestamp}.${blob.type.split("/")[1] || "jpg"}`;
		const imageFile = new File([blob], filename, { type: blob.type });
		return { imageSrc, imageFile };
	}, [webcamRef]);

	// if (status === "error") {
	// 	return (
	// 		<Flex
	// 			direction="row"
	// 			align="center"
	// 			justify="center"
	// 			width="100%"
	// 			height="100vh"
	// 		>
	// 			<Text color="white">{errorMessage}</Text>
	// 		</Flex>
	// 	);
	// }

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
				{/* {process.env.NEXT_PUBLIC_ENV !== "production" &&
					camDevices.length && (
						<p className="p-2 text-white border-2 border-white border-solid rounded-lg ">
							{camDevices[deviceIdx]?.label}
						</p>
					)} */}
				<Webcam
					style={{
						maxWidth: "100%",
						maxHeight: `calc(100vh - ${toolbar_height})`,
						borderRadius: "6px",
					}}
					audio={false}
					ref={webcamRef}
					minScreenshotHeight={500}
					minScreenshotWidth={500}
					screenshotFormat="image/jpeg"
					screenshotQuality={0.9}
					forceScreenshotSourceSize={true}
					imageSmoothing={true}
					mirrored={camDevices[deviceIdx]?.mirrored || false}
					videoConstraints={videoConstraints}
					onUserMedia={(e) => {
						console.log("[Camera] onUserMedia", e);
						if (!camDevices?.length) {
							navigator.mediaDevices
								.enumerateDevices()
								.then(getDevices)
								.catch((err) =>
									console.error(
										"[Camera] error: Devices not found",
										err
									)
								);
						}
						setStatus("ready");
					}}
					onUserMediaError={(err) => {
						console.error("[Camera] err", err);
						setStatus("error");
						setErrorMessage(err.toString());
					}}
				/>
				{/* {!camDevices.length && <p className="text-lg text-black bg-white">Please "Allow" browser to use your camera.</p>} */}
				<Box height={toolbar_height} width="100%" />
				{status === "ready" ? (
					// Show the toolbar when camera is ready
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
						bg="#00000099"
						borderRadius={{ base: "0", md: "md" }}
					>
						<IcoBtn
							icon={MdCamera}
							label="Accept Image"
							isMain
							onClick={onCapture}
						/>
						{camDevices?.length > 1 ? (
							<IcoBtn
								icon={MdCameraswitch}
								label="Switch Camera"
								onClick={switchCamera}
							/>
						) : null}
					</Flex>
				) : (
					// Camera not ready...
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
						{status === "error" ? (
							// Show error message
							<Text color="white">{errorMessage}</Text>
						) : null}
						{status === "init" ? (
							// Show spinner while camera is initializing
							<Spinner
								thickness="4px"
								speed="0.65s"
								color="white"
								size="xl"
							/>
						) : null}
					</Flex>
				)}

				{/* Close button  */}
				<IcoBtn
					position="fixed"
					right="10px"
					top="10px"
					icon={MdClose}
					label="Reject Image"
					bg="#00000060"
					color="white"
					onClick={onCancel}
					_hover={{ bg: "#44000090" }}
				/>
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
			bg={selected ? "primary.DEFAULT" : "white"}
			color={selected ? "white" : "black"}
			borderRadius="full"
			boxShadow="md"
			p="10px"
			size={isMain ? "60px" : "48px"}
			// minW={isMain ? "100px" : "initial"}
			alignItems="center"
			justifyContent="center"
			_hover={{ filter: "brightness(0.9)" }}
			outline={isMain ? "2px solid white" : "none"}
			outlineOffset={isMain ? "2px" : "0"}
			// _after={isMain ? { content: `" "`,  } : {}}
			{...rest}
		>
			{icon}
		</IcoButton>
	);
};

export default Camera;
