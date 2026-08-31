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

// Matches the legacy Connect widget's generic MOBILE param-type validation
// (tf-interaction-constants-behavior.html) — a valid Indian mobile number.
const MOBILE_REGEX = /^[6-9](?!0+$)[0-9]{9}$/;

/**
 * Step — Interaction 150 (AEPS Search Customer, card id 482). Confirmed to
 * need only the customer's mobile number — no amount/bank/biometric here;
 * those belong to Cashout (interaction 344), one step later.
 */
export const SearchCustomer = () => {
	const { state, actions, submitSearchCustomer } = useAepsContext();

	const isValid = MOBILE_REGEX.test(state.customerId);
	const isLoading = state.status === "loading";

	return (
		<VStack align="stretch" spacing={5}>
			<Box>
				{/* Matches connect-api's real reference label for this field
				    (parameters.id 8, name "customer_id") - "Customer's Mobile". */}
				<Text fontSize="sm" fontWeight="medium" mb={2}>
					Customer&apos;s Mobile
				</Text>
				<Input
					type="tel"
					inputMode="numeric"
					maxLength={10}
					value={state.customerId}
					onChange={(e) =>
						actions.setCustomerId(
							e.target.value.replace(/\D/g, "").slice(0, 10)
						)
					}
					placeholder="10-digit customer mobile"
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
				loadingText="Searching…"
				onClick={submitSearchCustomer}
			>
				Search Customer
			</Button>
		</VStack>
	);
};

export default SearchCustomer;
