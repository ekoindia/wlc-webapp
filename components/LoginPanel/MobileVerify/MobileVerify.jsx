import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Buttons, IconButtons, Input } from "../../";

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
			<Flex align="center">
				<Box onClick={() => setStep(0)}>
					<ArrowBackIcon boxSize={6} w="18px" h="15px" />
				</Box>
				<Heading as="h3" pl={5} fontWeight="600">
					Verify with OTP
				</Heading>
			</Flex>

			<Flex mt="30px" ml="3rem" mb="6.8rem" fontSize="lg" align="center">
				<Text>
					Sent on <Text as="b">abhishek.kumar@eko.co.in</Text>
				</Text>
				<IconButtons
					iconName="mode-edit"
					iconStyle={{ h: "12px", w: "12px" }}
				/>
			</Flex>

			<Input
				label="Enter mobile number"
				placeholder={"XXX XXX XXXX"}
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				labelStyle={{
					fontSize: "lg",
					color: "light",
					pl: "0",
					mb: "0.8rem",
					fontWeight: "semibold",
				}}
				inputContStyle={{ h: "4rem", pos: "relative" }}
				isNumInput={true}
				inputProps={{ maxLength: 10 }}
				onFocus={() => {
					setInvalid(false);
				}}
				onChange={onChangeHandler}
			/>

			<Buttons
				mt="4.35rem"
				title="Verify"
				h="4.5rem"
				fontSize="xl"
				borderRadius="10px"
				boxShadow="0px 3px 10px #FE9F0040"
				// onClick={onVerify}
				onClick={redirect} // need to remove
			/>
		</Flex>
	);
};

export default MobileVerify;
