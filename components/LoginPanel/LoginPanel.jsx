import { Box, Flex, Image } from "@chakra-ui/react";
import { useGetLogoContext } from "contexts/getLogoContext";
import { useState } from "react";
import { Login, MobileVerify, VerifyOtp } from ".";

const LoginPanel = ({ className = "", ...props }) => {
	const [step, setStep] = useState(0); // TODO: Edit state as required
	const [number, setNumber] = useState("");
	const { logo } = useGetLogoContext();
	return (
		<Flex
			position={{ base: "fixed", md: "none" }}
			w="full"
			h="100vh"
			flexDirection="column"
			alignItems="center"
			justifyContent={{ sm: "normal", md: "center" }}
			bg="#F5F6F8"
		>
			<Flex
				direction="column"
				align="center"
				w={{ base: "100%", md: "30rem", "2xl": "43.75rem" }}
			>
				{/* Logo */}
				<Box
					display="flex"
					alignItems="center"
					w="full"
					h={{ base: "3.5rem", "2xl": "auto" }}
					bg={{ base: "white", md: "transparent" }}
					mb={{ base: 4, md: 8, "2xl": "3.8rem" }}
					boxShadow={{
						base: "0px 3px 15px #0000001A",
						md: "none",
					}}
				>
					<Image
						// src="./images/logoimage.png"
						src={logo || "./images/logoimage.png"}
						pl={{ base: 4, md: "0" }}
						w={{ base: "9rem", md: "14rem", "2xl": "19rem" }}
						height={{ base: "2.2rem", md: "3.5rem", "2xl": "5rem" }}
					/>
				</Box>

				{/* Login Card */}
				<Box
					maxW={{ sm: "30rem", lg: "none" }}
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
					bg="#FFFFFF"
				>
					{step === 0 ? (
						<Login
							setStep={setStep}
							number={number}
							setNumber={setNumber}
						/>
					) : (
						""
					)}
					{step === 1 ? (
						<VerifyOtp setStep={setStep} number={number} />
					) : (
						""
					)}
					{step === 2 ? (
						<MobileVerify
							setStep={setStep}
							number={number}
							setNumber={setNumber}
						/>
					) : (
						""
					)}
				</Box>
			</Flex>
		</Flex>
	);
};

export default LoginPanel;
