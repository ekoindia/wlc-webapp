import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { Select } from "components/Select";
import { useBankList } from "hooks";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { OtpModal } from "../../components/OtpModal";
import { StepHeader } from "../../components/StepHeader";
import { ANIMATION, OTP_MODAL_TITLES } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface AddRecipientStepProps {
	mobile: string;
}

interface BankOption {
	label: string;
	value: string | number;
}

/**
 * Form to register a new fund transfer recipient.
 * Flow: fill details → sendAddRecipientOtp → OtpModal → addRecipient
 * → ADD_RECIPIENT (with isNew flag) → navigate to recipients list.
 * @param {object} root0 - Component props
 * @param {string} root0.mobile - User's mobile number for API calls
 * @returns {JSX.Element} Recipient registration form with bank selection and OTP verification
 */
export const AddRecipientStep = ({
	mobile,
}: AddRecipientStepProps): JSX.Element => {
	const { dispatch } = useDigiKhata();
	const {
		sendAddRecipientOtp,
		isSendingAddRecipientOtp,
		verifySenderBankOtp,
		isVerifyingSenderBankOtp,
	} = useDigiKhataApi(mobile);

	const { banks, isLoading: isBanksLoading } = useBankList();

	const toast = useToast();

	const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
	const [accountNumber, setAccountNumber] = useState("");
	const [ifsc, setIfsc] = useState("");
	const [recipientMobile, setRecipientMobile] = useState("");
	const [recipientName, setRecipientName] = useState("");
	const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
const [otpRefId, setOtpRefId] = useState<string>("");

	const isFormValid =
		!!selectedBank &&
		accountNumber.trim().length >= 6 &&
		ifsc.trim().length === 11 &&
		recipientMobile.trim().length === 10 &&
		recipientName.trim().length >= 2;

	const handleSendOtp = async () => {
		if (!isFormValid) return false;

		const res = await sendAddRecipientOtp({
			account: accountNumber.trim(),
			ifsc: ifsc.trim().toUpperCase(),
			recipient_name: recipientName.trim(),
			recipient_mobile: recipientMobile.trim(),
			bank_code: selectedBank!.value,
		});

		if (res?.data?.status === 0) {
			// console.log("OTP sent successfully:", res.data);
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
		const res = await verifySenderBankOtp({
			otp,
			otp_ref_id: otpRefId,
		});

		if (res?.data?.status === 0) {
			// const recipientData = res.data.data?.recipient;
			// const newRecipient = {
			// 	recipient_id: recipientData?.recipient_id ?? 0,
			// 	bank_recipient_id: recipientData?.bank_recipient_id ?? null,
			// 	name: recipientData?.recipient_name ?? recipientName.trim(),
			// 	accountNumber: accountNumber.trim(),
			// 	ifsc: ifsc.trim().toUpperCase(),
			// 	bankName: selectedBank!.label,
			// 	accountType: "Bank Account",
			// 	isVerified: recipientData?.is_verified === 1,
			// 	mobile: recipientMobile.trim(),
			// 	recipientIdType: "acc_ifsc",
			// 	beneficiary_id: res.data.data?.beneficiary_id ?? null,
			// 	isNew: true,
			// };
			// dispatch({
			// 	type: "ADD_RECIPIENT",
			// 	payload: newRecipient,
			// });
			setIsOtpModalOpen(false);
			toast({
				title: "Recipient added successfully!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			dispatch({ type: "SET_STEP", step: "recipients" });
		} else {
			toast({
				title: res?.data?.message ?? "Failed to add recipient",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
		return res;
	};

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
					title="Add Recipient"
					onBack={() =>
						dispatch({ type: "SET_STEP", step: "recipients" })
					}
				/>

				{/* Bank selector */}
				<Select
					label="Bank"
					options={banks}
					value={selectedBank}
					required={true}
					onChange={(opt: BankOption) => setSelectedBank(opt)}
					placeholder="Select bank…"
					isLoading={isBanksLoading}
					renderer={{ label: "label", value: "value" }}
				/>

				{/* Account Number */}
				<Box>
					<Text fontSize="sm" fontWeight="medium" color="dark" mb={2}>
						Account Number
					</Text>
					<Input
						type="tel"
						inputMode="numeric"
						value={accountNumber}
						onChange={(e) =>
							setAccountNumber(e.target.value.replace(/\D/g, ""))
						}
						placeholder="Enter account number"
						borderRadius="10"
						required={true}
						size="lg"
					/>
				</Box>

				{/* IFSC */}
				<Box>
					<Text fontSize="sm" fontWeight="medium" color="dark" mb={2}>
						IFSC Code
					</Text>
					<Input
						type="text"
						maxLength={11}
						value={ifsc}
						onChange={(e) =>
							setIfsc(e.target.value.toUpperCase().slice(0, 11))
						}
						placeholder="e.g. HDFC0001234"
						borderRadius="10"
						size="lg"
						required={true}
						textTransform="uppercase"
						letterSpacing="wider"
					/>
					{ifsc.length > 0 && ifsc.length !== 11 ? (
						<Text fontSize="xs" color="error" mt={1}>
							IFSC must be exactly 11 characters.
						</Text>
					) : null}
				</Box>

				{/* Beneficiary Name */}
				<Box>
					<Text fontSize="sm" fontWeight="medium" color="dark" mb={2}>
						Recipient's Name
					</Text>
					<Input
						type="text"
						value={recipientName}
						onChange={(e) => setRecipientName(e.target.value)}
						placeholder="As per bank records"
						borderRadius="10"
						required={true}
						size="lg"
					/>
				</Box>

				{/* Recipient Mobile */}
				<Box>
					<Text fontSize="sm" fontWeight="medium" color="dark" mb={2}>
						Recipient's Mobile Number
					</Text>
					<Input
						type="tel"
						inputMode="numeric"
						maxLength={10}
						value={recipientMobile}
						onChange={(e) =>
							setRecipientMobile(
								e.target.value.replace(/\D/g, "").slice(0, 10)
							)
						}
						placeholder="Enter beneficiary mobile number"
						borderRadius="10"
						required={true}
						size="lg"
					/>
					{recipientMobile.length > 0 &&
					recipientMobile.length !== 10 ? (
						<Text fontSize="xs" color="error" mt={1}>
							Mobile number must be exactly 10 digits.
						</Text>
					) : null}
				</Box>

				<Button
					w="full"
					bg="primary.DEFAULT"
					color="white"
					borderRadius="10"
					size="lg"
					isDisabled={!isFormValid}
					isLoading={isSendingAddRecipientOtp}
					loadingText="Sending OTP…"
					onClick={handleSendOtp}
					sx={{
						animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
						animationDelay: ANIMATION.CTA_DELAY,
					}}
					_hover={{ bg: "primary.dark" }}
				>
					Add Recipient
				</Button>
			</Flex>

			<OtpModal
				isOpen={isOtpModalOpen}
				onClose={() => setIsOtpModalOpen(false)}
				onSubmit={handleOtpSubmit}
				onResend={handleSendOtp}
				isLoading={isVerifyingSenderBankOtp}
				title={OTP_MODAL_TITLES.ADD_RECIPIENT}
				mobileHint={`XXXXXX${mobile.slice(-4)}`}
			/>
		</>
	);
};
