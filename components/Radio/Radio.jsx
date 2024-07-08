import { Flex, Radio as ChakraRadio, RadioGroup, Text } from "@chakra-ui/react";
import { useId } from "react";
import { InputLabel } from "..";

/**
 * A Radio component
 * @param {object} prop
 * @param {string} [prop.id] - Optional ID for the radio group
 * @param {string} [prop.value] - Selected value
 * @param {string} [prop.defaultValue] - Default value
 * @param {string} [prop.label] - Label for the radio group
 * @param {object} [prop.labelStyle] - Style object for label
 * @param {Array} 	prop.options - Array of options to show with `label` and `value` keys
 * @param {boolean} [prop.required] - Required field
 * @param {object} [prop.renderer] - mapping object for label & value
 * @param {object} [prop.styles] - Style object for radio group
 * @param {Function} prop.onChange - Function to call on change
 * @param {...*} rest - Rest of the props passed to this component.
 * @example	`<Radio value={...} options={[...]} />`
 */
const Radio = ({
	id,
	value,
	defaultValue,
	label,
	labelStyle,
	options,
	required = false,
	renderer = { label: "label", value: "value" },
	styles,
	onChange,
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
