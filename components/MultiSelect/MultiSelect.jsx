import { Flex, useTheme } from "@chakra-ui/react";
import Select from "react-select";
import { Icon } from "..";

/**
 * A MultiSelect component
 * with multiselect, search, checkbox functionality
 * @param	{Array}	[prop.options]	options (array of objects) from which multiselect component will populate data and let user select.
 * @param	{string}	[prop.placeholder]	placeholder to show when nothing is selected.
 * @param	{object}	[prop.renderer]	object which contains label & value, which will let multiselect component know what is going to be the label and value from particular data.
 * @param	{string}	[prop.onChange]	setter which parent component will pass to multiselect to get the data/values/options which is selected by the user.
 * @example	`<MultiSelect options={options}	renderer={renderer} placeholder = "Please Select Something"/>`
 */
const MultiSelect = ({ placeholder = "--Select--", isMulti = true }) => {
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

	return (
		<Select
			isMulti={isMulti}
			styles={colorStyles}
			options={options}
			placeholder={placeholder}
			closeMenuOnSelect={isMulti ? false : true}
			hideSelectedOptions={false}
			// menuIsOpen={true}
			components={{
				DropdownIndicator: DropdownIcon,
				// IndicatorSeparator: null,
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

const options = [
	{ value: "chocolate", label: "Chocolate" },
	{ value: "strawberry", label: "Strawberry" },
	{ value: "vanilla", label: "Vanilla" },
	{ value: "banana", label: "Banana" },
	{ value: "blueberry", label: "Blueberry" },
	{ value: "caramel", label: "Caramel" },
	{ value: "cherry", label: "Cherry" },
	{ value: "coconut", label: "Coconut" },
	{ value: "lemon", label: "Lemon" },
	{ value: "mint", label: "Mint" },
	{ value: "orange", label: "Orange" },
	{ value: "peach", label: "Peach" },
	{ value: "peanut butter", label: "Peanut Butter" },
	{ value: "pineapple", label: "Pineapple" },
	{ value: "raspberry", label: "Raspberry" },
	{ value: "watermelon", label: "Watermelon" },
	{ value: "cinnamon", label: "Cinnamon" },
	{ value: "hazelnut", label: "Hazelnut" },
	{ value: "pistachio", label: "Pistachio" },
	{ value: "butterscotch", label: "Butterscotch" },
	{ value: "almond", label: "Almond" },
	{ value: "blackberry", label: "Blackberry" },
	{ value: "coffee", label: "Coffee" },
	{ value: "stracciatella", label: "Stracciatella" },
	{ value: "peppermint", label: "Peppermint" },
	{ value: "maple", label: "Maple" },
	{ value: "fig", label: "Fig" },
	{ value: "kiwi", label: "Kiwi" },
	{ value: "passion fruit", label: "Passion Fruit" },
	{ value: "rocky road", label: "Rocky Road" },
	{ value: "s'mores", label: "S'mores" },
	{ value: "tiramisu", label: "Tiramisu" },
	{ value: "red velvet", label: "Red Velvet" },
	{ value: "pumpkin", label: "Pumpkin" },
	{ value: "cheesecake", label: "Cheesecake" },
	{ value: "toffee", label: "Toffee" },
	{ value: "rum raisin", label: "Rum Raisin" },
	{ value: "marshmallow", label: "Marshmallow" },
	{ value: "gingerbread", label: "Gingerbread" },
	{ value: "mango", label: "Mango" },
	{ value: "pomegranate", label: "Pomegranate" },
	{ value: "black currant", label: "Black Currant" },
	{ value: "pistachio almond", label: "Pistachio Almond" },
	{ value: "espresso", label: "Espresso" },
	{ value: "honeycomb", label: "Honeycomb" },
	{ value: "peanut brittle", label: "Peanut Brittle" },
	{ value: "chocolate chip", label: "Chocolate Chip" },
	{ value: "butter pecan", label: "Butter Pecan" },
	{ value: "peanut caramel", label: "Peanut Caramel" },
	{ value: "cookies and cream", label: "Cookies and Cream" },
	{ value: "strawberry cheesecake", label: "Strawberry Cheesecake" },
	{ value: "black cherry", label: "Black Cherry" },
	{ value: "cotton candy", label: "Cotton Candy" },
	{ value: "pistachio pistachio", label: "Pistachio Pistachio" },
	{ value: "banana split", label: "Banana Split" },
	{ value: "toasted coconut", label: "Toasted Coconut" },
	{ value: "lemon sorbet", label: "Lemon Sorbet" },
	{ value: "bubblegum", label: "Bubblegum" },
	{ value: "cappuccino", label: "Cappuccino" },
	{ value: "chocolate fudge", label: "Chocolate Fudge" },
	{ value: "french vanilla", label: "French Vanilla" },
	{ value: "green tea", label: "Green Tea" },
	{ value: "pumpkin pie", label: "Pumpkin Pie" },
	{ value: "rum raisin", label: "Rum Raisin" },
	{ value: "mochaccino", label: "Mochaccino" },
	{ value: "brownie", label: "Brownie" },
	{ value: "caramel swirl", label: "Caramel Swirl" },
	{ value: "rocky road", label: "Rocky Road" },
	{ value: "peanut butter swirl", label: "Peanut Butter Swirl" },
	{ value: "peanut butter cup", label: "Peanut Butter Cup" },
	{ value: "caramel praline", label: "Caramel Praline" },
	{ value: "cookie dough", label: "Cookie Dough" },
	{ value: "cinnamon roll", label: "Cinnamon Roll" },
	{ value: "pistachio almond fudge", label: "Pistachio Almond Fudge" },
	{ value: "strawberry ripple", label: "Strawberry Ripple" },
	{ value: "black raspberry", label: "Black Raspberry" },
	{ value: "cherry almond", label: "Cherry Almond" },
	{ value: "amaretto", label: "Amaretto" },
	{ value: "praline pecan", label: "Praline Pecan" },
	{ value: "coconut cream", label: "Coconut Cream" },
	{ value: "maple walnut", label: "Maple Walnut" },
	{ value: "mint chocolate chip", label: "Mint Chocolate Chip" },
	{ value: "toffee caramel", label: "Toffee Caramel" },
	{ value: "rocky mountain", label: "Rocky Mountain" },
	{ value: "honey lavender", label: "Honey Lavender" },
	{ value: "wild berry", label: "Wild Berry" },
	{ value: "key lime", label: "Key Lime" },
	{ value: "butter brickle", label: "Butter Brickle" },
	{ value: "banana nut", label: "Banana Nut" },
	{ value: "raspberry ripple", label: "Raspberry Ripple" },
	{ value: "butter pecan praline", label: "Butter Pecan Praline" },
];
