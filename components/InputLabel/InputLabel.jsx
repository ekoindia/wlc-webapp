import { Text } from "@chakra-ui/react";

const InputLabel = ({ htmlFor, required, children, ...props }) => {
	return (
		<Text
			htmlFor={htmlFor || undefined}
			fontSize={{ base: "sm", "2xl": "lg" }}
			fontWeight="semibold"
			pl="0"
			mb={{ base: 2, "2xl": "0.8rem" }}
			color="inputlabel"
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
