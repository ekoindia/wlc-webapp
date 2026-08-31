import { Alert, AlertIcon, Box, Button, Text, VStack } from "@chakra-ui/react";
import { Select } from "components";
import useBankList from "hooks/useBankList";
import { useState } from "react";
import UidaiFingerprintScanner from "tf-components/UidaiFingerprint/UidaiFingerprintScanner";
import { useAepsContext } from "../context/AepsContext";

/**
 * Step 3 (final) of the Complete-KYC chain (interaction 616, wire 543) —
 * reached after 615/542 returns `1604`. Needs a bank selection and a real
 * fingerprint scan; on success the KYC chain is fully complete. See
 * CompleteKycBiometricPayload in contracts.ts.
 */
export const CompleteKycBiometric = () => {
	const { state, actions, submitCompleteKycBiometric } = useAepsContext();
	const { banks, isLoading: banksLoading } = useBankList();
	const [isScanValid, setIsScanValid] = useState(false);

	const isValid =
		Boolean(state.kycBankCode) && Boolean(state.kycPidBlock) && isScanValid;
	const isLoading = state.status === "loading";

	return (
		<VStack align="stretch" spacing={5}>
			<Box>
				<Text fontSize="lg" fontWeight="bold" mb={1}>
					Complete Biometric Verification
				</Text>
				<Text fontSize="sm" color="gray.500">
					Select the bank linked to your Aadhaar and scan your
					fingerprint to finish KYC.
				</Text>
			</Box>

			<Box>
				<Text fontWeight="semibold" mb={2}>
					1. Bank Linked to Your Aadhaar
				</Text>
				<Select
					size="lg"
					placeholder={
						banksLoading ? "Loading banks…" : "Select bank"
					}
					disabled={banksLoading}
					options={banks}
					value={
						banks.find((b) => b.value === state.kycBankCode) ?? null
					}
					onChange={(option) =>
						actions.setKycBankCode(String(option?.value ?? ""))
					}
				/>
			</Box>

			<Box>
				<Text fontWeight="semibold" mb={2}>
					2. Biometric Capture
				</Text>
				<UidaiFingerprintScanner
					label="Scan Your Fingerprint"
					required
					hideBranding
					onChange={(value) => actions.setKycPidBlock(value)}
					onValidation={setIsScanValid}
				/>
			</Box>

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
				loadingText="Submitting…"
				onClick={submitCompleteKycBiometric}
			>
				Complete KYC
			</Button>
		</VStack>
	);
};

export default CompleteKycBiometric;
