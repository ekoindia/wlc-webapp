/**
 * @file Utility functions for UIDAI RD Service biometric device discovery and capture.
 * Contains XML parsers, PID options builders, quality scoring, and error code maps.
 * All functions are pure/stateless and can be used independently of React.
 */

// ================================ Types ================================

export type BiometricType = "face" | "iris" | "fingerprint";

export interface RDServiceInfo {
	/** Port the RD Service was found on (0 for Android) */
	port: number;
	/** Whether HTTPS was used for discovery */
	https: boolean;
	/** RD Service status string from XML (e.g. "READY", "NOTREADY") */
	status: string;
	/** Whether the device is ready for capture */
	ready: boolean;
	/** Raw discovery response XML */
	resp: string;
	/** Biometric type: face, iris, or fingerprint */
	type: BiometricType;
	/** Capture URL path (e.g. "/capture", "/rd/capture") */
	url: string;
	/** Human-readable device info string */
	info: string;
	/** Whether this device was discovered via Android bridge */
	is_android?: boolean;
	/** Android package name (for Android-discovered devices) */
	android_package?: string;
}

export interface CaptureResult {
	/** Error code from capture response ("0" = success) */
	errCode: string;
	/** Error message from capture response */
	errMsg: string;
	/** Quality score (0-100) */
	qScore: number;
}

// ================================ Constants ================================

/**
 * RD Service status codes.
 * Negative values indicate error states, 0 is searching, positive values are operational.
 */
export const RD_STATUS = {
	NO_RDSERVICE: -1,
	NO_SCANNER: -2,
	SCANNER_FAILED: -3,

	SEARCHING: 0,

	READY: 1,
	SCANNING: 2,
	SCAN_OK: 3,
} as const;

export type RDStatusValue = (typeof RD_STATUS)[keyof typeof RD_STATUS];

/**
 * Quality score thresholds for auto-retry and blocking.
 */
export const QUALITY_THRESHOLD = {
	/** Retry scan if quality below this level */
	RETRY: 45,
	/** Block scan if quality below this level */
	BLOCK: 25,
} as const;

/**
 * Maximum number of automatic capture retries on low quality.
 */
export const CAPTURE_RETRY_MAX = 2;

/**
 * Capture error codes mapped to human-readable messages.
 */
export const CAPTURE_ERROR_CODES: Record<number, string> = {
	210: "Protobuf format not supported",
	700: "Capture timed out",
	710: "Being used by another application",
	720: "Device not ready",
	730: "Capture Failed",
	740: "Device needs to be re-initialized",
	750: "RD Service does not support fingerprint",
	770: "Invalid URL",
	999: "Internal error",
};

/**
 * Port scan list for RD Service discovery.
 * Scans ports 11100-11120, both HTTP and HTTPS.
 */
export const RD_SERVICE_SCAN_LIST: Array<{
	port: number;
	https: boolean;
}> = (() => {
	const list: Array<{ port: number; https: boolean }> = [];

	// Primary ports (11100-11105): scan HTTP first, then HTTPS
	for (let port = 11100; port <= 11105; port++) {
		list.push({ port, https: false });
	}
	for (let port = 11100; port <= 11105; port++) {
		list.push({ port, https: true });
	}

	// Extended ports (11106-11120): interleave HTTP/HTTPS per port
	for (let port = 11106; port <= 11120; port++) {
		list.push({ port, https: false });
		list.push({ port, https: true });
	}

	return list;
})();

/**
 * Status messages for each RD status code.
 */
export const STATUS_MESSAGES: Record<number, string> = {
	[RD_STATUS.NO_RDSERVICE]: "Fingerprint device driver not running",
	[RD_STATUS.NO_SCANNER]: "Fingerprint device not found",
	[RD_STATUS.SCANNER_FAILED]: "Fingerprint scan failed",
	[RD_STATUS.SEARCHING]: "Searching for fingerprint device drivers…",
	[RD_STATUS.READY]: "Click here to capture fingerprint",
	[RD_STATUS.SCANNING]: "Waiting for scan",
	[RD_STATUS.SCAN_OK]: "Fingerprint Scanned",
};

// ================================ Detection ================================

/**
 * Detect RD Service type (fingerprint/face/iris) based on the response content.
 * @param {string} xml - The response string from RD Service discovery.
 * @returns {BiometricType} The detected RD Service type.
 */
export const detectRDServiceType = (xml: string): BiometricType => {
	const lower = xml ? xml.toLowerCase() : "";
	if (lower.includes(".face.")) {
		return "face";
	}
	if (lower.includes("iris")) {
		return "iris";
	}
	return "fingerprint";
};

// ================================ XML Parsing ================================

/**
 * Regex to extract error code, error info, and quality score from capture response.
 */
const CAPTURE_RESP_REGEX =
	/<Resp.+?errCode\s*=\s*['\"]\s*(-?[0-9]+)\s*['\"](?:.*?errInfo\s*=\s*['"]([^'"]+)['"])?(?:.*?qScore\s*=\s*['\"]\s*([0-9]+)\s*['\"])?/i;

/**
 * Parse the RD Service discovery response XML into a structured object.
 * @param {string} xml - Raw XML response string.
 * @param {number} port - Port the response came from (0 for Android).
 * @param {boolean} isHttps - Whether HTTPS was used.
 * @param {boolean} [fromAndroid] - Whether the response is from Android bridge.
 * @returns {RDServiceInfo | null} Parsed RDServiceInfo, or null if XML is invalid.
 */
export const parseRDServiceDiscoveryResponse = (
	xml: string,
	port: number,
	isHttps: boolean,
	fromAndroid: boolean = false
): RDServiceInfo | null => {
	const matchedStatus = xml.match(
		/<RDService.+?status\s*=\s*['"]([^'"]+)['"]/i
	);

	if (!matchedStatus?.[1] || matchedStatus[1].length <= 2) {
		return null;
	}

	const status = matchedStatus[1];
	const ready = status.toUpperCase() === "READY";
	const type = detectRDServiceType(xml);

	const rdDriver: RDServiceInfo = fromAndroid
		? {
				is_android: true,
				port: 0,
				https: false,
				status,
				ready,
				resp: xml,
				type,
				url: "/capture",
				info: "",
			}
		: {
				port,
				https: isHttps,
				status,
				ready,
				resp: xml,
				type,
				url: "/capture",
				info: "",
			};

	// Extract capture URL
	const matchedCapture = xml.match(
		/.*?<Interface\s+id\s*=\s*['"]CAPTURE['"]\s+path\s*=\s*['"]([^'"]+)['"]/i
	);
	if (matchedCapture?.[1] && matchedCapture[1].length > 3) {
		let captureUrl = matchedCapture[1]
			.replace(/[ \t]+/g, "")
			.replace(/^https?:\/\//i, "")
			.replace(/^:?\/?\/?\/?(?:127\.0\.0\.1|localhost):[0-9]+/i, "")
			.replace(/\/\/+/g, "/");

		if (!fromAndroid && !captureUrl.startsWith("/")) {
			captureUrl = "/" + captureUrl;
		}

		rdDriver.url = captureUrl || "/capture";
	}

	// Extract info
	const matchedInfo = xml.match(/<RDService.+?info\s*=\s*["']([^'"]+)["']/i);
	if (matchedInfo?.[1] && matchedInfo[1].length > 1) {
		rdDriver.info = matchedInfo[1];
	}

	// Extract Android package name
	if (fromAndroid) {
		const matchedPackage = xml.match(
			/<RD_SERVICE_ANDROID_PACKAGE=["']([^'"]+)["']/i
		);
		if (matchedPackage?.[1] && matchedPackage[1].length > 1) {
			rdDriver.android_package = matchedPackage[1];
		}
	}

	return rdDriver;
};

/**
 * Parse the biometric capture response XML.
 * @param {string} xml - Raw XML response from capture.
 * @returns {CaptureResult} Parsed capture result with error code, message, and quality score.
 */
export const parseCaptureResponse = (xml: string): CaptureResult => {
	const match = CAPTURE_RESP_REGEX.exec(xml);
	return {
		errCode: match?.[1] ?? "-1",
		errMsg: match?.[2] ?? "",
		qScore: match?.[3] ? parseInt(match[3], 10) : 0,
	};
};

// ================================ PID Options Builders ================================

/**
 * Build PidOptions XML for fingerprint or iris capture.
 * @param {BiometricType} type - Biometric type ("fingerprint" or "iris").
 * @param {string} wadh - The wadh parameter for PID options.
 * @param {number} [format] - PID format (0 = XML, 1 = Protobuf).
 * @returns {string} PidOptions XML string.
 */
export const buildPidOptions = (
	type: BiometricType,
	wadh: string,
	format: number = 0
): string => {
	const wadhAttr = wadh ? ` wadh="${wadh}"` : "";
	// Always use "P" for env due to bugs in Morpho/Mantra drivers
	const env = "P";

	if (type === "iris") {
		return `<PidOptions ver="1.0"><Opts iCount="1" iType="0" format="${format}" pidVer="2.0" timeout="30000" otp=""${wadhAttr} posh="UNKNOWN" env="${env}" /></PidOptions>`;
	}

	// Default: fingerprint
	return `<PidOptions ver="1.0"><Opts fCount="1" fType="2" format="${format}" pidVer="2.0" timeout="30000" otp=""${wadhAttr} posh="UNKNOWN" env="${env}" /></PidOptions>`;
};

/**
 * Build PidOptions XML for face authentication capture (Android only).
 * @param {string} [wadh] - The wadh parameter for face PID options.
 * @returns {string} PidOptions XML string for face capture.
 */
export const buildFacePidOptions = (wadh?: string): string => {
	const txnId = Math.floor(
		Math.random() * (9999999999999999 - 100000 + 1) + 100000
	).toString();
	const faceWadh = wadh || "sgydIC09zzy6f8Lb3xaAqzKquKe9lFcNR9uTvYxFp+A=";

	return (
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<PidOptions ver="1.0" env="P">\n` +
		`   <Opts fCount="" fType="" iCount="" iType="" pCount="" pType="" format="" pidVer="2.0" timeout="" otp="" wadh="${faceWadh}" posh="" />\n` +
		`   <CustOpts>\n` +
		`      <Param name="txnId" value="${txnId}"/>\n` +
		`      <Param name="purpose" value="auth"/>\n` +
		`      <Param name="language" value="en"/>\n` +
		`   </CustOpts>\n` +
		`</PidOptions>`
	);
};

// ================================ Quality Scoring ================================

/**
 * Map a numeric quality score to a human-readable label.
 * @param {number} score - Quality score (0-100).
 * @returns {"Great" | "Good" | "Average" | "Bad" | "Very Bad" | ""} Quality label string.
 */
export const getScanQualityLabel = (
	score: number
): "Great" | "Good" | "Average" | "Bad" | "Very Bad" | "" => {
	if (score > 70) return "Great";
	if (score > 55) return "Good";
	if (score > 35) return "Average";
	if (score > 25) return "Bad";
	if (score > 0) return "Very Bad";
	return "";
};

/**
 * Get the capture error message for a given error code.
 * Falls back to the provided errMsg if the code is unknown.
 * @param {string} code - Error code from capture response.
 * @param {string} errMsg - Error message from capture response (fallback).
 * @returns {string} Human-readable error message.
 */
export const getCaptureErrorMessage = (
	code: string,
	errMsg: string
): string => {
	const numCode = parseInt(code, 10);
	if (errMsg && (numCode === 999 || !(numCode in CAPTURE_ERROR_CODES))) {
		return `${errMsg} (${code})`;
	}
	return CAPTURE_ERROR_CODES[numCode] || errMsg || "Unknown error";
};

// ================================ URL Helpers ================================

/**
 * Build the full capture URL for a web-based RD Service.
 * @param {RDServiceInfo} rdService - The RD Service info object.
 * @returns {string} Full URL string for the capture endpoint.
 */
export const buildCaptureUrl = (rdService: RDServiceInfo): string => {
	if (!rdService || rdService.port === 0) return "";
	const protocol = rdService.https ? "https" : "http";
	return `${protocol}://127.0.0.1:${rdService.port}${rdService.url}`;
};

/**
 * Get the status message for a given RD status, adjusted for the biometric type.
 * @param {number} status - Current RD status code.
 * @param {BiometricType} [serviceType] - The biometric type of the selected service.
 * @returns {string} Status message string.
 */
export const getStatusMessage = (
	status: number,
	serviceType?: BiometricType
): string => {
	const msg = STATUS_MESSAGES[status] ?? "";

	if (serviceType === "face") {
		if (status === RD_STATUS.READY) return "Click to capture face";
		if (status === RD_STATUS.SCANNING) return "Waiting for face scan";
		if (status === RD_STATUS.SCAN_OK) return "Face Scanned";
		return msg.replace(/fingerprint/gi, "Face");
	}

	if (serviceType === "iris") {
		return msg.replace(/fingerprint/gi, "Iris");
	}

	return msg;
};

/**
 * Capitalize the first letter of a biometric type for display.
 * @param {BiometricType} [type] - BiometricType string.
 * @returns {string} Capitalized string (e.g. "Fingerprint", "Iris", "Face").
 */
export const capitalizeServiceType = (type?: BiometricType): string => {
	if (!type) return "Biometric";
	return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Synthetic Face RD Service response for Android when faceAuth is enabled.
 * Used to register a face RD service without actual port scanning.
 */
export const FACE_RD_SERVICE_RESPONSE =
	'<RDService info="AadhaarFaceRD Service" status="READY">\n' +
	'    <Interface id="CAPTURE" path="in.gov.uidai.rdservice.face.CAPTURE"/>\n' +
	'    <Interface id="DEVICEINFO" path="in.gov.uidai.rdservice.face.INFO"/>\n' +
	'</RDService><RD_SERVICE_ANDROID_PACKAGE="in.gov.uidai.facerd"  />';
