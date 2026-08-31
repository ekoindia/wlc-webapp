import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { LocationCapture } from "components";
import { useEffect, useRef } from "react";
import { useAepsContext } from "../context/AepsContext";

/**
 * Step after provider selection — interaction 391 ("Fingpay Status").
 * This is the FIRST step in the chain that needs `state.latLong` (the
 * Fingpay Status call itself requires it, and every step after it does too)
 * - so location is captured here if missing, before firing. Previously
 * `LocationCapture` only lived on the Daily Auth step, which is skippable
 * (either via the "already done today" outcome, or a dev mock standing in
 * for it) - leaving `latLong` unset forever in that path and hard-blocking
 * Search Customer's own "Location is required first" guard with no UI
 * anywhere to satisfy it. Daily Auth keeps its own capture too, for a fresh
 * reading at that later, more sensitive (biometric) step.
 */
export const FingpayStatus = () => {
	const { state, actions, submitFingpayStatus } = useAepsContext();
	const hasFired = useRef(false);

	useEffect(() => {
		if (hasFired.current || !state.latLong) return;
		hasFired.current = true;
		submitFingpayStatus();
	}, [state.latLong, submitFingpayStatus]);

	if (!state.latLong) {
		return (
			<VStack align="stretch" spacing={4}>
				<Box>
					<Text fontSize="sm" color="gray.500">
						Location is required before checking Fingpay status.
					</Text>
				</Box>
				<LocationCapture onCaptured={actions.setLocation} />
			</VStack>
		);
	}

	return (
		<Center py={16}>
			<VStack spacing={4}>
				<Spinner size="lg" color="primary.DEFAULT" thickness="3px" />
				<Text fontSize="sm" color="gray.500">
					Checking Fingpay activation status…
				</Text>
			</VStack>
		</Center>
	);
};

export default FingpayStatus;
