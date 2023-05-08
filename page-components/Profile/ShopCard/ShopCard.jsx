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
import { IconButtons, Input, Modal } from "components";
import { Endpoints, TransactionIds } from "constants";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
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
	const { userData, updateShopDetails } = useUser();
	const [error, setError] = useState(false);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const data = userData.shopDetails;
	const { generateNewToken } = useRefreshToken();
	const labelStyle = {
		fontSize: { base: "md" },
		color: "inputlabel",
		pl: "0",
		fontWeight: "600",
	};
	const inputConstStyle = {
		h: { base: "2.5rem" },
		w: "100%",
		pos: "relative",
		br: "none",
		alignItems: "center",
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
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id: TransactionIds.USER_PROFILE,
					user_id: userData.userId,
					section: "shop_detail",
					...formState,
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((data) => {
				updateShopDetails(formState);
				toast({
					title: data.message,
					status: "success",
					duration: 2000,
				});
				onClose();
			})
			.catch((err) => {
				toast({
					title: data.message,
					status: "error",
					duration: 2000,
				});
				console.error("error: ", err);
			});
	});
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
		<Flex
			w="100%"
			h={{ base: "400px" }}
			bg="white"
			direction="column"
			borderRadius="10px"
			border="1px solid #D2D2D2"
			boxShadow="0px 5px 15px #0000000D"
			p="5"
		>
			<Flex justify="space-between">
				<Text fontWeight="semibold" fontSize={{ base: "18px" }}>
					My Shop
				</Text>
				<IconButtons
					onClick={onEditClick}
					iconName="mode-edit"
					iconStyle={{ height: "12px", width: "12px" }}
				/>
			</Flex>
			<Grid templateColumns="repeat(2, 1fr)" mt="20px" rowGap="20px">
				{Object.entries(shopObj).map(([key, value], index) =>
					data[key] != "" ? (
						<GridItem key={index} colSpan={1} rowSpan={1}>
							<Flex direction="column">
								<Text>{key}</Text>
								<Text fontWeight="semibold">{data[key]}</Text>
							</Flex>
						</GridItem>
					) : null
				)}
			</Grid>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Edit My Shop"
				submitText="Save now"
				onSubmit={onSubmit}
			>
				<form onSubmit={onSubmit}>
					<Input
						label="Shop Name"
						name="shop_name"
						value={formState.shop_name}
						onChange={handleChange}
						labelStyle={labelStyle}
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
						labelStyle={labelStyle}
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
						labelStyle={labelStyle}
						inputContStyle={inputConstStyle}
					/>
					<Input
						label="City"
						name="city"
						value={formState.city}
						onChange={handleChange}
						labelStyle={labelStyle}
						inputContStyle={inputConstStyle}
					/>
					<Input
						label="State"
						name="state"
						value={formState.state}
						onChange={handleChange}
						labelStyle={labelStyle}
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
							/>
						</NumberInput>
						{error && (
							<FormErrorMessage>
								Pincode should be 6 digit
							</FormErrorMessage>
						)}
					</FormControl>
					{/* <Button type="submit">save me</Button> */}
				</form>
			</Modal>
		</Flex>
	);
};

export default ShopCard;
