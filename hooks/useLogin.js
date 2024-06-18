import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useAppSource, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useState } from "react";

/**
 *
 * @param login
 * @param setStep
 * @param setEmail
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

				// Login Success
				processLoginResponse(responseData);
			})
			.catch((e) => {
				console.error("Login Error: ", e);
			})
			.finally(() => setBusy(false));
	}

	return [busy, submitLogin];
}

export default useLogin;
