import {
	Box,
	Button,
	Flex,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Text,
	useToast,
} from "@chakra-ui/react";
import { CopyButton } from "components";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { Pintwin } from "tf-components/Pintwin";
import { OtpModal } from "../../components/OtpModal";
import { ANIMATION, OTP_MODAL_TITLES } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface LoadWalletStepProps {
	mobile: string;
}

/**
 * Lets the agent load funds into their DigiKhata wallet.
 * Flow: Enter Amount + PIN → loadWallet → generateSenderOtp → OtpModal
 * → verifySenderOtp → hydrate wallet → back to dashboard.
 * @param root0
 * @param root0.mobile
 */
export const LoadWalletStep = ({
	mobile,
}: LoadWalletStepProps): JSX.Element => {
	const { state, dispatch } = useDigiKhata();
	const {
		loadWallet,
		isLoadingWallet,
		generateSenderOtp,
		isGeneratingSenderOtp,
		verifySenderOtp,
		isVerifyingSenderOtp,
	} = useDigiKhataApi(mobile);

	const toast = useToast();

	const [amount, setAmount] = useState("");
	const [encodedPin, setEncodedPin] = useState("");
	const [isPinComplete, setIsPinComplete] = useState(false);
	const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
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
			// refresh the current balance
			// if (otpRes?.data?.response_type_id === 2129) {
			// 	dispatch({
			// 		type: "SET_OTP_REF_ID",
			// 		payload: otpRes?.data?.data?.otp_ref_id ?? null,
			// 	});
			// 	setIsOtpModalOpen(true);
			// } else {
			// 	toast({
			// 		title: otpRes?.data?.message ?? "Failed to send OTP",
			// 		status: "error",
			// 		duration: 4000,
			// 		isClosable: true,
			// 	});
			// }
		} else {
			toast({
				title: res?.data?.message ?? "Failed to load wallet",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
	};

	const handleOtpSubmit = async (otp: string) => {
		if (!state.otpRefId) {
			toast({
				title: "Missing OTP reference. Please request OTP again.",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
			return null;
		}

		const res = await verifySenderOtp({
			otp,
			otp_ref_id: state.otpRefId,
		});
		if (res?.data?.status === 0) {
			dispatch({ type: "SET_WALLET_DATA", payload: res.data.data });
			setIsOtpModalOpen(false);
			toast({
				title: "Wallet loaded successfully!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			dispatch({ type: "SET_STEP", step: "wallet-dashboard" });
		} else {
			toast({
				title: res?.data?.message ?? "Invalid OTP",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
		return res;
	};

	const canSubmit =
		isPinComplete &&
		parseFloat(amount) > 0 &&
		!isLoadingWallet &&
		!isGeneratingSenderOtp;

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
				<Flex align="center" gap={3}>
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							dispatch({
								type: "SET_STEP",
								step: "wallet-dashboard",
							})
						}
						px={2}
						color="light"
					>
						← Back
					</Button>
					<Text fontWeight="semibold" fontSize="md" color="dark">
						Load Wallet
					</Text>
				</Flex>

				<Text fontSize="sm" color="gray.600">
					Choose how you want to add money to your DigiKhata wallet.
				</Text>

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
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
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
						isLoading={isLoadingWallet || isGeneratingSenderOtp}
						loadingText={
							isLoadingWallet ? "Loading Wallet…" : "Sending OTP…"
						}
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
								Use any UPI app like GPay, BHIM, PhonePe, or
								Paytm to transfer money to this DigiKhata VPA.
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
						Open your preferred UPI app and send money to this VPA.
						Your wallet balance will update after the transfer is
						processed.
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
								Use your bank's online banking app or website to
								transfer money digitally to this DigiKhata
								account.
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
						Use your bank's app to make an online transfer to the
						account shown above. Balance will reflect after the
						transfer is processed.
					</Text>
				</Box>
			</Flex>

			<OtpModal
				isOpen={isOtpModalOpen}
				onClose={() => setIsOtpModalOpen(false)}
				onSubmit={handleOtpSubmit}
				onResend={generateSenderOtp}
				isLoading={isVerifyingSenderOtp}
				title={OTP_MODAL_TITLES.SENDER_VERIFY}
				mobileHint={`XXXXXX${mobile.slice(-4)}`}
			/>
		</>
	);
};
