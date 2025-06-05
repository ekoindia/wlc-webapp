import { Flex, ResponsiveValue } from "@chakra-ui/react";
import { Icon } from "components";
import { useClipboard } from "hooks";

// Declare the props interface
interface CopyButtonProps {
	text?: string;
	size?: ResponsiveValue<string>;
	iconProps?: { [key: string]: any };
	[key: string]: any;
}

/**
 * A simple component to copy text to clipboard. It shows as a simple `copy` Icon-Button.
 * When clicked, it copies the text to clipboard, and renders a `success` icon for a few seconds.
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.text - The text to be copied to clipboard
 * @param {ResponsiveValue<string>} [prop.size] - Size of the icon. This can be a responsive value.
 * @param {object} [prop.iconProps] - Additional properties to pass to the Icon component
 * @param {...*} rest - Rest of the props
 * @example	`<CopyButton text="Text to be copied" />`
 */
const CopyButton = ({
	text,
	size = "sm",
	iconProps,
	...rest
}: CopyButtonProps) => {
	const { copy, state } = useClipboard();

	// MARK: JSX
	return (
		<Flex
			boxSizing="border-box"
			padding={2}
			borderRadius="full"
			aria-label="Copy to clipboard"
			title="Copy to clipboard"
			cursor={state[1] ? "default" : "pointer"}
			align="center"
			justify="center"
			bg={state[1] ? "green.100" : "#00000010"}
			_hover={{ bg: state[1] ? "green.100" : "#00000020" }}
			pointerEvents={state[1] ? "none" : "auto"}
			transition="background 0.2s ease-out"
			onClick={() => copy(text, 1)}
			{...rest}
		>
			<Icon
				name={state[1] ? "check" : "content-copy"}
				size={size}
				{...iconProps}
			/>
		</Flex>
	);
};

export default CopyButton;
