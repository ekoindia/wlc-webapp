import { Alert, AlertIcon, Box, Button, Text, VStack } from "@chakra-ui/react";
import { useAepsContext } from "../context/AepsContext";

/**
 * Step reached from Fingpay Status's 1601 outcome ("Merchant eKYC pending").
 * Catalog 626 — confirmed live to be a pure static/informational screen: no
 * fields, no backend call (`interaction_type_id: null`, `parameter_list: []`
 * in its own schema). Its only job is showing this device-setup note and a
 * "Continue" button through to the real KYC submission (catalog 614).
 */
export const ChooseDevice = () => {
	const { actions } = useAepsContext();

	return (
		<VStack align="stretch" spacing={5}>
			<Box>
				<Text fontSize="lg" fontWeight="bold" mb={1}>
					Choose Your Device
				</Text>
				<Text fontSize="sm" color="gray.500">
					Before completing KYC, make sure your fingerprint device is
					connected.
				</Text>
			</Box>

			<Alert status="info" borderRadius="lg" fontSize="sm">
				<AlertIcon />
				For Oppo/Vivo phones, please enable OTG connector at Settings
				&gt; More (or Additional) Settings &gt; OTG.
			</Alert>

			<Button
				variant="primary"
				size="lg"
				onClick={() => actions.setStep("completeKyc")}
			>
				Continue
			</Button>
		</VStack>
	);
};

export default ChooseDevice;
