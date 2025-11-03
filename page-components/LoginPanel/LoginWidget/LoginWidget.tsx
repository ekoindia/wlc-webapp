import { Flex, SlideFade } from "@chakra-ui/react";
import { useSession } from "contexts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Login } from "../Login";
import { useRestoreLastLoginOrRoute } from "../useRestoreLastLoginOrRoute";

// Lazy load the LoginPanel components...
// const Login = dynamic(() => import("./Login").then((pkg) => pkg.Login), {
// 	// loading: () => <div>Loading...</div>,
// 	ssr: false,
// });
const VerifyOtp = dynamic(
	() => import("../VerifyOtp").then((pkg) => pkg.VerifyOtp),
	{
		// loading: () => <div>Loading...</div>,
		ssr: false,
	}
);
const SocialVerify = dynamic(
	() => import("../SocialVerify").then((pkg) => pkg.SocialVerify),
	{
		// loading: () => <div>Loading...</div>,
		ssr: false,
	}
);

// Declare the props interface
interface LoginWidgetProps {
	previewMode?: boolean;
	[key: string]: any;
}

/**
 * Component to show the Login/Signup flow.
 * To be used on the landing page to allow users to login or start onboarding process for new users.
 * Includes the following steps:
 * - Show Login Options
 * - Verify OTP
 * - Social Verify
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {boolean} [prop.previewMode] - Show login widget as a preview. Do not allow submitting the form. Used in CMS Editor as a preview of the Login widget.
 * @param {boolean} [prop.hideLogo] - Hide the logo in the login widget
 * @param {...*} rest - Rest of the props
 * @example	`<LoginWidget></LoginWidget>` TODO: Fix example
 */
const LoginWidget = ({
	previewMode = false,
	hideLogo = false,
	...rest
}: LoginWidgetProps) => {
	const [step, setStep] = useState("LOGIN");
	const [email, setEmail] = useState("");
	const [number, setNumber] = useState({
		original: "",
		formatted: "",
	});
	const [loginType, setLoginType] = useState("Mobile");
	const [lastMobileFormatted, setLastMobileFormatted] = useState("");
	const [lastUserName, setLastUserName] = useState("");

	const { isLoggedIn } = useSession();

	// Get last login mobile number from local storage and set it as default value
	useRestoreLastLoginOrRoute({
		number,
		setNumber,
		setLastUserName,
		setLastMobileFormatted,
		setLoginType,
		setStep,
	});

	// Cache current OTP-Verification step in local storage,
	// so that OTP Verification can be continued when app is closed on mobile.
	useEffect(() => {
		if (step === "VERIFY_OTP") {
			localStorage.setItem(
				"inf-last-route",
				JSON.stringify({
					path: "/",
					meta: { step: step, type: loginType, mobile: number },
					at: Date.now(),
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	// Hide LoginWidget if user is already logged in
	if (isLoggedIn && previewMode !== true) return null;

	// MARK: JSX
	return (
		<Flex
			// display={{
			// 	base: showWelcomeCard ? "none" : "block",
			// 	md: "block",
			// }}
			// flex={1}
			// w="100%"
			minW={{ base: "300px", lg: "350px" }}
			h={{ base: "100vh", lg: "auto" }}
			boxShadow="0px 3px 20px #00000005"
			px={{ base: 5, "2xl": 7 }}
			py={{ base: 7, "2xl": 10 }}
			bg="white"
			color="#333"
			{...rest}
		>
			{step === "LOGIN" && (
				<Login
					hideLogo={hideLogo}
					{...{
						number,
						setNumber,
						setStep,
						setEmail,
						setLoginType,
						lastUserName,
						lastMobileFormatted,
						previewMode,
					}}
				/>
			)}
			{step === "VERIFY_OTP" && (
				<SlideFade offsetX={100} offsetY={0} in={true}>
					<VerifyOtp
						{...{ number, loginType, setStep, previewMode }}
					/>
				</SlideFade>
			)}
			{step === "SOCIAL_VERIFY" && (
				<SlideFade offsetX={100} offsetY={0} in={true}>
					<SocialVerify
						{...{ email, number, setNumber, setStep, previewMode }}
					/>
				</SlideFade>
			)}
		</Flex>
	);
};

export default LoginWidget;
