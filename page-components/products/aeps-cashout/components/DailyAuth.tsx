import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import { LocationCapture, Select } from "components";
import useBankList from "hooks/useBankList";
import { useState } from "react";
import UidaiFingerprintScanner from "tf-components/UidaiFingerprint/UidaiFingerprintScanner";
import { useAepsContext } from "../context/AepsContext";

const AADHAAR_REGEX = /^\d{12}$/;

/**
 * Step reached when Fingpay Status (155) reports the AGENT's daily biometric
 * re-authentication is pending — interaction 594 ("AePS Daily Authentication").
 *
 * This verifies the logged-in agent's OWN identity (their Aadhaar + bank +
 * fingerprint), not the customer's — required once per day before Fingpay
 * will process any customer transaction.
 *
 * The Aadhaar number entered here is RSA-encrypted client-side before
 * submission (AepsContext.submitDailyAuth fetches the key via
 * getAadhaarPublicKey() and applies utils/rsaEncrypt.ts) — this component
 * only collects the plaintext value from the user, it never sends it as-is.
 */
export const DailyAuth = () => {
	const { state, actions, submitDailyAuth } = useAepsContext();
	const { banks, isLoading: banksLoading } = useBankList();
	const [isScanValid, setIsScanValid] = useState(false);

	const isValid =
		Boolean(state.latLong) &&
		AADHAAR_REGEX.test(state.agentAadhaar) &&
		Boolean(state.agentBankCode) &&
		Boolean(state.agentPidBlock) &&
		isScanValid;

	const isLoading = state.status === "loading";

	return (
		<VStack align="stretch" spacing={5}>
			<Box>
				<Text fontSize="lg" fontWeight="bold" mb={1}>
					Daily Authentication Required
				</Text>
				<Text fontSize="sm" color="gray.500">
					Fingpay requires you to re-verify your own identity once a
					day before you can process customer transactions.
				</Text>
			</Box>

			<Box>
				<Text fontWeight="semibold" mb={2}>
					1. Location
				</Text>
				<LocationCapture onCaptured={actions.setLocation} />
			</Box>

			<Box>
				<Text fontWeight="semibold" mb={2}>
					2. Your Aadhaar Number
				</Text>
				<Input
					type="text"
					inputMode="numeric"
					maxLength={12}
					value={state.agentAadhaar}
					onChange={(e) =>
						actions.setAgentAadhaar(
							e.target.value.replace(/\D/g, "").slice(0, 12)
						)
					}
					placeholder="12-digit Aadhaar number"
					borderRadius="10"
					size="lg"
				/>
			</Box>

			<Box>
				<Text fontWeight="semibold" mb={2}>
					3. Bank Linked to Your Aadhaar
				</Text>
				<Select
					size="lg"
					placeholder={
						banksLoading ? "Loading banks…" : "Select bank"
					}
					disabled={banksLoading}
					options={banks}
					value={
						banks.find((b) => b.value === state.agentBankCode) ??
						null
					}
					onChange={(option) =>
						actions.setAgentBankCode(String(option?.value ?? ""))
					}
				/>
			</Box>

			<Box>
				<Text fontWeight="semibold" mb={2}>
					4. Biometric Capture
				</Text>
				<UidaiFingerprintScanner
					label="Scan Your Fingerprint"
					required
					hideBranding
					onChange={(value) => actions.setAgentPidBlock(value)}
					onValidation={setIsScanValid}
				/>
			</Box>

			{!state.latLong && (
				<Alert status="info" borderRadius="lg" fontSize="sm">
					<AlertIcon />
					Location is required before biometric capture can be
					verified.
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
				isDisabled={!isValid}
				isLoading={isLoading}
				loadingText="Verifying…"
				onClick={submitDailyAuth}
			>
				Continue
			</Button>
		</VStack>
	);
};

export default DailyAuth;
