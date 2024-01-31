import {
	Flex,
	Grid,
	GridItem,
	Text,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Button, Modal } from "components";
import { Endpoints, ParamType, TransactionIds } from "constants";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { WidgetBase } from "page-components/Home";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

/**
 * Array containing objects representing various types of shops.
 * @type {Array<{
 *     label: string,
 *     value: number
 * }>}
 */
const shop_types = [
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

const findObjectByValue = (arr, value) => arr.find((obj) => obj.value == value);

// const PINCODE_REGEX = /^[1-9][0-9]{5}&}/;
const TEXT_ONLY_REGEX = /^[A-Za-z\s]+$/;

/**
 * A ShopCard page-component
 * @example	`<ShopCard></ShopCard>` TODO: Fix example
 */
const ShopCard = () => {
	const { userData, refreshUser, accessToken } = useUser();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { generateNewToken } = useRefreshToken();
	const [shopDetails, setShopDetails] = useState({});
	const [statesList, setStatesList] = useState([]);

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isValid, isDirty, isSubmitting },
		reset,
	} = useForm({
		mode: "onChange",
	});

	const watcher = useWatch({
		control,
	});

	const shop_card_parameter_list = [
		{
			key: "shop_name", //using this key to show data on UI
			name: "shop_name",
			label: "Shop Name",
		},
		{
			key: "shop_type_ui",
			name: "shop_type",
			label: "Shop Type",
			parameter_type_id: ParamType.LIST,
			list_elements: shop_types,
		},
		{
			key: "shop_address",
			name: "shop_address",
			label: "Shop Address",
		},
		{
			key: "city",
			name: "city",
			label: "City",
			validations: { pattern: TEXT_ONLY_REGEX },
		},
		{
			key: "state",
			name: "shop_address_state",
			label: "State",
			parameter_type_id: ParamType.LIST,
			list_elements: statesList,
		},
		{
			key: "pincode",
			name: "pincode",
			label: "Pincode",
			maxLength: "6",
			step: "1",
			validations: {
				minLength: 6,
				// pattern: PINCODE_REGEX,
			},
		},
	];

	const fetchStatesList = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionIds.STATE_TYPE,
			},
			token: accessToken,
		})
			.then((res) => {
				if (res.status === 0) {
					setStatesList(res?.param_attributes.list_elements);
				}
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	useEffect(() => {
		fetchStatesList();
		const data = userData?.shopDetails;

		const _state =
			data?.state == "Delhi"
				? "National Capital Territory of Delhi (UT)"
				: data?.state;

		const state = findObjectByValue(statesList, _state);

		let _shopDetails = {
			shop_name: data ? data.shop_name : null,
			shop_type_ui: data ? data.shop_type : null,
			shop_type: data ? data.shop_type : null,
			shop_address: data ? data.shop_address : null,
			city: data ? data.city : null,
			shop_address_state: data ? state : null,
			state: data ? _state : null,
			pincode: data ? Number(data.pincode) : null,
		};

		let _shopType = _shopDetails?.shop_type;

		const shop_type = shop_types.find(
			(option) => option.label.toLowerCase() === _shopType.toLowerCase()
		);

		if (shop_type) {
			_shopDetails["shop_type"] = shop_type;
		} else {
			_shopDetails["shop_type"] = {};
		}
		setShopDetails({ ..._shopDetails });
		reset({ ..._shopDetails });
	}, [userData?.shopDetails]);

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		_finalData["shop_type"] = _finalData["shop_type"]?.value;
		_finalData["shop_address_state"] =
			_finalData["shop_address_state"]?.value;

		delete _finalData["shop_type_ui"];
		delete _finalData["state"];

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id: TransactionIds.USER_PROFILE,
					user_id: userData?.userId,
					section: "shop_detail",
					..._finalData,
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((res) => {
				refreshUser();
				toast({
					title: res.message,
					status: "success",
					duration: 6000,
				});
				onClose();
			})
			.catch((error) => {
				toast({
					title: data.message,
					status: "error",
					duration: 6000,
				});
				console.error("📡Error:", error);
			});
	};

	return (
		<WidgetBase
			title="My Shop"
			iconName="mode-edit"
			linkOnClick={() => onOpen()}
		>
			<Grid
				templateColumns="repeat(2, 1fr)"
				rowGap="20px"
				fontSize={{ base: "14px" }}
			>
				{shop_card_parameter_list.map(({ key, label }) => (
					<GridItem key={key} colSpan={1} rowSpan={1}>
						<Flex direction="column">
							<Text>{label}</Text>
							<Text fontWeight="semibold">
								{shopDetails[key]}
							</Text>
						</Flex>
					</GridItem>
				))}
			</Grid>

			<Modal isOpen={isOpen} onClose={onClose} title="Edit Shop Details">
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<Flex direction="column" gap="8" pb="4">
						<Form
							{...{
								parameter_list: shop_card_parameter_list,
								formValues: watcher,
								control,
								register,
								errors,
							}}
						/>
						<Button
							type="submit"
							size="lg"
							width="100%"
							fontSize="lg"
							loading={isSubmitting}
							disabled={!isValid || !isDirty}
						>
							Save
						</Button>
					</Flex>
				</form>
			</Modal>
		</WidgetBase>
	);
};

export default ShopCard;
