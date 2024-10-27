import { Box, Flex, Text } from "@chakra-ui/react";
// import { Render } from "@measured/puck";
import { Icon } from "components";
import { useOrgDetailContext, useSession } from "contexts";
import { useFeatureFlag } from "hooks";
import { fadeIn } from "libs/chakraKeyframes";
import { cmsConfig } from "libs/cms";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoginWidget } from "./LoginWidget";

const WelcomeCard = dynamic(
	() => import("./WelcomeCard").then((pkg) => pkg.WelcomeCard),
	{
		ssr: false,
	}
);

const ImageCard = dynamic(
	() => import("./ImageCard").then((pkg) => pkg.ImageCard),
	{
		ssr: false,
	}
);

// For CMS custom screen
// TODO: Move to static import, and, enable SSR
const Render = dynamic(
	() => import("@measured/puck").then((pkg) => pkg.Render),
	{
		ssr: false,
	}
);

// const cmsConfig = dynamic(
// 	() => import("libs/cms").then((pkg) => pkg.cmsConfig),
// 	{
// 		ssr: false,
// 	}
// );

// Time in milliseconds to persist the OTP screen, if the user comes back to the app within this time.
const PERSIST_OTP_SCREEN_TIMEOUT_MS = 240000; // 4 mins

/**
 * Format mobile number in the following format: 123 456 7890
 * @param {number} mobile
 * @returns {string} Formatted mobile number
 */
const formatMobileNumber = (mobile) => {
	return mobile.toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
};

/**
 * This is the main component where all the Login related components are rendered.
 * @param {*} props
 * @param {string} props.cmsType Type of CMS to render. Renders the default WelcomeCard if not provided. If "image", the custom image provided in cmsData is rendered.
 * @param {object} props.cmsData Custom CMS data to render. If cmsType is "image", this object should contain the image URL.
 */
const LoginPanel = ({ cmsType, cmsData }) => {
	const [number, setNumber] = useState({
		original: "",
		formatted: "",
	});
	const [showWelcomeCard, setShowWelcomeCard] = useState(true);
	const { orgDetail } = useOrgDetailContext();
	const { isLoggedIn } = useSession();

	const [isCmsEnabled] = useFeatureFlag("CMS_LANDING_PAGE");

	// On small-screen, quickly hide the welcome card and move on to the login screen,
	// especially, if the user had already entered their mobile number previously
	useEffect(() => {
		const duration = number?.formatted?.length > 0 ? 1000 : 30000;

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
			lastRoute?.at > Date.now() - PERSIST_OTP_SCREEN_TIMEOUT_MS
		) {
			// Was the user on enter-OTP screen in the last 4 mins?
			// Take them back there without resending OTP...
			setNumber(lastRoute.meta.mobile);
			setShowWelcomeCard(false);
		} else if (lastLogin?.type !== "Google" && lastLogin?.mobile > 1) {
			// Format mobile number in the following format: +91 123 456 7890
			// TODO: Fix Input component so that this is not required
			const formatted_mobile = formatMobileNumber(lastLogin.mobile);
			setNumber({
				original: lastLogin.mobile,
				formatted: formatted_mobile,
			});
		}
	}, []);

	// Hide login panel if user is already logged in
	if (isLoggedIn) return null;

	// MARK: JSX
	return (
		<Box
			boxSizing="border-box"
			w="full"
			h="100vh"
			maxH="100vh"
			direction="column"
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
				direction="row"
				align="center"
				minH="100%"
				p={{ base: 0, md: "20px 0" }}
			>
				<Flex
					direction="row"
					boxSizing="border-box"
					w={{ base: "100%", md: "80%" }}
					h={{ base: "100vh", lg: "auto" }}
					maxW="1000px"
					overflow="hidden"
					borderRadius={{ base: 0, md: "15px" }}
					boxShadow="xl"
					animation={`${fadeIn} ease-out 1s`}
					m="auto"
				>
					{/* Description Box */}
					<Flex
						display={{
							base: showWelcomeCard ? "flex" : "none",
							md: "flex",
						}}
						w="100%"
						// h="100%"
						direction="column"
						justify="flex-start"
					>
						{isCmsEnabled && cmsType === "card" && cmsData ? (
							<Render config={cmsConfig} data={cmsData} />
						) : isCmsEnabled &&
						  cmsType === "image" &&
						  cmsData?.img ? (
							<ImageCard
								img={cmsData?.img}
								onClick={() => setShowWelcomeCard(false)}
							/>
						) : (
							<WelcomeCard
								logo="/favicon.svg"
								header={`Welcome to ${orgDetail.app_name}`}
								features={[
									"Your business partner to grow your revenue and digitize your business",
									"Start earning today from your shop, office, home or anywhere",
								]}
								cmsType={cmsType}
								cmsData={cmsData}
								onClick={() => setShowWelcomeCard(false)}
							/>
						)}
					</Flex>

					{/* Login Widget */}
					<LoginWidget
						display={{
							base: showWelcomeCard ? "none" : "block",
							md: "block",
						}}
						flex={1}
					/>
				</Flex>
			</Flex>

			{/* Privacy Policy Link */}
			<Flex
				display={{
					base: showWelcomeCard ? "none" : "block",
					md: "block",
				}}
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
		</Box>
	);
};

export default LoginPanel;
