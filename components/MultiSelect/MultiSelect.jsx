import { Flex, useTheme } from "@chakra-ui/react";
import { useId } from "react";
import Select from "react-select";
import { Icon, InputLabel } from "..";

/**
 * A MultiSelect component
 * with multiselect, search, checkbox functionality
 * @param	{Array}	[prop.options]	options (array of objects) from which multiselect component will populate data and let user select.
 * @param	{string}	[prop.placeholder]	placeholder to show when nothing is selected.
 * @param	{object}	[prop.renderer]	object which contains label & value, which will let multiselect component know what is going to be the label and value from particular data.
 * @param	{string}	[prop.onChange]	setter which parent component will pass to multiselect to get the data/values/options which is selected by the user.
 * @example	`<MultiSelect options={options}	renderer={renderer} placeholder = "Please Select Something"/>`
 */
const MultiSelect = ({
	placeholder = "--Select--",
	onChange,
	options = [],
	renderer = { label: "label", value: "value" },
	isMulti = true,
	value,
	label,
	id,
	required,
	labelStyle,
}) => {
	const _id = useId();
	const { colors, fontSizes } = useTheme();

	const colorStyles = {
		control: (base, { isDisabled, isFocused, isSelected }) => {
			return {
				...base,
				borderRadius: "0.5rem",
				borderColor: isDisabled
					? undefined
					: isSelected
					? colors.primary.dark
					: isFocused
					? colors.primary.dark
					: undefined,
				boxShadow: "none",
				minHeight: "3rem",
			};
		},
		option: (
			base,
			{ isDisabled, isFocused, isSelected /* , options, data */ }
		) => {
			return {
				...base,
				backgroundColor: isDisabled
					? undefined
					: isSelected
					? colors.shade
					: isFocused
					? colors.shade
					: undefined,
				color: colors.dark,
			};
		},
		placeholder: (base) => {
			return {
				...base,
				color: colors.dark,
				fontSize: fontSizes.sm,
			};
		},
	};

	const getOptionLabel = (option) => option[renderer.label];

	const getOptionValue = (option) => option[renderer.value];

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
			<Select
				isMulti={isMulti}
				styles={colorStyles}
				options={options}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
				closeMenuOnSelect={isMulti ? false : true}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				hideSelectedOptions={false}
				// menuIsOpen={true}
				components={{
					DropdownIndicator: DropdownIcon,
					IndicatorSeparator: null,
				}}
				theme={(theme) => ({
					...theme,
					borderRadius: 0,
					colors: {
						...theme.colors,
						primary25: colors.shade, //option-hover
						primary50: colors.shade,
						primary75: colors.shade,
						primary: colors.shade, //control-border
						danger: colors.error, //cross
						dangerLight: colors.shade, //cross-box
						neutral10: colors.shade, //tag-text-box
					},
				})}
			/>
		</Flex>
	);
};

export default MultiSelect;

/**
 * Dropdown Icon for React Select to show custom dropdown icon.
 */
const DropdownIcon = () => (
	<Flex px="4">
		<Icon name="caret-down" size="xs" />
	</Flex>
);
