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
import { useRestoreLastLoginOrRoute } from "./useRestoreLastLoginOrRoute";

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
	const [isImageThemeEnabled] = useFeatureFlag("CMS_IMAGE_THEME");

	// On small-screen, quickly hide the welcome card and move on to the login screen,
	// especially, if the user had already entered their mobile number previously
	useEffect(() => {
		const duration = number?.formatted?.length > 0 ? 1000 : 30000;

		const timer = setTimeout(() => {
			setShowWelcomeCard(false);
		}, duration);

		return () => clearTimeout(timer);
	}, [number?.formatted]);

	// Restore last login or OTP route from localStorage
	useRestoreLastLoginOrRoute({
		number,
		setNumber,
		setShowWelcomeCard,
	});

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
						) : isImageThemeEnabled &&
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
				<Link href="/privacy" prefetch={false}>
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
