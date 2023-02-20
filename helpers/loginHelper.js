import { Endpoints } from "constants/EndPoints";

function sendOtpRequest(number, toast) {
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
				toast({
					title: "Resend Otp Successfully",
					status: "success",
					duration: 2000,
					isClosable: true,
					position: "top-right",
				});
				return response.json();
			} else {
				const err = new Error("Response not Ok");
				err.response = response;
				throw err;
			}
		})
		.then((data) => console.log(data))
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

function updateAuthTokens(data) {}

function getAuthTokens(data) {}

function clearAuthTokens(data) {}

function revokeSession() {}

function getAccessTokenUsingRefreshToken() {}

export { sendOtpRequest, RemoveFormatted };
