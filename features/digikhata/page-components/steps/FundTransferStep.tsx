import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	NumberInput,
	NumberInputField,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import { Icon, JsonViewer } from "components";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { Pintwin } from "tf-components/Pintwin";
import { OtpModal } from "../../components/OtpModal";
import { StepHeader } from "../../components/StepHeader";
import { ANIMATION, OTP_MODAL_TITLES } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface FundTransferStepProps {
	mobile: string;
	onFetchBalance: () => void;
}

type TransferStatus = "idle" | "pending" | "success" | "failed";

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 50000;

interface TransferStatusCardProps {
	status: Exclude<TransferStatus, "idle">;
	txnRef: string | null;
	txnData: Record<string, unknown> | null;
	onBack: () => void;
}

const TransferStatusCard = ({
	status,
	txnRef,
	txnData,
	onBack,
}: TransferStatusCardProps): JSX.Element => {
	const isSuccess = status === "success";
	const isPending = status === "pending";

	const borderColor = isSuccess
		? "rgba(0, 195, 65, 0.4)"
		: isPending
			? "blue.200"
			: "rgba(255, 64, 129, 0.4)";

	const bg = isSuccess
		? "linear-gradient(rgba(0, 195, 65, 0.15), rgba(0, 195, 65, 0.15)), white"
		: isPending
			? "blue.50"
			: "linear-gradient(rgba(255, 64, 129, 0.15), rgba(255, 64, 129, 0.15)), white";

	const iconName = isSuccess ? "check-circle" : "warning";
	const iconColor = isSuccess ? "success" : "error";

	const title = isSuccess
		? "Transfer Successful!"
		: isPending
			? "Processing Transfer…"
			: "Transfer Failed";

	const displayData: Record<string, unknown> = {
		...(txnRef ? { transaction_id: txnRef } : {}),
		...(txnData ?? {}),
	};

	return (
		<Flex
			direction="column"
			gap={4}
			sx={{
				animation: `${fadeSlideInBottom12} 0.2s ${ANIMATION.EASING} both`,
			}}
		>
			<Box
				border="1px solid"
				borderColor={borderColor}
				bg={bg}
				borderRadius="12"
				overflow="hidden"
			>
				{/* Header */}
				<Flex p={4} align="center" gap={3}>
					{isPending ? (
						<Spinner size="sm" color="blue.500" />
					) : (
						<Icon name={iconName} size="sm" color={iconColor} />
					)}
					<Box flex={1}>
						<Text fontWeight="bold" fontSize="md" color="dark">
							{title}
						</Text>
						{txnRef ? (
							<Text fontSize="xs" color="light">
								Ref: {txnRef}
							</Text>
						) : null}
					</Box>
				</Flex>

				{/* Transaction details */}
				{Object.keys(displayData).length > 0 ? (
					<Box
						px={4}
						pb={4}
						pt={2}
						borderTop="1px"
						borderColor="gray.100"
						bg="white"
					>
						<JsonViewer data={displayData} collapseAfterLevel={2} />
					</Box>
				) : null}
			</Box>

			{isPending ? null : (
				<Button
					w="full"
					variant="outline"
					borderRadius="10"
					onClick={onBack}
				>
					Back to Dashboard
				</Button>
			)}
		</Flex>
	);
};

/**
 * Final step: transfer funds to the selected recipient.
 * Flow: Enter Amount + PIN → sendTransactionOtp → OtpModal
 * → initiateTransaction → show success/fail alert.
 *
 * If the selected recipient has beneficiary_id === 0 (not yet bank-registered),
 * the component shows an informational warning and blocks transfer.
 * @param {object} root0 - Component props
 * @param {string} root0.mobile - User's mobile number for API calls
 * @param {Function} root0.onFetchBalance - Callback to refresh wallet balance and navigate to dashboard
 * @returns {JSX.Element} Fund transfer form with amount, PIN, OTP confirmation, and status display
 */
export const FundTransferStep = ({
	mobile,
	onFetchBalance,
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
	const [txnData, setTxnData] = useState<Record<string, unknown> | null>(
		null
	);
	const [otpRefId, setOtpRefId] = useState(null);

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

	// If the recipient is not bank-registered (beneficiary_id === 0 or null), block transfer
	if (!recipient.beneficiary_id) {
		return (
			<Flex
				direction="column"
				gap={4}
				sx={{
					animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
				}}
			>
				<StepHeader
					title="Transfer Fund"
					onBack={() =>
						dispatch({ type: "SET_STEP", step: "recipients" })
					}
				/>
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
		if (
			isNaN(numAmount) ||
			numAmount < MIN_AMOUNT ||
			numAmount > MAX_AMOUNT ||
			!isPinComplete
		)
			return false;

		const res = await sendTransactionOtp({
			amount: numAmount,
			beneficiary_id: recipient.beneficiary_id,
			recipient_id: recipient.recipient_id,
			customer_id: mobile,
		});

		if (res?.data?.status === 0) {
			setOtpRefId(res.data.data?.otp_ref_id);
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
		setIsOtpModalOpen(false);
		setTransferStatus("pending");

		const res = await initiateTransaction({
			amount: numAmount,
			beneficiary_id: recipient.beneficiary_id,
			recipient_id: recipient.recipient_id,
			bank_recipient: recipient.recipient_id,
			otp,
			pin: encodedPin,
			customer_id: mobile,
			otp_ref_id: otpRefId,
			name: recipient.name,
		});

		if (res?.data?.status === 0) {
			setTransferStatus("success");
			setTxnRef(res.data.data?.transaction_id ?? null);
			setTxnData(res.data.data ?? null);
		} else {
			setTransferStatus("failed");
			setTxnData(res.data?.data ?? null);
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

	const numAmount = parseFloat(amount);
	const isAmountValid =
		!isNaN(numAmount) && numAmount >= MIN_AMOUNT && numAmount <= MAX_AMOUNT;
	const canSubmit =
		isPinComplete && isAmountValid && !isSendingTransactionOtp;

	// Non-idle terminal states (pending / success / failed)
	if (transferStatus !== "idle") {
		return (
			<TransferStatusCard
				status={transferStatus}
				txnRef={txnRef}
				txnData={txnData}
				onBack={() => {
					onFetchBalance();
				}}
			/>
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
				<StepHeader
					title="Transfer Fund"
					onBack={() =>
						dispatch({ type: "SET_STEP", step: "recipients" })
					}
				/>

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
						value={amount}
						onChange={(val) => {
							const num = parseFloat(val);
							if (!isNaN(num) && num > MAX_AMOUNT) return;
							setAmount(val);
						}}
						borderRadius="10"
						focusBorderColor={
							amount !== "" && !isAmountValid
								? "error"
								: "primary.DEFAULT"
						}
					>
						<NumberInputField
							placeholder="Enter amount"
							borderRadius="10"
							h="14"
							fontSize="xl"
							borderColor={
								amount !== "" && !isAmountValid
									? "error"
									: undefined
							}
							_hover={{
								borderColor:
									amount !== "" && !isAmountValid
										? "error"
										: undefined,
							}}
						/>
					</NumberInput>
					<Text
						fontSize="xs"
						color={isAmountValid ? "light" : "error"}
						mt={1}
					>
						{""}
						Amount should be between ₹{MIN_AMOUNT.toLocaleString()}{" "}
						and ₹{MAX_AMOUNT.toLocaleString()}
					</Text>
				</Box>

				{/* PIN */}
				<Box>
					<Pintwin
						label="Your Secret PIN"
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
					Transfer
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
			/>
		</>
	);
};
