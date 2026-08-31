import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useAepsContext } from "../context/AepsContext";

const OTP_REGEX = /^\d{6,7}$/;

/**
 * Step 2 of the Complete-KYC chain (interaction 615, wire 542) — reached
 * after 614/540 returns `1600`. Verifies the OTP sent to the merchant's
 * registered mobile by step 1. See VerifyKycOtpPayload in contracts.ts.
 */
export const VerifyKycOtp = () => {
	const { state, actions, submitVerifyKycOtp } = useAepsContext();

	const isValid = OTP_REGEX.test(state.kycOtp);
	const isLoading = state.status === "loading";

	return (
		<VStack align="stretch" spacing={5}>
			<Box>
				<Text fontSize="lg" fontWeight="bold" mb={1}>
					Verify OTP
				</Text>
				<Text fontSize="sm" color="gray.500">
					Enter the OTP sent to your registered mobile number to
					continue your KYC.
				</Text>
			</Box>

			<Input
				type="text"
				inputMode="numeric"
				maxLength={7}
				value={state.kycOtp}
				onChange={(e) =>
					actions.setKycOtp(
						e.target.value.replace(/\D/g, "").slice(0, 7)
					)
				}
				placeholder="Enter OTP"
				borderRadius="10"
				size="lg"
			/>

			{state.error && (
				<Alert status="error" borderRadius="lg" fontSize="sm">
					<AlertIcon />
					{state.error}
				</Alert>
			)}

			<Button
				variant="primary"
				size="lg"
				isDisabled={!isValid}
				isLoading={isLoading}
				loadingText="Verifying…"
				onClick={submitVerifyKycOtp}
			>
				Verify OTP
			</Button>
		</VStack>
	);
};

export default VerifyKycOtp;
