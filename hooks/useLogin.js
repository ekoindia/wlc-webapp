import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useRouter } from "next/router";
import { useState } from "react";

function useLogin(login, setStep, setEmail) {
	const { login: processLoginResponse } = useUser();
	const [busy, setBusy] = useState(false);
	const toast = useToast();
	const router = useRouter();

	function submitLogin(data) {
		setBusy(true);
		// if (true) {
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
						responseData &&
						responseData.details &&
						responseData.access_token &&
						responseData.details.code &&
						responseData.details.mobile &&
						responseData.details.mobile.toString().length > 6
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
						responseData.details.user_type === -1 &&
						data.id_type === "Google"
					) {
						console.log("Setting states");

						setStep("SOCIAL_VERIFY");
						setEmail(responseData.details.email);
						return;
					}

					if (responseData.details.mobile === "1") {
						processLoginResponse(responseData);

						router.push("/signup");
						return;
					}
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
		// }
		// else
		// 	processLoginResponse({
		// 		auth_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
		// 		access_token:
		// 			"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiOTQwNjkyMTczMiIsInJvbGVfbGlzdCI6WyIxMjQwMCIsIjE1MDAwIiwiMTYwMDAiLCI4MDAiXSwidXNlcl90eXBlIjozLCJla29fdXNlcl9pZCI6MjAwMDM3LCJlbWFpbCI6ImlzaHViaGphaW4zMEBnbWFpbC5jb20iLCJjb2RlIjoiMTAwMDA2MTAiLCJ6b2hvX2lkIjoiIiwiaWF0IjoxNjgwNDk5MDM3LCJleHAiOjE2ODA1MTcwMzcsImF1ZCI6Ijk0MDY5MjE3MzIiLCJpc3MiOiJjb25uZWN0LmVrbyJ9.FFZM0TPda65xZJReY1h6wUZ27qJVXerHba199e_hxZY",
		// 		refresh_token: "$2b$10$nO6gkwZ7qQc...",
		// 		long_session: false,
		// 		token_expiration: 18000,
		// 		details: {
		// 			alternate_mobiles: [],
		// 			code: "99094675",
		// 			contacts: [
		// 				{
		// 					cellnumber: "8045681393",
		// 					name: "Customer Support",
		// 					email: "cs@eko.co.in",
		// 					relation: "",
		// 				},
		// 			],
		// 			date_of_joining: "2020-07-13 14:21:18",
		// 			email: "testdistributor32@gmail.com",
		// 			login_id: 2886068045,
		// 			mobile: "8888888888",
		// 			name: "Shubh Enterprises",
		// 			onboarding: 0,
		// 			pic: "https://lh3.googleusercontent.com/a/AGNmyxaHRKHCkLmpHKiehZhbpljGiFNCNAl5PkOX4vCz=s96-c",
		// 			uid: 197950,
		// 			user_type: 3,
		// 			zoho_id: "",
		// 		},
		// 	});
	}

	return [busy, submitLogin];
}

export default useLogin;
