import { Endpoints } from "constants/EndPoints";
import { useState } from "react";

function useLogin(login, setStep, setEmail) {
	const [busy, setBusy] = useState(false);

	function submitLogin(data) {
		setBusy(true);
		console.log("Data", JSON.stringify(data));

		fetch(
			process.env.NEXT_PUBLIC_API_AUTHENTICATION_URL + Endpoints.LOGIN,
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
			.then((data) => {
				console.log("LOGIN RESPONSE >>>> ", data);

				if (!data.details.mobile) {
					throw new Error(data.message || "Something went wrong!");
				}

				if (
					data.details.mobile.length < 7 &&
					data.details.user_type === "-1" &&
					data.id_type === "Google"
				) {
					console.log("Setting states");

					setEmail(data.details.email);
					setStep("GOOGLE_VERIFY");
				} else {
					login({
						userId: data.details.mobile,
						sessionKey: data.access_token_lite,
						userDetails: data.details,
						profileDetails: {
							account_details: data.account_details,
							personal_details: data.personal_details,
							shop_details: data.shop_details,
							extras: data.extras,
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
