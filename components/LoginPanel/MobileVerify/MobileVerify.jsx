import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Buttons, Icon, IconButtons, Input } from "../../";

const MobileVerify = ({ number, setNumber, setStep }) => {
	const [value, setValue] = useState(number);
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");

	const onChangeHandler = (val) => {
		if (val == "" || /^[6-9]\d{0,9}$/g.test(val)) {
			console.log("bwjnfj");
			setValue(val);
		}
	};
	const router = useRouter();
	const redirect = () => {
		router.push("/admin/my-network");
	};

	const onVerify = () => {
		console.log(/^[6-9]{1}[0-9]{9}$/g.test(value));
		if (/^[6-9]{1}[0-9]{9}$/g.test(value)) {
			setNumber(value);
			setStep(1);
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
					onClick={() => setStep(0)}
					w="18px"
					h="15px"
					cursor="pointer"
				>
					<Icon name="arrow-back" />
				</Box>
				<Heading
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
			>
				<Flex align="center" wrap="wrap">
					<Text>Sent on&nbsp;</Text>
					<Center as="b">
						abhishek.kumar@eko.co.in
						<IconButtons
							iconName="mode-edit"
							iconStyle={{ h: "12px", w: "12px" }}
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
				inputProps={{ maxLength: 10 }}
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
				onClick={redirect} // need to remove
			/>
		</Flex>
	);
};

export default MobileVerify;
