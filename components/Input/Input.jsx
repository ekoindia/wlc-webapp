import {
	Flex,
	Input as ChakraInput,
	InputGroup,
	InputLeftAddon,
	InputLeftElement,
	InputRightElement,
} from "@chakra-ui/react";
import { forwardRef, useId } from "react";
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

const Input = forwardRef(
	(
		{
			id,
			name,
			label,
			placeholder,
			description,
			value,
			type = "text",
			isNumInput = false,
			min,
			max,
			minLength,
			maxLength = "100",
			leftAddon,
			inputLeftElement,
			inputLeftElementStyle,
			inputRightElement,
			inputRightElementStyle,
			required = false,
			disabled = false,
			hidden = false,
			invalid = false,
			errorMsg = "",
			radius,
			labelStyle,
			errorStyle,
			inputContStyle,
			inputAttributes,
			m,
			mt,
			mr,
			mb,
			ml,
			onChange = () => {},
			onKeyDown = () => {},
			onEnter = () => {},
			...rest
		},
		ref
	) => {
		const _id = useId();

		const onChangeHandler = (e) => {
			let val = e.target.value;
			if (isNumInput) {
				if (
					val == "" ||
					/^[6-9]((\d{0,2})?\s?)?((\d{0,3})?\s?)?((\d{0,4})?)$/g.test(
						val
					)
				) {
					let formatted = formatNum(value, val);
					onChange(formatted);
				}
			} else onChange(e);
		};

		return (
			<Flex
				direction="column"
				align="flex-start"
				w="100%"
				m={m}
				mt={mt}
				mr={mr}
				mb={mb}
				ml={ml}
				{...inputContStyle}
			>
				{label ? (
					<InputLabel
						htmlFor={id ?? _id}
						required={required}
						{...labelStyle}
					>
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
						ref={ref}
						id={id ?? _id}
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
						min={min}
						max={max}
						minLength={minLength}
						maxLength={maxLength}
						{...inputAttributes}
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
				</InputGroup>

				{(invalid && errorMsg) || description ? (
					<InputMsg error={invalid && errorMsg} {...errorStyle}>
						{invalid && errorMsg ? errorMsg : description}
					</InputMsg>
				) : null}
			</Flex>
		);
	}
);

Input.displayName = "Input";

export default Input;
