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
		const selectedObject = data.find((obj) => obj.key === parseInt(value));
		setSelectedValue(selectedObject);
		setSelected(selectedObject);
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
				// w="100%"
				h="3rem"
				fontSize={{ base: "sm", md: "sm", "2xl": "lg" }}
				focusBorderColor="#D2D2D2"
				_focus={{
					border: "1px solid #D2D2D2",
					boxShadow: "none",
				}}
				borderRadius="10px"
				icon={<Icon name="caret-down" w="14px" h="10px" />}
				onChange={handleSelectChange}
				value={selectedValue.key || ""}
				{...inputContStyle}
			>
				{data?.map((value) => (
					<option value={value.key} key={value.key}>
						{value.minSlabAmount} - {value.maxSlabAmount}
					</option>
				))}
			</ChakraSelect>
		</Flex>
	);
};

export default Select;
