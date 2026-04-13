import {
	Alert,
	AlertIcon,
	Box,
	Divider,
	Flex,
	NumberInput,
	NumberInputField,
	Spinner,
	Switch,
	Text,
	useToast,
} from "@chakra-ui/react";
import { Button, Icon, JsonViewer, PrintReceipt, Share } from "components";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { historyParametersMetadata } from "page-components/History/HistoryTable/historyParametersMetadata";
import {
	showInPrint,
	showOnScreen,
} from "page-components/History/HistoryTable/historyUtils";
import { useState } from "react";
import { Pintwin } from "tf-components/Pintwin";
import { printPage } from "utils";
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
const MAX_AMOUNT = 49800;

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

	const headerBg = isSuccess
		? "linear-gradient(rgba(0, 195, 65, 0.15), rgba(0, 195, 65, 0.15)), white"
		: isPending
			? "blue.50"
			: "linear-gradient(rgba(255, 64, 129, 0.15), rgba(255, 64, 129, 0.15)), white";

	const headerBorderColor = isSuccess
		? "rgba(0, 195, 65, 0.4)"
		: isPending
			? "blue.200"
			: "rgba(255, 64, 129, 0.4)";

	const iconName = isSuccess ? "check-circle" : "warning";
	const iconColor = isSuccess ? "success" : "error";

	const title = isSuccess
		? "Transfer Successful!"
		: isPending
			? "Processing Transfer…"
			: "Transfer Failed";

	const subtitle = isSuccess
		? "Your funds have been transferred successfully."
		: isPending
			? "Your transfer is being processed. Please wait."
			: "The transfer could not be completed. Please try again.";

	// Build a merged row for metadata lookups
	const row: Record<string, unknown> = {
		...(txnRef ? { transaction_id: txnRef } : {}),
		...(txnData ?? {}),
	};

	// Filter metadata to expanded/detail entries only (not table columns)
	const expandedMeta = historyParametersMetadata.filter(
		(col) => !col.visible_in_table
	);

	interface MetaField {
		label: string;
		value: unknown;
		display_media_id: number | undefined;
	}

	const matchedFields: MetaField[] = expandedMeta.reduce<MetaField[]>(
		(acc, col) => {
			const raw = row[col.name];
			if (raw === null || raw === undefined || raw === "") return acc;
			const value = col.compute ? col.compute(raw, row, 0) : raw;
			if (value === null || value === undefined || value === "")
				return acc;
			acc.push({
				label: col.label,
				value,
				display_media_id: col.display_media_id,
			});
			return acc;
		},
		[]
	);

	const screenFields = matchedFields.filter((f) =>
		showOnScreen(f.display_media_id)
	);
	const printFields = matchedFields.filter((f) =>
		showInPrint(f.display_media_id)
	);

	const screenData = Object.fromEntries(
		screenFields.map((f) => [f.label, f.value])
	);
	const keyOverrides = Object.fromEntries(
		screenFields.map((f) => [f.label, f.label])
	);

	const shareText = printFields
		.map((f) => `${f.label}: ${f.value}`)
		.join("\n");

	return (
		<Flex
			direction="column"
			gap={4}
			sx={{
				animation: `${fadeSlideInBottom12} 0.2s ${ANIMATION.EASING} both`,
			}}
		>
			{/* Status header */}
			<Box
				p={6}
				bg={headerBg}
				border="1px solid"
				borderColor={headerBorderColor}
				borderRadius="12"
				textAlign="center"
				sx={{ "@media print": { display: "none" } }}
			>
				{isPending ? (
					<Flex justify="center" mb={3}>
						<Spinner size="lg" color="blue.500" />
					</Flex>
				) : (
					<Flex justify="center" mb={3}>
						<Icon name={iconName} size="xl" color={iconColor} />
					</Flex>
				)}
				<Text fontWeight="bold" fontSize="lg" color="dark">
					{title}
				</Text>
				<Text fontSize="sm" color="light" mt={1}>
					{subtitle}
				</Text>
				{txnRef ? (
					<Text fontSize="xs" color="light" mt={2}>
						Ref: {txnRef}
					</Text>
				) : null}
			</Box>

			{/* Transaction details */}
			{screenFields.length > 0 ? (
				<Box
					border="1px solid"
					borderColor="divider"
					borderRadius="12"
					bg="white"
					p={4}
					sx={{ "@media print": { display: "none" } }}
				>
					<Text
						fontSize="xs"
						fontWeight="semibold"
						color="light"
						textTransform="uppercase"
						letterSpacing="wide"
						mb={3}
					>
						Transaction Details
					</Text>
					<JsonViewer
						data={screenData}
						keyOverrides={keyOverrides}
						collapseAfterLevel={2}
					/>
				</Box>
			) : null}

			{/* Print receipt (print-only) */}
			<PrintReceipt heading="Transaction Receipt" receiptTnc={undefined}>
				{printFields.map((f) => (
					<Flex
						key={String(f.label)}
						justify="space-between"
						sx={{
							display: "none",
							"@media print": { display: "flex" },
						}}
					>
						<Text fontSize="sm" color="light">
							{String(f.label)}
						</Text>
						<Text fontSize="sm" fontWeight="medium" color="dark">
							{String(f.value)}
						</Text>
					</Flex>
				))}
			</PrintReceipt>

			{/* Actions + Back button */}
			{isPending ? null : (
				<>
					<Divider />
					<Flex
						direction="row"
						align="center"
						justify="flex-end"
						gap={4}
						sx={{
							"@media print": { display: "none !important" },
						}}
					>
						<Button
							variant="link"
							fontSize="xs"
							size="md"
							icon="print"
							// color="accent.DEFAULT"
							onClick={() => printPage("DigiKhata Receipt")}
						>
							Print
						</Button>
						<Share
							title="DigiKhata Transaction Receipt"
							text={shareText}
							variant="link"
							size="md"
							labelProps={{ fontSize: "xs" }}
						/>
					</Flex>
					<Button
						w="full"
						variant="outline"
						borderRadius="10"
						onClick={onBack}
						sx={{
							"@media print": { display: "none !important" },
						}}
					>
						Back to Dashboard
					</Button>
				</>
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
	const [isSchedule, setIsSchedule] = useState(false);

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
			isschedule: isSchedule,
		});

		if (res?.data?.status === 0) {
			setOtpRefId(res.data.data?.otp_ref_id);
			setIsOtpModalOpen(true);
		} else {
			toast({
				title: res?.data?.message ?? "Failed to send OTP",
				description: res?.data?.data?.description ?? "",
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
				description:
					res?.data?.data?.description ?? "Please try again later.",
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

				{/* Schedule Transfer */}
				<Flex align="center" justify="space-between">
					<Box>
						<Text fontSize="sm" fontWeight="medium" color="dark">
							Schedule
						</Text>
						<Text fontSize="xs" color="light">
							Schedule this transfer to be sent automatically
							after recipient verification.
						</Text>
					</Box>
					<Switch
						size={{ base: "sm", md: "md" }}
						variant="primary"
						isChecked={isSchedule}
						onChange={() => setIsSchedule((prev) => !prev)}
					/>
				</Flex>

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
