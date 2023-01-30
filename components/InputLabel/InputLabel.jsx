import { Text } from "@chakra-ui/react";

const InputLabel = ({ htmlFor, children, ...props }) => {
	return (
		<Text
			htmlFor={htmlFor || undefined}
			fontSize="xs"
			mb="2px"
			color="light"
			{...props}
		>
			{children}
		</Text>
	);
};

export default InputLabel;
