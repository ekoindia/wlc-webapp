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
		control: (base, { menuIsOpen }) => {
			return {
				...base,
				borderColor: menuIsOpen ? colors.primary.DEFAULT : colors.hint,
				borderRadius: "0.5rem",
				boxShadow: "none",
				minHeight: "3rem",
				":hover": {
					borderColor: colors.primary.DEFAULT,
				},

				":active": {
					borderColor: colors.primary.DEFAULT,
				},

				":focus": {
					borderColor: colors.primary.DEFAULT,
				},
			};
		},
		option: (base, { isSelected }) => {
			return {
				...base,
				color: colors.dark,

				backgroundColor: isSelected ? colors.shade : "transparent",

				":nth-of-type(odd)": {
					backgroundColor: isSelected ? colors.shade : colors.divider,
				},

				":hover": {
					backgroundColor: colors.shade,
				},

				":active": {
					backgroundColor: colors.shade,
				},

				":focus": {
					backgroundColor: colors.shade,
				},

				"::before": {
					content: isSelected ? '"■"' : '"□"',
					display: "inline-block",
					fontSize: "1.5em",
					"margin-right": "0.25em",
					color: colors.primary.dark,
				},
			};
		},
		placeholder: (base) => {
			return {
				...base,
				color: colors.dark,
				fontSize: fontSizes.sm,
			};
		},
		multiValue: (base) => {
			return {
				...base,
				backgroundColor: colors.shade,
			};
		},
		multiValueLabel: (base) => {
			return {
				...base,
				color: colors.primary.DEFAULT,
			};
		},
		multiValueRemove: (base) => {
			return {
				...base,
				backgroundColor: colors.shade,
				":hover": {
					color: colors.accent.dark,
				},
			};
		},
		clearIndicator: (base) => {
			return {
				...base,
				":hover": {
					color: colors.accent.dark,
				},
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
				components={{
					DropdownIndicator: DropdownIcon,
					IndicatorSeparator: null,
				}}
				// menuIsOpen={true}
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
