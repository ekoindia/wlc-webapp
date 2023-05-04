import { Flex, Heading, useToast } from "@chakra-ui/react";
import { Button, Divider, Input } from "components";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { RemoveFormatted, sendOtpRequest } from "helpers";
import { useRef, useState } from "react";
import { GoogleButton } from "./GoogleButton";

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
	const { orgDetail } = useOrgDetailContext();
	const [value, setValue] = useState(number.formatted || "");
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");
	let login_types = Object.keys(orgDetail?.login_types || {});

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
				mb={{
					base: 4,
					"2xl": "4.35rem",
				}}
			>
				Login
			</Heading>

			{login_types.map((key) => {
				switch (key) {
					case "google":
						return (
							<GoogleButton
								key={key}
								setStep={setStep}
								setLoginType={setLoginType}
								setNumber={setNumber}
								setEmail={setEmail}
							/>
						);
					default:
						return null;
				}
			})}
			{login_types.length ? (
				<Divider
					title="Or login with mobile number"
					cursor="default"
					py={{ base: "4rem", "2xl": "5.62rem" }}
					fontSize={{ base: "xs", "2xl": "md" }}
				/>
			) : null}

			<Input
				cursor="default"
				label="Enter mobile number"
				placeholder="XXX XXX XXXX"
				leftAddon="+91"
				type="mobile_number"
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				radius={10}
				mb={{ base: 10, "2xl": "4.35rem" }}
				maxW="100%"
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
				// inputContStyle={{
				// 	h: { base: "3rem", "2xl": "4rem" },
				// 	// pos: "relative",
				// }}
				onFocus={() => {
					setInvalid(false);
				}}
				onKeyDown={onkeyHandler}
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
