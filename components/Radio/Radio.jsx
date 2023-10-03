import { Flex, Radio as ChakraRadio, RadioGroup, Text } from "@chakra-ui/react";
import { useId } from "react";
import { InputLabel } from "..";

/**
 * A Radio component
 * @param 	{Array}	options     options to show
 * @param 	{Object}	renderer	mapping object for label & value
 * @param 	{String}	value	value
 * @param 	{Function}	onChange	function
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Radio></Radio>` TODO: Fix example
 */
const Radio = ({
	id,
	value,
	options,
	onChange,
	label,
	labelStyle,
	required = true,
	defaultValue,
	renderer = { label: "label", value: "value" },
	...rest
}) => {
	const _id = useId();
	return (
		<RadioGroup
			defaultValue={defaultValue}
			onChange={onChange}
			value={value}
		>
			{label ? (
				<InputLabel
					htmlFor={id ?? _id}
					required={required}
					{...labelStyle}
				>
					{label}
				</InputLabel>
			) : null}
			<Flex
				direction={{
					base: "column",
					md: "row",
				}}
				gap={{
					base: "4",
					md: "16",
				}}
				wrap="wrap"
				{...rest}
			>
				{options?.map((item) => (
					<ChakraRadio
						size="lg"
						key={item[renderer.value]}
						value={item[renderer.value]}
					>
						<Text
							fontSize="sm"
							whiteSpace="nowrap"
							maxWidth="200px"
						>
							{item[renderer.label]}
						</Text>
					</ChakraRadio>
				))}
			</Flex>
		</RadioGroup>
	);
};

export default Radio;
