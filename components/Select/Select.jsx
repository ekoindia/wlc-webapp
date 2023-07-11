import { Flex, Select as ChakraSelect } from "@chakra-ui/react";
import { Icon, InputLabel } from "..";
/**
 * A <Select> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Select></Select>`
 */
const Select = ({
	label,
	placeholder,
	required = false,
	inputContStyle,
	options,
	onChange,
	// defaultValue,
	// value,
	disabled = false,
	...rest
}) => {
	return (
		<Flex direction="column" w="100%">
			{label ? (
				<Flex>
					<InputLabel
						required={required}
						fontSize="md"
						color="inputlabel"
						fontWeight="600"
						mb={{ base: 2.5, "2xl": "0.8rem" }}
					>
						{label}
					</InputLabel>
				</Flex>
			) : null}
			<ChakraSelect
				disabled={disabled}
				placeholder={placeholder || "-- Select --"}
				h="3rem"
				fontSize="sm"
				focusBorderColor="hint"
				_focus={{
					border: "1px solid #D2D2D2",
					boxShadow: "none",
				}}
				borderRadius="10px"
				icon={<Icon name="caret-down" />}
				iconSize="10px"
				onChange={onChange}
				// value={value}
				// defaultValue={defaultValue}
				{...inputContStyle}
				{...rest}
			>
				{options?.map(({ value, label, selected }) => (
					<option value={value} key={label} selected={selected}>
						{label}
					</option>
				))}
			</ChakraSelect>
		</Flex>
	);
};

export default Select;
