import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useSession, useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import router from "next/router";
import { useCallback, useEffect } from "react";
import { OnboardingWidget } from "../../components";

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

	// Refresh user profile on mount to ensure fresh data (e.g., after page reload)
	useEffect(() => {
		refreshAgentProfile();
	}, []);

	// MARK: JSX
	return (
		<Flex direction="column" minH="100vh" bg="bg">
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
