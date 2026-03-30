import { Flex, Text } from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { FiSend } from "react-icons/fi";
import { MdAddCard } from "react-icons/md";
import { ActionCard } from "../../components/ActionCard";
import { ANIMATION } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";

/**
 * Main wallet action hub — shown once the wallet is confirmed open.
 * Renders Load Wallet and (conditionally) Transfer Fund action cards.
 */
export const WalletDashboard = (): JSX.Element => {
	const { state, dispatch } = useDigiKhata();

	const balance = state.walletData?.walletCurrentBalance ?? 0;

	return (
		<Flex
			direction="column"
			gap={4}
			sx={{
				animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
				animationDelay: ANIMATION.STEP_IN_DELAY,
			}}
		>
			<Text
				fontSize="sm"
				color="light"
				textAlign="center"
				px={2}
				userSelect="none"
			>
				What would you like to do?
			</Text>

			<ActionCard
				label="Load Wallet"
				description="Add funds to your DigiKhata wallet"
				icon={MdAddCard}
				gradient="linear(135deg, #b45309, #d97706)"
				animationDelay="0s"
				onClick={() =>
					dispatch({ type: "SET_STEP", step: "load-wallet" })
				}
			/>

			{balance > 0 ? (
				<ActionCard
					label="Transfer Fund"
					description="Send money to a registered recipient"
					icon={FiSend}
					gradient="linear(135deg, #1e40af, #3b82f6)"
					animationDelay="0.1s"
					onClick={() =>
						dispatch({ type: "SET_STEP", step: "recipients" })
					}
				/>
			) : (
				<Flex
					direction="column"
					align="center"
					gap={1}
					py={3}
					px={4}
					bg="shade"
					borderRadius="10"
					border="1px dashed"
					borderColor="divider"
					opacity={0.6}
				>
					<Text fontSize="sm" color="light" userSelect="none">
						Fund transfer is available once your wallet has a
						balance.
					</Text>
				</Flex>
			)}
		</Flex>
	);
};
