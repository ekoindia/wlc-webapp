import { Box, Center, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { Button, IcoButton, Icon, OtpInput } from "components";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";
import { sendOtpRequest } from "helpers";
import { useLogin } from "hooks";
import { useCallback, useEffect, useState } from "react";

/**
 * A <VerifyOtp> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<VerifyOtp></VerifyOtp>`
 */

const VerifyOtp = ({ loginType, number, setStep }) => {
	const [Otp, setOtp] = useState("");
	const [timer, setTimer] = useState(30);
	const { login } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const [loading, submitLogin] = useLogin(login, setStep);
	const toast = useToast();

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

	const resendOtpHandler = () => {
		resetTimer();
		sendOtpRequest(orgDetail.org_id, number.original, toast, "resend");
	};

	const verifyOtpHandler = (_otp) => {
		if (loading) return;
		if (!(_otp || Otp)) return;

		submitLogin({
			id_type: "Mobile",
			mobile: number.original,
			id_token: _otp || Otp,
			org_id: orgDetail.org_id,
		});
	};

	return (
		<Flex direction="column">
			<Flex align="center">
				<Box
					onClick={() =>
						setStep(
							loginType === "Mobile" ? "LOGIN" : "GOOGLE_VERIFY"
						)
					}
					cursor="pointer"
				>
					<Icon
						name="arrow-back"
						size="18px"
						// h="15px"
					/>
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
						+91 {number.formatted}
						<IcoButton
							iconName="mode-edit"
							size="sm"
							theme="primary"
							ml={2}
							onClick={() =>
								setStep(
									loginType === "Mobile"
										? "LOGIN"
										: "GOOGLE_VERIFY"
								)
							}
						/>
					</Center>
				</Flex>
			</Flex>

			<Flex w="full" align="center" justify="center">
				<OtpInput
					inputStyle={{
						w: { base: 12, md: "72px", "2xl": "96px" },
						h: { base: 12, "2xl": 16 },
						fontSize: { base: "sm", "2xl": "2xl" },
					}}
					containerStyle={
						{
							// justifyContent: "space-between",
						}
					}
					length={4}
					onChange={setOtp}
					onEnter={() => verifyOtpHandler()}
					onComplete={(otp) => {
						verifyOtpHandler(otp);
					}}
					// onKeyDown={onkeyHandler}
				/>
			</Flex>

			<Flex
				justify="center"
				mt={{ base: 6, "2xl": "2.5rem" }}
				fontSize={{ base: "sm", "2xl": "lg" }}
				gap="0px 10px"
				userSelect="none"
			>
				{timer >= 1 ? (
					<>
						<Text as={"span"}>Resend otp in </Text>
						<Flex align="center" color="error" columnGap="4px">
							<Icon name="timer" size="18px" />
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
							onClick={resendOtpHandler}
							fontWeight="medium"
						>
							Resend OTP
						</Text>
					</>
				)}
			</Flex>

			<Button
				mt={{ base: "3.25rem", "2xl": "6.25rem" }}
				h={{ base: 16, "2xl": "4.5rem" }}
				fontSize={{ base: "lg", "2xl": "xl" }}
				disabled={loading}
				loading={loading}
				onClick={() => verifyOtpHandler()}
			>
				Submit
			</Button>
		</Flex>
	);
};

export default VerifyOtp;
