import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useAppSource, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useState } from "react";
import { parseEnvBoolean } from "utils/envUtils";

/**
 * A custom hook to submit login request to the server process the login response (user profile data, tokens, etc)
 * @param {Function} login - The login function to call
 * @param {Function} setStep - Function to set the current step in the login process
 * @param {Function} setEmail - Function to set the email address for social login
 */
function useLogin(login, setStep, setEmail) {
	const { login: processLoginResponse } = useUser();
	const [busy, setBusy] = useState(false);
	const toast = useToast();
	const { isAndroid } = useAppSource();

	/**
	 * Login the user by fetching user profile & tokens.
	 * If successful set the login & user profile state of the app.
	 * @param {object} data The user data & other details
	 * @param {string} data.id_type The login type (Mobile/Google)
	 * @param {string} data.id_token The login id token for validation (OTP or Gmail token)
	 * @param {string} data.mobile The user's mobile number (for Mobile login)
	 * @param {string} data.org_id The organization ID
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
				console.log("LOGIN RESPONSE >>>> ", responseData);

				if (
					!(
						(
							responseData &&
							responseData.details &&
							responseData.access_token
						) // &&
						// responseData.details.code &&
						// responseData.details.mobile &&
						// responseData.details.mobile.toString().length > 6
					)
				) {
					if (responseData.otpFailed) {
						toast({
							title: "Wrong OTP. Please try again.",
							status: "error",
							duration: 5000,
						});
						return;
					}

					if (responseData.accountInactive) {
						toast({
							title: "Your account has been temporarily blocked.",
							description: "Please contact support.",
							status: "error",
							duration: null,
						});
						setStep("LOGIN");
						return;
					}

					if (
						responseData?.details?.user_type === -1 &&
						data?.id_type === "Google"
					) {
						console.log("Setting states");

						setStep("SOCIAL_VERIFY");
						setEmail(responseData.details.email);
						return;
					}

					// if (responseData.details.mobile === "1") {
					// 	processLoginResponse(responseData);
					// 	router.push("/signup");
					// 	return;
					// }
					// TODO: Start Onboarding Process
					// Login Failed
					toast({
						title: "Login failed.",
						status: "error",
						duration: 5000,
					});
					setStep("LOGIN");
					return;
				}

				// Disable onboarding if Self-Onboarding is not allowed
				if (
					responseData?.details?.onboarding == 1 &&
					!responseData?.details?.code &&
					parseEnvBoolean(
						process.env.NEXT_PUBLIC_DISABLE_SELF_ONBOARDING
					)
				) {
					toast({
						title: "User not found!",
						status: "error",
						duration: 6000,
					});
					setStep("LOGIN");
					return;
				}

				// Login Success
				processLoginResponse(responseData);
			})
			.catch((e) => {
				console.error("Login Error:", e);
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
