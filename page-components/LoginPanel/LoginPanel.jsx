import { Box, Flex, SlideFade, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useOrgDetailContext, useSession } from "contexts";
import { fadeIn } from "libs/chakraKeyframes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Login, SocialVerify, VerifyOtp, WelcomeCard } from "./children";

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

	const { orgDetail } = useOrgDetailContext();
	const { isLoggedIn } = useSession();

	// Get last login mobile number from localstorage and set it as default value
	useEffect(() => {
		if (number?.formatted?.length > 0) return;

		const lastLogin = JSON.parse(localStorage.getItem("inf-last-login"));
		const lastRoute = JSON.parse(localStorage.getItem("inf-last-route"));

		if (
			lastRoute?.path === "/" &&
			lastRoute?.meta?.step === "VERIFY_OTP" &&
			lastRoute?.meta?.type === "Mobile" &&
			lastRoute?.meta?.mobile?.formatted &&
			lastRoute?.at > Date.now() - 240000
		) {
			// Was the user on enter-OTP screen in the last 4 mins?
			// Take them back there without resending OTP...
			setNumber(lastRoute.meta.mobile);
			setLastMobileFormatted(lastRoute.meta.mobile.formatted);
			setLoginType("Mobile");
			setStep("VERIFY_OTP");
		} else if (lastLogin?.type !== "Google" && lastLogin?.mobile > 1) {
			// Format mobile number in the following format: +91 123 456 7890
			// TODO: Fix Input component so that this is not required
			const formatted_mobile = lastLogin.mobile
				.toString()
				.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");

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

	// Cache current OTP-Verification step in localstorage,
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
			// direction={{ base: "column-reverse", md: "row" }}
			w="full"
			h="100vh"
			// h={{ base: "100%", md: "100vh" }}
			align="center"
			justify="center"
			bg="accent.light"
			// bgGradient="linear(to-b, primary.light, primary.dark)"
			bgImage={{
				base: "none",
				lg: "url('/login_bg_2.opt.svg')",
			}}
			backgroundRepeat="no-repeat"
			backgroundPosition="center center"
			backgroundSize="cover"
			// position={{ base: "fixed", md: "none" }}
			overflowY="auto"
		>
			<Flex
				direction={{ base: "column-reverse", md: "row" }}
				w={{ base: "100%", md: "80%" }}
				h={{ base: "100vh", lg: "auto" }}
				maxW="1000px"
				overflow="hidden"
				borderRadius={{ base: 0, md: "15px" }}
				boxShadow="xl"
				animation={`${fadeIn} ease-out 1s`}
			>
				{/* Description Box */}
				<WelcomeCard
					logo="/favicon.svg"
					header={`Welcome to ${orgDetail.app_name}`}
					features={[
						"Your business partner to grow your revenue and digitize your business",
						"Start earning today from your shop, office, home or anywhere",
					]}
				/>

				{/* Login Box */}
				<Box
					flex={1}
					minW={{ base: "300px", lg: "350px" }}
					h={{ base: "100vh", lg: "auto" }}
					px={{ base: 5, "2xl": 7 }}
					py={{ base: 7, "2xl": 10 }}
					// my={{ base: "auto", md: "0" }}
					boxShadow="0px 3px 20px #00000005"
					bg="white"
				>
					{step === "LOGIN" && (
						<Login
							setStep={setStep}
							number={number}
							setNumber={setNumber}
							setEmail={setEmail}
							setLoginType={setLoginType}
							lastUserName={lastUserName}
							lastMobileFormatted={lastMobileFormatted}
						/>
					)}
					{step === "VERIFY_OTP" && (
						<SlideFade offsetX={100} offsetY={0} in={true}>
							<VerifyOtp
								loginType={loginType}
								setStep={setStep}
								number={number}
							/>
						</SlideFade>
					)}
					{step === "SOCIAL_VERIFY" && (
						<SlideFade offsetX={100} offsetY={0} in={true}>
							<SocialVerify
								setStep={setStep}
								number={number}
								email={email}
								setNumber={setNumber}
							/>
						</SlideFade>
					)}
				</Box>
			</Flex>
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
		</Flex>
	);
};

export default LoginPanel;
