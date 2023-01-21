import { Box, Center, Image } from "@chakra-ui/react";
import { useState } from "react";
import { Login, MobileVerify, VerifyOtp } from ".";

const LoginPanel = ({ className = "", ...props }) => {
	const [step, setStep] = useState(0); // TODO: Edit state as required
	const [number, setNumber] = useState("");
	return (
		<Center
			w="full"
			h="100vh"
			alignItems="center"
			justifyContent={{ sm: "normal", xl: "center", lg: "center" }}
			bg="#F5F6F8"
			flexDirection="column"
		>
			{/* <Flex direction="column"> */}
			<Box
				w={["full", "full", "43.75rem", "43.75rem"]}
				bg={["white", "white", "transparent", "transparent"]}
				h={["3.5rem", "3.5rem", "auto", "auto"]}
				alignItems="center"
				display={"flex"}
				mb={["1rem", "1rem", "1.5rem", "3.8rem", "3.8rem"]}
			>
				<Image
					src="./images/logoimage.png"
					w={{ sm: "9rem", xl: "19rem" }}
					height={{ sm: "2.2rem", xl: "5rem" }}
				/>
			</Box>
			<Box
				w={{
					base: "90%",
					sm: "90%",
					md: "35rem",
					lg: "43rem",
					xl: "43.75rem",
				}}
				h={{
					base: "33.37rem",
					sm: "33.37rem",
					xl: "45rem",
				}}
				px={[5, 5, 5, 7, 7]}
				py={[7, 7, 10, 10, 10]}
				boxShadow="0px 3px 20px #00000005"
				borderRadius={[15, 15, 20, 20]}
				bg="#FFFFFF"
				// bg={["red.100", "blackAlpha.200", "green.100", "yellow.400"]}
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
			{/* </Flex> */}
		</Center>
	);
};

export default LoginPanel;
