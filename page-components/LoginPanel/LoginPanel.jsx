import { Flex, SlideFade, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useOrgDetailContext, useSession } from "contexts";
import { fadeIn } from "libs/chakraKeyframes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Login, SocialVerify, VerifyOtp, WelcomeCard } from "./children";

const FOUR_MINUTES_IN_MS = 240000;

const formatMobileNumber = (mobile) => {
	return mobile.toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
};

/**
 * This is the main component where all the Login related component rendered.
 * @example	`<LoginPanel></LoginPanel>`
 */
const LoginPanel = () => {
	const [step, setStep] = useState("LOGIN");
	const [email, setEmail] = useState("");
	const [number, setNumber] = useState({
		original: "",
		formatted: "",
	});
	const [loginType, setLoginType] = useState("Mobile");
	const [lastMobileFormatted, setLastMobileFormatted] = useState("");
	const [lastUserName, setLastUserName] = useState("");
	const [showWelcomeCard, setShowWelcomeCard] = useState(true);
	const { orgDetail } = useOrgDetailContext();
	const { isLoggedIn } = useSession();

	useEffect(() => {
		const duration = number?.formatted?.length > 0 ? 3000 : 30000;

		const timer = setTimeout(() => {
			setShowWelcomeCard(false);
		}, duration);

		return () => clearTimeout(timer);
	}, [number?.formatted]);

	// Get last login mobile number from local storage and set it as default value
	useEffect(() => {
		if (number?.formatted?.length > 0) return;

		const lastLogin = JSON.parse(localStorage.getItem("inf-last-login"));
		const lastRoute = JSON.parse(localStorage.getItem("inf-last-route"));

		if (
			lastRoute?.path === "/" &&
			lastRoute?.meta?.step === "VERIFY_OTP" &&
			lastRoute?.meta?.type === "Mobile" &&
			lastRoute?.meta?.mobile?.formatted &&
			lastRoute?.at > Date.now() - FOUR_MINUTES_IN_MS
		) {
			// Was the user on enter-OTP screen in the last 4 mins?
			// Take them back there without resending OTP...
			setNumber(lastRoute.meta.mobile);
			setLastMobileFormatted(lastRoute.meta.mobile.formatted);
			setLoginType("Mobile");
			setStep("VERIFY_OTP");
			setShowWelcomeCard(false);
		} else if (lastLogin?.type !== "Google" && lastLogin?.mobile > 1) {
			// Format mobile number in the following format: +91 123 456 7890
			// TODO: Fix Input component so that this is not required
			const formatted_mobile = formatMobileNumber(lastLogin.mobile);
			setNumber({
				original: lastLogin.mobile,
				formatted: formatted_mobile,
			});
			setLastMobileFormatted(formatted_mobile);
		}

		// Check if lastLogin.name exists and is not a mobile number
		if (lastLogin?.name && lastLogin.name.match(/^[a-zA-Z]/)) {
			setLastUserName(lastLogin.name.split(" ")[0]);
		}
	}, []);

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

	// Hide login panel if user is already logged in
	if (isLoggedIn) return null;

	return (
		<Flex
			w="full"
			h="100vh"
			align="center"
			justify="center"
			bg="accent.light"
			bgImage={{
				base: "none",
				lg: "url('/login_bg_2.opt.svg')",
			}}
			backgroundRepeat="no-repeat"
			backgroundPosition="center center"
			backgroundSize="cover"
			overflowY="auto"
		>
			<Flex
				w={{ base: "100%", md: "80%" }}
				h={{ base: "100vh", lg: "auto" }}
				maxW="1000px"
				overflow="hidden"
				borderRadius={{ base: 0, md: "15px" }}
				boxShadow="xl"
				animation={`${fadeIn} ease-out 1s`}
			>
				{/* Description Box */}
				<Flex
					display={{
						base: showWelcomeCard ? "flex" : "none",
						md: "flex",
					}}
					w="100%"
					h="100%"
				>
					<WelcomeCard
						logo="/favicon.svg"
						header={`Welcome to ${orgDetail.app_name}`}
						features={[
							"Your business partner to grow your revenue and digitize your business",
							"Start earning today from your shop, office, home or anywhere",
						]}
						onClick={() => setShowWelcomeCard(false)}
					/>
				</Flex>

				{/* Login Box */}
				<Flex
					display={{
						base: showWelcomeCard ? "none" : "block",
						md: "block",
					}}
					flex={1}
					w="100%"
					minW={{ base: "300px", lg: "350px" }}
					h={{ base: "100vh", lg: "auto" }}
					boxShadow="0px 3px 20px #00000005"
					px={{ base: 5, "2xl": 7 }}
					py={{ base: 7, "2xl": 10 }}
					bg="white"
				>
					{step === "LOGIN" && (
						<Login
							{...{
								number,
								setNumber,
								setStep,
								setEmail,
								setLoginType,
								lastUserName,
								lastMobileFormatted,
							}}
						/>
					)}
					{step === "VERIFY_OTP" && (
						<SlideFade offsetX={100} offsetY={0} in={true}>
							<VerifyOtp {...{ number, loginType, setStep }} />
						</SlideFade>
					)}
					{step === "SOCIAL_VERIFY" && (
						<SlideFade offsetX={100} offsetY={0} in={true}>
							<SocialVerify
								{...{ email, number, setNumber, setStep }}
							/>
						</SlideFade>
					)}
				</Flex>
			</Flex>

			{/* Privacy Policy Link */}
			{showWelcomeCard ? null : (
				<Flex
					pos="absolute"
					bottom="6px"
					right="6px"
					fontWeight="medium"
					fontSize="xs"
					color={{ base: "dark", md: "white" }}
					opacity="0.4"
				>
					<Link href="/privacy">
						<Flex gap="1" align="center">
							<Text display="inline" lineHeight="1">
								Privacy Policy
							</Text>
							<Icon name="open-in-new" size="xs" />
						</Flex>
					</Link>
				</Flex>
			)}
		</Flex>
	);
};

export default LoginPanel;
