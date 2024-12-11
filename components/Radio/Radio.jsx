import { Flex, Radio as ChakraRadio, RadioGroup, Text } from "@chakra-ui/react";
import { useId } from "react";
import { InputLabel } from "..";

/**
 * A Radio component
 * @param {object} props Properties passed to the component
 * @param {string} props.id
 * @param {Array} props.options Options to show
 * @param {object} props.renderer Mapping object for label & value
 * @param {string} props.value Value
 * @param {string} props.size Size of the radio: "sm" | "md" | "lg"
 * @param {Function} props.onChange	function
 * @param {...*} rest Rest of the props passed to this component.
 * @param props.label
 * @param props.labelStyle
 * @param props.required
 * @param props.hideOptionalMark Hide the "optional" mark for the label
 * @param props.defaultValue
 * @param props.styles
 */
const Radio = ({
	id,
	value,
	options,
	onChange,
	label,
	labelStyle,
	size = "md",
	required = false,
	hideOptionalMark = false,
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
					hideOptionalMark={hideOptionalMark}
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
							size={size}
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
