import { chakra, Text } from "@chakra-ui/react";

const InputLabel = ({ htmlFor, required, children, ...rest }) => {
	const Label = chakra("label");
	return (
		<Label
			htmlFor={htmlFor || undefined}
			fontSize={{ base: "sm", "2xl": "lg" }}
			fontWeight="semibold"
			// textTransform="capitalize"
			pl="0"
			mb={{ base: 2, "2xl": "0.8rem" }}
			color="inputlabel"
			variant="selectNone"
			{...rest}
		>
			{children}
			{required ? null : (
				<Text as="span" color="light" fontWeight="medium" fontSize="xs">
					{" (optional)"}
				</Text>
			)}
		</Label>
	);
};

export default InputLabel;
