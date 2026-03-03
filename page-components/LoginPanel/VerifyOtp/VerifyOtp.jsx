import { Box, Center, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { Button, IcoButton, Icon, OtpInput } from "components";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { useAppSource, useOrgDetailContext } from "contexts";
import { useUser } from "contexts/UserContext";
import { fetcher, sendOtpRequest } from "helpers";
import { useLogin } from "hooks";
import { useState } from "react";
import { ResendOtpSection } from "./ResendOtpSection";

const RESEND_OTP_COUNTDOWN_SECONDS = 30;

/**
 * A <VerifyOtp> component
 * @param {object} props - Properties passed to the component
 * @param {string} [props.loginType] - Login type, eg: Mobile
 * @param {string} [props.email] - Email of the user (used for social login OTP verification)
 * @param {object} props.number - Object containing the original and formatted mobile number
 * @param {object} props.cachedSocialResponse - Cached social login response. When OTP verification is successful, the cached response can be used to partially login the user (prep for onboarding)
 * @param {boolean} props.previewMode - Flag to check if the component is in preview mode
 * @param {Function} props.setStep - Function to set the step
 * @returns {JSX.Element} The VerifyOtp component
 */
const VerifyOtp = ({
	loginType,
	email,
	number,
	cachedSocialResponse,
	previewMode,
	setStep,
}) => {
	const { login } = useUser();
	const [loading, submitLogin] = useLogin(login, setStep);
	const toast = useToast();
	const { isAndroid } = useAppSource();
	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail ?? {};
	const { login_meta } = metadata ?? {};
	const isMobileMappedUserId = login_meta?.mobile_mapped_user_id === 1;

	const [Otp, setOtp] = useState("");

	const resendOtpHandler = async () => {
		if (previewMode === true) return false;
		const { otp_sent } = await sendOtpRequest(
			orgDetail.org_id,
			number.original,
			toast,
			"resend",
			isAndroid,
			isMobileMappedUserId,
			orgDetail.org_token
		);
		if (!otp_sent) {
			// OTP failed..back to previous screen
			setStep(loginType === "Mobile" ? "LOGIN" : "SOCIAL_VERIFY");
			return false;
		}

		return true;
	};

	// For social login flow, we reach this screen only for new users (email not mapped).
	// In that case, we only verify the OTP (by calling API with interaction_type_id=194) and do not proceed with login in this step. Instead, we set the verified number and move to onboarding steps.
	// TODO: Need to handle the case where mobile is already registered but the email is being mapped for the first time. In that case, we should login the user instead of moving to onboarding. Or, allow users to map Social IDs (like, Gmail) only on their profile page.
	// MARK: SocialVerifyOTP
	const verifyOtpForSocialLogin = async (otp, mobile) => {
		if (previewMode === true) return;
		if (loading) return;
		if (!otp) return;
		if (!email || !cachedSocialResponse) return;

		const accessToken = cachedSocialResponse.access_token;

		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					body: {
						interaction_type_id:
							TransactionIds.ASSISTED_ONBOARDING_ADD_AGENT,
						csp_id: mobile,
						otp: otp,
					},
					token: accessToken,
				}
			);

			if (response?.data) {
				// Extract response_type_id from the root level of response
				const responseTypeId = response.response_type_id;

				console.log("[VerifyOtp] After Google Login: API Response:", {
					responseTypeId,
					fullResponse: response,
				});

				if (
					responseTypeId === 874 // ??? Agent completed onboarding
				) {
					// TODO: Handle this case with better UX:
					// If another email is registered for this user, then show an error message. User must change email only after a normal login from his profile page.
					// If no email is registered, ask the user to connect this email to his existing profile. Also send an SMS to the user to avoid fraudulent account creation with random emails.
					// For now, we will just show a toast message and stay on the same screen.
					toast({
						title: "Mobile number already registered.",
						description:
							"Please go back and login with your mobile number and OTP.",
						status: "warning",
						duration: 5000,
						position: "top-right",
					});
					return;
				}

				if (
					responseTypeId === 876 || // OTP Verified Successfully
					responseTypeId === 873 || // ???? Agent doesn't exist, needs OTP verification
					responseTypeId === 862 // Agent exists, OTP verified but onboarding not complete
				) {
					// Login the user with the pre-cached social login response (which has the access token and other details) and set the verified mobile number in the user context (for use in onboarding steps)
					login(cachedSocialResponse, mobile);
					return;
				}
			}

			// Any other failure scenario...
			toast({
				title:
					response.message ||
					`Unknown error (#${response?.response_type_id}). Please try again.`,
				status: "error",
				duration: 5000,
				position: "top-right",
			});
		} catch (error) {
			console.error("Error checking agent:", error);
			toast({
				title:
					error?.message || "Something went wrong. Please try again.",
				status: "error",
				duration: 5000,
				position: "top-right",
			});
		}
	};

	const verifyOtpHandler = (_otp) => {
		if (previewMode === true) return;
		if (loading) return;
		if (!(_otp || Otp)) return;

		const _mobile = number?.verified ?? number?.original;

		// If `email` is set, and there is a previously cached social-login response, it means it's a Social-Login flow, else it's a mobile login flow
		if (email && cachedSocialResponse) {
			verifyOtpForSocialLogin(_otp || Otp, _mobile);
			return;
		}

		// Mobile login flow - directly submit login with OTP verification
		submitLogin({
			id_type: "Mobile",
			mobile: _mobile,
			id_token: _otp || Otp,
			org_id: orgDetail.org_id,
			org_token: orgDetail.org_token,
			// ...(isMobileMappedUserId && { is_mobile_mapped_user_id: true }),
		});
	};

	return (
		<Flex direction="column">
			<Flex align="center">
				<Box
					onClick={() =>
						setStep(
							loginType === "Mobile" ? "LOGIN" : "SOCIAL_VERIFY"
						)
					}
					cursor="pointer"
				>
					<Icon
						name="arrow-back"
						size="18px"
						// h="15px"
					/>
				</Box>
				<Heading
					as="h3"
					pl={{ base: 3.5, "2xl": 5 }}
					fontWeight="semibold"
					fontSize={{ base: "xl", "2xl": "3xl" }}
					letterSpacing="wide"
					variant="selectNone"
				>
					Verify with OTP
				</Heading>
			</Flex>

			<Flex
				mt={{ base: 2.5, "2xl": "30px" }}
				ml={{ base: 9, "2xl": "2.4rem" }}
				mb={{ base: "5rem", "2xl": "7.25rem" }}
				fontSize={{ base: "sm", "2xl": "lg" }}
				align="center"
			>
				{/* Hide "Sent on +91 ...." if the number is a user-id instead of mobile number */}
				{isMobileMappedUserId ? null : (
					<Flex align="center" wrap="wrap" userSelect="none">
						<Text>Sent on&nbsp;</Text>
						<Center as="b">
							+91 {number.formatted}
							<IcoButton
								iconName="mode-edit"
								size="sm"
								theme="primary"
								ml={2}
								onClick={() =>
									setStep(
										loginType === "Mobile"
											? "LOGIN"
											: "SOCIAL_VERIFY"
									)
								}
							/>
						</Center>
					</Flex>
				)}
			</Flex>

			<Flex w="full" align="center" justify="center">
				<OtpInput
					inputStyle={{
						w: { base: 12, sm: 14 },
						h: { base: 12 },
						fontSize: "sm",
					}}
					// containerStyle={
					// 	{
					// 		// justifyContent: "space-between",
					// 	}
					// }
					length={4}
					value={Otp}
					onChange={setOtp}
					onEnter={() => verifyOtpHandler()}
					onComplete={(otp) => {
						verifyOtpHandler(otp);
					}}
					// onKeyDown={onkeyHandler}
				/>
			</Flex>

			<ResendOtpSection
				countdownSeconds={RESEND_OTP_COUNTDOWN_SECONDS}
				onResendOtp={resendOtpHandler}
			/>

			<Button
				mt={{ base: "3.25rem", "2xl": "6.25rem" }}
				h={{ base: 16, "2xl": "4.5rem" }}
				fontSize={{ base: "lg", "2xl": "xl" }}
				disabled={loading}
				loading={loading}
				onClick={() => verifyOtpHandler()}
			>
				Submit
			</Button>
		</Flex>
	);
};

export default VerifyOtp;
