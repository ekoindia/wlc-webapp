import { Text } from "@chakra-ui/react";

/**
 * A <InputMsg> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.error
 * @param prop.children
 * @example	`<InputMsg></InputMsg>`
 */
const InputMsg = ({ error = false, children, ...props }) => {
	if (!children) return null;
	return (
		<Text
			pl="6px"
			mt="4px"
			fontSize="xs"
			color={error ? "error" : "primary.light"}
			textAlign="left"
			{...props}
			variant="selectNone"
		>
			{children}
		</Text>
	);
};

export default InputMsg;
