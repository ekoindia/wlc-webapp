import { Flex, useTheme } from "@chakra-ui/react";
import { useId } from "react";
import { default as ReactSelect } from "react-select";
import { Icon, InputLabel } from "..";

/**
 * A Select component
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
	required,
	labelStyle,
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
				minHeight: "3rem",
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
				height: "2.5rem",
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

	const getOptionLabel = (option) => option[renderer.label];

	const getOptionValue = (option) => option[renderer.value];

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
			<ReactSelect
				required={required}
				isMulti={isMulti}
				styles={colorStyles}
				isSearchable={options?.length > 15}
				options={options}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
				closeMenuOnSelect={isMulti ? false : true}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
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
 */
const DropdownIcon = (base) => {
	const _menuIsOpen = base?.selectProps?.menuIsOpen;
	return (
		<Flex px="4">
			<Icon name={_menuIsOpen ? "caret-up" : "caret-down"} size="xs" />
		</Flex>
	);
};
