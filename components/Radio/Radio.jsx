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
	required = false,
	defaultValue,
	renderer = { label: "label", value: "value" },
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
			<RadioGroup
				id={id ?? _id}
				defaultValue={defaultValue}
				onChange={onChange}
				value={value}
			>
				<Flex
					direction={{
						base: "column",
						md: "row",
					}}
					columnGap={{
						base: "4",
						md: "12",
					}}
					rowGap={{
						base: "4",
						md: "4",
					}}
					wrap="wrap"
					{...styles}
				>
					{options?.map((item) => (
						<ChakraRadio
							size="lg"
							key={item[renderer.value]}
							value={item[renderer.value]}
							isDisabled={item.isDisabled}
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
		</Flex>
	);
};

export default Radio;
