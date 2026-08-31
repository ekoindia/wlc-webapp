import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import { LocationCapture } from "components";
import { useAepsContext } from "../context/AepsContext";

const AADHAAR_REGEX = /^\d{12}$/;

/**
 * Step — Interaction 614 "Complete Your KYC" (wire interaction_type_id 540).
 * Only needs the agent's own Aadhaar + location — no piddata/bank_code here
 * (that's the biometric step, see CompleteKycBiometric). This is step 1 of a
 * 3-step chain: submitting here sends an OTP; see CompleteKycPayload in
 * contracts.ts for the full chain and a known backend issue on this call.
 */
export const CompleteKyc = () => {
	const { state, actions, submitCompleteKyc } = useAepsContext();

	const isValid =
		Boolean(state.latLong) && AADHAAR_REGEX.test(state.agentAadhaar);
	const isLoading = state.status === "loading";

	return (
		<VStack align="stretch" spacing={5}>
			<Box>
				<Text fontSize="lg" fontWeight="bold" mb={1}>
					Complete Your KYC
				</Text>
				<Text fontSize="sm" color="gray.500">
					Your Aadhaar-linked eKYC is pending. Verify your own Aadhaar
					number to continue.
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
				onClick={submitCompleteKyc}
			>
				Submit KYC
			</Button>
		</VStack>
	);
};

export default CompleteKyc;
