import { useUser } from "contexts";
import useFeatureFlag from "hooks/useFeatureFlag";
import { useMemo } from "react";
import { UPI_CASH_FEATURE_FLAG, UPI_CASH_MERCHANT_ROLE } from "../constants";
import type { UpiCashStatus } from "../types";

/** A single entry in the profile's `onboarding_steps` list. */
interface OnboardingStepEntry {
	role: number;
	label?: string;
}

/**
 * Resolve UPI Cash Withdrawal enablement + registration for the current agent.
 *
 * - **Enablement** — the optional staged-rollout feature flag on top of the backend
 *   role-gated menu. A non-enabled agent must never reach the flow (AC-5.1); the gate
 *   component refuses to render the product when `isEnabled` is false.
 * - **Registration** — the agent is registered once Fingpay merchant self-onboarding
 *   is complete. The backend signals a pending onboarding by including the merchant
 *   role in the profile's `onboarding_steps`; its presence therefore means
 *   "not yet registered" → route to onboarding (T-2), else → withdrawal (T-3).
 *
 * Branches only on structured profile data — never on message text.
 * @returns {UpiCashStatus} Resolved `{ isLoading, isEnabled, isRegistered }`.
 */
export const useUpiCashWithdrawalStatus = (): UpiCashStatus => {
	const { userData, loading } = useUser();
	const [isEnabled] = useFeatureFlag(UPI_CASH_FEATURE_FLAG);

	const onboardingSteps: OnboardingStepEntry[] = useMemo(
		() =>
			userData?.details?.onboarding_steps ??
			userData?.onboarding_steps ??
			[],
		[userData]
	);

	const isRegistered = useMemo(
		() =>
			!onboardingSteps.some(
				(step) => step?.role === UPI_CASH_MERCHANT_ROLE
			),
		[onboardingSteps]
	);

	return {
		isLoading: loading,
		isEnabled,
		isRegistered,
	};
};
