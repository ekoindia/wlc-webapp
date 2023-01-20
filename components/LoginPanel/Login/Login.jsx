import {
	Button,
	Center,
	Divider,
	Flex,
	Heading,
	Image,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Buttons, Input } from "../../";

const Login = ({ setStep, setNumber, number }) => {
	const [value, setValue] = useState(number);
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");

	function formatNum(num) {
		let formatted_num = "";
		// This is for space removal when user removes the input
		if (value.slice(0, value.length - 1) === num && num !== "") {
			return num;
		} else {
			for (let i in num) {
				if (num[i] !== " ") {
					if (i === "2" || i === "6") {
						formatted_num += num[i] + " ";
					} else formatted_num += num[i];
				}
			}
			return formatted_num;
		}
	}

	const onChangeHandler = (val) => {
		// /^[6-9]\d{0,9}$/g.test(val)
		// /^[6-9]\d{0,2}\s\d{0,3}\s\d{0,4}$/g
		// [6-9]?(\d{0,2})?(\s\d{0,3})?(\s\d{0,4})
		if (
			val == "" ||
			/^[6-9]((\d{0,2})?\s?)?((\d{0,3})?\s?)?((\d{0,4})?)$/g.test(val)
		) {
			setValue(formatNum(val));
		}
	};

	const onVerify = () => {
		// console.log(/^[6-9]{1}[0-9]{9}$/g.test(value));
		if (value.length == 12) {
			setNumber(value);
			setStep((prev) => prev + 1);
		} else {
			setErrorMsg("Required");
			setInvalid(true);
		}
	};
	return (
		<Flex direction="column">
			<Heading as="h3">Login</Heading>

			<Button
				variant
				mt="4.35rem"
				h="4.5rem"
				bg="#4185F4"
				w="100%"
				fontSize="2xl"
				color="white"
				fontWeight="medium"
				borderRadius="10px"
				position="relative"
				onClick={() => setStep(2)}
			>
				<Center
					bg="#FFFFFF"
					p="13px"
					borderRadius="10px"
					position="absolute"
					left="2px"
				>
					<Image src="./icons/google.png" />
				</Center>
				Login with Google
			</Button>

			<Flex align="center" justify="center" py="5.62rem">
				<Divider w="12.5rem" borderColor="#707070" />
				<Text
					fontSize="1rem"
					color="#0F0F0F"
					px="12px"
					width="fit-content"
				>
					Or login with mobile number
				</Text>
				<Divider w="12.5rem" borderColor="#707070" />
			</Flex>

			<Input
				label="Enter mobile number"
				placeholder={"XXX XXX XXXX"}
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				mb="4.35rem"
				onChange={onChangeHandler}
				labelStyle={{
					fontSize: "lg",
					color: "light",
					pl: "0",
					fontWeight: "semibold",
					mb: "0.8rem",
				}}
				inputContStyle={{ h: "4rem", pos: "relative" }}
				isNumInput={true}
				inputProps={{ maxLength: 12 }}
				onFocus={() => {
					setInvalid(false);
				}}
			/>

			<Buttons
				title="Verify"
				h="4.5rem"
				fontSize="xl"
				borderRadius="10px"
				boxShadow="0px 3px 10px #FE9F0040"
				onClick={onVerify}
			/>
		</Flex>
	);
};

export default Login;
