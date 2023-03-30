import { Box, Flex, Grid, Image, SlideFade } from "@chakra-ui/react";
import { useGetLogoContext } from "contexts/getLogoContext";
import { useUser } from "contexts/UserContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { GoogleVerify, Login, VerifyOtp } from ".";

/**
 * This is the main component where all the Login related component rendered.
 * @arg 	{Object}	prop	Properties passed to the component
 * @example	`<LoginPanel></LoginPanel>`
 */

const LoginPanel = (props) => {
	const [step, setStep] = useState("LOGIN");
	const [email, setEmail] = useState("");
	const [number, setNumber] = useState({
		original: "",
		formatted: "",
	});
	const [loginType, setLoginType] = useState("Mobile");
	const { logo } = useGetLogoContext();
	const router = useRouter();
	// const { userData } = useUser();
	// useRedirectPageOnLogin(router, userData )
	return (
		<Flex
			w="full"
			// h="100vh"
			h={{ base: "100%", md: "100vh" }}
			alignItems={{ sm: "normal", md: "center" }}
			justifyContent="center"
			bg="bg"
			position={{ base: "fixed", md: "none" }}
		>
			<Grid
				// direction="column"
				// justifyContent="center"
				// align="center"
				justifyItems="center"
				w={{ base: "100%", md: "30rem", "2xl": "43.75rem" }}
				h={{ base: "100%", md: "initial" }}
			>
				{/* Logo */}
				<Box
					justifySelf="flex-start"
					display="flex"
					alignItems="center"
					w="full"
					minH={{ base: "3.5rem", "2xl": "auto" }}
					h={{ base: "10vw", md: "3.5rem", "2xl": "auto" }}
					bg={{ base: "white", md: "transparent" }}
					mb={{ base: "0", md: 8, "2xl": "3.8rem" }}
					boxShadow={{
						base: "0px 3px 15px #0000001A",
						md: "none",
					}}
				>
					<Image
						// src="./images/logoimage.png"
						src={logo || "./images/logoimage.png"}
						alt="" //TODO <companyname>
						pl={{ base: 4, md: "0" }}
						w={{ base: "9rem", md: "14rem", "2xl": "19rem" }}
						height={{ base: "2.2rem", md: "3.5rem", "2xl": "5rem" }}
					/>
				</Box>

				{/* Login Card */}
				<Box
					maxW={{ base: "90vw", sm: "30rem", lg: "none" }}
					w={{
						base: "90%",
						md: "30rem",
						"2xl": "43.75rem",
					}}
					h={{ base: "31rem", "2xl": "44.3rem" }}
					px={{ base: 5, "2xl": 7 }}
					py={{ base: 7, "2xl": 10 }}
					boxShadow="0px 3px 20px #00000005"
					borderRadius={{ base: 15, "2xl": 20 }}
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
					{step === "GOOGLE_VERIFY" && (
						<SlideFade offsetX={100} offsetY={0} in={true}>
							<GoogleVerify
								setStep={setStep}
								number={number}
								email={email}
								setNumber={setNumber}
							/>
						</SlideFade>
					)}
				</Box>
			</Grid>
		</Flex>
	);
};

export default LoginPanel;
