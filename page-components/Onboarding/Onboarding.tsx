import { Flex } from "@chakra-ui/react";
import { OnboardingWidget } from "components";
import { Endpoints } from "constants/EndPoints";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useSession, useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import router from "next/router";
import { useCallback } from "react";

/**
 * An Onboarding component for onboarding of agents
 * Uses the OnboardingWidget with onboarding specific configuration
 * @returns {JSX.Element} The rendered Onboarding component
 * @example
 * ```tsx
 * <Onboarding />
 * ```
 */
const Onboarding = () => {
	const { userData, updateUserInfo } = useUser();
	console.log("[AgentOnboarding] userData", userData);
	const { orgDetail } = useOrgDetailContext();
	const { logo, app_name, org_name } = orgDetail ?? {};
	const { generateNewToken } = useRefreshToken();
	const { accessToken } = useSession();
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
	// MARK: JSX
	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			bg="bg"
			h="100%"
			minH="100%"
			w="100%"
		>
			<OnboardingWidget
				logo={logo}
				appName={app_name}
				orgName={org_name}
				userData={userData}
				updateUserInfo={updateUserInfo}
				isAssistedOnboarding={false}
				refreshAgentProfile={refreshAgentProfile}
			/>
		</Flex>
	);
};

export default Onboarding;
