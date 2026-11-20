import { Flex, Spinner, Text } from "@chakra-ui/react";
import { PageTitle } from "components";
import { useUpiCashWithdrawalStatus } from "./hooks";
import { Onboarding } from "./Onboarding";
import { Withdrawal } from "./Withdrawal";

/**
 * UPI Cash Withdrawal gate — the product's landing component.
 *
 * On open it resolves enablement + registration and routes with no provider step:
 * - not enabled   → nothing (page-level route guard; a non-enabled agent must never
 *                   reach the product — AC-5.1). The menu already hides it (AC-1.1);
 *                   this is defence-in-depth for a deep-linked URL.
 * - not registered → self-onboarding entry (T-2 — AC-1.3).
 * - registered     → withdrawal flow (T-3/T-4 — AC-1.3).
 *
 * Admins in agent-view resolve the same way, so an enabled org's admin can transact
 * (AC-1.2).
 * @returns {JSX.Element} The resolved step for the current agent.
 */
export const UpiCashWithdrawal = (): JSX.Element => {
	const { isLoading, isEnabled, isRegistered } = useUpiCashWithdrawalStatus();

	if (isLoading) {
		return (
			<Flex justify="center" py={10} data-testid="upi-cash-loading">
				<Spinner />
			</Flex>
		);
	}

	if (!isEnabled) {
		return (
			<Flex direction="column" gap={2} data-testid="upi-cash-not-enabled">
				<PageTitle title="UPI Cash Withdrawal" />
				<Text color="gray.600">
					This product isn’t available on your account.
				</Text>
			</Flex>
		);
	}

	return isRegistered ? <Withdrawal /> : <Onboarding />;
};
