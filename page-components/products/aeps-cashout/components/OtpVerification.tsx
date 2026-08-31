import { Alert, AlertIcon, Box, Button, Text, VStack } from "@chakra-ui/react";
import { OtpInput } from "components";
import { useState } from "react";
import { AEPS_INTERACTION } from "../constants";
import { useAepsContext } from "../context/AepsContext";

/**
 * OTP Verification — shared by two contexts (see AepsOtpContext in
 * contracts.ts): customer-identity verification (interaction 103, confirmed
 * working) and bank-side cashout-amount OTP (unconfirmed resubmission
 * mechanism — see AEPS_INTERACTION.CASHOUT_OTP_VERIFY).
 *
 * TODO(OPEN ITEM, doc §4.4/§7): for the cashoutThreshold context specifically,
 * `submitOtp` will show an error until `AEPS_INTERACTION.CASHOUT_OTP_VERIFY`
 * is set (services/aepsService.ts / constants.ts).
 */
export const OtpVerification = () => {
	const { state, submitOtp } = useAepsContext();
	const [otp, setOtp] = useState("");

	const isCashoutOtp = state.otpContext === "cashoutThreshold";
	const isLoading = state.status === "loading";
	const isConfigured = isCashoutOtp
		? Boolean(AEPS_INTERACTION.CASHOUT_OTP_VERIFY)
		: Boolean(AEPS_INTERACTION.OTP_VERIFY);

	return (
		<VStack align="stretch" spacing={5}>
			<Box>
				<Text fontSize="sm" fontWeight="medium" mb={3}>
					{isCashoutOtp
						? "This amount requires bank-side OTP confirmation. Enter the OTP sent to the customer's registered mobile."
						: "Enter the OTP sent to the customer's bank-registered mobile."}
				</Text>
				<OtpInput value={otp} onChange={setOtp} length={6} />
			</Box>

			{!isConfigured && (
				<Alert status="warning" borderRadius="lg" fontSize="sm">
					<AlertIcon />
					{isCashoutOtp
						? "Bank-side cashout OTP verification isn't wired up yet — the resubmission reference (txnOtpRequestId) hasn't been confirmed with backend (open item)."
						: "OTP interaction is not configured yet — this is a pending open item (see doc §7)."}
				</Alert>
			)}

			{state.error && (
				<Alert status="error" borderRadius="lg" fontSize="sm">
					<AlertIcon />
					{state.error}
				</Alert>
			)}

			<Button
				variant="primary"
				size="lg"
				isDisabled={otp.length !== 6 || !isConfigured}
				isLoading={isLoading}
				loadingText="Verifying…"
				onClick={() => submitOtp(otp)}
			>
				Verify OTP
			</Button>
		</VStack>
	);
};

export default OtpVerification;
