import { Center, Text } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "components/Button";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";
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
	const { login } = useUser();
	const [_busy, submitLogin] = useLogin(login, setStep, setEmail);
	const { orgDetail } = useOrgDetailContext();

	const googleLoginHandler = useGoogleLogin({
		onSuccess: async (response) => {
			const postData = {
				id_type: "Google",
				id_token: response?.code,
				org_id: orgDetail?.org_id,
			};
			submitLogin(postData);
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
				base: "56px",
				// "2xl": "62px",
			}}
			fontSize={{ base: "lg" }}
			color="white"
			fontWeight="medium"
			borderRadius="8px"
			position="relative"
			boxShadow="2px 3px 10px #4185F433"
			px="0"
			onClick={googleLoginHandler}
			{...rest}
		>
			<Center
				bg="white"
				// p={{ base: "9px" }}
				borderRadius="8px"
				position="absolute"
				left="2px"
				top="2px"
				bottom="2px"
				// h="calc(100% - 4px)"
				w={{ base: "54px" }}
			>
				<Image
					src="./icons/google.svg"
					width={38}
					height={38}
					loading="lazy"
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
