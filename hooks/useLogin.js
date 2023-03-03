import { Endpoints } from "constants/EndPoints";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useUser } from "contexts/UserContext";

function useLogin(login, setStep, setEmail) {
	const { login: processLoginResponse } = useUser();
	const [busy, setBusy] = useState(false);
	const toast = useToast();

	function submitLogin(data) {
		setBusy(true);
		console.log("Data", JSON.stringify(data));
		if (true) {
			fetch(
				process.env.NEXT_PUBLIC_API_AUTHENTICATION_URL +
					`${
						data.id_type === "Mobile"
							? Endpoints.LOGIN
							: Endpoints.GOOGLELOGIN
					}`,
				{
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify(data),
				}
			)
				.then((response) => {
					console.log(response);
					if (response.ok) {
						return response.json();
					} else {
						const err = new Error(
							response.message || "Response not Ok"
						);
						err.response = response;
						throw err;
					}
				})
				.then((responseData) => {
					console.log("LOGIN RESPONSE >>>> ", responseData.status);

					if (responseData.status === 302) {
						toast({
							title: "Please Enter Correct OTP or resend ",
							status: "error",
							duration: 1000,
							isClosable: true,
							position: "top-right",
						});
					}

					if (
						responseData.details.mobile.length < 7 &&
						responseData.details.user_type === -1 &&
						data.id_type === "Google"
					) {
						console.log("Setting states");

						setEmail(res.details.email);
						setStep("GOOGLE_VERIFY");
					} else {
						processLoginResponse(responseData);

						// ProcessLoginResponse({
						// 	userId: res.details.mobile,
						// 	sessionKey: res.access_token,
						// 	userDetails: res.details,
						// 	profileDetails: {
						// 		account_details: res.account_details,
						// 		personal_details: res.personal_details,
						// 		shop_details: res.shop_details,
						// 		extras: res.extras,
						// 	},
						// });
					}
				})
				.catch((e) => {
					console.error("Login Error: ", e);
				})
				.finally(() => setBusy(false));
		} else
			processLoginResponse({
				auth_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
				access_token: "eyJ0eXAiOiiJ9.eyJ1c2VyX2lkIjoi",
				refresh_token: "$2b$10$nO6gkwZ7qQc...",
				long_session: false,
				token_expiration: 18000,
				details: {
					user_type: -1,
					mobile: "1",
					role_list: "-1",
					login_id: "",
					name: "",
					email: "xyz@gmail.com",
					code: "",
					zoho_id: "",
					pic: "https://lh3.googleusercontent.com/a/AEdFTp6UQoU...",
					show_dashboard: 0,
					tf_config_rev: "1405",
				},
			});
	}

	return [busy, submitLogin];
}

export default useLogin;
