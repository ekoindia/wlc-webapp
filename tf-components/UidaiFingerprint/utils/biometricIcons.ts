/**
 * @file Maps biometric types to icon names from the project's IconLibrary.
 */
import type { IconNameType } from "constants/IconLibrary";
import type { BiometricType } from "./rdServiceHelpers";

/**
 * Get the appropriate icon name for a given biometric type.
 * @param {BiometricType} [type] - The biometric type: 'face', 'iris', or 'fingerprint'.
 * @returns {IconNameType} The corresponding icon name from the IconLibrary.
 */
export const getBiometricIcon = (type?: BiometricType): IconNameType => {
	switch (type) {
		case "face":
			return "face-scan";
		case "iris":
			return "iris-scan";
		case "fingerprint":
		default:
			return "fingerprint";
	}
};

/**
 * Get the status indicator icon for an RD Service's ready state.
 * @param {boolean} ready - Whether the RD Service is ready.
 * @returns {IconNameType} Icon name for the status indicator.
 */
export const getRdStatusIcon = (ready: boolean): IconNameType => {
	return ready ? "check" : "error";
};
