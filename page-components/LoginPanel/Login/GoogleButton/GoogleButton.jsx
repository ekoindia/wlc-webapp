import { Center, Text } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "components/Button";
import { useLogin } from "hooks";
import Image from "next/image";

/**
 * A custom Google login button
 * @param	{function}	[prop.setStep]	Function to set the step like LOGIN, VERIFYOTP & SOCIALVERIFY
 * @param	{function}	[prop.setLoginType]	Function to set the type of login
 * @param	{function}	[prop.setNumber]	Function to set the number
 * @param	{function}	[prop.setEmail]	Function to set the email
 * @example	`<GoogleButton></GoogleButton>`
 */
const GoogleButton = ({
	setStep,
	setLoginType,
	setNumber,
	setEmail,
	...rest
}) => {
	const [/* busy, */ googleHandler] = useLogin(setStep, setEmail);

	const googleLoginHandler = useGoogleLogin({
		onSuccess: async (response) => {
			const postData = {
				id_type: "Google",
				id_token: response.code,
			};
			googleHandler(postData);
			setLoginType("Google");
			setNumber({
				original: "",
				formatted: "",
			});
		},
		onError: (err) => console.log("Google Error => ", err),
		flow: "auth-code",
	});

	return (
		<Button
			variant="nostyle"
			bg="google-btn-bg"
			h={{
				base: 16,
				"2xl": "4.5rem",
			}}
			fontSize={{ base: "lg", "2xl": "2xl" }}
			color="white"
			fontWeight="medium"
			borderRadius="10px"
			position="relative"
			boxShadow="0px 3px 10px #4185F433;"
			px="0"
			onClick={googleLoginHandler}
			{...rest}
		>
			<Center
				bg="white"
				p={{ base: "9px", "2xl": "13px" }}
				borderRadius="10px"
				position="absolute"
				left="2px"
				h="calc(100% - 4px)"
				w={{ base: "60px", "2xl": "68px" }}
			>
				<Image
					src="./icons/google.svg"
					width={48}
					height={48}
					loading="eager"
					alt="Google Logo"
				/>
			</Center>
			<Text ml={[10, 10, null]} variant="selectNone">
				Login with Google
			</Text>
		</Button>
	);
};

export default GoogleButton;
