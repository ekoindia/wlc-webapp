import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { usePubSub } from "contexts";
import { useAppSource } from "contexts/AppSourceContext";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useSession, useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import router from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import { OnboardingWidget } from "../../components";
import type { OnboardingServices } from "../../contracts";

/**
 * An Onboarding component for self-onboarding of users.
 * Uses the OnboardingWidget with onboarding specific configuration.
 * @returns {JSX.Element} The rendered Onboarding component
 * @example
 * ```tsx
 * <Onboarding />
 * ```
 */
const Onboarding = () => {
	const { userData, updateUserInfo } = useUser();
	console.log("[AgentOnboarding] userData", userData);
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const { isAndroid } = useAppSource();
	const pubsub = usePubSub();
	const { orgDetail } = useOrgDetailContext();

	// Build the services object for the onboarding feature
	const services: OnboardingServices = useMemo(
		() => ({
			accessToken,
			generateNewToken,
			isAndroid,
			pubsub,
		}),
		[accessToken, generateNewToken, isAndroid, pubsub]
	);

	const isSelfOnboardingDisabled =
		orgDetail?.metadata?.disable_self_onboarding?.value ?? false;

	// Method to refresh user profile and update states
	const refreshAgentProfile = useCallback(async () => {
		try {
			const res = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL +
					Endpoints.REFRESH_PROFILE,
				{
					token: accessToken,
					body: {
						last_refresh_token: userData?.refresh_token,
					},
				},
				generateNewToken
			);

			// Check if states list needs to be captured on refresh
			updateUserInfo(res);

			if (
				res?.details?.onboarding !== 1 &&
				res?.details?.onboarding !== undefined &&
				res?.details?.onboarding !== null
			) {
				router.push("/home");
			}

			return res;
		} catch (err) {
			console.log("[Onboarding] Error refreshing agent profile:", err);
		}
	}, []);

	// Refresh user profile on mount to ensure fresh data (e.g., after page reload)
	useEffect(() => {
		refreshAgentProfile();
	}, []);

	// MARK: JSX
	return (
		<Flex direction="column" minH="100vh" bg="bg">
			<OnboardingWidget
				userData={userData}
				updateUserInfo={updateUserInfo}
				isAssistedOnboarding={false}
				refreshAgentProfile={refreshAgentProfile}
				services={services}
				orgMetadataOnboarding={orgDetail?.metadata?.onboarding}
				isSelfOnboardingDisabled={isSelfOnboardingDisabled}
			/>
		</Flex>
	);
};

export default Onboarding;
