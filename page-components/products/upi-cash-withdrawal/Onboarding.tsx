import { Flex, Text } from "@chakra-ui/react";
import { Button, PageTitle } from "components";
import { useRouter } from "next/router";

/**
 * Onboarding entry — shown to an enabled-but-not-yet-registered agent. The agent
 * completes Fingpay merchant self-onboarding themselves (no admin, no biometric).
 *
 * T-1 ships this entry point so the gate's routing is complete and testable; the
 * actual self-onboarding step (interaction 365) is wired in T-2 (#628) via
 * `features/onboarding` `masterOnboardingSteps` and the `/signup` self flow.
 * @returns {JSX.Element} The self-onboarding entry for a not-registered agent.
 */
export const Onboarding = (): JSX.Element => {
	const router = useRouter();

	return (
		<Flex direction="column" gap={4} data-testid="upi-cash-onboarding">
			<PageTitle title="Activate UPI Cash Withdrawal" />
			<Text color="gray.600">
				Complete a one-time merchant registration to start accepting UPI
				cash withdrawals. It only takes a few minutes and you can do it
				yourself.
			</Text>
			<Button width="fit-content" onClick={() => router.push("/signup")}>
				Start registration
			</Button>
		</Flex>
	);
};
