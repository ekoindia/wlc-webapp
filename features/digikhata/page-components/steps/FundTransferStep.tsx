import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Text,
	useToast,
} from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { Pintwin } from "tf-components/Pintwin";
import { OtpModal } from "../../components/OtpModal";
import { ANIMATION, OTP_MODAL_TITLES } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface FundTransferStepProps {
	mobile: string;
}

type TransferStatus = "idle" | "success" | "failed";

/**
 * Final step: transfer funds to the selected recipient.
 * Flow: Enter Amount + PIN → sendTransactionOtp → OtpModal
 * → initiateTransaction → show success/fail alert.
 *
 * If the selected recipient has beneficiary_id === 0 (not yet bank-registered),
 * the component shows an informational warning and blocks transfer.
 * @param root0
 * @param root0.mobile
 */
export const FundTransferStep = ({
	mobile,
}: FundTransferStepProps): JSX.Element => {
	const { state, dispatch } = useDigiKhata();
	const {
		sendTransactionOtp,
		isSendingTransactionOtp,
		initiateTransaction,
		isInitiatingTransaction,
	} = useDigiKhataApi(mobile);

	const toast = useToast();

	const recipient = state.selectedRecipient;

	const [amount, setAmount] = useState("");
	const [encodedPin, setEncodedPin] = useState("");
	const [isPinComplete, setIsPinComplete] = useState(false);
	const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
	const [transferStatus, setTransferStatus] =
		useState<TransferStatus>("idle");
	const [txnRef, setTxnRef] = useState<string | null>(null);

	if (!recipient) {
		return (
			<Flex
				direction="column"
				align="center"
				justify="center"
				py={10}
				gap={3}
			>
				<Text color="error" fontSize="sm">
					No recipient selected. Please go back and select a
					recipient.
				</Text>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						dispatch({ type: "SET_STEP", step: "recipients" })
					}
				>
					← Select Recipient
				</Button>
			</Flex>
		);
	}

	// If the recipient is not bank-registered (beneficiary_id === 0), block transfer
	if (recipient.beneficiary_id === 0) {
		return (
			<Flex
				direction="column"
				gap={4}
				sx={{
					animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
				}}
			>
				<Button
					variant="ghost"
					size="sm"
					alignSelf="flex-start"
					onClick={() =>
						dispatch({ type: "SET_STEP", step: "recipients" })
					}
					px={2}
					color="light"
				>
					← Back
				</Button>
				<Alert status="warning" borderRadius="10">
					<AlertIcon />
					<Box>
						<Text fontWeight="semibold" fontSize="sm">
							Recipient Registration Pending
						</Text>
						<Text fontSize="xs" color="light">
							{recipient.name} has not been validated by the bank
							yet. Please re-add this recipient to complete bank
							registration before transferring funds.
						</Text>
					</Box>
				</Alert>
				<Button
					w="full"
					variant="outline"
					borderRadius="10"
					onClick={() =>
						dispatch({ type: "SET_STEP", step: "add-recipient" })
					}
				>
					Re-register Recipient
				</Button>
			</Flex>
		);
	}

	const handleSendOtp = async () => {
		const numAmount = parseFloat(amount);
		if (isNaN(numAmount) || numAmount <= 0 || !isPinComplete) return false;

		const res = await sendTransactionOtp({
			amount: numAmount,
			beneficiary_id: recipient.beneficiary_id,
		});

		if (res?.data?.status === 0) {
			setIsOtpModalOpen(true);
		} else {
			toast({
				title: res?.data?.message ?? "Failed to send OTP",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
		return res;
	};

	const handleOtpSubmit = async (otp: string) => {
		const numAmount = parseFloat(amount);
		const res = await initiateTransaction({
			amount: numAmount,
			beneficiary_id: recipient.beneficiary_id,
			otp,
			pin: encodedPin,
		});

		setIsOtpModalOpen(false);
		if (res?.data?.status === 0) {
			setTransferStatus("success");
			setTxnRef(res.data.data?.transaction_id ?? null);
		} else {
			setTransferStatus("failed");
			toast({
				title: res?.data?.message ?? "Transaction failed",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
		return res;
	};

	const maskedAccount =
		recipient.accountNumber.length > 4
			? `••••${recipient.accountNumber.slice(-4)}`
			: recipient.accountNumber;

	const canSubmit =
		isPinComplete && parseFloat(amount) > 0 && !isSendingTransactionOtp;

	// Success / failure terminal states
	if (transferStatus === "success" || transferStatus === "failed") {
		return (
			<Flex
				direction="column"
				align="center"
				gap={4}
				py={6}
				sx={{
					animation: `${fadeSlideInBottom12} 0.2s ${ANIMATION.EASING} both`,
				}}
			>
				<Alert
					status={transferStatus === "success" ? "success" : "error"}
					borderRadius="12"
					flexDirection="column"
					textAlign="center"
					py={6}
				>
					<AlertIcon boxSize="36px" mb={2} />
					<Text fontWeight="bold" fontSize="md">
						{transferStatus === "success"
							? "Transfer Successful!"
							: "Transfer Failed"}
					</Text>
					{txnRef ? (
						<Text fontSize="xs" color="light" mt={1}>
							Reference: {txnRef}
						</Text>
					) : null}
				</Alert>
				<Button
					w="full"
					variant="outline"
					borderRadius="10"
					onClick={() => {
						dispatch({
							type: "SET_STEP",
							step: "wallet-dashboard",
						});
						dispatch({
							type: "SET_SELECTED_RECIPIENT",
							payload: null,
						});
					}}
				>
					Back to Dashboard
				</Button>
			</Flex>
		);
	}

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
							dispatch({ type: "SET_STEP", step: "recipients" })
						}
						px={2}
						color="light"
					>
						← Back
					</Button>
					<Text fontWeight="semibold" fontSize="md" color="dark">
						Transfer Fund
					</Text>
				</Flex>

				{/* Recipient summary */}
				<Flex
					gap={3}
					p={4}
					bg="shade"
					borderRadius="10"
					border="1px solid"
					borderColor="divider"
					align="center"
				>
					<Box flex={1}>
						<Text fontWeight="semibold" fontSize="sm" color="dark">
							{recipient.name}
						</Text>
						<Text fontSize="xs" color="light">
							{recipient.bankName} · {maskedAccount} ·{" "}
							{recipient.ifsc}
						</Text>
					</Box>
				</Flex>

				{/* Amount */}
				<Box>
					<Text fontSize="sm" fontWeight="medium" color="dark" mb={2}>
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
							h="14"
							fontSize="xl"
						/>
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</Box>

				{/* PIN */}
				<Box>
					<Pintwin
						label="Secret PIN"
						length={4}
						onPinComplete={(_pin, ep) => {
							setEncodedPin(ep);
							setIsPinComplete(true);
						}}
						onPinChange={() => {
							setIsPinComplete(false);
							setEncodedPin("");
						}}
					/>
				</Box>

				<Button
					w="full"
					bg="primary.DEFAULT"
					color="white"
					borderRadius="10"
					size="lg"
					isDisabled={!canSubmit}
					isLoading={isSendingTransactionOtp}
					loadingText="Sending OTP…"
					onClick={handleSendOtp}
					sx={{
						animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
						animationDelay: ANIMATION.CTA_DELAY,
					}}
					_hover={{ bg: "primary.dark" }}
				>
					Proceed to Transfer
				</Button>
			</Flex>

			<OtpModal
				isOpen={isOtpModalOpen}
				onClose={() => setIsOtpModalOpen(false)}
				onSubmit={handleOtpSubmit}
				onResend={handleSendOtp}
				isLoading={isInitiatingTransaction}
				title={OTP_MODAL_TITLES.TRANSFER}
				mobileHint={`XXXXXX${mobile.slice(-4)}`}
				otpLength={4}
			/>
		</>
	);
};
