import { Box, Flex, SlideFade, Text } from "@chakra-ui/react";
import { Icon, ShowcaseCircle } from "components";
import { useOrgDetailContext, useSession } from "contexts";
import { useState } from "react";
import { Login, SocialVerify, VerifyOtp } from "./children";

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
	const { orgDetail } = useOrgDetailContext();
	const { isLoggedIn } = useSession();

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
				overflow="hidden"
				borderRadius={{ base: 0, md: "15px" }}
				boxShadow="xl"
			>
				{/* Description Box */}
				<Flex
					direction="column"
					align="center"
					flex={2}
					display={{ base: "none", md: "flex" }}
					// maxW={{ base: "95vw", sm: "30rem", lg: "none" }}
					// w={{
					// 	base: "95%",
					// 	md: "26rem",
					// 	"2xl": "43.75rem",
					// }}
					// h={{ base: "31rem", "2xl": "44.3rem" }}
					px={{ base: 5, "2xl": 7 }}
					py={{ base: 7, "2xl": 10 }}
					// my={{ base: "auto", md: "0" }}
					boxShadow="0px 3px 20px #00000005"
					// borderRadius={{ base: 15, "2xl": 20 }}
					// bg="primary.DEFAULT"
					bgGradient="linear(to-b, primary.light, primary.dark)"
					color="white"
					opacity="0.9"
				>
					<DescCard
						logo="/favicon.svg"
						header={`Welcome to ${orgDetail.app_name}`}
						features={[
							"Your business partner for services like Money Transfer, AePS Cash-Out & more",
							"Build your own network and start earning today!",
						]}
					/>
				</Flex>

				{/* Login Box */}
				<Box
					flex={1}
					minW={{ base: "300px", lg: "350px" }}
					h={{ base: "100vh", lg: "auto" }}
					// maxW={{ base: "95vw", sm: "30rem", lg: "none" }}
					// w={{
					// 	base: "95%",
					// 	md: "26rem",
					// 	"2xl": "43.75rem",
					// }}
					// h={{ base: "31rem", "2xl": "44.3rem" }}
					px={{ base: 5, "2xl": 7 }}
					py={{ base: 7, "2xl": 10 }}
					// my={{ base: "auto", md: "0" }}
					boxShadow="0px 3px 20px #00000005"
					// borderRadius={{ base: 15, "2xl": 20 }}
					bg="white"
				>
					{step === "LOGIN" && (
						<Login
							setStep={setStep}
							number={number}
							setNumber={setNumber}
							setEmail={setEmail}
							setLoginType={setLoginType}
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
		</Flex>
	);
};

/**
 * A Description card with a logo, title and a list of features
 */
const DescCard = ({ logo, header, features = [] }) => {
	return (
		<Flex
			w="100%"
			h="100%"
			direction="column"
			align="center"
			justify="space-around"
		>
			{/* Top image box with circles and stars */}
			<ShowcaseCircle>
				<img
					src={logo}
					alt="store"
					width="80px"
					height="80px"
					loading="lazy"
				/>
			</ShowcaseCircle>

			{/* Title */}
			<Text
				fontWeight="bold"
				fontSize="1.4em"
				maxW="400px"
				my={{ base: "1em", md: "1.5em", lg: "2em" }}
				opacity="0.8"
			>
				{header}
			</Text>

			{/* Feature List */}
			<Flex
				direction="column"
				// align="center"
				opacity="0.9"
				fontSize="0.9em"
				maxW="400px"
			>
				{features.map((feature, i) => (
					<Flex key={i} align="center" py="5px">
						<Icon
							name="check"
							size="18px"
							mr="0.5em"
							border="1px solid #FFF"
							borderRadius="50%"
							padding="2px"
						/>
						<Text textAlign="start" textWrap="balance">
							{feature}
						</Text>
					</Flex>
				))}
			</Flex>
		</Flex>
	);
};

export default LoginPanel;
