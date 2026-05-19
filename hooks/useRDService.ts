/**
 * @file Custom hook for UIDAI RD Service biometric device discovery and capture.
 * Handles port scanning, Android bridge communication, multi-biometric (fingerprint/iris/face) support,
 * auto-retry on low quality, and all related state management.
 */
import { useAppSource, usePubSub } from "contexts";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type BiometricType,
	type RDServiceInfo,
	type RDStatusValue,
	buildCaptureUrl,
	buildFacePidOptions,
	buildPidOptions,
	capitalizeServiceType,
	CAPTURE_RETRY_MAX,
	FACE_RD_SERVICE_RESPONSE,
	getCaptureErrorMessage,
	getScanQualityLabel,
	getStatusMessage,
	parseCaptureResponse,
	parseRDServiceDiscoveryResponse,
	QUALITY_THRESHOLD,
	RD_SERVICE_SCAN_LIST,
	RD_STATUS,
} from "tf-components/UidaiFingerprint/utils/rdServiceHelpers";
import { ANDROID_ACTION, doAndroidAction } from "utils";

// ================================ Types ================================

interface UseRDServiceOptions {
	/** The wadh parameter for PID options. Default: standard eKYC 2.1 wadh */
	uidaiWadh?: string;
	/** PID format: 0 = XML (default), 1 = Protobuf */
	pidFormat?: number;
	/** Whether the component is disabled */
	disabled?: boolean;
	/** Whether the component is visible */
	isVisible?: boolean;
	/** Extra options (may contain wadh overrides, faceAuth flags, etc.) */
	options?: string | Record<string, unknown>;
	/** Callback when a capture succeeds */
	onCapture?: (_value: string, _decorated: string) => void;
	/** Callback when a capture fails */
	onError?: (_errorMsg: string) => void;
}

interface UseRDServiceReturn {
	status: RDStatusValue;
	rdServiceList: RDServiceInfo[];
	selectedIndex: number;
	scanQuality: number;
	errorMessage: string;
	value: string;
	valueDecorated: string;
	scanProgress: { current: number; total: number };
	forceShowDriverHelp: boolean;
	isValid: boolean;
	selectedServiceType: BiometricType;
	statusMessage: string;
	qualityLabel: string;
	captureBiometric: () => void;
	selectDevice: (_index: number) => void;
	discoverRDServices: () => void;
	resetValue: (_val?: string) => void;
	setForceShowDriverHelp: (_val: boolean) => void;
}

// ================================ Defaults ================================

const DEFAULT_WADH = "rhVuL7SnJi2W2UmsyukVqY7c93JWyL9O/kVKgdNMfv8=";
const MAX_PARALLEL_WORKERS = 20;

// ================================ Hook ================================

const useRDService = (
	options: UseRDServiceOptions = {}
): UseRDServiceReturn => {
	const {
		uidaiWadh: propWadh,
		pidFormat: propFormat,
		disabled = false,
		isVisible = true,
		options: extraOptions,
		onCapture,
		onError,
	} = options;

	// ---- Contexts ----
	const { isAndroid, nativeVersion } = useAppSource();
	const { subscribe, TOPICS } = usePubSub();

	// ---- Parsed options ----
	const parsedOpts = useRef<Record<string, unknown>>({});
	useEffect(() => {
		try {
			if (typeof extraOptions === "string") {
				parsedOpts.current = JSON.parse(extraOptions);
			} else if (
				typeof extraOptions === "object" &&
				extraOptions !== null
			) {
				parsedOpts.current = extraOptions;
			}
		} catch (e) {
			console.error("[useRDService] Error parsing options:", e);
			parsedOpts.current = {};
		}
	}, [extraOptions]);

	const uidaiWadh =
		(parsedOpts.current?.wadh as string) ?? propWadh ?? DEFAULT_WADH;
	const pidFormat = (parsedOpts.current?.format as number) ?? propFormat ?? 0;
	const faceAuthOnAndroid = +(
		(parsedOpts.current?.faceAuthOnAndroid as number) ?? 0
	);
	const exclusiveFaceAuth = +(
		(parsedOpts.current?.exclusiveFaceAuth as number) ?? 0
	);
	const faceAuthWadh = parsedOpts.current?.faceAuthWadh as string | undefined;

	// ---- State ----
	const [status, setStatus] = useState<RDStatusValue>(RD_STATUS.SEARCHING);
	const [rdServiceList, setRdServiceList] = useState<RDServiceInfo[]>([]);
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const [scanQuality, setScanQuality] = useState<number>(0);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [value, setValue] = useState<string>("");
	const [valueDecorated, setValueDecorated] = useState<string>("");
	const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
	const [forceShowDriverHelp, setForceShowDriverHelp] = useState(false);
	const [isValid, setIsValid] = useState(false);

	// ---- Refs ----
	const captureRetryRef = useRef(0);
	const readyDeviceFoundRef = useRef(false);
	const lastCaptureLogRef = useRef({
		device: "",
		pkg: "",
		url: "",
		pidopts: "",
	});

	// ---- Derived ----
	const selectedService: RDServiceInfo | null =
		rdServiceList[selectedIndex] ?? null;
	const selectedServiceType: BiometricType =
		selectedService?.type ?? "fingerprint";

	const statusMessage = getStatusMessage(status, selectedServiceType);
	const qualityLabel = getScanQualityLabel(scanQuality);

	// ================================ Discovery ================================

	/**
	 * Process a raw RD Service discovery response.
	 * Ported from Polymer's _processResponseRDService.
	 */
	const processDiscoveryResponse = useCallback(
		(
			xml: string,
			fromAndroid: boolean = false,
			port: number = 0,
			isHttps: boolean = false
		) => {
			if (readyDeviceFoundRef.current && !fromAndroid) {
				return; // Already found a ready device via port scan, skip
			}

			const rdDriver = parseRDServiceDiscoveryResponse(
				xml,
				port,
				isHttps,
				fromAndroid
			);
			if (!rdDriver) return;

			// Skip non-face biometrics if exclusive face auth is enabled on Android
			if (
				isAndroid &&
				faceAuthOnAndroid === 1 &&
				exclusiveFaceAuth === 1 &&
				rdDriver.type !== "face" &&
				nativeVersion >= 3
			) {
				return;
			}

			console.log("[useRDService] RD Service found:", rdDriver);

			setRdServiceList((prev) => {
				// Remove existing entry with same info+type (dedup)
				const filtered = prev.filter(
					(item) =>
						!(
							item.info === rdDriver.info &&
							item.type === rdDriver.type
						)
				);
				const updated = [...filtered, rdDriver];

				// Auto-select if ready
				if (rdDriver.ready) {
					readyDeviceFoundRef.current = true;
					setSelectedIndex(updated.length - 1);
				}

				return updated;
			});
		},
		[isAndroid, faceAuthOnAndroid, exclusiveFaceAuth, nativeVersion]
	);

	/**
	 * Called after port scan completes (or Android discovery finishes).
	 * Sets final status based on what was found.
	 */
	const afterScanComplete = useCallback(() => {
		setRdServiceList((list) => {
			if (list.length > 0) {
				const hasReady = list.some((rd) => rd.ready);
				setStatus(hasReady ? RD_STATUS.READY : RD_STATUS.NO_SCANNER);
			} else {
				setStatus(RD_STATUS.NO_RDSERVICE);
			}
			return list;
		});
	}, []);

	/**
	 * Run the parallel port scan for web discovery.
	 * Ported from Polymer's createDiscoveryQueue.
	 */
	const webDiscovery = useCallback(() => {
		readyDeviceFoundRef.current = false;
		setStatus(RD_STATUS.SEARCHING);
		setScanProgress({ current: 0, total: RD_SERVICE_SCAN_LIST.length });

		let taskIndex = 0;
		let numWorkers = 0;
		let doneCount = 0;

		const handleResult = (
			txt: string,
			resultPort: number,
			resultHttps: boolean
		) => {
			doneCount++;
			setScanProgress((prev) => ({ ...prev, current: doneCount }));
			processDiscoveryResponse(txt, false, resultPort, resultHttps);
			numWorkers--;
			getNextTask();
		};

		const handleError = () => {
			doneCount++;
			setScanProgress((prev) => ({ ...prev, current: doneCount }));
			numWorkers--;
			getNextTask();
		};

		const getNextTask = () => {
			if (readyDeviceFoundRef.current) {
				afterScanComplete();
				return;
			}

			if (
				numWorkers < MAX_PARALLEL_WORKERS &&
				taskIndex < RD_SERVICE_SCAN_LIST.length
			) {
				const task = RD_SERVICE_SCAN_LIST[taskIndex];
				const url = `${task.https ? "https" : "http"}://127.0.0.1:${task.port}`;

				fetch(url, { method: "RDSERVICE" })
					.then((resp) => {
						const portMatch = resp.url.match(/:(111[0-9]{2})/);
						const respPort = portMatch
							? parseInt(portMatch[1], 10)
							: task.port;
						const respHttps = resp.url.startsWith("https://");

						resp.text()
							.then((txt) =>
								handleResult(txt, respPort, respHttps)
							)
							.catch(() => handleError());
					})
					.catch(() => handleError());

				taskIndex++;
				numWorkers++;
				getNextTask(); // Launch more in parallel
			} else if (
				numWorkers === 0 &&
				taskIndex === RD_SERVICE_SCAN_LIST.length
			) {
				afterScanComplete();
			}
		};

		getNextTask();
	}, [processDiscoveryResponse, afterScanComplete]);

	/**
	 * Main discovery entry point.
	 */
	const discoverRDServices = useCallback(() => {
		setRdServiceList([]);
		setSelectedIndex(-1);

		if (isAndroid) {
			doAndroidAction(ANDROID_ACTION.DISCOVER_RDSERVICE);
			doAndroidAction(ANDROID_ACTION.DISCOVER_IRIS_RDSERVICE);
			return;
		}

		webDiscovery();
	}, [isAndroid, webDiscovery]);

	// ================================ Face Auth Discovery (Android) ================================

	useEffect(() => {
		if (faceAuthOnAndroid === 1 && isAndroid && nativeVersion >= 3) {
			processDiscoveryResponse(FACE_RD_SERVICE_RESPONSE, true);
		}
	}, [faceAuthOnAndroid, isAndroid, nativeVersion, processDiscoveryResponse]);

	// ================================ Capture ================================

	/**
	 * Process a capture response XML.
	 * Ported from Polymer's _processResponseCapture.
	 */
	const processCaptureResponse = useCallback(
		(xml: string) => {
			const { errCode, errMsg, qScore } = parseCaptureResponse(xml);
			const serviceType = selectedServiceType;
			const typeLabel = capitalizeServiceType(serviceType);

			if (errCode === "0") {
				setValue(xml);
				setValueDecorated(`${typeLabel} Scanned Successfully.`);
				setStatus(RD_STATUS.SCAN_OK);

				// FIX for STARTEK devices that send quality=1/2/3 on Android
				const adjustedQuality = qScore < 5 ? 0 : qScore;
				setScanQuality(adjustedQuality);

				// Check quality and maybe retry (skip for face)
				if (
					adjustedQuality &&
					adjustedQuality < QUALITY_THRESHOLD.RETRY &&
					serviceType !== "face"
				) {
					if (captureRetryRef.current < CAPTURE_RETRY_MAX) {
						captureRetryRef.current += 1;
						initiateCapture(serviceType);
						return;
					}
					if (adjustedQuality < QUALITY_THRESHOLD.BLOCK) {
						setValue("");
						setValueDecorated(
							`Bad ${typeLabel} Quality! Please try again`
						);
						setStatus(RD_STATUS.SCANNER_FAILED);
						setIsValid(false);
						onError?.(`Bad ${typeLabel} Quality! Please try again`);
						return;
					}
				}

				setIsValid(true);
				onCapture?.(xml, `${typeLabel} Scanned Successfully.`);
			} else {
				setValue("");
				setValueDecorated(`${typeLabel} Scan Failed`);
				setStatus(RD_STATUS.SCANNER_FAILED);
				setIsValid(false);

				const errorMsg = getCaptureErrorMessage(errCode, errMsg);
				setErrorMessage(`${typeLabel} Scan Failed. ${errorMsg}`);
				onError?.(`${typeLabel} Scan Failed. ${errorMsg}`);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selectedServiceType, onCapture, onError]
	);

	/**
	 * Initiate capture for a specific biometric type.
	 */
	const initiateCapture = useCallback(
		(type: BiometricType) => {
			if (!selectedService) return;

			setScanQuality(0);

			if (type === "face") {
				// Face capture: Android-only
				const facePidOpts = buildFacePidOptions(faceAuthWadh);
				doAndroidAction(
					ANDROID_ACTION.CAPTURE_FACE_RDSERVICE,
					JSON.stringify({
						pidopts: facePidOpts,
						package: "in.gov.uidai.rdservice.face.CAPTURE",
					})
				);
				lastCaptureLogRef.current = {
					device: "SDK",
					pkg: "in.gov.uidai.rdservice.face.CAPTURE",
					url: "",
					pidopts: facePidOpts,
				};
				return;
			}

			const pidopts = buildPidOptions(type, uidaiWadh, pidFormat);

			if (selectedService.is_android) {
				// Android capture via intent
				const action =
					type === "iris"
						? ANDROID_ACTION.CAPTURE_IRIS_RDSERVICE
						: ANDROID_ACTION.CAPTURE_RDSERVICE;

				doAndroidAction(
					action,
					JSON.stringify({
						pidopts,
						package: selectedService.android_package,
					})
				);

				lastCaptureLogRef.current = {
					device: "SDK",
					pkg: selectedService.android_package ?? "",
					url: selectedService.url ?? "",
					pidopts,
				};
			} else {
				// Web capture via HTTP
				const captureUrl = buildCaptureUrl(selectedService);
				if (!captureUrl) return;

				setStatus(RD_STATUS.SCANNING);

				fetch(captureUrl, {
					method: "CAPTURE",
					headers: { "Content-Type": "text/xml" },
					body: pidopts,
				})
					.then((resp) => resp.text())
					.then((txt) => processCaptureResponse(txt))
					.catch((err) => {
						console.error(
							"[useRDService] Capture HTTP error:",
							err
						);
						const typeLabel = capitalizeServiceType(type);
						setValue("");
						setValueDecorated(`${typeLabel} Scan Failed`);
						setStatus(RD_STATUS.SCANNER_FAILED);
						setIsValid(false);
						onError?.(
							`${typeLabel} Scan Failed. ${err?.message ?? "Connection error"}`
						);
					});

				lastCaptureLogRef.current = {
					device: "WEB",
					pkg: "",
					url: captureUrl,
					pidopts,
				};
			}
		},
		[
			selectedService,
			uidaiWadh,
			pidFormat,
			faceAuthWadh,
			processCaptureResponse,
			onError,
		]
	);

	/**
	 * Public capture handler.
	 * Ported from Polymer's _onBtnClick.
	 */
	const captureBiometric = useCallback(() => {
		if (
			status === RD_STATUS.NO_RDSERVICE ||
			status === RD_STATUS.NO_SCANNER
		) {
			// Retry discovery
			discoverRDServices();
			return;
		}

		if (
			status === RD_STATUS.READY ||
			status === RD_STATUS.SCAN_OK ||
			status === RD_STATUS.SCANNER_FAILED
		) {
			captureRetryRef.current = 0;
			initiateCapture(selectedServiceType);
		}
	}, [status, selectedServiceType, discoverRDServices, initiateCapture]);

	// ================================ Device Selection ================================

	const selectDevice = useCallback(
		(index: number) => {
			if (!rdServiceList[index] || rdServiceList[index].ready !== true) {
				console.warn(
					"[useRDService] Ignoring selection of non-ready RD service at index",
					index
				);
				return;
			}
			setSelectedIndex(index);
		},
		[rdServiceList]
	);

	// ================================ Reset ================================

	const resetValue = useCallback((val?: string) => {
		setValue(val ?? "");
		setValueDecorated(val ?? "");
		setErrorMessage("");
		setIsValid(false);
		setScanQuality(0);
	}, []);

	// ================================ Android Bridge Listener ================================

	useEffect(() => {
		if (!subscribe || !TOPICS) return;

		const unsubscribe = subscribe(
			TOPICS.ANDROID_RESPONSE,
			(msg: { action: string; data: string }) => {
				switch (msg.action) {
					case ANDROID_ACTION.RDSERVICE_INFO:
						processDiscoveryResponse(msg.data, true);
						afterScanComplete();
						break;

					case ANDROID_ACTION.RDSERVICE_DISCOVERY_FAILED:
						afterScanComplete();
						break;

					case ANDROID_ACTION.RDSERVICE_RESP:
						processCaptureResponse(msg.data);
						break;

					default:
						break;
				}
			}
		);

		return unsubscribe;
	}, [
		subscribe,
		TOPICS,
		processDiscoveryResponse,
		processCaptureResponse,
		afterScanComplete,
	]);

	// ================================ Auto-Discovery on Mount ================================

	useEffect(() => {
		if (
			disabled === false &&
			isVisible === true &&
			rdServiceList.length === 0
		) {
			const timer = setTimeout(() => {
				discoverRDServices();
			}, 10);
			return () => clearTimeout(timer);
		}
		return undefined;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [disabled, isVisible]);

	// ================================ Return ================================

	return {
		status,
		rdServiceList,
		selectedIndex,
		scanQuality,
		errorMessage,
		value,
		valueDecorated,
		scanProgress,
		forceShowDriverHelp,
		isValid,
		selectedServiceType,
		statusMessage,
		qualityLabel,
		captureBiometric,
		selectDevice,
		discoverRDServices,
		resetValue,
		setForceShowDriverHelp,
	};
};

export default useRDService;
