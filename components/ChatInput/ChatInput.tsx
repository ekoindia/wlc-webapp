import { Spinner } from "@chakra-ui/react";
import { Input } from "components";
import { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

// Declare the props interface
interface ChatInputProps {
	placeholder?: string;
	inputLeftElement?: JSX.Element;
	maxLength?: number;
	loading?: boolean;
	disabled?: boolean;
	onChange?: Function;
	onEnter?: Function;
	[key: string]: any;
}

/**
 * Display a chat input box.
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} [prop.placeholder] - The placeholder text for the input
 * @param {JSX.Element} [prop.inputLeftElement] - The left element for the input
 * @param {number} [prop.maxLength] - The maximum length of the input
 * @param {boolean} [prop.loading] - Whether the input is in loading state
 * @param {boolean} [prop.disabled] - Whether the input is disabled
 * @param {Function} [prop.onChange] - The function to call on input change
 * @param {Function} [prop.onEnter] - The function to call on pressing Enter
 * @param {...*} rest - Rest of the props
 * @example	`<ChatInput />
 */
const ChatInput = ({
	placeholder,
	inputLeftElement,
	maxLength,
	loading = false,
	disabled = false,
	onChange,
	onEnter,
	...rest
}: ChatInputProps) => {
	const [value, setValue] = useState("");

	const onSubmit = () => {
		if (loading || disabled) return;
		if (typeof value === undefined || value === null) return;
		const _val = value?.trim();
		if (_val === "") return;

		console.log("[ChatInput] Submit:", _val);
		onEnter && onEnter(_val);
		setValue("");
	};

	// MARK: JSX
	return (
		<Input
			placeholder={placeholder}
			inputLeftElement={
				inputLeftElement || (
					<IoChatbubbleEllipsesOutline size="18px" color="light" />
				)
			}
			inputRightElement={
				loading ? (
					<Spinner size="18px" />
				) : (
					<IoMdSend
						size="18px"
						color="light"
						cursor="pointer"
						style={
							value === ""
								? { opacity: 0.4, pointerEvents: "none" }
								: {}
						}
						onClick={onSubmit}
					/>
				)
			}
			maxLength={maxLength || 250}
			// m="2px"
			// w="calc(100% - 4px)"
			value={value}
			disabled={disabled || loading}
			autoComplete="off"
			// invalid={invalid}
			// errorMsg={errorMsg}
			onChange={(e) => {
				setValue(e.target.value);
				onChange && onChange(e.target.value);
			}}
			onEnter={onSubmit}
			{...rest}
		/>
	);
};

export default ChatInput;
