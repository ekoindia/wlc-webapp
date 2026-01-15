import { Box, Center, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { Button, IcoButton, Icon, Input } from "components";
import { useAppSource, useOrgDetailContext } from "contexts";
import { sendOtpRequest } from "helpers";
import { useState } from "react";

/**
 * A <SocialVerify> component. Used to verify phone number if the user is new,
 * 		and if they have logged in using Google or other social SSO.
 * @param {object} prop - Properties passed to the component
 * @param {string} [prop.email] - Email of the user
 * @param {object} prop.number - Object containing the original and formatted mobile number
 * @param {boolean} prop.previewMode - Flag to check if the component is in preview mode
 * @param {Function} prop.setNumber - Function to set the number
 * @param {Function} prop.setStep - Function to set the step
 */
const SocialVerify = ({ email, number, previewMode, setNumber, setStep }) => {
	const toast = useToast();
	const [value, setValue] = useState(number.formatted);
	const { isAndroid } = useAppSource();

	const [invalid, setInvalid] = useState("");
	const [errorMsg, setErrorMsg] = useState(false);
	const { orgDetail } = useOrgDetailContext();

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

	const onVerifyOtp = async () => {
		if (previewMode === true) return;

		if (value.length === 10) {
			// Input component now returns unformatted value directly
			const formattedValue = value.replace(
				/(\d{3})(\d{3})(\d{4})/,
				"$1 $2 $3"
			);
			setNumber({
				original: value,
				formatted: formattedValue,
			});

			setStep("VERIFY_OTP");
			const { otp_sent } = await sendOtpRequest(
				orgDetail.org_id,
				value,
				toast,
				"send",
				isAndroid,
				orgDetail.org_token
			);

			if (!otp_sent) {
				// OTP failed..back to previous screen
				setStep("LOGIN");
			}
		} else {
			setErrorMsg("Required");
			setInvalid(true);
		}
	};

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
					Verify with OTP
				</Heading>
			</Flex>

			{/* Edit */}
			<Flex
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
			</Flex>

			{/* Input */}
			<Input
				label="Enter mobile number"
				placeholder={"XXX XXX XXXX"}
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				borderRadius={10}
				labelStyle={{
					color: "light",
				}}
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
			/>

			<Button
				mt={{ base: 10, "2xl": "4.35rem" }}
				h={{ base: 16, "2xl": "4.5rem" }}
				fontSize={{ base: "lg", "2xl": "xl" }}
				onClick={onVerifyOtp}
			>
				Verify
			</Button>
		</Flex>
	);
};

export default SocialVerify;
