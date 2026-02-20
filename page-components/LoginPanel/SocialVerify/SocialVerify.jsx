import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import { Button, Icon, Input } from "components";
import { useAppSource, useOrgDetailContext } from "contexts";
import { sendOtpRequest } from "helpers";
import { useRef, useState } from "react";

/**
 * A <SocialVerify> component. Used to verify phone number if the user is new,
 * 		and if they have logged in using Google or other social SSO.
 * TODO: Refactor common code with <Login> & (maybe) <VerifyOtp> components.
 * @param {object} prop - Properties passed to the component
//  * @param {string} [prop.email] - Email of the user
 * @param {object} prop.number - Object containing the original and formatted mobile number
 * @param {boolean} prop.previewMode - Flag to check if the component is in preview mode
 * @param {Function} prop.setNumber - Function to set the number
 * @param {Function} prop.setStep - Function to set the step
 * @param {Function} prop.setLoginType - Function to set the login type (Google, Mobile, etc)
 */
const SocialVerify = ({
	/* email, */ number,
	previewMode,
	setNumber,
	setStep,
	setLoginType,
}) => {
	const EnterRef = useRef();
	const toast = useToast();
	const [value, setValue] = useState(number.formatted);
	const { isAndroid } = useAppSource();

	const [invalid, setInvalid] = useState("");
	const [errorMsg, setErrorMsg] = useState(false);
	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail ?? {};
	const { login_meta } = metadata ?? {};
	const isMobileMappedUserId = login_meta?.mobile_mapped_user_id === 1;
	const mobileMappedUserIdLabel = login_meta?.user_id_label || "User ID";

	const UserIdType = isMobileMappedUserId
		? mobileMappedUserIdLabel
		: "Mobile Number";

	const onChangeHandler = (e) => {
		if (e === null || typeof e === "undefined") return;

		if (typeof e === "string") {
			setValue(e);
			return;
		}

		if (
			typeof e === "object" &&
			e.target &&
			typeof e.target.value === "string"
		) {
			setValue(e.target.value);
		}
	};

	const onSendOtp = async () => {
		if (previewMode === true) return;

		if (
			(isMobileMappedUserId && value.length >= 5 && value.length <= 10) ||
			(!isMobileMappedUserId && value.length === 10)
		) {
			// Change screen to OTP verify
			setLoginType("Google");
			setStep("VERIFY_OTP");

			const { otp_sent, verifiedMobileNumber } = await sendOtpRequest(
				orgDetail.org_id,
				value,
				toast,
				"send",
				isAndroid,
				isMobileMappedUserId,
				orgDetail.org_token
			);

			// Input component now returns unformatted value directly
			const formattedValue = value.replace(
				/(\d{3})(\d{3})(\d{4})/,
				"$1 $2 $3"
			);
			setNumber({
				original: value,
				formatted: formattedValue,
				verified: verifiedMobileNumber,
			});

			if (otp_sent) {
				// Set login-type for current session...
				sessionStorage.setItem("login_type", "Google");
			} else {
				// OTP failed..back to current screen
				setStep("SOCIAL_VERIFY");
			}
		} else {
			setErrorMsg("Required");
			setInvalid(true);
		}
	};

	const onkeyHandler = (e) => {
		if (e.code === "Enter") {
			EnterRef.current.focus();
		}
	};

	// MARK: jsx
	return (
		<Flex direction="column">
			{/* Heading with Icon */}
			<Flex align="center">
				<Box onClick={() => setStep("LOGIN")} cursor="pointer">
					<Icon
						name="arrow-back"
						size="18px"
						// h="15px"
					/>
				</Box>
				<Heading
					variant="selectNone"
					as="h3"
					pl={{ base: 3.5, "2xl": 5 }}
					fontWeight="600"
					fontSize={{ base: "xl", "2xl": "3xl" }}
				>
					Verify Your {UserIdType}
				</Heading>
			</Flex>
			<br />
			<br />

			{/* Edit */}
			{/* <Flex
				mt={{ base: 2.5, "2xl": "30px" }}
				ml={{ base: 9, "2xl": 12 }}
				mb={{ base: "3.6rem", "2xl": "6.8rem" }}
				fontSize={{ base: "sm", "2xl": "lg" }}
				align="center"
				userSelect="none"
			>
				<Flex align="center" wrap="wrap">
					<Text>Sent on&nbsp;</Text>
					<Center as="b">
						{email}
						<IcoButton
							iconName="mode-edit"
							size="sm"
							theme="accent"
							ml={2}
							onClick={() => {
								setStep("LOGIN");
								setNumber({
									original: "",
									formatted: "",
								});
							}}
						/>
					</Center>
				</Flex>
			</Flex> */}

			{/* Input */}
			<Input
				label={`Enter Your ${UserIdType}`}
				placeholder={isMobileMappedUserId ? "" : "XXX XXX XXXX"}
				leftAddon={isMobileMappedUserId ? undefined : "+91"}
				required={true}
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				borderRadius={10}
				labelStyle={{
					color: "light",
				}}
				maxW="100%"
				// inputContStyle={{
				// 	h: { base: "3rem", "2xl": "4rem" },
				// 	pos: "relative",
				// }}
				isNumInput={true}
				maxLength={10}
				onFocus={() => {
					setInvalid(false);
				}}
				onChange={onChangeHandler}
				onKeyDown={onkeyHandler}
			/>

			<Button
				mt={{ base: 10, "2xl": "4.35rem" }}
				h={{ base: 16, "2xl": "4.5rem" }}
				fontSize={{ base: "lg", "2xl": "xl" }}
				onClick={onSendOtp}
				ref={EnterRef}
			>
				Verify
			</Button>
		</Flex>
	);
};

export default SocialVerify;
