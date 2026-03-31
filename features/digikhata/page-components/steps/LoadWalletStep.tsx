import {
	Box,
	Button,
	Flex,
	Input,
	NumberInput,
	NumberInputField,
	Text,
	useToast,
} from "@chakra-ui/react";
import { CopyButton } from "components";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { Pintwin } from "tf-components/Pintwin";
import { StepHeader } from "../../components/StepHeader";
import { ANIMATION } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface LoadWalletStepProps {
	mobile: string;
	onFetchBalance: () => Promise<void>;
	/** Flow mode — "self" shows all load options; "assisted" hides external transfer options */
	mode?: "self" | "assisted";
}

/**
 * Lets the agent load funds into their DigiKhata wallet.
 * Flow: Enter Amount + PIN → loadWallet → on 2447 calls onFetchBalance for OTP flow
 * → verifySenderOtp → hydrate wallet → back to dashboard.
 * @param {object} root0 - Component props
 * @param {string} root0.mobile - User's mobile number for API calls
 * @param {() => Promise<void>} root0.onFetchBalance - Callback to trigger balance refresh and OTP handling
 * @param root0.mode
 * @returns {JSX.Element} Wallet loading form with UPI and virtual account options
 */
export const LoadWalletStep = ({
	mobile,
	onFetchBalance,
	mode = "self",
}: LoadWalletStepProps): JSX.Element => {
	const { dispatch } = useDigiKhata();
	const { loadWallet, isLoadingWallet } = useDigiKhataApi(mobile);

	const toast = useToast();

	const [amount, setAmount] = useState("");
	const [encodedPin, setEncodedPin] = useState("");
	const [isPinComplete, setIsPinComplete] = useState(false);
	const upiVpa = `${mobile}@digikhata`;
	const virtualAccountNumber = `DIGIKTWT${mobile}`;
	const virtualAccountIfsc = "IDFB0040101";

	const handlePinComplete = (_pin: string, ep: string) => {
		setEncodedPin(ep);
		setIsPinComplete(true);
	};

	const handleLoadWallet = async () => {
		const numAmount = parseFloat(amount);
		if (isNaN(numAmount) || numAmount <= 0 || !isPinComplete) return;

		const res = await loadWallet({ amount: numAmount, pin: encodedPin });
		if (res?.data?.status === 0) {
			if (res?.data?.response_type_id === 2447) {
				// Trigger parent's balance fetch to handle OTP flow, to show the updated balance, and to navigate back to the dashboard
				await onFetchBalance();
			} else {
				toast({
					title: res?.data?.message ?? "Failed to load wallet",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		} else {
			toast({
				title: res?.data?.message ?? "Failed to load wallet",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
	};

	const canSubmit =
		isPinComplete && parseFloat(amount) > 0 && !isLoadingWallet;

	return (
		<>
			<Flex
				direction="column"
				gap={5}
				sx={{
					animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
					animationDelay: ANIMATION.STEP_IN_DELAY,
				}}
			>
				<StepHeader
					title="Load Wallet"
					subtitle="Choose how you want to add money to your DigiKhata wallet."
					onBack={() =>
						dispatch({ type: "SET_STEP", step: "wallet-dashboard" })
					}
				/>

				<Box
					borderWidth="1px"
					borderColor="gray.200"
					borderRadius="16px"
					bg="white"
					p={4}
					boxShadow="sm"
				>
					<Flex
						justify="space-between"
						align="flex-start"
						gap={3}
						mb={3}
					>
						<Box>
							<Text
								fontSize="lg"
								fontWeight="semibold"
								color="dark"
							>
								Via E-value
							</Text>
							<Text fontSize="sm" color="gray.600" mt={1}>
								Load wallet instantly inside DigiKhata using
								amount, PIN, and OTP verification.
							</Text>
						</Box>
						<Text
							fontSize="xs"
							fontWeight="semibold"
							color="primary.DEFAULT"
							bg="primary.50"
							px={3}
							py={1}
							borderRadius="full"
						>
							In app
						</Text>
					</Flex>

					{/* Amount */}
					<Box>
						<Text
							fontSize="sm"
							fontWeight="medium"
							color="dark"
							mb={2}
						>
							Amount (₹)
						</Text>
						<NumberInput
							min={1}
							value={amount}
							onChange={(val) => setAmount(val)}
							borderRadius="10"
						>
							<NumberInputField
								placeholder="Enter amount"
								borderRadius="10"
								fontSize="xl"
								h="14"
							/>
						</NumberInput>
					</Box>

					{/* PIN */}
					<Box mt={4}>
						<Pintwin
							label="Secret PIN"
							length={4}
							onPinComplete={handlePinComplete}
							onPinChange={() => {
								setIsPinComplete(false);
								setEncodedPin("");
							}}
						/>
					</Box>

					<Button
						w="full"
						mt={4}
						bg="primary.DEFAULT"
						color="white"
						borderRadius="10"
						size="lg"
						isDisabled={!canSubmit}
						isLoading={isLoadingWallet}
						loadingText="Loading Wallet…"
						onClick={handleLoadWallet}
						sx={{
							animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
							animationDelay: ANIMATION.CTA_DELAY,
						}}
						_hover={{ bg: "primary.dark" }}
					>
						Proceed
					</Button>
				</Box>

				{mode === "self" ? (
					<>
						<Box
							borderWidth="1px"
							borderColor="gray.200"
							borderRadius="16px"
							bg="white"
							p={4}
							boxShadow="sm"
						>
							<Flex
								justify="space-between"
								align="flex-start"
								gap={3}
								mb={3}
							>
								<Box>
									<Text
										fontSize="lg"
										fontWeight="semibold"
										color="dark"
									>
										Via UPI
									</Text>
									<Text fontSize="sm" color="gray.600" mt={1}>
										Use any UPI app like GPay, BHIM,
										PhonePe, or PhonePe, or Paytm to trans
										er money to this DigiKhata VPA.
									</Text>
								</Box>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="orange.600"
									bg="orange.50"
									px={3}
									py={1}
									borderRadius="full"
								>
									External transfer
								</Text>
							</Flex>

							<Box>
								<Text
									fontSize="xs"
									fontWeight="medium"
									color="gray.500"
									mb={1}
								>
									UPI VPA
								</Text>
								<Flex align="center" gap={2}>
									<Input
										value={upiVpa}
										isReadOnly
										borderRadius="10"
									/>
									<CopyButton text={upiVpa} />
								</Flex>
							</Box>

							<Text fontSize="sm" color="gray.600" mt={3}>
								Open your preferred UPI app and send money to
								this this VPA. Your wallet balance will update r
								the the transfer is processed.
							</Text>
						</Box>

						<Box
							borderWidth="1px"
							borderColor="gray.200"
							borderRadius="16px"
							bg="white"
							p={4}
							boxShadow="sm"
						>
							<Flex
								justify="space-between"
								align="flex-start"
								gap={3}
								mb={3}
							>
								<Box>
									<Text
										fontSize="lg"
										fontWeight="semibold"
										color="dark"
									>
										Via Virtual Account
									</Text>
									<Text fontSize="sm" color="gray.600" mt={1}>
										Use your bank's online banking app or
										website to transfer money digitally to
										this this DigiKhata account.
									</Text>
								</Box>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="orange.600"
									bg="orange.50"
									px={3}
									py={1}
									borderRadius="full"
								>
									External transfer
								</Text>
							</Flex>

							<Box>
								<Text
									fontSize="xs"
									fontWeight="medium"
									color="gray.500"
									mb={1}
								>
									Virtual Account Number
								</Text>
								<Flex align="center" gap={2}>
									<Input
										value={virtualAccountNumber}
										isReadOnly
										borderRadius="10"
									/>
									<CopyButton text={virtualAccountNumber} />
								</Flex>
							</Box>

							<Box mt={3}>
								<Text
									fontSize="xs"
									fontWeight="medium"
									color="gray.500"
									mb={1}
								>
									IFSC
								</Text>
								<Flex align="center" gap={2}>
									<Input
										value={virtualAccountIfsc}
										isReadOnly
										borderRadius="10"
									/>
									<CopyButton text={virtualAccountIfsc} />
								</Flex>
							</Box>

							<Text fontSize="sm" color="gray.600" mt={3}>
								Use your bank's app to make an online transfer
								to to the account shown above. Balance will ref
								after after the transfer is processed.
							</Text>
						</Box>
					</>
				) : null}
			</Flex>
		</>
	);
};
