import { Box, Button, Icon, Text, VStack } from "@chakra-ui/react";
import {
	MdCheckCircle,
	MdError,
	MdHourglassEmpty,
	MdRefresh,
} from "react-icons/md";
import { useAepsContext } from "../context/AepsContext";

/**
 * Terminal step. Mirrors the legacy Connect widget's `tf-trxn-response-card`,
 * which models 3 distinct outcome states (Successful / Failed / Initiated),
 * not just a binary success/failure — a response_status_id of 2 ("Initiated",
 * e.g. Fingpay code 1465) means the transaction result isn't known yet, so it
 * must NOT be shown as either success or failure.
 *
 * Shared by two flows now — Cashout AND the Complete-KYC chain
 * (614->615->616, see CompleteKycBiometric's success path) - so copy/routing
 * is keyed by `state.resultContext` rather than being cashout-only.
 */
const RESULT_CONFIG = {
	cashout: {
		success: {
			icon: MdCheckCircle,
			color: "success",
			title: "Cashout Successful",
			buttonLabel: "New Cashout",
			buttonVariant: "primary" as const,
		},
		pending: {
			icon: MdHourglassEmpty,
			color: "orange.400",
			title: "Cashout Initiated",
			buttonLabel: "Done",
			buttonVariant: "outline" as const,
		},
		retry: {
			icon: MdRefresh,
			color: "blue.400",
			title: "Temporary Issue",
			buttonLabel: "Retry",
			buttonVariant: "outline" as const,
		},
		error: {
			icon: MdError,
			color: "error",
			title: "Cashout Failed",
			buttonLabel: "Try Again",
			buttonVariant: "outline" as const,
		},
	},
	kyc: {
		success: {
			icon: MdCheckCircle,
			color: "success",
			title: "KYC Completed Successfully",
			buttonLabel: "Continue",
			buttonVariant: "primary" as const,
		},
		pending: {
			icon: MdHourglassEmpty,
			color: "orange.400",
			title: "KYC Verification Pending",
			buttonLabel: "Done",
			buttonVariant: "outline" as const,
		},
		retry: {
			icon: MdRefresh,
			color: "blue.400",
			title: "Temporary Issue",
			buttonLabel: "Retry",
			buttonVariant: "outline" as const,
		},
		error: {
			icon: MdError,
			color: "error",
			title: "KYC Verification Failed",
			buttonLabel: "Try Again",
			buttonVariant: "outline" as const,
		},
	},
} as const;

export const ResultScreen = () => {
	const { state, actions } = useAepsContext();

	const resultKey =
		state.status === "success" ||
		state.status === "pending" ||
		state.status === "retry"
			? state.status
			: "error";
	const config = RESULT_CONFIG[state.resultContext][resultKey];

	// "retry" (e.g. Fingpay Status' unmapped 461) re-runs the same status
	// check in place, keeping the provider/session context — a full
	// `actions.reset()` would needlessly send the agent back to card
	// selection for what's likely a transient backend hiccup.
	const handleAction = (): void => {
		if (state.resultContext === "kyc") {
			// KYC success -> re-check Fingpay Status, which should now report
			// "already done" and carry on into the real cashout flow. KYC
			// error/retry -> restart the KYC submission itself.
			actions.setStep(
				resultKey === "success" ? "fingpayStatus" : "completeKyc"
			);
			return;
		}
		if (resultKey === "retry") {
			actions.setStep("fingpayStatus");
			return;
		}
		actions.reset();
	};

	return (
		<VStack align="stretch" spacing={5} py={6}>
			<VStack spacing={3}>
				<Icon as={config.icon} boxSize={12} color={config.color} />
				<Text fontSize="lg" fontWeight="bold">
					{config.title}
				</Text>
				{resultKey === "pending" && (
					<Text fontSize="sm" color="gray.600" textAlign="center">
						The bank hasn&apos;t confirmed this transaction yet.
						Please check the transaction history shortly for the
						final status before retrying.
					</Text>
				)}
				{resultKey === "retry" && (
					<Text fontSize="sm" color="gray.600" textAlign="center">
						{state.error ??
							"This looked like a temporary issue on the bank's side — please try again."}
					</Text>
				)}
				{state.error && resultKey === "error" && (
					<Text fontSize="sm" color="gray.600" textAlign="center">
						{state.error}
					</Text>
				)}
			</VStack>

			<Box>
				<Button
					variant={config.buttonVariant}
					size="lg"
					w="full"
					onClick={handleAction}
				>
					{config.buttonLabel}
				</Button>
			</Box>
		</VStack>
	);
};

export default ResultScreen;
