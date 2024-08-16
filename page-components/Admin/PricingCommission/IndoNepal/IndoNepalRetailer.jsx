import { Flex, useToast } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { Endpoints, ParamType, productPricingType, products } from "constants";
import { useSession } from "contexts/";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const operation_type_list = [
	{ value: "3", label: "Whole Network" },
	{ value: "2", label: "Distributor's Network" },
	{ value: "1", label: "Individual Distributor/Retailer" },
];

const PAYMENT_MODE = {
	CASH_TO_CASH: "1",
	CASH_TO_ACCOUNT: "2",
};

const payment_mode_list = [
	{ value: PAYMENT_MODE.CASH_TO_CASH, label: "Cash to Cash" },
	{ value: PAYMENT_MODE.CASH_TO_ACCOUNT, label: "Cash to Account" },
];

const PRICING_TYPE = {
	PERCENT: "0",
	FIXED: "1",
};

const pricing_type_list = [
	{
		id: "percentage",
		value: PRICING_TYPE.PERCENT,
		label: "Percentage (%)",
		isDisabled: false,
	},
	{
		id: "fixed",
		value: PRICING_TYPE.FIXED,
		label: "Fixed (₹)",
		isDisabled: false,
	},
];

const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
};

const _multiselectRenderer = {
	value: "user_code",
	label: "name",
};

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const IndoNepalRetailer = () => {
	const { uriSegment, slabs, DEFAULT } = products.INDO_NEPAL_FUND_TRANSFER;

	const {
		handleSubmit,
		register,
		control,
		formState: {
			errors,
			isValid,
			isDirty,
			isSubmitting,
			isSubmitSuccessful,
		},

		reset,
		trigger,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			operation_type: DEFAULT.operation_type,
			payment_mode: "1",
		},
	});

	const watcher = useWatch({
		control,
	});

	const toast = useToast();
	const router = useRouter();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const [slabOptions, setSlabOptions] = useState([]);
	const [multiSelectLabel, setMultiSelectLabel] = useState();
	const [multiSelectOptions, setMultiSelectOptions] = useState([]);
	const [pricingTypeList, setPricingTypeList] = useState(pricing_type_list);
	const [validation, setValidation] = useState({ min: null, max: null });

	const min = validation.min;
	const max = validation.max;

	let prefix = "";
	let suffix = "";

	if (watcher["pricing_type"] === PRICING_TYPE.PERCENT) {
		suffix = "%";
	} else {
		prefix = "₹";
	}

	let helperText = "";

	if (min != undefined) helperText += `Minimum: ${prefix}${min}${suffix}`;
	if (max != undefined)
		helperText += `${
			min != undefined ? " - " : ""
		}Maximum: ${prefix}${max}${suffix}`;

	const indo_nepal_retailer_parameter_list = [
		{
			name: "operation_type",
			label: `Set ${productPricingType.INDO_NEPAL_FUND_TRANSFER} for`,
			parameter_type_id: ParamType.LIST,
			list_elements: operation_type_list,
			// defaultValue: DEFAULT.operation_type,
		},
		{
			name: "CspList",
			label: `Select ${multiSelectLabel}`,
			parameter_type_id: ParamType.LIST,
			is_multi: true,
			list_elements: multiSelectOptions,
			visible_on_param_name: "operation_type",
			visible_on_param_value: /1|2/,
			multiSelectRenderer: _multiselectRenderer,
		},
		{
			name: "select",
			label: "Select Slab",
			parameter_type_id: ParamType.LIST,
			list_elements: slabOptions,
			meta: {
				force_dropdown: true,
			},
		},
		{
			name: "pricing_type",
			label: `Select ${productPricingType.INDO_NEPAL_FUND_TRANSFER} Type`,
			parameter_type_id: ParamType.LIST,
			list_elements: pricingTypeList,
			// defaultValue: DEFAULT.pricing_type,
		},
		{
			name: "payment_mode",
			label: "Select Payment Mode",
			parameter_type_id: ParamType.LIST,
			list_elements: payment_mode_list,
		},
		{
			name: "actual_pricing",
			label: `Define ${productPricingType.INDO_NEPAL_FUND_TRANSFER} (Exclusive of GST)`,
			parameter_type_id: ParamType.NUMERIC, //ParamType.MONEY
			helperText: helperText,
			validations: {
				// required: true,
				min: validation?.min,
				max: validation?.max,
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

	// This useEffect hook updates the pricing type list based on slab selection.
	// If any pricing type is disabled, it sets the first non-disabled pricing type as the selected pricing type.
	useEffect(() => {
		if (watcher?.select?.value) {
			const _validations =
				slabs[+watcher?.select?.value]?.validation?.PRICING;
			let anyDisabled = false;

			const _pricingTypeList = pricing_type_list.map((_typeObj) => {
				const _validation = _validations[_typeObj.id];
				const isDisabled = !_validation;
				if (isDisabled) anyDisabled = true;
				return { ..._typeObj, isDisabled };
			});

			setPricingTypeList(_pricingTypeList);

			// If any pricing type is disabled, set the first non-disabled pricing type as the selected pricing type
			if (anyDisabled) {
				const _firstNonDisabled = _pricingTypeList.find(
					(item) => !item.isDisabled
				);
				if (_firstNonDisabled) {
					watcher["pricing_type"] = _firstNonDisabled.value;
				}
			}

			reset({ ...watcher });
		}
	}, [watcher?.select?.value]);

	// This useEffect updates the validation state based on the selected slab, pricing type and payment mode.
	useEffect(() => {
		const _pricingType =
			watcher.pricing_type === PRICING_TYPE.PERCENT
				? "percentage"
				: watcher.pricing_type === PRICING_TYPE.FIXED
					? "fixed"
					: null;

		const _slab = +watcher?.select?.value;

		const _paymentMode =
			watcher.payment_mode === PAYMENT_MODE.CASH_TO_CASH
				? "cash_to_cash"
				: watcher.payment_mode === PAYMENT_MODE.CASH_TO_ACCOUNT
					? "cash_to_account"
					: null;

		// If a slab, pricing type & payment mode are selected, update the validation state
		if (_slab != null && _pricingType != null && _paymentMode != null) {
			const _validation = slabs[_slab]?.validation;
			const _min =
				_validation?.PRICING?.[_pricingType]?.[_paymentMode]?.min;
			const _max =
				_validation?.PRICING?.[_pricingType]?.[_paymentMode]?.max;

			setValidation({ min: _min, max: _max });
		}
	}, [watcher?.pricing_type, watcher?.payment_mode, watcher?.select?.value]);

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
	}, []);

	useEffect(() => {
		if (watcher.operation_type != "3") {
			/* no need of api call when user clicked on product radio option in select_commission_for field as multiselect option is hidden for this */
			const _tf_req_uri =
				watcher.operation_type === "2"
					? "/network/agent-list?usertype=1"
					: "/network/agent-list";

			fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					headers: {
						"tf-req-uri-root-path": "/ekoicici/v1",
						"tf-req-uri": `${_tf_req_uri}`,
						"tf-req-method": "GET",
					},
					token: accessToken,
					generateNewToken,
				}
			)
				.then((res) => {
					const _agents = res?.data?.csp_list ?? [];
					setMultiSelectOptions(_agents);
				})
				.catch((error) => {
					console.error("📡Error:", error);
				});

			let _operationTypeList = operation_type_list.filter(
				(item) => item.value == watcher.operation_type
			);
			let _label =
				_operationTypeList.length > 0 && _operationTypeList[0].label;

			setMultiSelectLabel(_label);
		}
	}, [watcher.operation_type]);

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset(watcher);
		}
		if (isDirty && !isValid) {
			trigger();
		}
	}, [isSubmitSuccessful, isValid]);

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		const { min, max } = slabs[data?.select?.value] || {};
		_finalData.min_slab_amount = min;
		_finalData.max_slab_amount = max;

		const _CspList = data?.CspList?.map(
			(item) => item[_multiselectRenderer.value]
		);

		if (watcher.operation_type != 3) {
			_finalData.CspList = `${_CspList}`;
		}

		delete _finalData.select;

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/pricing_commissions/${uriSegment}`,
				"tf-req-method": "POST",
			},
			body: {
				operation_type: watcher.operation_type,
				operation: OPERATION.SUBMIT,
				..._finalData,
			},
			token: accessToken,
			generateNewToken,
		})
			.then((res) => {
				toast({
					title: res.message,
					status: getStatus(res.status),
					duration: 6000,
					isClosable: true,
				});
				// handleReset();
			})
			.catch((error) => {
				console.error("📡Error:", error);
			});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="8">
				<Form
					{...{
						parameter_list: indo_nepal_retailer_parameter_list,
						formValues: watcher,
						control,
						register,
						errors,
					}}
				/>

				<Flex
					direction={{ base: "row-reverse", md: "row" }}
					w={{ base: "100%", md: "500px" }}
					position={{ base: "fixed", md: "initial" }}
					gap={{ base: "0", md: "16" }}
					align="center"
					bottom="0"
					left="0"
					bg="white"
				>
					<Button
						type="submit"
						size="lg"
						h="64px"
						w={{ base: "100%", md: "200px" }}
						fontWeight="bold"
						borderRadius={{ base: "none", md: "10" }}
						loading={isSubmitting}
						disabled={!isValid || !isDirty}
					>
						Save
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

export default IndoNepalRetailer;
