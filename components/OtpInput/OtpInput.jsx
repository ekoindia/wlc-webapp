import { Flex, PinInput, PinInputField } from "@chakra-ui/react";
import { useRef, useState } from "react";

/**
 * A <OtpInput> component for taking Otp input
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{number}	[prop.length] Number input fields has to be shown @default 6
 * @param	{String}	    [prop.value] To pass initial Otp value
 * @param	{function}	    [prop.onChange] To get the otp value
 * @param	{Object}	[prop.containerStyle] Takes an object for conatiner style
 * @param	{number}	[prop.inputStyle] Takes an object for input field style
 * @param 	{...*}	rest	Rest of the props passed to this component.
 * @example	`<OtpInput></OtpInput>`
 */
const OtpInput = ({
	value,
	length = 6,
	placeholder = "",
	containerStyle = {},
	inputStyle = {},
	onChange = () => {},
	onKeyDown = () => {},
	onEnter = () => {},
	onComplete,
	...rest
}) => {
	const inputRef = useRef([]);
	const [Otp, setOtp] = useState("");
	const inputfocusbg =
		inputStyle?.focus?.background || "var(--chakra-colors-focusbg)";
	const inputbg = inputStyle?.background || " ";

	return (
		<Flex minW={"10rem"} columnGap={"10px"} wrap="wrap" {...containerStyle}>
			<PinInput
				autoFocus
				type="number"
				otp
				value={value}
				placeholder={placeholder}
				manageFocus={true}
				onChange={(e) => {
					setOtp(e);
					onChange(e);
				}}
				onComplete={(val) => {
					onComplete && onComplete(val);
				}}
				{...rest}
			>
				{Array(length)
					.fill(null)
					.map((el, idx) => (
						<PinInputField
							key={idx}
							ref={(ref) => (inputRef.current[idx] = ref)}
							borderColor="hint"
							bg={Otp[idx] ? inputfocusbg : inputbg}
							borderRadius="10"
							boxShadow={Otp[idx] ? "sh-otpfocus" : ""}
							_focus={{
								// bg: "focusbg",
								boxShadow: "sh-otpfocus",
								borderColor: "hint",
								transition: "box-shadow 0.3s ease-out",
							}}
							onFocus={(e) => {
								if (!Otp.length || idx - Otp.length - 1 >= 0) {
									inputRef.current[Otp.length].focus();
								} else e.target.style.background = inputfocusbg;
							}}
							onKeyDown={(e) => {
								if (e.code === "Enter") {
									onEnter && onEnter(Otp);
								} else if (e.code === "Backspace") {
									e.target.style.background = "#fff";
								} else e.target.style.background = inputfocusbg;
								onKeyDown && onKeyDown(e);
							}}
							{...inputStyle}
						/>
					))}
			</PinInput>
		</Flex>
	);
};

export default OtpInput;
