/**
 * @file UidaiFingerprintScanner — Main wrapper component for UIDAI biometric capture.
 * Orchestrates ScannerButton, ScannerStatus, RDServiceList, and SetupHelpGuide.
 */
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { Icon } from "components";
import useRDService from "hooks/useRDService";
import { memo, useEffect, useRef } from "react";
import RDServiceList from "./RDServiceList";
import ScannerButton from "./ScannerButton";
import ScannerStatus from "./ScannerStatus";
import SetupHelpGuide from "./SetupHelpGuide";
import { RD_STATUS } from "./utils/rdServiceHelpers";

// ================================ Types ================================

export interface UidaiFingerprintScannerProps {
	/** Label text for the scanner field */
	label?: string;
	/** Whether the field is required */
	required?: boolean;
	/** Hide the "(optional)" mark */
	hideOptionalMark?: boolean;
	/** Whether the scanner is disabled */
	disabled?: boolean;
	/** Whether the scanner is currently visible */
	isVisible?: boolean;
	/** UIDAI wadh parameter */
	uidaiWadh?: string;
	/** PID format: 0 = XML, 1 = Protobuf */
	pidFormat?: number;
	/** Extra options (stringified JSON or object) */
	options?: string | Record<string, unknown>;
	/** Current value from parent (for controlled mode) */
	value?: string;
	/** Callback when capture value changes */
	onChange?: (_value: string, _decorated: string) => void;
	/** Callback when validation state changes */
	onValidation?: (_isValid: boolean) => void;
	/** Hide Eko branding (e.g. Connect app links) */
	hideBranding?: boolean;
}

// ================================ Component ================================

const UidaiFingerprintScanner = ({
	label,
	required = false,
	hideOptionalMark = false,
	disabled = false,
	isVisible = true,
	uidaiWadh,
	pidFormat,
	options,
	value: controlledValue,
	onChange,
	onValidation,
	hideBranding = false,
}: UidaiFingerprintScannerProps): JSX.Element => {
	const {
		status,
		rdServiceList,
		selectedIndex,
		scanQuality,
		errorMessage,
		isValid,
		scanProgress,
		forceShowDriverHelp,
		selectedServiceType,
		statusMessage,
		qualityLabel,
		captureBiometric,
		selectDevice,
		discoverRDServices,
		resetValue,
		setForceShowDriverHelp,
	} = useRDService({
		uidaiWadh,
		pidFormat,
		disabled,
		isVisible,
		options,
		onCapture: onChange,
	});

	// ---- Sync controlled value ----
	const prevControlledValue = useRef(controlledValue);
	useEffect(() => {
		if (
			controlledValue !== undefined &&
			controlledValue !== prevControlledValue.current
		) {
			prevControlledValue.current = controlledValue;
			if (!controlledValue) {
				resetValue();
			}
		}
	}, [controlledValue, resetValue]);

	// ---- Sync validation state ----
	useEffect(() => {
		onValidation?.(isValid);
	}, [isValid, onValidation]);

	const showSetupHelp =
		(status === RD_STATUS.NO_RDSERVICE || forceShowDriverHelp) &&
		selectedServiceType !== "face";

	const invalid =
		status === RD_STATUS.SCANNER_FAILED || status < RD_STATUS.SEARCHING;

	return (
		<VStack
			id="uidai-fingerprint-scanner"
			align="stretch"
			spacing={2}
			w="100%"
		>
			{/* Row: Button + Status */}
			<HStack align="flex-start" spacing={3}>
				<ScannerButton
					status={status}
					serviceType={selectedServiceType}
					disabled={disabled}
					onClick={captureBiometric}
				/>
				<ScannerStatus
					label={label}
					required={required}
					hideOptionalMark={hideOptionalMark}
					status={status}
					statusMessage={statusMessage}
					errorMessage={errorMessage}
					invalid={invalid}
					scanQuality={scanQuality}
					qualityLabel={qualityLabel}
					scanProgress={scanProgress}
					onClick={captureBiometric}
				/>
			</HStack>

			{/* Discovered devices list */}
			{rdServiceList.length > 1 ? (
				<RDServiceList
					rdServiceList={rdServiceList}
					selectedIndex={selectedIndex}
					onSelect={selectDevice}
				/>
			) : null}

			{/* Setup new device button (shown when devices found) */}
			{rdServiceList.length > 0 &&
			status !== RD_STATUS.SEARCHING &&
			selectedServiceType !== "face" ? (
				<Box>
					<Button
						variant="link"
						size="sm"
						color="primary.DEFAULT"
						leftIcon={<Icon name="add" size="sm" />}
						onClick={() =>
							setForceShowDriverHelp(!forceShowDriverHelp)
						}
					>
						{forceShowDriverHelp
							? "Hide Setup Guide"
							: "Setup New Device"}
					</Button>
				</Box>
			) : null}

			{/* Setup help guide */}
			{showSetupHelp ? (
				<SetupHelpGuide
					rdServiceType={selectedServiceType}
					hideBranding={hideBranding}
					allowRefresh={true}
					onRefresh={discoverRDServices}
				/>
			) : null}
		</VStack>
	);
};

export default memo(UidaiFingerprintScanner);
