import {
	Box,
	Flex,
	Heading,
	HStack,
	PinInput,
	PinInputField,
	Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Buttons, Icon, IconButtons } from "../../";

const pinInputStyle = {
	w: "95px",
	h: "64px",
	borderColor: "hint",
};

const VerifyOtp = ({ number, setStep }) => {
	const [Otp, setOtp] = useState("");
	const router = useRouter();
	const [timer, setTimer] = useState(30);
	const timeOutCallback = useCallback(
		() => setTimer((currTimer) => currTimer - 1),
		[]
	);

	useEffect(() => {
		timer > 0 && setTimeout(timeOutCallback, 1000);
	}, [timer, timeOutCallback]);

	console.log(timer);

	const resetTimer = function () {
		if (!timer || timer <= 0) {
			setTimer(30);
		}
	};

	const redirect = () => {
		router.push("/admin/my-network");
	};

	return (
		<Flex direction="column">
			<Flex align="center">
				<Box onClick={() => setStep(0)} cursor="pointer">
					{/* <ArrowBackIcon boxSize={6} w="18px" h="15px" /> */}
					<Icon name="arrow-back" width="18px" />
				</Box>
				<Heading
					as="h3"
					pl={5}
					fontWeight="semibold"
					letterSpacing="wide"
				>
					Verify with OTP
				</Heading>
			</Flex>

			<Flex mt="30px" ml="2.4rem" fontSize="lg" align="center">
				<Text>
					Sent on{" "}
					<Text as="span" fontWeight="semibold">
						+91 {number}
					</Text>
				</Text>
				<IconButtons
					onClick={() => setStep((prev) => prev - 1)}
					iconName="mode-edit"
					iconStyle={{ h: "12px", w: "12px" }}
				/>
			</Flex>

			<HStack justify="space-between" mt="7.25rem">
				<PinInput
					autoFocus
					type="number"
					otp
					size="lg"
					placeholder=""
					onChange={(e) => setOtp(e)}
				>
					{Array(6)
						.fill(null)
						.map((el, idx) => (
							<PinInputField
								key={idx}
								{...pinInputStyle}
								bg={Otp[idx] ? "focusbg" : ""}
								boxShadow={
									Otp[idx] ? "0px 3px 6px #0000001A" : ""
								}
							/>
						))}
				</PinInput>
			</HStack>

			<Flex justify="center" mb="6.25rem" mt="2.5rem" align="center">
				<Text>Did not receive yet?</Text>
				{timer >= 1 ? (
					<Box color="error" display="flex">
						&nbsp;
						<Icon name="file-upload" width="12px" />
						00:{timer}
					</Box>
				) : (
					<Text
						pl="2.5"
						as="span"
						color="accent.DEFAULT"
						fontSize="lg"
						fontWeight="medium"
						fontFamily="roboto_font"
						onClick={() => resetTimer()}
					>
						Resend OTP
					</Text>
				)}
			</Flex>

			<Buttons
				title="Verify"
				h="4.5rem"
				fontSize="xl"
				borderRadius="10px"
				boxShadow="0px 3px 10px #FE9F0040"
				onClick={redirect} // dummy onClick
			/>
		</Flex>
	);
};

export default VerifyOtp;
