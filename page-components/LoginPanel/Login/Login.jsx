import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { Button, Input, OrgLogo } from "components";
import { useAppSource, useOrgDetailContext } from "contexts";
import { RemoveFormatted, sendOtpRequest } from "helpers";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
// import { GoogleButton } from "./GoogleButton";

const DynamicGoogleButton = dynamic(
	() => import("./GoogleButton/GoogleButton"),
	{
		ssr: false,
		// loading: () => <p>Loading...</p>,
	}
);

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
const Login = ({
	setStep,
	setNumber,
	number,
	setEmail,
	setLoginType,
	lastUserName,
	lastMobileFormatted,
}) => {
	const EnterRef = useRef();
	const toast = useToast();
	const { orgDetail } = useOrgDetailContext();
	const { isAndroid } = useAppSource();

	const [value, setValue] = useState(number.formatted || "");
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState("");

	useEffect(() => {
		if (lastMobileFormatted && !value) {
			setValue(lastMobileFormatted);
		}
		// WARNING: Do not add "value" as a dependency here (as it will always auto-fill the last number whenever the user deletes the filled number & therefore the value becomes empty)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastMobileFormatted]);

	// Is Google Login available?
	const showGoogle =
		orgDetail?.login_types?.google?.default ||
		orgDetail?.login_types?.google?.client_id
			? true
			: false;

	const onChangeHandler = (val) => {
		setValue(val);
	};

	const sendOtp = async () => {
		if (value.length === 12) {
			let originalNum = RemoveFormatted(value);
			setNumber({
				original: originalNum,
				formatted: value,
			});
			setLoginType("Mobile");
			setStep("VERIFY_OTP");

			const otp_sent = await sendOtpRequest(
				orgDetail.org_id,
				originalNum,
				toast,
				"send",
				isAndroid
			);

			if (otp_sent) {
				// Set login-type for current session...
				sessionStorage.setItem("login_type", "Mobile");
			} else {
				// OTP failed..back to previous screen
				setStep("LOGIN");
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

	return (
		<Flex direction="column" height="100%">
			<Box
				display={{ base: "block", md: "none" }}
				position="absolute"
				top="0"
				left="0"
				right="0"
				h="10px"
				bg="primary.DEFAULT"
			></Box>
			<Flex mb={lastUserName ? "6" : { base: 10, lg: 14 }}>
				<OrgLogo
					orgDetail={orgDetail}
					size="lg"
					// ml={{ base: 4, md: "0" }}
				/>
			</Flex>

			{lastUserName ? (
				<Text
					variant="selectNone"
					as="h3"
					fontSize={{ base: "xl", "2xl": "3xl" }}
					color="primary.light"
					mb={{
						base: 6,
						"2xl": "8",
					}}
				>
					Welcome back, {lastUserName}
				</Text>
			) : null}

			{/* {showGoogle ? (
				<>
					<Box flex="1" />
					<GoogleButton
						setStep={setStep}
						setLoginType={setLoginType}
						setNumber={setNumber}
						setEmail={setEmail}
					/>
					<Box flex="1" />
					<Divider
						title="Or, login with mobile number"
						cursor="default"
						py={{ base: "2rem", lg: "3rem", "2xl": "4rem" }}
						fontSize={{ base: "xs" }}
						titleStyle={{
							display: "inline-block",
							color: "light",
							opacity: "0.8",
							fontSize: "xs",
							border: "1px solid",
							borderColor: "hint",
							borderRadius: "10px",
							py: "2px",
						}}
						lineStyle={{
							borderColor: "hint",
						}}
					/>
				</>
			) : (
				<Text fontWeight="bold" fontSize="1.2em" color="light">
					Login with your mobile...
				</Text>
			)} */}

			<Box flex="0.5" />

			<Input
				label="Login with your mobile number" // "Enter mobile number"
				placeholder="XXX XXX XXXX"
				required
				leftAddon="+91"
				type="mobile_number"
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				radius={10}
				maxW="100%"
				onChange={onChangeHandler}
				maxLength={12}
				isNumInput={true}
				labelStyle={{
					color: "light",
				}}
				onFocus={() => {
					setInvalid(false);
				}}
				onKeyDown={onkeyHandler}
			/>

			<Button
				h={{ base: "56px" }}
				borderRadius="8px"
				fontSize={{ base: "lg" }}
				mt={{ base: 8 }}
				onClick={sendOtp}
				ref={EnterRef}
				// disabled={value.length < 12}
			>
				Verify
			</Button>

			{/* <Box flex="1" /> */}

			{showGoogle ? (
				<>
					<Box flex="2" />

					<Flex direction="row" align="center" w="100%">
						<Text
							display="inline-block"
							color="light"
							opacity="0.8"
							fontSize="xs"
							border="1px solid"
							borderColor="hint"
							borderRadius="10px"
							cursor="default"
							px="1em"
							py="2px"
							my={{ base: "2rem", lg: "3rem", "2xl": "4rem" }}
						>
							Or, login with
						</Text>
						<Box
							flex="1"
							position="relative"
							_after={{
								position: "absolute",
								top: "50%",
								left: "0",
								right: "0",
								borderTop: "1px solid",
								content: "''",
								borderColor: "hint",
							}}
						/>
						<DynamicGoogleButton
							setStep={setStep}
							setLoginType={setLoginType}
							setNumber={setNumber}
							setEmail={setEmail}
							transform="scale(120%)"
						/>
					</Flex>

					{/* <Box flex="1" /> */}
					{/* <Divider
						title="Or, login with mobile number"
						cursor="default"
						py={{ base: "2rem", lg: "3rem", "2xl": "4rem" }}
						fontSize={{ base: "xs" }}
						titleStyle={{
							display: "inline-block",
							color: "light",
							opacity: "0.8",
							fontSize: "xs",
							border: "1px solid",
							borderColor: "hint",
							borderRadius: "10px",
							py: "2px",
						}}
						lineStyle={{
							borderColor: "hint",
						}}
					/> */}
				</>
			) : null}

			<Box flex="1" />
		</Flex>
	);
};

export default Login;
