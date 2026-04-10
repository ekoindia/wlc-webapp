/**
 * @file ScannerStatus — Displays label, status message, error, quality score, and progress bar.
 */
import { Progress, Text, VStack } from "@chakra-ui/react";
import { Icon } from "components";
import { memo } from "react";
import type { RDStatusValue } from "./utils/rdServiceHelpers";
import { RD_STATUS } from "./utils/rdServiceHelpers";

interface ScannerStatusProps {
	label?: string;
	required?: boolean;
	hideOptionalMark?: boolean;
	status: RDStatusValue;
	statusMessage: string;
	errorMessage: string;
	invalid?: boolean;
	scanQuality: number;
	qualityLabel: string;
	scanProgress: { current: number; total: number };
	onClick: () => void;
}

const getQualityColor = (label: string): string => {
	if (label === "Great" || label === "Good") return "success";
	if (label === "Bad" || label === "Very Bad") return "error";
	return "inherit";
};

const getSecondaryIcon = (
	status: RDStatusValue
): { icon: string; text: string } => {
	if (status < RD_STATUS.SEARCHING) return { icon: "reload", text: "Retry" };
	if (status === RD_STATUS.SCANNING)
		return { icon: "fingerprint", text: "Scanning" };
	if (status === RD_STATUS.SCAN_OK) return { icon: "check", text: "" };
	return { icon: "", text: "" };
};

const ScannerStatus = ({
	label,
	required = false,
	hideOptionalMark = false,
	status,
	statusMessage,
	errorMessage,
	invalid = false,
	scanQuality,
	qualityLabel,
	scanProgress,
	onClick,
}: ScannerStatusProps): JSX.Element => {
	const { icon: secIcon, text: secText } = getSecondaryIcon(status);

	// Build display label with optional mark
	let displayLabel = label ?? "";
	if (
		!required &&
		!hideOptionalMark &&
		displayLabel &&
		!displayLabel.toLowerCase().includes("optional")
	) {
		displayLabel += " (optional)";
	}

	return (
		<VStack align="start" spacing={0} flex={1}>
			{displayLabel ? (
				<Text
					fontSize="12px"
					fontWeight={400}
					color={
						invalid
							? "error"
							: "var(--chakra-colors-gray-500, #9e9e9e)"
					}
					pb="0.2em"
				>
					{displayLabel}
				</Text>
			) : null}

			<Text
				fontSize="0.9em"
				fontWeight={400}
				cursor="pointer"
				onClick={onClick}
			>
				{statusMessage}
			</Text>

			{invalid && errorMessage ? (
				<Text fontSize="12px" lineHeight="18px" color="error">
					{errorMessage}
				</Text>
			) : null}

			{scanQuality > 0 ? (
				<Text fontSize="0.8em" fontWeight={400}>
					Quality:{" "}
					<Text as="strong" color={getQualityColor(qualityLabel)}>
						{scanQuality}%&nbsp;({qualityLabel})
					</Text>
				</Text>
			) : null}

			{status === RD_STATUS.SEARCHING ? (
				<Progress
					size="xs"
					w="100%"
					mt={1}
					colorScheme="primary"
					isIndeterminate={scanProgress.total === 0}
					min={0}
					max={scanProgress.total || 1}
					value={scanProgress.current}
				/>
			) : null}

			{secIcon ? (
				<Text
					display="inline-flex"
					alignItems="center"
					gap={1}
					fontSize="14px"
					color="primary.DEFAULT"
					cursor="pointer"
					onClick={onClick}
					mt={1}
				>
					<Icon name={secIcon} size="sm" />
					{secText}
				</Text>
			) : null}
		</VStack>
	);
};

export default memo(ScannerStatus);
