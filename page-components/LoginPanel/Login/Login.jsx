import { Button, Center, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Buttons, Divider, Input } from "components";
import { useRef, useState } from "react";

/**
 * A <Login> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Login></Login>`
 */
const Login = ({ setStep, setNumber, number }) => {
	const [value, setValue] = useState(number);
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");
	const EnterRef = useRef();

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

	const onkeyHandler = (e) => {
		if (e.code === "Enter") {
			EnterRef.current.focus();
		}
	};
	return (
		<Flex direction="column">
			<Heading
				variant="selectNone"
				as="h3"
				fontSize={{ base: "xl", "2xl": "3xl" }}
			>
				Login
			</Heading>

			<Button
				variant
				bg="google"
				mt={{
					base: 4,
					"2xl": "4.35rem",
				}}
				h={{
					base: 16,
					"2xl": "4.5rem",
				}}
				fontSize={{ base: "lg", "2xl": "2xl" }}
				color="white"
				fontWeight="medium"
				borderRadius="10px"
				position="relative"
				onClick={() => setStep(2)}
				boxShadow="sh-googlebtn"
			>
				<Center
					bg="white"
					p={{ base: "9px", "2xl": "13px" }}
					borderRadius="10px"
					position="absolute"
					left="2px"
					h="calc(100% - 4px)"
					w={{ base: "60px", "2xl": "68px" }}
				>
					<Image
						src="./icons/google.svg"
						w={{ base: "40px", "2xl": "48px" }}
					/>
				</Center>
				<Text ml={[10, 10, null]} variant="selectNone">
					Login with Google
				</Text>
			</Button>

			<Divider
				cursor="default"
				title="Or login with mobile number"
				py={{ base: "4rem", "2xl": "5.62rem" }}
				fontSize={{ base: "xs", "2xl": "md" }}
			/>

			<Input
				cursor="default"
				label="Enter mobile number"
				placeholder={"XXX XXX XXXX"}
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				mb={{ base: 10, "2xl": "4.35rem" }}
				onChange={onChangeHandler}
				labelStyle={{
					fontSize: { base: "sm", "2xl": "lg" },
					color: "light",
					pl: "0",
					fontWeight: "semibold",
					mb: { base: 2.5, "2xl": "0.8rem" },
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
				onKeyDown={onkeyHandler}
			/>

			<Buttons
				title="Verify"
				h={{ base: 16, "2xl": "4.5rem" }}
				fontSize={{ base: "lg", "2xl": "xl" }}
				onClick={onVerify}
				ref={EnterRef}
			/>
		</Flex>
	);
};

export default Login;
