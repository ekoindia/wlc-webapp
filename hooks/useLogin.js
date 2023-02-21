import { Endpoints } from "constants/EndPoints";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

function useLogin(login, setStep, setEmail) {
	const [busy, setBusy] = useState(false);
	const toast = useToast();
	function submitLogin(data) {
		setBusy(true);
		console.log("Data", JSON.stringify(data));

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
			.then((res) => {
				console.log("LOGIN RESPONSE >>>> ", res.status);

				if (res.status === 302) {
					toast({
						title: "Please Enter Correct OTP or resend ",
						status: "error",
						duration: 1000,
						isClosable: true,
						position: "top-right",
					});
				}

				if (
					res.details.mobile.length < 7 &&
					res.details.user_type === -1 &&
					data.id_type === "Google"
				) {
					console.log("Setting states");

					setEmail(res.details.email);
					setStep("GOOGLE_VERIFY");
				} else {
					login({
						userId: res.details.mobile,
						sessionKey: res.access_token,
						userDetails: res.details,
						profileDetails: {
							account_details: res.account_details,
							personal_details: res.personal_details,
							shop_details: res.shop_details,
							extras: res.extras,
						},
					});
				}
			})
			.catch((e) => {
				console.error("Login Error: ", e);
			})
			.finally(() => setBusy(false));
	}

	return [busy, submitLogin];
}

export default useLogin;
