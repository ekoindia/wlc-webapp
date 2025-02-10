import { chakra, Text } from "@chakra-ui/react";

/**
 *
 * @param {*} props - properties passed to the component
 * @param {string} [props.htmlFor] - The id of the input element the label is associated with
 * @param {boolean} [props.required] - Whether the input is required or not
 * @param {boolean} [props.hideOptionalMark] - Whether to hide the "optional" mark
 * @param {string} [props.children] - The text content of the label
 * @returns {JSX.Element|null} - The label element, or null if no children are provided
 */
const InputLabel = ({
	htmlFor,
	required = false,
	hideOptionalMark = false,
	children,
	...rest
}) => {
	const Label = chakra("label");

	if (!children) return null;

	return (
		<Label
			htmlFor={htmlFor || undefined}
			fontSize={{ base: "sm", "2xl": "md" }}
			fontWeight="semibold"
			textTransform="capitalize"
			pl="0"
			mb={{ base: 2, "2xl": "0.8rem" }}
			color="inputlabel"
			variant="selectNone"
			noOfLines={1}
			{...rest}
		>
			{children}
			{required || hideOptionalMark ? null : (
				<Text as="span" color="light" fontWeight="medium" fontSize="xs">
					{" (optional)"}
				</Text>
			)}
		</Label>
	);
};

export default InputLabel;
