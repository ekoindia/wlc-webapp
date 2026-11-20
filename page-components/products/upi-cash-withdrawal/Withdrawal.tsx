import { Flex, Text } from "@chakra-ui/react";
import { PageTitle } from "components";

/**
 * Withdrawal step — amount + location + QR (T-3 #629) and status polling + hard
 * cash-gate (T-4 #630). T-1 ships it as the registered-agent landing so the gate's
 * routing is complete and testable; the transaction UI is built in T-3/T-4.
 * @returns {JSX.Element} The withdrawal landing for a registered agent.
 */
export const Withdrawal = (): JSX.Element => {
	return (
		<Flex direction="column" gap={4} data-testid="upi-cash-withdrawal">
			<PageTitle title="UPI Cash Withdrawal" />
			<Text color="gray.600">
				Enter an amount to generate a UPI QR. Your customer scans it
				from their own phone and pays with their own UPI PIN.
			</Text>
		</Flex>
	);
};
