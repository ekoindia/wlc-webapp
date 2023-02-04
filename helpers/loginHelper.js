import { Endpoints } from "constants/EndPoints";

function sendOtpRequest(PostData) {
	fetch(process.env.NEXT_PUBLIC_API_AUTHENTICATION_URL + Endpoints.SENDOTP, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(PostData),
	})
		.then((res) => res.json())
		.then((data) => console.log(data))
		.catch((e) => console.log(e));
}

function RemoveFormatted(number) {
	return number.slice(0, 3) + number.slice(4, 7) + number.slice(8);
}

export { sendOtpRequest, RemoveFormatted };
