/**
 * @file SetupHelpGuide — Full port of tf-uidai-fingerprint-setup-help.html.
 * Shows device brand selection, platform-specific installation instructions,
 * registration links, and help buttons.
 */
import {
	Box,
	Button,
	HStack,
	Link,
	ListItem,
	OrderedList,
	Select,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Icon } from "components";
import { useAppSource } from "contexts";
import useRaiseIssue from "hooks/useRaiseIssue";
import { memo, useState } from "react";
import type { BiometricType } from "./utils/rdServiceHelpers";

// ================================ Driver Data ================================

interface DriverInfo {
	brand?: string;
	android?: string;
	windows?: string;
	windowshelpdoc?: string;
	buy?: string;
	register?: string;
	register_help_video?: string;
}

type DriverMap = Record<string, DriverInfo>;
type DeviceOption = { value: string; label: string };

const DEVICE_LISTS: Record<BiometricType, DeviceOption[]> = {
	fingerprint: [
		{ value: "mantra", label: "Mantra" },
		{ value: "secugen", label: "Secugen" },
		{ value: "startek", label: "Startek" },
		{ value: "morpho", label: "Morpho" },
		{ value: "cogent_3m", label: "3M" },
		{ value: "tatvik", label: "Tatvik TMF20" },
	],
	iris: [{ value: "mantra", label: "Mantra" }],
	face: [],
};

const DRIVER_MAPS: Record<BiometricType, DriverMap> = {
	fingerprint: {
		mantra: {
			brand: "Mantra",
			android: "com.mantra.rdservice",
			windows: "http://download.mantratecapp.com/Forms/DownLoadFiles",
			windowshelpdoc:
				"https://sites.google.com/view/eko-connect-guide/guides/windows-driver-install/mantra",
			buy: "https://amzn.to/2IOpnzs",
		},
		morpho: {
			brand: "Morpho",
			android: "com.scl.rdservice",
			windows: "https://rdserviceonline.com",
			windowshelpdoc:
				"https://sites.google.com/view/eko-connect-guide/guides/windows-driver-install/morpho",
			buy: "https://amzn.to/2EbLGAH",
			register:
				"https://rdserviceonline.com/products/rd-service-device-whitelisting",
			register_help_video: "HmJ6a-f2bCI",
		},
		secugen: {
			brand: "Secugen",
			android: "com.secugen.rdservice",
			windows: "https://secugenindia.com/download",
			windowshelpdoc:
				"https://sites.google.com/view/eko-connect-guide/guides/windows-driver-install/secugen",
			buy: "https://amzn.to/2SM8U4o",
		},
		startek: {
			brand: "Startek",
			android: "com.acpl.registersdk",
			windows: "http://acpl.in.net/downloads/SetupFM220_RD_Ver1.zip",
			windowshelpdoc:
				"https://drive.google.com/file/d/180yibS3pfqS8Ja74mcAzZLCkbjHMVjRt/view",
			buy: "https://amzn.to/2TAN1VN",
		},
		cogent_3m: {
			brand: "3M",
			android: "com.rd.gemalto.com.rdserviceapp",
			windows:
				"https://dsrvsindia.ac.in/cogent-csd200-rd-service-registration-precision-biometric-csd-200/",
			windowshelpdoc:
				"https://pbrdms.precisionbiometric.co.in/RDPayments/downloads/BOI/RegisteredDevice_Installation_Manual_CSD200_Windows_v1.1.pdf",
			buy: "https://amzn.to/2ABKvHz",
		},
		tatvik: {
			brand: "Tatvik",
			android: "com.tatvik.bio.tmf20",
			windows: "https://rd.tatvikbiosystems.com/rd/",
			windowshelpdoc: "https://rd.tatvikbiosystems.com/rd/",
			buy: "https://www.amazon.in/Tatvik-TMF20/dp/B07B7G4HZ3",
			register: "https://rd.tatvikbiosystems.com/rd/rdrenewal.html",
		},
		other: {},
	},
	iris: {
		mantra: {
			brand: "Mantra",
			android: "com.mantra.mfs110.rdservice",
			windows: "https://www.mantratec.com/Download/User",
			windowshelpdoc:
				"https://sites.google.com/view/eko-connect-guide/guides/windows-driver-install/mantra",
		},
		other: {},
	},
	face: {},
};

// ================================ Helpers ================================

const getDriverInfo = (
	device: string,
	key: keyof DriverInfo,
	type: BiometricType
): string => {
	return (DRIVER_MAPS[type]?.[device]?.[key] as string) ?? "";
};

const getFilteredDeviceList = (
	type: BiometricType,
	isAndroid: boolean,
	hideBranding: boolean
): DeviceOption[] => {
	const platform = isAndroid ? "android" : "windows";
	const list = (DEVICE_LISTS[type] ?? []).filter((rd) => {
		const info = DRIVER_MAPS[type]?.[rd.value];
		return info && info[platform as keyof DriverInfo];
	});

	if (!hideBranding) {
		list.push({ value: "other", label: "Others…" });
	}

	return list;
};

const capitalize = (text?: string): string => {
	if (!text) return "";
	return text.charAt(0).toUpperCase() + text.slice(1);
};

// ================================ Component ================================

interface SetupHelpGuideProps {
	rdServiceType: BiometricType;
	hideBranding?: boolean;
	allowRefresh?: boolean;
	onRefresh?: () => void;
}

const SetupHelpGuide = ({
	rdServiceType,
	hideBranding = false,
	allowRefresh = false,
	onRefresh,
}: SetupHelpGuideProps): JSX.Element | null => {
	const { isAndroid } = useAppSource();
	const [selectedDevice, setSelectedDevice] = useState<string>("");
	const { showRaiseIssueDialog } = useRaiseIssue();

	const openDeviceHelpIssue = (): void => {
		const brand =
			selectedDevice && selectedDevice !== "other"
				? getDriverInfo(selectedDevice, "brand", rdServiceType)
				: undefined;

		showRaiseIssueDialog(
			{
				heading: `${capitalize(rdServiceType)} Scanner Setup Help`,
				customIssueType: "biometric_device_setup",
				customIssueDetails: {
					category: "Device Setup",
					sub_category: brand ?? "Device not listed",
				},
				origin: "uidai-fingerprint-setup-help",
			},
			() => {}
		);
	};

	// Don't show for face type
	if (rdServiceType === "face") return null;

	const deviceList = getFilteredDeviceList(
		rdServiceType,
		isAndroid,
		hideBranding
	);

	const isMobileWeb =
		!isAndroid &&
		typeof window !== "undefined" &&
		/Mobi|Android/i.test(navigator?.userAgent ?? "");

	// Mobile Web: just show download link
	if (isMobileWeb) {
		return (
			<Box border="2px solid" borderColor="gray.300" mt={4}>
				<Box bg="gray.100" p={2} fontWeight={700}>
					<HStack>
						<Icon name="help-outline" size="sm" />
						<Text>
							How to Setup {capitalize(rdServiceType)} Scanner?
						</Text>
					</HStack>
				</Box>
				<Box p={4}>
					<Text>
						To use {rdServiceType} scanner with your mobile phone,
						download the{" "}
						<Link
							href="https://play.google.com/store/apps/details?id=in.eko.connect"
							isExternal
							color="primary.DEFAULT"
						>
							Connect Android App
						</Link>
					</Text>
				</Box>
			</Box>
		);
	}

	return (
		<Box border="2px solid" borderColor="gray.300" mt={4}>
			{/* Header */}
			<Box bg="gray.100" p={2} fontWeight={700}>
				<HStack>
					<Icon name="help-outline" size="sm" />
					<Text>
						How to Setup {capitalize(rdServiceType)} Scanner?
					</Text>
				</HStack>
			</Box>

			{/* Body */}
			<Box p={4}>
				{/* Device selector */}
				<Box mb={4}>
					<Text fontSize="sm" fontWeight={400} mb={1}>
						Select Your {capitalize(rdServiceType)} Device
					</Text>
					<Select
						placeholder="Choose device..."
						value={selectedDevice}
						onChange={(e) => setSelectedDevice(e.target.value)}
						size="sm"
					>
						{deviceList.map((d) => (
							<option key={d.value} value={d.value}>
								{d.label}
							</option>
						))}
					</Select>
				</Box>

				{/* Instructions */}
				{selectedDevice ? (
					<VStack align="stretch" spacing={3}>
						{selectedDevice === "other" ? (
							/* "Other" device — raise issue flow */
							<OrderedList
								pl={0}
								spacing={2}
								styleType="none"
								sx={{
									counterReset: "help-counter",
									"& li": {
										counterIncrement: "help-counter",
										position: "relative",
										pl: "1.6em",
										"&::before": {
											content: "counter(help-counter)",
											fontSize: "0.8em",
											fontWeight: 700,
											position: "absolute",
											left: 0,
											width: "1.3em",
											height: "1.3em",
											top: "0.3em",
											bg: "gray.400",
											color: "white",
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										},
									},
								}}
							>
								<ListItem>
									<Link
										as="button"
										color="primary.DEFAULT"
										fontWeight={700}
										onClick={openDeviceHelpIssue}
									>
										Click here to let us know
									</Link>{" "}
									if you have a {rdServiceType} device that is
									not in this list.
								</ListItem>
								<ListItem>
									Write the name of your device in the
									&quot;Comment&quot; box.
								</ListItem>
								<ListItem>
									We will reach out to you soon to resolve
									your issue.
								</ListItem>
							</OrderedList>
						) : (
							/* Selected device — install instructions */
							<OrderedList
								pl={0}
								spacing={2}
								styleType="none"
								sx={{
									counterReset: "help-counter",
									"& li": {
										counterIncrement: "help-counter",
										position: "relative",
										pl: "1.6em",
										"&::before": {
											content: "counter(help-counter)",
											fontSize: "0.8em",
											fontWeight: 700,
											position: "absolute",
											left: 0,
											width: "1.3em",
											height: "1.3em",
											top: "0.3em",
											bg: "gray.400",
											color: "white",
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										},
									},
								}}
							>
								{/* Registration link */}
								{getDriverInfo(
									selectedDevice,
									"register",
									rdServiceType
								) ? (
									<ListItem>
										<Link
											href={getDriverInfo(
												selectedDevice,
												"register",
												rdServiceType
											)}
											isExternal
											color="primary.DEFAULT"
											fontWeight={700}
										>
											Click here to register
										</Link>{" "}
										and activate your device at{" "}
										{getDriverInfo(
											selectedDevice,
											"brand",
											rdServiceType
										)}
										{getDriverInfo(
											selectedDevice,
											"register_help_video",
											rdServiceType
										) ? (
											<>
												{" "}
												<Link
													href={`https://www.youtube.com/watch?v=${getDriverInfo(
														selectedDevice,
														"register_help_video",
														rdServiceType
													)}`}
													isExternal
													bg="primary.DEFAULT"
													color="white"
													px={2}
													py={0.5}
													borderRadius="11px"
													fontSize="13px"
													fontWeight={700}
													display="inline-flex"
													alignItems="center"
													gap={1}
												>
													<Icon
														name="help-outline"
														size="xs"
														color="white"
													/>
													How?
												</Link>
											</>
										) : null}
									</ListItem>
								) : null}

								{/* Platform-specific install */}
								{isAndroid ? (
									<>
										<ListItem>
											<Link
												href={`market://details?id=${getDriverInfo(selectedDevice, "android", rdServiceType)}`}
												isExternal
												color="primary.DEFAULT"
												fontWeight={700}
											>
												Click here to install
											</Link>{" "}
											the driver
										</ListItem>
										<ListItem>
											After installation, select{" "}
											<Text as="strong" fontWeight={700}>
												open
											</Text>{" "}
											to start the driver
										</ListItem>
										<ListItem>
											Press{" "}
											<Text as="strong" fontWeight={700}>
												back
											</Text>{" "}
											to come back here
										</ListItem>
									</>
								) : (
									<ListItem>
										<Link
											href={getDriverInfo(
												selectedDevice,
												"windows",
												rdServiceType
											)}
											isExternal
											color="primary.DEFAULT"
											fontWeight={700}
										>
											Click here to download
										</Link>{" "}
										and install the driver
										{getDriverInfo(
											selectedDevice,
											"windowshelpdoc",
											rdServiceType
										) ? (
											<>
												{" "}
												<Link
													href={getDriverInfo(
														selectedDevice,
														"windowshelpdoc",
														rdServiceType
													)}
													isExternal
													bg="primary.DEFAULT"
													color="white"
													px={2}
													py={0.5}
													borderRadius="11px"
													fontSize="13px"
													fontWeight={700}
													display="inline-flex"
													alignItems="center"
													gap={1}
												>
													<Icon
														name="help-outline"
														size="xs"
														color="white"
													/>
													How?
												</Link>
											</>
										) : null}
									</ListItem>
								)}

								{/* Refresh instructions */}
								{allowRefresh ? (
									<>
										<ListItem>
											Make sure the device is connected
										</ListItem>
										<ListItem>
											Then,{" "}
											<Link
												as="button"
												bg="primary.DEFAULT"
												color="white"
												px={2}
												py={0.5}
												borderRadius="11px"
												fontSize="13px"
												fontWeight={700}
												display="inline-flex"
												alignItems="center"
												gap={1}
												onClick={onRefresh}
												border="none"
												cursor="pointer"
											>
												click here to continue
												<Icon
													name="arrow-forward"
													size="xs"
													color="white"
												/>
											</Link>
										</ListItem>
									</>
								) : null}
							</OrderedList>
						)}

						{/* Desktop: Connect Android app download link */}
						{!isAndroid && !hideBranding ? (
							<Text fontSize="sm" mt={4}>
								⭐ For easy setup, download the{" "}
								<Link
									href="https://play.google.com/store/apps/details?id=in.eko.connect"
									isExternal
									fontWeight={700}
									color="primary.DEFAULT"
								>
									📱 Connect Android app
								</Link>{" "}
								on your mobile phone.
							</Text>
						) : null}

						{/* Need help button */}
						{!hideBranding ? (
							<Button
								variant="outline"
								size="sm"
								mt={2}
								leftIcon={
									<Icon name="help-outline" size="sm" />
								}
								textTransform="none"
								onClick={openDeviceHelpIssue}
							>
								Need help with the setup?
							</Button>
						) : null}
					</VStack>
				) : null}
			</Box>
		</Box>
	);
};

export default memo(SetupHelpGuide);
