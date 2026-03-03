import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useEffect, useState } from "react";

interface ResendOtpSectionProps {
	/**
	 * Initial time in seconds for the countdown
	 */
	countdownSeconds: number;
	/**
	 * Function to call when resend OTP clicked. Must return a promise resolving to boolean indicating success.
	 */
	onResendOtp: () => Promise<boolean>;
}

/**
 * A section to resend OTP after a countdown timer expires
 * @param {ResendOtpSectionProps} props - Properties passed to the component
 * @returns {JSX.Element} The ResendOtpSection component
 */
export const ResendOtpSection: React.FC<ResendOtpSectionProps> = ({
	countdownSeconds,
	onResendOtp,
}) => {
	const [timer, setTimer] = useState(countdownSeconds);

	useEffect(() => {
		if (timer < 1) return undefined;

		const timeoutId = setTimeout(() => {
			setTimer((currTimer) => currTimer - 1);
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [timer]);

	return (
		<Flex
			justify="center"
			mt={{ base: 6, "2xl": "2.5rem" }}
			fontSize={{ base: "sm", "2xl": "lg" }}
			gap="0px 10px"
			userSelect="none"
		>
			{timer >= 1 ? (
				<>
					<Text as={"span"}>Resend OTP in </Text>
					<Flex align="center" color="error" columnGap="4px">
						<Icon name="timer" size="18px" />
						00:{timer <= 9 ? `0${timer}` : timer}
					</Flex>
				</>
			) : (
				<>
					<Text as={"span"}>Did not receive yet?</Text>
					<Text
						cursor="pointer"
						as="span"
						color="primary.DEFAULT"
						onClick={async () => {
							const didSend = await onResendOtp();
							if (didSend) setTimer(countdownSeconds);
						}}
						fontWeight="medium"
					>
						Resend OTP
					</Text>
				</>
			)}
		</Flex>
	);
};
