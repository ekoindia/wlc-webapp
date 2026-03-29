import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { OtpModal } from "../../components/OtpModal";
import { ANIMATION, OTP_MODAL_TITLES } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface PanVerificationStepProps {
	mobile: string;
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/**
 * Step 3 of KYC: validates PAN, then sends sender OTP → on success
 * hydrates wallet data and navigates to the wallet dashboard.
 * @param root0
 * @param root0.mobile
 */
export const PanVerificationStep = ({
	mobile,
}: PanVerificationStepProps): JSX.Element => {
	const { dispatch } = useDigiKhata();
	const {
		validatePan,
		isValidatingPan,
		generateSenderOtp,
		isGeneratingSenderOtp,
		verifySenderOtp,
		isVerifyingSenderOtp,
	} = useDigiKhataApi(mobile);

	const toast = useToast();

	const [pan, setPan] = useState("");
	const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

	const handleValidatePan = async () => {
		if (!PAN_REGEX.test(pan)) return;

		const res = await validatePan({ pan });
		if (res?.data?.status === 0) {
			// PAN validated — now trigger sender OTP for wallet hydration
			const otpRes = await generateSenderOtp();
			if (otpRes?.data?.status === 0) {
				setIsOtpModalOpen(true);
			} else {
				toast({
					title: otpRes?.data?.message ?? "Failed to send OTP",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		} else {
			toast({
				title: res?.data?.message ?? "PAN validation failed",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
	};

	const handleOtpSubmit = async (otp: string) => {
		const res = await verifySenderOtp({ otp });
		if (res?.data?.status === 0) {
			dispatch({ type: "SET_WALLET_DATA", payload: res.data.data });
			setIsOtpModalOpen(false);
			dispatch({ type: "SET_STEP", step: "wallet-dashboard" });
		} else {
			toast({
				title: res?.data?.message ?? "Invalid OTP. Please try again.",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
		return res;
	};

	const handleResendOtp = async () => {
		const res = await generateSenderOtp();
		if (res?.data?.status !== 0) {
			toast({
				title: res?.data?.message ?? "Failed to send OTP",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
		return res;
	};

	const isValid = PAN_REGEX.test(pan);
	const isWorking = isValidatingPan || isGeneratingSenderOtp;

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
				<Flex direction="column" gap={1}>
					<Text fontWeight="semibold" fontSize="md" color="dark">
						PAN Verification
					</Text>
					<Text fontSize="sm" color="light">
						Enter your PAN card number to complete KYC and open your
						wallet.
					</Text>
				</Flex>

				<Box>
					<Text fontSize="sm" fontWeight="medium" color="dark" mb={2}>
						PAN Number
					</Text>
					<Input
						type="text"
						maxLength={10}
						value={pan}
						onChange={(e) =>
							setPan(e.target.value.toUpperCase().slice(0, 10))
						}
						placeholder="e.g. ABCDE1234F"
						borderRadius="10"
						size="lg"
						letterSpacing="widest"
						textTransform="uppercase"
						borderColor={
							pan.length === 10 && !isValid ? "error" : "divider"
						}
					/>
					{pan.length > 0 && !isValid ? (
						<Text fontSize="xs" color="error" mt={1}>
							Invalid PAN format (e.g. ABCDE1234F).
						</Text>
					) : null}
				</Box>

				<Button
					w="full"
					bg="primary.DEFAULT"
					color="white"
					borderRadius="10"
					size="lg"
					isDisabled={!isValid}
					isLoading={isWorking}
					loadingText="Validating…"
					onClick={handleValidatePan}
					sx={{
						animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
						animationDelay: ANIMATION.CTA_DELAY,
					}}
					_hover={{ bg: "primary.dark" }}
				>
					Validate PAN &amp; Open Wallet
				</Button>
			</Flex>

			<OtpModal
				isOpen={isOtpModalOpen}
				onClose={() => setIsOtpModalOpen(false)}
				onSubmit={handleOtpSubmit}
				onResend={handleResendOtp}
				isLoading={isVerifyingSenderOtp}
				title={OTP_MODAL_TITLES.SENDER_VERIFY}
				mobileHint={`XXXXXX${mobile.slice(-4)}`}
				otpLength={4}
			/>
		</>
	);
};
