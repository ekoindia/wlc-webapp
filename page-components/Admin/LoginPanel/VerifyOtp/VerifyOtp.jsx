import {
	Box,
	Center,
	Flex,
	Heading,
	HStack,
	PinInput,
	PinInputField,
	Text,
} from "@chakra-ui/react";
import { Buttons, Icon, IconButtons } from "components";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

/**
 * A <VerifyOtp> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<VerifyOtp></VerifyOtp>`
 */

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

	// console.log(timer);

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
				<Box
					onClick={() => setStep(0)}
					w="18px"
					h="15px"
					cursor="pointer"
				>
					<Icon name="arrow-back" />
				</Box>
				<Heading
					as="h3"
					pl={{ base: 3.5, "2xl": 5 }}
					fontWeight="semibold"
					fontSize={{ base: "xl", "2xl": "3xl" }}
					letterSpacing="wide"
					variant="selectNone"
				>
					Verify with OTP
				</Heading>
			</Flex>

			<Flex
				mt={{ base: 2.5, "2xl": "30px" }}
				ml={{ base: 9, "2xl": "2.4rem" }}
				mb={{ base: "5rem", "2xl": "7.25rem" }}
				fontSize={{ base: "sm", "2xl": "lg" }}
				align="center"
			>
				<Flex align="center" wrap="wrap" userSelect="none">
					<Text>Sent on&nbsp;</Text>
					<Center as="b">
						+91 {number}
						<IconButtons
							onClick={() => setStep((prev) => prev - 1)}
							iconName="mode-edit"
							iconStyle={{ height: "12px", width: "12px" }}
						/>
					</Center>
				</Flex>
			</Flex>

			<HStack justify="space-between">
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
								h={{ base: 12, "2xl": 16 }}
								borderRadius="10"
								boxShadow={
									Otp[idx] ? "0px 3px 6px #0000001A" : ""
								}
								_focus={{
									bg: "focusbg",
									boxShadow: "0px 3px 6px #0000001A",
									borderColor: "hint",
									transition: "box-shadow 0.3s ease-out",
								}}
							/>
						))}
				</PinInput>
			</HStack>

			<Flex
				justify="center"
				mt={{ base: 6, "2xl": "2.5rem" }}
				fontSize={{ base: "sm", "2xl": "lg" }}
				fontFamily="roboto_font"
				fontWeight="normal"
				gap="0px 10px"
				userSelect="none"
			>
				{timer >= 1 ? (
					<>
						<Text as={"span"}>Resend otp in </Text>
						<Flex color="error" columnGap="4px">
							<Icon name="timer" width="18px" />
							00:{timer <= 9 ? "0" + timer : timer}
						</Flex>
					</>
				) : (
					<>
						<Text as={"span"}>Did not receive yet?</Text>
						<Text
							cursor="pointer"
							as="span"
							color="accent.DEFAULT"
							onClick={resetTimer}
							fontWeight="medium"
						>
							Resend OTP
						</Text>
					</>
				)}
			</Flex>

			<Buttons
				title="Submit"
				mt={{ base: "3.25rem", "2xl": "6.25rem" }}
				h={{ base: 16, "2xl": "4.5rem" }}
				fontSize={{ base: "lg", "2xl": "xl" }}
				onClick={redirect} // dummy onClick
			/>
		</Flex>
	);
};

export default VerifyOtp;
