import { Text } from "@chakra-ui/react";

const InputLabel = ({ htmlFor, required, children, ...props }) => {
	return (
		<Text
			htmlFor={htmlFor || undefined}
			fontSize="xs"
			mb="2px"
			color="light"
			variant="selectNone"
			{...props}
		>
			{required ? (
				<Text as="span" color="error">
					*
				</Text>
			) : (
				""
			)}
			{children}
		</Text>
	);
};

export default InputLabel;
