import { Flex, Heading, useToast } from "@chakra-ui/react";
// import { useGoogleLogin } from "@react-oauth/google";
import { Button, Input } from "components";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";
import { RemoveFormatted, sendOtpRequest } from "helpers";
import { useRef, useState } from "react";

/**
 * A <Login> component
 * Responsible for handling different types of login like Mobile Number & Google Login
 * @params 	{Function}	setStep		Function to set the step like LOGIN, VERIFYOTP & SOCIALVERIFY
 * @params 	{Function}	setNumber	Function to set the users mobile number if the user is loogin using Mobile number
 * @params 	{Object}	number		Object which gives the number in two forms formatted and original (or unformatted)
 * @params 	{Function}	setEmail	Function to set the users email
 * @params 	{Function}	setLoginType	Function to set the login type
 * @example	`<Login></Login>`
 */
const Login = ({ setStep, setNumber, number, setEmail, setLoginType }) => {
	const EnterRef = useRef();
	const toast = useToast();
	const { login } = useUser();
	// const [/* busy, */ googleHandler] = useLogin(login, setStep, setEmail);
	const { orgDetail } = useOrgDetailContext();

	const [value, setValue] = useState(number.formatted || "");
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");

	// const googleLoginHandler = useGoogleLogin({
	// 	onSuccess: async (response) => {
	// 		const postData = {
	// 			id_type: "Google",
	// 			id_token: response.code,
	// 		};
	// 		googleHandler(postData);
	// 		setLoginType("Google");
	// 		setNumber({
	// 			original: "",
	// 			formatted: "",
	// 		});
	// 	},
	// 	onError: (err) => console.log(err),
	// 	flow: "auth-code",
	// });

	const onChangeHandler = (val) => {
		setValue(val);
	};

	const SendOtp = () => {
		if (value.length === 12) {
			let originalNum = RemoveFormatted(value);
			setNumber({
				original: originalNum,
				formatted: value,
			});
			setLoginType("Mobile");
			setStep("VERIFY_OTP");
			sendOtpRequest(orgDetail.org_id, originalNum, toast);
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

			{/* <Button
				variant
				bg="#4185F4"
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
				onClick={googleLoginHandler}
				boxShadow="0px 3px 10px #4185F433;"
			>
				<Center
					bg="#FFFFFF"
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
			/> */}

			<Input
				cursor="default"
				label="Enter mobile number"
				placeholder={"XXX XXX XXXX"}
				type="mobile_number"
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				mb={{ base: 10, "2xl": "4.35rem" }}
				maxW="100%"
				isPrefixVisible={true}
				prefixSymbol={"+91"}
				onChange={onChangeHandler}
				maxLength={12}
				isNumInput={true}
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
				onFocus={() => {
					setInvalid(false);
				}}
				onKeyDown={onkeyHandler}
				// parameter_type_id={"15"}
			/>

			<Button
				h={{ base: 16, "2xl": "4.5rem" }}
				fontSize={{ base: "lg", "2xl": "xl" }}
				onClick={SendOtp}
				ref={EnterRef}
			>
				Verify
			</Button>
		</Flex>
	);
};

export default Login;
