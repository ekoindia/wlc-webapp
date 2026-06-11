import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useAppSource, useOrgDetailContext } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useState } from "react";
import { parseEnvBoolean } from "utils/envUtils";

/**
 * A custom hook to submit login request to the server process the login response (user profile data, tokens, etc)
 * @param {Function} login - The login function to call
 * @param {Function} setStep - Function to set the current step in the login process
 * @param {Function} setEmail - Function to set the email address for social login
 * @param {Function} setCachedSocialResponse - Function to set the cached social login response (used for mobile verification in social login)
 * @returns {[boolean, Function]} - Array containing busy state and submitLogin function
 */
function useLogin(login, setStep, setEmail, setCachedSocialResponse) {
	const [busy, setBusy] = useState(false);
	const toast = useToast();
	const { isAndroid } = useAppSource();

	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail || {};
	const { disable_self_onboarding } = metadata || {};

	const isSelfOnboardingDisabled =
		disable_self_onboarding?.value ||
		parseEnvBoolean(process.env.NEXT_PUBLIC_DISABLE_SELF_ONBOARDING) ||
		false;

	/**
	 * Login the user by fetching user profile & tokens.
	 * If successful set the login & user profile state of the app.
	 * @param {object} data The user data & other details
	 * @param {string} data.id_type The login type (Mobile/Google)
	 * @param {string} data.id_token The login id token for validation (OTP or Gmail token)
	 * @param {string} data.mobile The user's mobile number (for Mobile login)
	 * @param {string} data.org_id The organization ID
	 * @param {string} data.org_token A JWT token with org details (including org_id)
	 * @param {string} data.google_token_type The type of Google token ("credential" or "code")
	 */
	function submitLogin(data) {
		if (!data) return;

		setBusy(true);

		data = {
			...data,
			platform: isAndroid ? "android" : "web",
		};

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL +
				`${
					data.id_type === "Mobile"
						? Endpoints.LOGIN
						: Endpoints.GOOGLELOGIN
				}`,
			{
				body: data,
				timeout: 60000,
			}
		)
			.then((responseData) => {
				console.log("[useLogin] LOGIN RESPONSE >>>> ", {
					responseData,
					data,
				});
				console.log("LOGIN RESPONSE >>>> ", { data, responseData });

				if (
					!(
						(
							responseData &&
							responseData.details &&
							responseData.access_token
						) // &&
						// responseData.loggedIn === true
						// &&
						// responseData.details.code &&
						// responseData.details.mobile &&
						// responseData.details.mobile.toString().length > 6
					)
				) {
					console.log("[useLogin] access_token not found.");

					if (responseData.otpFailed) {
						console.log("[useLogin] Wrong OTP.");
						toast({
							title: "Wrong OTP. Please try again.",
							status: "error",
							duration: 5000,
						});
						return;
					}

					if (responseData.accountInactive) {
						console.log("[useLogin] Account is inactive.");
						toast({
							title: "Your account has been temporarily blocked.",
							description: "Please contact support.",
							status: "error",
							duration: null,
						});
						setStep("LOGIN");
						return;
					}

					// if (responseData.details.mobile === "1") {
					// 	processLoginResponse(responseData);
					// 	router.push("/signup");
					// 	return;
					// }
					// TODO: Start Onboarding Process
					console.log("[useLogin] Login Failed → Back to Login");

					// Login Failed
					console.log(
						"[useLogin] Verification Failed. Go Back to Login."
					);
					toast({
						title: "Login failed.",
						status: "error",
						duration: 5000,
					});
					setStep("LOGIN");
					return;
				}

				if (
					responseData?.details?.onboarding == 1 &&
					responseData?.details?.user_type === -1 &&
					data?.id_type === "Google"
				) {
					console.log(
						"[useLogin] Social Login: Need to verify mobile"
					);
					setStep("SOCIAL_VERIFY");
					setEmail(responseData.details.email);
					setCachedSocialResponse(responseData);
					return;
				}

				// Disable onboarding if Self-Onboarding is not allowed
				if (
					responseData?.details?.onboarding == 1 &&
					!responseData?.details?.code &&
					isSelfOnboardingDisabled
				) {
					console.log(
						"[useLogin] Self-Onboarding Disabled → User Not Found → Back to Login"
					);
					toast({
						title: "User not found!",
						status: "error",
						duration: 6000,
					});
					setStep("LOGIN");
					console.log(
						"[useLogin] Verification Failed. Self-Onboarding is disabled"
					);
					return;
				}

				// Social Signup → Verify mobile number before starting signup process
				// MARK: New Gmail
				if (
					responseData?.details?.user_type === -1 &&
					data?.id_type === "Google" &&
					responseData?.details?.email
				) {
					console.log(
						"[useLogin] Google Login → Social Verify (mobile number verification)."
					);
					setStep("SOCIAL_VERIFY");
					setEmail(responseData.details.email);
					setCachedSocialResponse(responseData);
					return;
				}

				// Login Success (or, signup of new user)
				// MARK: Success
				console.log(
					"[useLogin] Login Successful → Processing Login Response (dispatch `LOGIN` to UserReducer)"
				);
				login(responseData);
			})
			.catch((e) => {
				console.error("[useLogin] Login Error:", e);
				// TODO: Show toast message with server error (<Err object>.body.message - parse `body` from string to JSON)
				toast({
					title: "Login failed. Try again or contact support.",
					status: "error",
					duration: 5000,
				});
				setStep("LOGIN");
			})
			.finally(() => setBusy(false));
	}

	return [busy, submitLogin];
}

export default useLogin;
