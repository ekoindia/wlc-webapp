import { Text } from "@chakra-ui/react";

const InputLabel = ({ htmlFor, children, ...props }) => {
	return (
		<Text
			htmlFor={htmlFor || undefined}
			fontSize="xs"
			pl="6px"
			mb="2px"
			{...props}
		>
			{children}
		</Text>
	);
};

export default InputLabel;
