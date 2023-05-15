import { Flex, Select as ChakraSelect } from "@chakra-ui/react";
import { useState } from "react";
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
	data,
	setSelected,
}) => {
	const [selectedValue, setSelectedValue] = useState({});

	const handleSelectChange = (event) => {
		const value = event.target.value;
		const selectedValues = value.split(",").map((num) => Number(num));
		setSelectedValue(selectedValues);
		setSelected(selectedValues);
	};

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
				placeholder={placeholder || "-- Select --"}
				h="3rem"
				fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
				focusBorderColor="hint"
				_focus={{
					border: "1px solid #D2D2D2",
					boxShadow: "none",
				}}
				borderRadius="10px"
				icon={<Icon name="caret-down" w="14px" h="10px" />}
				onChange={handleSelectChange}
				value={selectedValue}
				{...inputContStyle}
				// isDisabled={data.length === 1} //TODO add default select functionality
			>
				{data?.map((value, index) => (
					<option value={[value.min, value.max]} key={index}>
						{value.min == value.max
							? value.max
							: `${value.min} - ${value.max}`}
					</option>
				))}
			</ChakraSelect>
		</Flex>
	);
};

export default Select;
