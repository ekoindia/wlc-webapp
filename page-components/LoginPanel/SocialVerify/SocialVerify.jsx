import { Box, Center, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { Button, Icon, IconButtons, Input } from "components";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { RemoveFormatted, sendOtpRequest } from "helpers";
import { useState } from "react";

/**
 * A <SocialVerify> component
 * TODO: Used when the google auth is successfull to verify phone number if the user is new
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<SocialVerify></SocialVerify>`
 */
const SocialVerify = ({ email, number, setNumber, setStep }) => {
	const toast = useToast();
	const [value, setValue] = useState(number.formatted);
	const [invalid, setInvalid] = useState("");
	const [errorMsg, setErrorMsg] = useState(false);
	const { orgDetail } = useOrgDetailContext();

	const onChangeHandler = (val) => {
		setValue(val);
	};

	const onVerifyOtp = () => {
		if (value.length === 12) {
			let originalNum = RemoveFormatted(value);
			setNumber({
				original: originalNum,
				formatted: value,
			});

			setStep("VERIFY_OTP");
			sendOtpRequest(orgDetail.org_id, originalNum, toast);
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
					<Icon name="arrow-back" w="18px" h="15px" />
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
						<IconButtons
							onClick={() => {
								setStep("LOGIN");
								setNumber({
									original: "",
									formatted: "",
								});
							}}
							iconName="mode-edit"
							iconStyle={{ height: "12px", width: "12px" }}
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
				labelStyle={{
					color: "light",
					pl: "0",
					mb: { base: 2.5, "2xl": "0.8rem" },
					fontSize: { base: "sm", "2xl": "lg" },
					fontWeight: "semibold",
				}}
				inputContStyle={{
					h: { base: "3rem", "2xl": "4rem" },
					pos: "relative",
				}}
				isNumInput={true}
				inputProps={{ maxLength: 12 }}
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
