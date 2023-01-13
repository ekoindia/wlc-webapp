import { Box, Center, Flex, Image } from "@chakra-ui/react";
import { useState } from "react";
import { Login, MobileVerify, VerifyOtp } from ".";

const LoginPanel = ({ className = "", ...props }) => {
	const [step, setStep] = useState(0); // TODO: Edit state as required
	const [number, setNumber] = useState();
	return (
		<Center
			w="full"
			h="100vh"
			alignItems="center"
			justifyContent="center"
			bg="#F5F6F8"
		>
			<Flex direction="column">
				<Box>
					<Image
						src="./images/logoimage.png"
						w="19rem"
						height="5rem"
						mb="3.8rem"
					/>
				</Box>
				<Box
					w="43.75rem"
					h="44rem"
					px="1.875rem"
					py="2.5rem"
					boxShadow="0px 3px 20px #00000005"
					borderRadius="1.25rem"
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
					{step === 2 ? <MobileVerify setStep={setStep} /> : ""}
				</Box>
			</Flex>
		</Center>
	);
};

export default LoginPanel;
