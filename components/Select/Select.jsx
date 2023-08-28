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
	value,
	disabled = false,
	renderer = { label: "label", value: "value" },
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
					border: "1px solid var(--chakra-colors-hint)",
					boxShadow: "none",
				}}
				borderRadius="10px"
				icon={<Icon name="caret-down" />}
				iconSize="8px"
				onChange={onChange}
				value={value}
				{...inputContStyle}
				{...rest}
			>
				{options?.map((item, index) => (
					<option
						key={`${item[renderer.label]}-${index}`}
						value={item[renderer.value]}
						selected={item.selected}
					>
						{item[renderer.label]}
					</option>
				))}
			</ChakraSelect>
		</Flex>
	);
};

export default Select;
