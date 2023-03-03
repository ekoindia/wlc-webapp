import { Text } from "@chakra-ui/react";

/**
 * A <InputMsg> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<InputMsg></InputMsg>`
 */
const InputMsg = ({ error = false, children, ...props }) => {
	if (!children) return null;
	return (
		<Text
			pl="6px"
			mt="4px"
			fontSize="xs"
			color="error"
			{...props}
			variant="selectNone"
		>
			{children}
		</Text>
	);
};

export default InputMsg;
