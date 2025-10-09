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
 * @param {object} props
 * @param {boolean} [props.hideLogo] - Flag to hide the logo
 * @param {Function} props.setStep - Function to set the step like LOGIN, VERIFYOTP & SOCIALVERIFY
 * @param {Function} props.setNumber - Function to set the users mobile number if the user is loogin using Mobile number
 * @param {object} props.number - Object which gives the number in two forms formatted and original (or unformatted)
 * @param {string} props.lastUserName - Last user name who logged in
 * @param {string} props.lastMobileFormatted - Last mobile number which was used to login
 * @param {boolean} props.previewMode - Flag to check if the component is in preview mode
 * @param {Function} props.setEmail - Function to set the users email
 * @param {Function} props.setLoginType - Function to set the login type
 */
const Login = ({
	hideLogo = false,
	setStep,
	setNumber,
	number,
	lastUserName,
	lastMobileFormatted,
	previewMode,
	setEmail,
	setLoginType,
}) => {
	const EnterRef = useRef();
	const toast = useToast();
	const { isAndroid } = useAppSource();

	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail ?? {};
	const { login_meta } = metadata ?? {};
	const isMobileMappedUserId = login_meta?.mobile_mapped_user_id === 1;

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
		if (previewMode === true) return;

		// check based on the isMobileMappedUserId,
		// if isMobileMappedUserId is true, then allow digits 7 to 12
		// else exactly 12 digits are required
		if (
			(isMobileMappedUserId && value.length >= 7 && value.length <= 12) ||
			(!isMobileMappedUserId && value.length === 12)
		) {
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
				isAndroid,
				isMobileMappedUserId
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
		<Flex direction="column" _h="100%">
			<Box
				display={{ base: "block", md: "none" }}
				position="absolute"
				top="0"
				left="0"
				right="0"
				h="10px"
				bg="primary.DEFAULT"
			></Box>

			{hideLogo ? null : (
				<Flex mb={lastUserName ? "6" : { base: 10, lg: 14 }}>
					<OrgLogo
						size="lg"
						// ml={{ base: 4, md: "0" }}
					/>
				</Flex>
			)}

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

			<Box flex="0.5 1 40px" />

			<Input
				label={`Login with your ${isMobileMappedUserId ? "user id/mobile number" : "mobile number"}`} // "Enter mobile number"
				placeholder="XXX XXX XXXX"
				required
				leftAddon="+91"
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				borderRadius={10}
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
					<Box flex="1 1 60px" />

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
