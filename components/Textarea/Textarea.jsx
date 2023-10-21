import { Flex, Textarea as ChakraTextarea } from "@chakra-ui/react";
import { useId } from "react";
import { InputLabel } from "..";

/**
 * A Textarea component
 * @example	`<Textarea></Textarea>` TODO: Fix example
 */
const Textarea = ({
	id,
	value,
	label,
	labelStyle,
	placeholder,
	required,
	onChange,
	noOfLines = 2,
	maxLength = 100,
	resize = "none",
	isDisabled,
	isInvalid,
	styles,
	...rest
}) => {
	const _id = useId();
	return (
		<Flex direction="column" w="100%" {...rest}>
			{label ? (
				<InputLabel
					htmlFor={id ?? _id}
					required={required}
					{...labelStyle}
				>
					{label}
				</InputLabel>
			) : null}
			<ChakraTextarea
				id={id ?? _id}
				resize={resize}
				noOfLines={noOfLines}
				maxLength={maxLength}
				onChange={onChange}
				isDisabled={isDisabled}
				isInvalid={isInvalid}
				_hover={{
					borderColor: "primary.DEFAULT",
					borderWidth: "1px",
					borderStyle: "solid",
				}}
				_active={{
					borderColor: "primary.DEFAULT",
					borderWidth: "1px",
					borderStyle: "solid",
				}}
				_focusVisible={{
					borderColor: "primary.DEFAULT",
					borderWidth: "1px",
					borderStyle: "solid",
				}}
				_invalid={{
					borderColor: "error",
					borderWidth: "1px",
					borderStyle: "solid",
				}}
				{...styles}
			/>
		</Flex>
	);
};

export default Textarea;
