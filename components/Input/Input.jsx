import { Box, Center, Flex, Input } from "@chakra-ui/react";
import { InputLabel, InputMsg } from "../";

/**
 * A <Input> component
 * TODO: A reusable component for input (only text)
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Inputs></Inputs>`
 * @example	`<Inputs/>`
 */

const Inputs = ({
	label,
	name,
	placeholder,
	description,
	value,
	type = "text",
	disabled = false,
	hidden = false,
	invalid = false,
	errorMsg = "",
	onChange,
	isNumInput = false,
	labelStyle,
	errorStyle,
	inputContStyle,
	inputNumStyle,
	inputProps,
	...props
}) => {
	// TODO: Edit state as required

	return (
		<Flex direction="column" {...props}>
			{label ? <InputLabel {...labelStyle}>{label}</InputLabel> : null}
			<Flex pos="relative" {...inputContStyle}>
				<Input
					name={name}
					placeholder={placeholder}
					type={type}
					disabled={disabled}
					hidden={hidden}
					value={value}
					borderRadius={{ base: 10, "2xl": 15 }}
					borderColor={errorMsg && invalid ? "error" : "hint"}
					bg={errorMsg && invalid ? "#fff7fa" : ""}
					w="100%"
					onChange={(e) => onChange(e.target.value)}
					pl={isNumInput ? { base: 17, "2xl": "7.6rem" } : ""}
					height="100%"
					_hover={{
						border: "",
					}}
					_focus={{
						bg: "focusbg",
						boxShadow: "0px 3px 6px #0000001A",
						borderColor: "hint",
						transition: "box-shadow 0.3s ease-out",
					}}
					{...inputProps}
				/>

				{isNumInput && (
					<Center
						pos="absolute"
						top="0"
						left="0"
						height="100%"
						w={{ base: 14, "2xl": "5.6rem" }}
						borderRight="1px solid"
						borderColor={invalid && errorMsg ? "error" : "hint"}
						zIndex="1100"
						{...inputNumStyle}
					>
						+91
					</Center>
				)}
			</Flex>

			{(invalid && errorMsg) || description ? (
				<InputMsg error={invalid && errorMsg} {...errorStyle}>
					{invalid && errorMsg ? errorMsg : description}
				</InputMsg>
			) : null}
		</Flex>
	);
};

Inputs.defaultProps = {
	onChange: () => {},
};

export default Inputs;
