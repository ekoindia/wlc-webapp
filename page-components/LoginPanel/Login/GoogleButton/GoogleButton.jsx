import { Box } from "@chakra-ui/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useOrgDetailContext, useUser } from "contexts";
import { useLogin } from "hooks";
// import { Button } from "components";
// import Image from "next/image";

/**
 * A custom Google login button
 * @param	{function}	[prop.setStep]	Function to set the step like LOGIN, VERIFYOTP & SOCIALVERIFY
 * @param	{function}	[prop.setLoginType]	Function to set the type of login
 * @param	{function}	[prop.setNumber]	Function to set the number
 * @param	{function}	[prop.setEmail]	Function to set the email
 * @example	`<GoogleButton></GoogleButton>`
 */
const GoogleButtonContent = ({
	org_id,
	setStep,
	setLoginType,
	setNumber,
	setEmail,
	...rest
}) => {
	const { login } = useUser();
	const [_busy, submitLogin] = useLogin(login, setStep, setEmail);
	// const { orgDetail } = useOrgDetailContext();

	const onGoogleLoginSuccess = (response) => {
		console.log("Google Login Response => ", response);
		const postData = {
			id_type: "Google",
			id_token: response?.credential || response?.code,
			org_id: org_id, // orgDetail?.org_id,
			google_token_type: response?.credential ? "credential" : "code",
		};

		// Set login-type for current session...
		sessionStorage.setItem("login_type", "Google");

		// Submit login request...
		submitLogin(postData, "Google");
		setLoginType("Google");
		setNumber({
			original: "",
			formatted: "",
		});
	};

	const onGoogleLoginError = (err) => {
		console.error("Google Login Error => ", err);
	};

	// const googleLoginHandler = useGoogleLogin({
	// 	onSuccess: async (response) => onGoogleLoginSuccess,
	// 	onError: (err) => onGoogleLoginError,
	// 	scope: "email",
	// 	flow: "auth-code",
	// });

	return (
		<>
			<Box w="54px" marginRight="-10px" {...rest}>
				<GoogleLogin
					type="icon" // standard or icon
					shape="circle" // icon or pill or circle
					theme="filled_blue"
					text="continue_with"
					size="large"
					logoAlignment="left"
					style={{
						height: "44px",
						width: "54px",
						marginRight: "-10px",
					}}
					onSuccess={onGoogleLoginSuccess}
					onFailure={onGoogleLoginError}
				/>
			</Box>
			{/* <Button
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
			</Button> */}
		</>
	);
};

const GoogleButton = (args) => {
	const { orgDetail } = useOrgDetailContext();
	const org_id = orgDetail?.org_id;

	const useDefaultGoogleLogin = orgDetail?.login_types?.google?.default
		? true
		: false;

	const showGoogleLogin =
		useDefaultGoogleLogin || orgDetail?.login_types?.google?.client_id;

	if (!showGoogleLogin) return null;

	return (
		<GoogleOAuthProvider
			clientId={
				useDefaultGoogleLogin
					? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
					: orgDetail?.login_types?.google?.client_id
			}
		>
			<GoogleButtonContent org_id={org_id} {...args} />
		</GoogleOAuthProvider>
	);
};

export default GoogleButton;
