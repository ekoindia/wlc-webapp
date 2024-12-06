import {
	Flex,
	Input as ChakraInput,
	InputGroup,
	InputLeftAddon,
	InputLeftElement,
	InputRightElement,
} from "@chakra-ui/react";
import {
	forwardRef,
	useCallback,
	useId,
	ReactElement,
	CSSProperties,
} from "react";
import { InputLabel, InputMsg } from "..";

interface InputProps {
	id?: string;
	name?: string;
	label?: string;
	placeholder?: string;
	description?: string;
	value?: string;
	type?: string;
	size?: "xs" | "sm" | "md" | "lg";
	isNumInput?: boolean;
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
	leftAddon?: React.ReactNode;
	inputLeftElement?: React.ReactNode;
	inputRightElement?: React.ReactNode;
	required?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	invalid?: boolean;
	errorMsg?: string;
	borderRadius?: string;
	labelStyle?: CSSProperties;
	errorStyle?: CSSProperties;
	inputContStyle?: Object;
	inputAttributes?: Object;
	m?: number;
	mt?: number;
	mr?: number;
	mb?: number;
	ml?: number;
	onChange?: Function;
	onKeyDown?: Function;
	onEnter?: Function;
	[key: string]: any;
}

/**
 * A <Input> component
 * @param {object} prop Properties passed to the component
 * @param {string} [prop.id] HTML ID of the input element
 * @param {string} [prop.name] Name of the input element
 * @param {string} [prop.label] Label for the input element
 * @param {string} [prop.placeholder] Placeholder text for the input element
 * @param {string} [prop.description] Description text for the input element
 * @param {string} [prop.value] Value of the input element
 * @param {string} [prop.type] Type of the input element
 * @param {string} [prop.size] Size of the input element
 * @param {boolean} [prop.isNumInput] If the input is a number input
 * @param {number} [prop.min] Minimum value for the input element
 * @param {number} [prop.max] Maximum value for the input element
 * @param {number} [prop.minLength] Minimum length of the input element
 * @param {number} [prop.maxLength] Maximum length of the input element
 * @param {React.ReactNode} [prop.leftAddon] Left addon for the input element
 * @param {React.ReactNode} [prop.inputLeftElement] Left element for the input element
 * @param {React.ReactNode} [prop.inputRightElement] Right element for the input element
 * @param {boolean} [prop.required] If the input is required
 * @param {boolean} [prop.disabled] If the input is disabled
 * @param {boolean} [prop.hidden] If the input is hidden
 * @param {boolean} [prop.invalid] If the input is invalid
 * @param {string} [prop.errorMsg] Error message for the input element
 * @param {string} [prop.borderRadius] Border radius for the input element
 * @param {object} [prop.labelStyle] Style for the label
 * @param {object} [prop.errorStyle] Style for the error message
 * @param {object} [prop.inputContStyle] Style for the input container
 * @param {object} [prop.inputAttributes] Additional attributes for the input element
 * @param {number} [prop.m] Margin for the input container
 * @param {number} [prop.mt] Margin top for the input container
 * @param {number} [prop.mr] Margin right for the input container
 * @param {number} [prop.mb] Margin bottom for the input container
 * @param {number} [prop.ml] Margin left for the input container
 * @param {Function} [prop.onChange] Function to handle the change event
 * @param {Function} [prop.onKeyDown] Function to handle the key down event
 * @param {Function} [prop.onEnter] Function to handle the enter key event
 * @returns {React.ReactElement} A <Input> component
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			id,
			name,
			label,
			placeholder,
			description,
			value,
			type = "text",
			size = "lg", // TODO: Change default size to "md" and fix all implementations
			isNumInput = false,
			min,
			max,
			minLength,
			maxLength = 100,
			leftAddon,
			inputLeftElement,
			inputRightElement,
			required = false,
			disabled = false,
			hidden = false,
			invalid = false,
			errorMsg = "",
			borderRadius,
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
	): ReactElement => {
		const _id = useId();

		const default_radius =
			size === "lg"
				? "10px"
				: size === "sm"
					? "6px"
					: size === "xs"
						? "4px"
						: "8px";

		const onChangeHandler = useCallback(
			(e) => {
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
			},
			[isNumInput, onChange]
		);

		return (
			<Flex
				flexDirection="column"
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
				<InputGroup
					size={size}
					borderRadius={borderRadius || default_radius || size}
				>
					{leftAddon ? (
						<InputLeftAddon
							pointerEvents="none"
							bg="transparent"
							borderLeftRadius={
								borderRadius || default_radius || size
							}
							borderColor={errorMsg && invalid ? "error" : "hint"}
						>
							{leftAddon}
						</InputLeftAddon>
					) : null}

					{inputLeftElement ? (
						<InputLeftElement pointerEvents="none">
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
						// required={required}
						borderRadius={borderRadius || default_radius || size}
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
						focusBorderColor="primary.light"
						errorBorderColor="error"
						{...inputAttributes}
						{...rest}
					/>

					{inputRightElement ? (
						<InputRightElement
							pointerEvents={onEnter ? undefined : "none"}
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

/**
 * Format the number to add space after every 3 digits
 * @param {*} value
 * @param {*} num
 * @returns
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
