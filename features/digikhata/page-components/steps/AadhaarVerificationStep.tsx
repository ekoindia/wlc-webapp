import {
	Box,
	Button,
	Flex,
	Input,
	SimpleGrid,
	Text,
	useToast,
} from "@chakra-ui/react";
import { Icon } from "components";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import UidaiFingerprintScanner from "tf-components/UidaiFingerprint/UidaiFingerprintScanner";
import { OtpModal } from "../../components/OtpModal";
import { StepHeader } from "../../components/StepHeader";
import { ANIMATION, OTP_MODAL_TITLES } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface AadhaarVerificationStepProps {
	mobile: string;
}

const AADHAAR_REGEX = /^\d{12}$/;

/**
 * Step 2 of KYC: select validation method, collect 12-digit Aadhaar,
 * verify via OTP or Biometrics. On success navigates to PAN verification.
 * @param {object} root0 - Component props
 * @param {string} root0.mobile - User's mobile number for API calls
 * @returns {JSX.Element} Aadhaar input form with OTP/Biometric verification
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
		validateAadhaarBiometric,
		isValidatingAadhaarBiometric,
	} = useDigiKhataApi(mobile);

	const toast = useToast();

	const [aadhaar, setAadhaar] = useState(state.aadhaarNumber ?? "");
	const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
	const [pidData, setPidData] = useState("");
	const [isScanValid, setIsScanValid] = useState(false);

	const handleSendOtp = async () => {
		if (!AADHAAR_REGEX.test(aadhaar)) return false;
		dispatch({ type: "SET_AADHAAR_NUMBER", payload: aadhaar });

		const res = await generateAadhaarOtp({ aadhar: aadhaar });
		if (res?.data?.status === 0) {
			dispatch({
				type: "SET_AADHAAR_OTP_DATA",
				payload: {
					intentId: res.data.data.intent_id,
					otpRefId: res.data.data.otp_ref_id,
				},
			});
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
			aadhar: aadhaar,
			otp,
			consent_id: state.consentId,
			intent_id: state.aadhaarIntentId,
			otp_ref_id: state.aadhaarOtpRefId,
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

	const handleVerifyBiometric = async () => {
		if (!AADHAAR_REGEX.test(aadhaar) || !pidData) return;
		dispatch({ type: "SET_AADHAAR_NUMBER", payload: aadhaar });

		const res = await validateAadhaarBiometric({
			aadhar: aadhaar,
			piddata: pidData,
		});

		if (res?.data?.status === 0) {
			dispatch({ type: "SET_STEP", step: "pan-verify" });
		} else {
			toast({
				title: res?.data?.message ?? "Biometric verification failed",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
	};

	const setMethod = (method: "otp" | "biometrics") => {
		dispatch({ type: "SET_AADHAAR_KYC_METHOD", payload: method });
	};

	const goBackToMethodSelection = () => {
		dispatch({ type: "SET_AADHAAR_KYC_METHOD", payload: null });
	};

	const isValid = AADHAAR_REGEX.test(aadhaar);

	if (!state.aadhaarKycMethod) {
		return (
			<Flex
				direction="column"
				gap={5}
				sx={{
					animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
				}}
			>
				<StepHeader
					title="Aadhaar Verification"
					subtitle="Choose an option to verify your Aadhaar."
				/>
				<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
					<Flex
						direction="column"
						align="center"
						justify="center"
						bg="shade"
						borderRadius="10"
						p={6}
						cursor="pointer"
						border="1px solid"
						borderColor="divider"
						transition="all 0.2s"
						_hover={{
							borderColor: "primary.DEFAULT",
							bg: "primary.tint",
						}}
						onClick={() => setMethod("otp")}
					>
						<Icon
							name="message"
							size="lg"
							color="primary.DEFAULT"
							mb={3}
						/>
						<Text fontWeight="medium" color="dark">
							Via OTP
						</Text>
						<Text
							fontSize="xs"
							color="light"
							textAlign="center"
							mt={1}
						>
							OTP will be sent to your Aadhaar-linked mobile
						</Text>
					</Flex>

					<Flex
						direction="column"
						align="center"
						justify="center"
						bg="shade"
						borderRadius="10"
						p={6}
						cursor="pointer"
						border="1px solid"
						borderColor="divider"
						transition="all 0.2s"
						_hover={{
							borderColor: "primary.DEFAULT",
							bg: "primary.tint",
						}}
						onClick={() => setMethod("biometrics")}
					>
						<Icon
							name="fingerprint"
							size="lg"
							color="primary.DEFAULT"
							mb={3}
						/>
						<Text fontWeight="medium" color="dark">
							Via Biometrics
						</Text>
						<Text
							fontSize="xs"
							color="light"
							textAlign="center"
							mt={1}
						>
							Verify using fingerprint scanner
						</Text>
					</Flex>
				</SimpleGrid>
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
				<Flex align="flex-start" gap={3}>
					<StepHeader
						title={`Aadhaar Verification (${
							state.aadhaarKycMethod === "otp"
								? "Via OTP"
								: "Via Biometrics"
						})`}
						subtitle={
							state.aadhaarKycMethod === "otp"
								? "Enter your 12-digit Aadhaar number. An OTP will be sent to your Aadhaar-linked mobile."
								: "Enter your 12-digit Aadhaar number and scan your fingerprint."
						}
						onBack={goBackToMethodSelection}
					/>
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

				{state.aadhaarKycMethod === "biometrics" ? (
					<>
						{/* Ensure the fingerprint scanner displays cleanly here */}
						<Box>
							<UidaiFingerprintScanner
								label="Capture Fingerprint"
								required
								hideBranding
								onChange={(value) => setPidData(value)}
								onValidation={setIsScanValid}
							/>
						</Box>

						<Button
							w="full"
							bg="primary.DEFAULT"
							color="white"
							borderRadius="10"
							size="lg"
							isDisabled={!isValid || !isScanValid}
							isLoading={isValidatingAadhaarBiometric}
							loadingText="Verifying…"
							onClick={handleVerifyBiometric}
							sx={{
								animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
								animationDelay: ANIMATION.CTA_DELAY,
							}}
							_hover={{ bg: "primary.dark" }}
						>
							Verify
						</Button>
					</>
				) : (
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
				)}
			</Flex>

			{state.aadhaarKycMethod === "otp" && (
				<OtpModal
					isOpen={isOtpModalOpen}
					onClose={() => setIsOtpModalOpen(false)}
					onSubmit={handleOtpSubmit}
					onResend={handleSendOtp}
					isLoading={isValidatingAadhaarOtp}
					title={OTP_MODAL_TITLES.AADHAAR}
					mobileHint="Aadhaar-linked mobile"
				/>
			)}
		</>
	);
};
