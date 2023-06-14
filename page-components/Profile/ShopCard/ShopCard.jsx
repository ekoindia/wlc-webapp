import {
	Flex,
	FormControl,
	FormErrorMessage,
	Grid,
	GridItem,
	NumberInput,
	NumberInputField,
	Select,
	Text,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Input, Modal } from "components";
import { Endpoints, TransactionIds } from "constants";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { WidgetBase } from "page-components/Home";
import { useCallback, useState } from "react";

/**
 * A <ShopCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<ShopCard></ShopCard>` TODO: Fix example
 */
const ShopCard = () => {
	const { userData, refreshUser } = useUser();
	const [disabled, setDisabled] = useState(false);
	const [error, setError] = useState(false);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const data = userData.shopDetails;
	const { generateNewToken } = useRefreshToken();
	const inputConstStyle = {
		w: "100%",
		pos: "relative",
		br: "none",
		mb: { base: 2, "2xl": "1rem" },
	};
	const shopObj = {
		shop_name: data ? data.shop_name : "Shop Name",
		shop_type: data ? data.shop_type : "Shop Type",
		shop_address: data ? data.shop_address : "Shop Address",
		city: data ? data.city : "City",
		state: data ? data.state : "State",
		pincode: data ? Number(data.pincode) : "Pincode",
	};
	const [formState, setFormState] = useState(shopObj);
	// const error = formState.pincode.length < 6 || formState.pincode.length > 6;
	const options = [
		{ label: "Kirana", value: 1 },
		{ label: "Medical", value: 2 },
		{ label: "Individual", value: 3 },
		{ label: "Money Transfer Agent", value: 4 },
		{ label: "Tour & Travel Agent", value: 5 },
		{ label: "Mobile & Accessories", value: 6 },
		{ label: "Grocery & Kirana Store", value: 7 },
		{ label: "Chemist & Pharmacy", value: 8 },
		{ label: "Automobile Dealer", value: 9 },
		{ label: "Boutique", value: 10 },
		{ label: "Computer Center & Cyber Cafe", value: 11 },
		{ label: "Courier Services", value: 12 },
		{ label: "Electrical Store", value: 13 },
		{ label: "Electronic & Home Appliances", value: 14 },
		{ label: "Footwear", value: 15 },
		{ label: "Forex & Money Exchanger", value: 16 },
		{ label: "Game Parlour", value: 17 },
		{ label: "Garment & Apparel", value: 18 },
		{ label: "Gift & Toys", value: 19 },
		{ label: "Hardware", value: 20 },
		{ label: "Insurance Advisor", value: 21 },
		{ label: "Newspaper Stall", value: 22 },
		{ label: "Opticial & Optical Store", value: 23 },
		{ label: "Photo Studio", value: 24 },
		{ label: "Photostat", value: 25 },
		{ label: "Property Dealer", value: 26 },
		{ label: "Repair Services", value: 27 },
		{ label: "Restaurant", value: 28 },
		{ label: "Salon & Beauty Parlour", value: 29 },
		{ label: "Sport Goods", value: 30 },
		{ label: "Stationary & Books", value: 31 },
		{ label: "Supermarket", value: 32 },
		{ label: "Tailor", value: 33 },
		{ label: "Vegetable Store", value: 34 },
	];
	const onEditClick = () => {
		onOpen();
	};
	const hitQuery = useCallback(() => {
		setDisabled(true);
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id: TransactionIds.USER_PROFILE,
					user_id: userData?.userId,
					section: "shop_detail",
					...formState,
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((data) => {
				setDisabled(false);
				refreshUser();
				// updateShopDetails(formState);
				toast({
					title: data.message,
					status: "success",
					duration: 2000,
				});
				onClose();
			})
			.catch((err) => {
				setDisabled(false);
				toast({
					title: data.message,
					status: "error",
					duration: 2000,
				});
				console.error("error: ", err);
			});
	}, [formState, userData?.access_token, userData?.userId]);

	const onSubmit = (e) => {
		e.preventDefault();
		if (!error) {
			hitQuery();
		}
	};

	const handleChange = (e) => {
		if (e.target.name === "pincode") {
			if (!(e.target.value.length == 6)) {
				setError(true);
			} else {
				setError(false);
			}
		}
		setFormState({ ...formState, [e.target.name]: e.target.value });
	};
	return (
		<WidgetBase
			title="My Shop"
			iconName="mode-edit"
			linkOnClick={onEditClick}
		>
			<Grid
				templateColumns="repeat(2, 1fr)"
				rowGap="20px"
				fontSize={{ base: "14px" }}
			>
				{data &&
					Object.entries(shopObj).map(([key], index) =>
						data[key] != "" ? (
							<GridItem key={index} colSpan={1} rowSpan={1}>
								<Flex direction="column">
									<Text>
										{key
											.replace(/_/g, " ")
											.replace(/\b\w/g, (c) =>
												c.toUpperCase()
											)}
									</Text>
									<Text fontWeight="semibold">
										{data[key]}
									</Text>
								</Flex>
							</GridItem>
						) : null
					)}
			</Grid>

			{/* Show Chakra Modal to edit Shop details */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Edit My Shop"
				submitText="Save now"
				onSubmit={onSubmit}
				disabled={disabled}
			>
				<form onSubmit={onSubmit}>
					<Input
						label="Shop Name"
						name="shop_name"
						value={formState.shop_name}
						onChange={handleChange}
						inputContStyle={inputConstStyle}
					/>
					<Text fontSize={{ base: "md", md: "md" }} fontWeight="bold">
						Shop Type
					</Text>

					<Select
						label="Shop Type"
						name="shop_type"
						value={formState.shop_type}
						onChange={handleChange}
						mb={{ base: 2, "2xl": "1rem" }}
						h="3rem"
						inputContStyle={inputConstStyle}
					>
						{options.map((data, idx) => {
							return (
								<option
									key={`${data?.label}_${idx}`}
									value={data.value}
								>
									{data.label}
								</option>
							);
						})}
					</Select>
					<Input
						label="Shop Address"
						name="shop_address"
						value={formState.shop_address}
						onChange={handleChange}
						inputContStyle={inputConstStyle}
					/>
					<Input
						label="City"
						name="city"
						value={formState.city}
						onChange={handleChange}
						inputContStyle={inputConstStyle}
					/>
					<Input
						label="State"
						name="state"
						value={formState.state}
						onChange={handleChange}
						inputContStyle={inputConstStyle}
					/>
					<Text fontSize={{ base: "md", md: "md" }} fontWeight="bold">
						Pincode
					</Text>
					<FormControl isInvalid={error}>
						<NumberInput value={formState.pincode}>
							<NumberInputField
								name="pincode"
								onChange={handleChange}
								h="3rem"
							/>
						</NumberInput>
						{error && (
							<FormErrorMessage>
								Pincode should be 6 digit
							</FormErrorMessage>
						)}
					</FormControl>
				</form>
			</Modal>
			{/* </Flex> */}
		</WidgetBase>
	);
};

export default ShopCard;
