import { Box, Flex, Text } from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { ANIMATION } from "../../constants";

/**
 * Landing screen before wallet details have been fetched.
 * Instructs the user to click "Fetch Balance" on the WalletCard above.
 * Navigation is driven by the root DigiKhataPage after a successful
 * sender OTP verification.
 */
export const InitialStep = (): JSX.Element => (
	<Flex
		direction="column"
		align="center"
		justify="center"
		gap={3}
		py={10}
		px={4}
		sx={{
			animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
			animationDelay: ANIMATION.STEP_IN_DELAY,
		}}
	>
		<Box fontSize="4xl" userSelect="none">
			🔒
		</Box>
		<Text
			fontWeight="semibold"
			fontSize="md"
			color="dark"
			textAlign="center"
			userSelect="none"
		>
			Your DigiKhata Wallet is locked.
		</Text>
		<Text
			fontSize="sm"
			color="light"
			textAlign="center"
			maxW="300px"
			userSelect="none"
		>
			Click <strong>Fetch Balance</strong> above to verify your identity
			and unlock your wallet details.
		</Text>
	</Flex>
);
