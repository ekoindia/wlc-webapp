import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { OtpModal } from "../../components/OtpModal";
import { ANIMATION, OTP_MODAL_TITLES } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface AadhaarVerificationStepProps {
	mobile: string;
}

const AADHAAR_REGEX = /^\d{12}$/;

/**
 * Step 2 of KYC: collect 12-digit Aadhaar, generate OTP, validate OTP.
 * On success navigates to PAN verification.
 * @param root0
 * @param root0.mobile
 */
export const AadhaarVerificationStep = ({
	mobile,
}: AadhaarVerificationStepProps): JSX.Element => {
	const { state, dispatch } = useDigiKhata();
	const {
		generateAadhaarOtp,
		isGeneratingAadhaarOtp,
		validateAadhaarOtp,
		isValidatingAadhaarOtp,
	} = useDigiKhataApi(mobile);

	const toast = useToast();

	const [aadhaar, setAadhaar] = useState(state.aadhaarNumber ?? "");
	const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

	const handleSendOtp = async () => {
		if (!AADHAAR_REGEX.test(aadhaar)) return false;
		dispatch({ type: "SET_AADHAAR_NUMBER", payload: aadhaar });

		const res = await generateAadhaarOtp({ aadhaar });
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
		const res = await validateAadhaarOtp({
			aadhaar,
			otp,
			consent_id: state.consentId,
		});

		if (res?.data?.status === 0) {
			setIsOtpModalOpen(false);
			dispatch({ type: "SET_STEP", step: "pan-verify" });
		} else {
			const msg = res?.data?.message ?? "Invalid OTP. Please try again.";
			toast({
				title: msg,
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
		return res;
	};

	const isValid = AADHAAR_REGEX.test(aadhaar);

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
						Aadhaar Verification
					</Text>
					<Text fontSize="sm" color="light">
						Enter your 12-digit Aadhaar number. An OTP will be sent
						to your Aadhaar-linked mobile.
					</Text>
				</Flex>

				<Box>
					<Text fontSize="sm" fontWeight="medium" color="dark" mb={2}>
						Aadhaar Number
					</Text>
					<Input
						type="tel"
						inputMode="numeric"
						maxLength={12}
						value={aadhaar}
						onChange={(e) =>
							setAadhaar(
								e.target.value.replace(/\D/g, "").slice(0, 12)
							)
						}
						placeholder="Enter 12-digit Aadhaar"
						borderRadius="10"
						size="lg"
						letterSpacing="widest"
						borderColor={
							aadhaar.length === 12 && !isValid
								? "error"
								: "divider"
						}
					/>
					{aadhaar.length > 0 && !isValid ? (
						<Text fontSize="xs" color="error" mt={1}>
							Aadhaar must be exactly 12 digits.
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
					isLoading={isGeneratingAadhaarOtp}
					loadingText="Sending OTP…"
					onClick={handleSendOtp}
					sx={{
						animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
						animationDelay: ANIMATION.CTA_DELAY,
					}}
					_hover={{ bg: "primary.dark" }}
				>
					Send OTP
				</Button>
			</Flex>

			<OtpModal
				isOpen={isOtpModalOpen}
				onClose={() => setIsOtpModalOpen(false)}
				onSubmit={handleOtpSubmit}
				onResend={handleSendOtp}
				isLoading={isValidatingAadhaarOtp}
				title={OTP_MODAL_TITLES.AADHAAR}
				mobileHint="Aadhaar-linked mobile"
				otpLength={4}
			/>
		</>
	);
};
