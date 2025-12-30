import { Flex, useTheme } from "@chakra-ui/react";
import { useId } from "react";
import { default as ReactSelect } from "react-select";
import { Icon, InputLabel } from "..";

/**
 * Size configuration for control height.
 * - sm: 32px (2rem)
 * - md: 40px (2.5rem)
 * - lg: 48px (3rem)
 */
const SIZE_CONFIG = {
	sm: "2rem",
	md: "2.5rem",
	lg: "3rem",
};

/**
 * @typedef {object} SelectOption
 * @property {string} label - Display text for the option
 * @property {string|number} value - Value of the option
 */

/**
 * @typedef {object} SelectRenderer
 * @property {string} label - Key to use for option label (default: 'label')
 * @property {string} value - Key to use for option value (default: 'value')
 */

/**
 * A customizable Select component built on react-select with Chakra UI styling.
 * Supports single/multi select, custom renderers, and size variants.
 * @param {object} props - Component props
 * @param {string} [props.placeholder] - Placeholder text when no option is selected
 * @param {Function} props.onChange - Callback when selection changes. Receives selected option(s)
 * @param {SelectOption[]} [props.options] - Array of options to display
 * @param {SelectRenderer} [props.renderer] - Keys to use for label/value in options
 * @param {boolean} [props.isMulti] - Enable multi-select mode
 * @param {SelectOption|SelectOption[]} [props.value] - Currently selected option(s)
 * @param {string} [props.label] - Label text displayed above the select
 * @param {string} [props.id] - HTML id attribute for the select
 * @param {boolean} [props.disabled] - Whether the select is disabled
 * @param {boolean} [props.required] - Whether the field is required
 * @param {boolean} [props.hideOptionalMark] - Hide the optional indicator when not required
 * @param {object} [props.labelStyle] - Style props passed to the InputLabel component
 * @param {Function} [props.getOptionLabel] - Custom function to get option label
 * @param {Function} [props.getOptionValue] - Custom function to get option value
 * @param {'sm'|'md'|'lg'} [props.size='lg'] - Size variant: 'sm' (32px), 'md' (40px), 'lg' (48px)
 * @example
 * // Basic usage
 * <Select
 *   options={[{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }]}
 *   onChange={(option) => console.log(option)}
 *   placeholder="Select an option"
 * />
 *
 * @example
 * // Multi-select with custom size
 * <Select
 *   isMulti
 *   size="md"
 *   options={options}
 *   value={selectedOptions}
 *   onChange={setSelectedOptions}
 * />
 */
const Select = ({
	placeholder = "--Select--",
	onChange,
	options = [],
	renderer = { label: "label", value: "value" },
	isMulti = false,
	value,
	label,
	id,
	disabled,
	required = false,
	hideOptionalMark = false,
	labelStyle,
	getOptionLabel,
	getOptionValue, // Check if really required
	size = "lg",
	...rest
}) => {
	const _id = useId();

	const { colors, fontSizes, radii, shadows, borders, space } = useTheme();

	const colorStyles = {
		control: (base, { menuIsOpen }) => {
			return {
				...base,
				borderColor: menuIsOpen ? colors.primary.DEFAULT : colors.hint,
				borderRadius: radii.lg,
				boxShadow: "none",
				minHeight: SIZE_CONFIG[size],
				maxHeight: "6rem",
				overflowY: "auto",
				":hover": {
					borderColor: colors.primary.DEFAULT,
					cursor: "pointer",
				},

				":active": {
					borderColor: colors.primary.DEFAULT,
				},

				":focus": {
					borderColor: colors.primary.DEFAULT,
				},
			};
		},
		menu: (base) => {
			return {
				...base,
				borderRadius: radii.lg,
				border: borders.card,
				boxShadow: shadows.basic,
			};
		},
		menuList: (base) => {
			return {
				...base,
				paddingTop: "0",
				paddingBottom: "0",
			};
		},
		option: (base, { isSelected }) => {
			return {
				...base,
				minHeight: "2.5rem",
				lineHeight: isMulti ? "1" : null,
				fontSize: fontSizes.sm,

				":nth-of-type(even)": {
					backgroundColor: isSelected
						? colors.primary.DEFAULT
						: colors.white,
				},

				":nth-of-type(odd)": {
					backgroundColor: isSelected
						? colors.primary.DEFAULT
						: colors.divider,
				},

				"::before": isMulti && {
					content: isSelected ? '"✓"' : '"▢"', // ▣ ✓ ▢ □
					display: "inline-block",
					width: "1rem",
					fontSize: fontSizes.xl,
					marginRight: space[4],
				},

				":hover": {
					cursor: "pointer",
				},

				":active": {
					backgroundColor: colors.primary.DEFAULT,
				},

				":focus": {
					backgroundColor: colors.primary.DEFAULT,
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
		singleValue: (base) => {
			return {
				...base,
				fontSize: fontSizes.sm,
			};
		},
		multiValue: (base) => {
			return {
				...base,
				backgroundColor: colors.shade,
				fontSize: fontSizes.sm,
			};
		},
		multiValueLabel: (base) => {
			return {
				...base,
				color: colors.dark,
			};
		},
		multiValueRemove: (base) => {
			return {
				...base,
				backgroundColor: colors.shade,
				":hover": {
					color: colors.error,
				},
			};
		},
		clearIndicator: (base) => {
			return {
				...base,
				":hover": {
					color: colors.error,
				},
			};
		},
	};

	const _getOptionLabel = (option) => option[renderer.label];

	const _getOptionValue = (option) => option[renderer.value];

	const _isClearable = isMulti ? true : required ? false : true;

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
			<ReactSelect
				id={id ?? _id}
				isMulti={isMulti}
				styles={colorStyles}
				isSearchable={options?.length > 15}
				isClearable={_isClearable}
				options={options}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
				closeMenuOnSelect={isMulti ? false : true}
				getOptionLabel={getOptionLabel ?? _getOptionLabel}
				getOptionValue={getOptionValue ?? _getOptionValue}
				hideSelectedOptions={false}
				isDisabled={disabled}
				components={{
					DropdownIndicator: DropdownIcon,
					IndicatorSeparator: null,
				}}
				// menuIsOpen={true}
			/>
		</Flex>
	);
};

export default Select;

/**
 * Dropdown Icon for React Select to show custom dropdown icon.
 * @param base
 */
const DropdownIcon = (base) => {
	const _menuIsOpen = base?.selectProps?.menuIsOpen;
	return (
		<Flex px="4">
			<Icon name={_menuIsOpen ? "caret-up" : "caret-down"} size="xs" />
		</Flex>
	);
};
