import { Flex, Select as ChakraSelect } from "@chakra-ui/react";
import { useId } from "react";
import { Icon, InputLabel } from "..";
/**
 * A <Select> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Select></Select>`
 */
const Select = ({
	id,
	label,
	placeholder,
	required = true,
	inputContStyle,
	labelStyle,
	options,
	onChange,
	value,
	disabled = false,
	renderer = { label: "label", value: "value" },
	...rest
}) => {
	const _id = useId();
	return (
		<Flex direction="column" w="100%">
			{label ? (
				<InputLabel
					htmlFor={id ?? _id}
					required={required}
					{...labelStyle}
				>
					{label}
				</InputLabel>
			) : null}
			<ChakraSelect
				id={id ?? _id}
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
