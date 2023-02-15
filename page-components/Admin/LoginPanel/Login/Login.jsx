import { Button, Center, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Buttons, Divider, Input } from "components";
import { useRef, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useToast } from "@chakra-ui/react";
import { useLogin } from "hooks";
import { useUser } from "contexts/UserContext";
import { sendOtpRequest, RemoveFormatted } from "helpers";

/**
 * A <Login> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Login></Login>`
 */

const Login = ({ setStep, setNumber, number, setEmail }) => {
	const EnterRef = useRef();
	const toast = useToast();
	const { login } = useUser();
	const [busy, googleHandler] = useLogin(login, setStep, setEmail);

	const [value, setValue] = useState(number.formatted);
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");

	const googleLoginHandler = useGoogleLogin({
		onSuccess: async (response) => {
			try {
				console.log("Bearer token", response);
				// const postData = {
				// 	id_type: "Google",
				// 	id_token: response.access_token
				// }
				// googleHandler(postData);

				// const res = await fetch(
				// 	"https://www.googleapis.com/oauth2/v3/userinfo",
				// 	{
				// 		headers: {
				// 			Authorization: `Bearer ${response.access_token}`,
				// 		},
				// 	}
				// );
				// const data = await res.json();
				// setEmail(data.email);
				// console.log("data", data);
				const res = await fetch("http://localhost:3334/", {
					headers: {
						Authorization: `Bearer ${response.access_token}`,
					},
				});
				const data = await res.json();
				// setEmail(data.email);
				console.log("data", data);
			} catch (err) {
				console.log(err);
			}
		},
	});

	const onChangeHandler = (val) => {
		setValue(val);
	};

	const SendOtp = () => {
		if (value.length === 12) {
			setNumber({
				original: RemoveFormatted(value),
				formatted: value,
			});

			setStep("VERIFY_OTP");
			sendOtpRequest(value, toast);
		} else {
			setErrorMsg("Required");
			setInvalid(true);
		}
	};

	const onkeyHandler = (e) => {
		if (e.code === "Enter") {
			EnterRef.current.focus();
		}
	};

	return (
		<Flex direction="column">
			<Heading
				variant="selectNone"
				as="h3"
				fontSize={{ base: "xl", "2xl": "3xl" }}
			>
				Login
			</Heading>

			<Button
				variant
				bg="#4185F4"
				mt={{
					base: 4,
					"2xl": "4.35rem",
				}}
				h={{
					base: 16,
					"2xl": "4.5rem",
				}}
				fontSize={{ base: "lg", "2xl": "2xl" }}
				color="white"
				fontWeight="medium"
				borderRadius="10px"
				position="relative"
				onClick={googleLoginHandler}
				boxShadow="0px 3px 10px #4185F433;"
			>
				<Center
					bg="#FFFFFF"
					p={{ base: "9px", "2xl": "13px" }}
					borderRadius="10px"
					position="absolute"
					left="2px"
					h="calc(100% - 4px)"
					w={{ base: "60px", "2xl": "68px" }}
				>
					<Image
						src="./icons/google.svg"
						w={{ base: "40px", "2xl": "48px" }}
					/>
				</Center>
				<Text ml={[10, 10, null]} variant="selectNone">
					Login with Google
				</Text>
			</Button>

			<Divider
				cursor="default"
				title="Or login with mobile number"
				py={{ base: "4rem", "2xl": "5.62rem" }}
				fontSize={{ base: "xs", "2xl": "md" }}
			/>

			<Input
				cursor="default"
				label="Enter mobile number"
				placeholder={"XXX XXX XXXX"}
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				mb={{ base: 10, "2xl": "4.35rem" }}
				onChange={onChangeHandler}
				labelStyle={{
					fontSize: { base: "sm", "2xl": "lg" },
					color: "light",
					pl: "0",
					fontWeight: "semibold",
					mb: { base: 2.5, "2xl": "0.8rem" },
				}}
				inputContStyle={{
					h: { base: "3rem", "2xl": "4rem" },
					pos: "relative",
				}}
				isNumInput={true}
				inputProps={{ maxLength: 12 }}
				onFocus={() => {
					setInvalid(false);
				}}
				onKeyDown={onkeyHandler}
			/>

			<Buttons
				title="Verify"
				h={{ base: 16, "2xl": "4.5rem" }}
				fontSize={{ base: "lg", "2xl": "xl" }}
				onClick={SendOtp}
				ref={EnterRef}
			/>
		</Flex>
	);
};

export default Login;
