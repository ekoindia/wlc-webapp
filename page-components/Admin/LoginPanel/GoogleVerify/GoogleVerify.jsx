import { Box, Center, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { Buttons, Icon, IconButtons, Input } from "components";
import { useRouter } from "next/router";
import { useState } from "react";
import { sendOtpRequest, RemoveFormatted } from "helpers";

/**
 * A <GoogleVerify> component
 * TODO: Used when the google auth is successfull
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<GoogleVerify></GoogleVerify>`
 */
const GoogleVerify = ({ number, setNumber, setStep }) => {
	const [value, setValue] = useState(number.formatted);
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");
	const toast = useToast();

	const onChangeHandler = (val) => {
		setValue(val);
	};

	const router = useRouter();
	const redirect = () => {
		router.push("/admin/my-network");
	};

	const onVerifyOtp = () => {
		if (value.length === 12) {
			toast({
				title: "OTP Sended Successfully",
				// description: "We've created your account for you.",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
			setNumber({
				original: RemoveFormatted(value),
				formatted: value,
			});

			setStep("VERIFY_OTP");

			const PostData = {
				platfom: "web",
				mobile: RemoveFormatted(value),
				client_ref_id: "242942347012342346",
				app: "Connect",
			};
			sendOtpRequest(PostData);
		} else {
			setErrorMsg("Required");
			setInvalid(true);
		}
	};

	return (
		<Flex direction="column">
			{/* Heading with Icon */}
			<Flex align="center">
				<Box
					onClick={() => setStep("LOGIN")}
					w="18px"
					h="15px"
					cursor="pointer"
				>
					<Icon name="arrow-back" />
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
						abhishek.kumar@eko.co.in
						<IconButtons
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

			<Buttons
				title="Verify"
				mt={{ base: 10, "2xl": "4.35rem" }}
				h={{ base: 16, "2xl": "4.5rem" }}
				fontSize={{ base: "lg", "2xl": "xl" }}
				// onClick={redirect} // need to remove
				onClick={onVerifyOtp}
			/>
		</Flex>
	);
};

export default GoogleVerify;
