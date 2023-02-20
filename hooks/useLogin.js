import { Endpoints } from "constants/EndPoints";
import { useState } from "react";

function useLogin(login, setStep, setEmail) {
	const [busy, setBusy] = useState(false);

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
				console.log("LOGIN RESPONSE >>>> ", res);

				if (!res.details.mobile) {
					throw new Error(res.message || "Something went wrong!");
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
						sessionKey: res.access_token_lite,
						userDetails: res.details,
						profileDetails: {
							account_details: res.account_details,
							personal_details: res.personal_details,
							shop_details: res.shop_details,
							extras: res.extras,
						},
					});
				}

				// toast.success("Logged in as " + data.details.name);
			})
			.catch((e) => {
				// toast.error("Login Failed. Please try again. ");
				console.error("Login Error: ", e);
			})
			.finally(() => setBusy(false));

		// login({
		//     userId: "#123456",
		//     sessionKey: "dsfsdjnfsj32423jbcs",
		//     userDetails: "sdfsfsdfsd",
		// });
	}

	return [busy, submitLogin];
}

export default useLogin;
