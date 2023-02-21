import { Endpoints } from "constants/EndPoints";

function sendOtpRequest(number, toast, sendState) {
	const PostData = {
		platfom: "web",
		mobile: number,
		client_ref_id: "242942347012342346",
		app: "Connect",
	};

	fetch(process.env.NEXT_PUBLIC_API_AUTHENTICATION_URL + Endpoints.SENDOTP, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(PostData),
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				const err = new Error("Response not Ok");
				err.response = response;
				throw err;
			}
		})
		.then((data) => {
			if (sendState === "resend")
				toast({
					title: "Resend Otp Successfully",
					status: "success",
					duration: 2000,
					isClosable: true,
					position: "top-right",
				});
			else
				toast({
					title: "Send Otp Successfully",
					status: "success",
					duration: 2000,
					isClosable: true,
					position: "top-right",
				});
		})
		.catch((e) =>
			toast({
				title: "Something went wrong",
				status: "error",
				duration: 2000,
				isClosable: true,
				position: "top-right",
			})
		);
}

function RemoveFormatted(number) {
	return number.replace(/\D/g, "");
}

function setAuthTokens(data) {}

function updateAuthTokens(data) {
	try {
		sessionStorage.setItem("access_token", data.access_token);
		sessionStorage.setItem("refresh_token", data.refresh_token);
		sessionStorage.setItem("access_token_lite", data.access_token_lite);
		sessionStorage.setItem("access_token_crm", data.access_token_crm);
	} catch (err) {
		console.warn("Updating to session-storage failed: ", err);
	}
}

function getAuthTokens(data) {}

function clearAuthTokens(data) {
	sessionStorage.removeItem("access_token");
	sessionStorage.removeItem("refresh_token");
	sessionStorage.removeItem("access_token_lite");
	sessionStorage.removeItem("access_token_crm");
}

function revokeSession() {}

function getAccessTokenUsingRefreshToken() {}

export { sendOtpRequest, RemoveFormatted };
