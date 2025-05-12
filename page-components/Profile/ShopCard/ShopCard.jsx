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
import { useUser } from "contexts";
import { fetcher } from "helpers";
import useLocalStorage from "hooks/useLocalStorage";
import useRefreshToken from "hooks/useRefreshToken";
import { WidgetBase } from "page-components/Home";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const findObjectByValue = (arr, value) => arr.find((obj) => obj.value == value);

// const PINCODE_REGEX = /^[1-9][0-9]{5}&}/;
const TEXT_ONLY_REGEX = /^[A-Za-z\s]+$/;
const ALPHANUMERIC_WITH_SPECIAL_CHARACTERS_REGEX =
	/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;

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
	const [stateList, setStateList] = useLocalStorage("oth-state-list");
	const [shopTypes, setShopTypes] = useLocalStorage("oth-shop-types");

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
			validations: { pattern: TEXT_ONLY_REGEX },
		},
		{
			key: "shop_type_ui",
			name: "shop_type",
			label: "Shop Type",
			parameter_type_id: ParamType.LIST,
			list_elements: shopTypes,
		},
		{
			key: "shop_address",
			name: "shop_address",
			label: "Shop Address",
			validations: {
				pattern: ALPHANUMERIC_WITH_SPECIAL_CHARACTERS_REGEX,
			},
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
			list_elements: stateList,
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

	const fetchStateList = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionIds.STATE_TYPE,
			},
			token: accessToken,
		})
			.then((res) => {
				if (res.status === 0) {
					setStateList(res?.param_attributes.list_elements);
				}
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	const fetchShopTypes = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionIds.SHOP_TYPE,
			},
			token: accessToken,
		})
			.then((res) => {
				if (res.status === 0) {
					setShopTypes(res?.param_attributes.list_elements);
				}
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	useEffect(() => {
		if (!shopTypes?.length) {
			fetchShopTypes();
		}

		if (!stateList?.length) {
			fetchStateList();
		}
	}, []);

	useEffect(() => {
		const data = userData?.shopDetails;

		const _state =
			data?.state == "Delhi"
				? "National Capital Territory of Delhi (UT)"
				: data?.state;

		const _shopType = data?.shop_type;

		const state =
			stateList?.length > 0 && findObjectByValue(stateList, _state);

		const shopType =
			shopTypes?.length > 0 && findObjectByValue(shopTypes, _shopType);

		let _shopDetails = {
			shop_name: data ? data.shop_name : null,
			shop_type_ui: data ? shopType?.label : null,
			shop_type: data ? shopType : {},
			shop_address: data ? data.shop_address : null,
			city: data ? data.city : null,
			shop_address_state: data ? state : null,
			state: data ? _state : null,
			pincode: data ? Number(data.pincode) : null,
		};

		setShopDetails({ ..._shopDetails });
		reset({ ..._shopDetails });
	}, [userData?.shopDetails, shopTypes, stateList]);

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
