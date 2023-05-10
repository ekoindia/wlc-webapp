import {
	Flex,
	Input as ChakraInput,
	InputGroup,
	InputLeftAddon,
	InputLeftElement,
	InputRightElement,
} from "@chakra-ui/react";
import { InputLabel, InputMsg } from "../";

/**
 * A <Input> component
 * TODO: A reusable component for input (only text)
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Input></Input>`
 * @example	`<Input/>`
 */

function formatNum(value, num) {
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

const Input = ({
	label,
	name,
	placeholder,
	description,
	value,
	type = "text",
	leftAddon,
	inputLeftElement,
	inputLeftElementStyle,
	inputRightElement,
	inputRightElementStyle,
	disabled = false,
	hidden = false,
	invalid = false,
	errorMsg = "",
	isNumInput = false,
	labelStyle,
	errorStyle,
	inputContStyle,
	inputNumStyle,
	radius,
	required = false,
	onChange = () => {},
	onKeyDown = () => {},
	onEnter = () => {},
	...rest
}) => {
	const onChangeHandler = (e) => {
		let val = e.target.value;
		if (isNumInput) {
			if (
				val == "" ||
				/^[6-9]((\d{0,2})?\s?)?((\d{0,3})?\s?)?((\d{0,4})?)$/g.test(val)
			) {
				let formatted = formatNum(value, val);
				onChange(formatted);
				// setNumber(formatted);
			}
		} else onChange(e);
	};

	return (
		<Flex direction="column" w="100%" {...inputContStyle}>
			{label ? (
				<InputLabel required={required} {...labelStyle}>
					{label}
				</InputLabel>
			) : null}

			<InputGroup size="lg">
				{leftAddon ? (
					<InputLeftAddon
						pointerEvents="none"
						bg="transparent"
						borderLeftRadius={radius || "6px"}
						borderColor={errorMsg && invalid ? "error" : "hint"}
					>
						{leftAddon}
					</InputLeftAddon>
				) : null}

				{inputLeftElement ? (
					<InputLeftElement
						pointerEvents="none"
						{...inputLeftElementStyle}
					>
						{inputLeftElement}
					</InputLeftElement>
				) : null}

				<ChakraInput
					name={name}
					placeholder={placeholder}
					type={type}
					disabled={disabled}
					hidden={hidden}
					value={value}
					required={required}
					borderRadius={radius || "6px"}
					borderColor={errorMsg && invalid ? "error" : "hint"}
					bg={errorMsg && invalid ? "#fff7fa" : ""}
					w="100%"
					inputMode={isNumInput ? "numeric" : "text"}
					onChange={(e) => onChangeHandler(e)}
					onKeyDown={(e) => {
						if (e.code === "Enter" && onEnter) onEnter(value);
						onKeyDown && onKeyDown(e);
					}}
					_hover={{
						border: "",
					}}
					_focus={{
						bg: "focusbg",
						boxShadow: "0px 3px 6px #0000001A",
						borderColor: "hint",
						transition: "box-shadow 0.3s ease-out",
					}}
					{...rest}
				/>

				{inputRightElement ? (
					<InputRightElement
						pointerEvents="none"
						{...inputRightElementStyle}
					>
						{inputRightElement}
					</InputRightElement>
				) : null}

				{/* {isNumInput && (
					<Center
						pos="absolute"
						top="0"
						left="0"
						height="100%"
						w={{ base: 14, "2xl": "5.6rem" }}
						borderRight="1px solid"
						borderColor={invalid && errorMsg ? "error" : "hint"}
						zIndex="1100"
						userSelect="none"
						{...inputNumStyle}
					>
						+91
					</Center>
				)} */}
			</InputGroup>

			{(invalid && errorMsg) || description ? (
				<InputMsg error={invalid && errorMsg} {...errorStyle}>
					{invalid && errorMsg ? errorMsg : description}
				</InputMsg>
			) : null}
		</Flex>
	);
};

export default Input;
