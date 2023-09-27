import { Flex } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { ParamType, productPricingType, products } from "constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "tf-components";

const operation_type_list = [
	{ value: "3", label: "Whole Network" },
	{ value: "2", label: "Distributor's Network" },
	{ value: "1", label: "Individual Distributor/Retailer" },
];

const PRICING_TYPE = {
	PERCENT: "0",
	FIXED: "1",
};

const pricing_type_list = [
	{ value: PRICING_TYPE.PERCENT, label: "Percentage (%)" },
	{ value: PRICING_TYPE.FIXED, label: "Fixed (₹)" },
];

/**
 * A AadhaarPay page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<AadhaarPay></AadhaarPay>` TODO: Fix example
 */
const AadhaarPay = () => {
	const router = useRouter();

	const {
		handleSubmit,
		register,
		control,
		watch,
		formState: { errors /* isSubmitting */ },
	} = useForm();

	const watcher = watch();

	const [slabOptions, setSlabOptions] = useState([]);

	const { /* uriSegment, */ slabs, DEFAULT } = products.AADHAAR_PAY;

	const dummyOptions = [
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

	const aadhaar_pay_parameter_list = [
		{
			name: "operation_type",
			label: `Set ${productPricingType.AADHAAR_PAY} for`,
			parameter_type_id: ParamType.LIST,
			list_elements: operation_type_list,
			defaultValue: DEFAULT.operation_type,
		},
		{
			name: "cspList",
			label: "Select Something",
			parameter_type_id: ParamType.LIST,
			is_multi: true,
			list_elements: dummyOptions,
			visible_on_param_name: "operation_type",
			visible_on_param_value: /1|2/,
			multiSelectRenderer: { label: "label", value: "value" },
		},
		{
			name: "select",
			label: "Select Slab",
			parameter_type_id: ParamType.LIST,
			list_elements: slabOptions,
			defaultValue: "0", // add condition, not hardcoded
			meta: {
				force_dropdown: true,
			},
		},
		{
			name: "pricing_type",
			label: `Select ${productPricingType.AADHAAR_PAY} Type`,
			parameter_type_id: ParamType.LIST,
			list_elements: pricing_type_list,
			defaultValue: DEFAULT.pricing_type,
		},
		{
			name: "actual_pricing",
			label: `Define ${productPricingType.AADHAAR_PAY}`,
			parameter_type_id: ParamType.NUMERIC, //ParamType.MONEY
			validations: {
				required: true,
				min: 0,
				max:
					watcher["pricing_type"] == PRICING_TYPE.PERCENT
						? 100
						: 1000000,
			},
			inputRightElement: (
				<Icon
					name={
						watcher["pricing_type"] == PRICING_TYPE.PERCENT
							? "percent_bg"
							: "rupee_bg"
					}
					size="23px"
					color="primary.DEFAULT"
				/>
			),
		},
	];

	useEffect(() => {
		const list = [];

		slabs.map((item, index) => {
			const temp = { value: `${index}` };

			const label =
				item.min == item.max
					? `₹${item.min}`
					: `₹${item.min} - ₹${item.max}`;

			list.push({ ...temp, label });
		});

		setSlabOptions(list);
	}, [slabs]);

	const handleFormSubmit = (data) => {
		console.log("data", data);
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="8">
				<Form
					parameter_list={aadhaar_pay_parameter_list}
					register={register}
					control={control}
					formValues={watcher}
					errors={errors}
				/>

				<Flex
					direction={{ base: "row-reverse", md: "row" }}
					w={{ base: "100%", md: "500px" }}
					position={{ base: "fixed", md: "initial" }}
					gap={{ base: "0", md: "16" }}
					align="center"
					bottom="0"
					left="0"
				>
					<Button
						type="submit"
						size="lg"
						h="64px"
						w={{ base: "100%", md: "250px" }}
						fontWeight="bold"
						borderRadius={{ base: "none", md: "10" }}
					>
						Save Commissions
					</Button>

					<Button
						h={{ base: "64px", md: "auto" }}
						w={{ base: "100%", md: "initial" }}
						bg={{ base: "white", md: "none" }}
						variant="link"
						fontWeight="bold"
						color="primary.DEFAULT"
						_hover={{ textDecoration: "none" }}
						borderRadius={{ base: "none", md: "10" }}
						onClick={() => router.back()}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
};

export default AadhaarPay;
