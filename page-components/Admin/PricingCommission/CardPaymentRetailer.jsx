import { Flex, useToast } from "@chakra-ui/react";
import { ActionButtonGroup, Icon } from "components";
import { Endpoints, ParamType, productPricingType, products } from "constants";
import { useSession } from "contexts/";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const fee_type_list = [
    { value: "1", label: "Transaction" },
    { value: "2", label: "Settlement Type" },
];
 
const payment_mode_list = [
    { value: "4", label: "Debit Card" },
    { value: "3", label: "Credit Card" },
    { value: "2", label: "Net Banking" },
    { value: "1", label: "UPI" },
];

const card_type_list = [
    { value: "4", label: "Visa" },
    { value: "3", label: "Rupay" },
    { value: "2", label: "Mastercard" },
    { value: "1", label: "Amex" },
    { value: "0", label: "Diner" },
];

const settlement_type_list = [
    { value: "3", label: "Instant" },
    { value: "2", label: "T + 1" },
];


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

const CardPaymentRetailer = () => {
	const { uriSegment, slabs, DEFAULT } = products.CARD_PAYMENT;

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
			// operation_type: DEFAULT.operation_type,
			fee_type:"1",
			payment_mode: "",
			select: { value: "0", label: "₹100 - ₹200000" },
		},
	});

	const watcher = useWatch({
		control,
	
	});
	console.log("Watcher Values:", watcher);

	// const shouldShowCardType = watcher.fee_type === "1" && watcher.payment_mode?.value === "4";


	const toast = useToast();
	const router = useRouter();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const [slabOptions, setSlabOptions] = useState([]);
	const [multiSelectLabel, setMultiSelectLabel] = useState();
	const [multiSelectOptions, setMultiSelectOptions] = useState([]);
	const [pricingTypeList, setPricingTypeList] = useState(pricing_type_list);
	const [validation, setValidation] = useState({ min: null, max: null });


	const min = validation?.min;
	const max = validation?.max;

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

	const card_payment_retailer_parameter_list = [
		{
			name: "fee_type",
			label: "Select Transaction Type",
			parameter_type_id: ParamType.LIST,
			list_elements: fee_type_list,
		},
		{
			name: "payment_mode",
			label: "Select Payment Mode",
			parameter_type_id: ParamType.LIST,
			list_elements: payment_mode_list,
			visible_on_param_name: "fee_type",
			visible_on_param_value: /1/,  
		},
		{
			name: "settlement_type",
			label: "Select Settlement Type",
			parameter_type_id: ParamType.LIST,
			list_elements: settlement_type_list,
			visible_on_param_name: "fee_type",
			visible_on_param_value: /^(?!1$)/,  
		},

		{
			name: "card_type",
			label: "Select Card Type",
			parameter_type_id: ParamType.LIST,
			list_elements: card_type_list,
			visible: watcher.fee_type === "1" && watcher.payment_mode?.value === "4",
		},
		
		
		
		{
			name: "operation_type",
			label: `Set ${productPricingType.CARD_PAYMENT} for`,
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
			label: `Select ${productPricingType.CARD_PAYMENT} Type`,
			parameter_type_id: ParamType.LIST,
			list_elements: pricingTypeList,
			// defaultValue: DEFAULT.pricing_type,
		},
		{
			name: "actual_pricing",
			label: `Define ${productPricingType.CARD_PAYMENT} (Exclusive of GST)`,
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
	].filter(param => param.visible !== false);



	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Save",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	useEffect(() => {
		console.log("Fee Type:", watcher.fee_type);
		console.log("Payment Mode:", watcher.payment_mode);
	}, [watcher.fee_type, watcher.payment_mode]);

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

	// This useEffect hook updates the validation state based on the selected slab and pricing type.
	useEffect(() => {
		const _pricingType =
			watcher.pricing_type === PRICING_TYPE.PERCENT
				? "percentage"
				: watcher.pricing_type === PRICING_TYPE.FIXED
					? "fixed"
					: null;

		const _slab = +watcher?.select?.value;

		// If a slab and pricing type are selected, update the validation state
		if (_slab != null && _pricingType != null) {
			const _validation = slabs[_slab]?.validation;
			const _min = _validation?.PRICING?.[_pricingType]?.min;
			const _max = _validation?.PRICING?.[_pricingType]?.max;

			setValidation({ min: _min, max: _max });
		}
	}, [watcher?.pricing_type, watcher?.select?.value]);

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
						parameter_list: card_payment_retailer_parameter_list,
						register,
						control,
						formValues: watcher,
						errors,
					}}

				
				/>
			

				<ActionButtonGroup {...{ buttonConfigList }} />
			</Flex>
		</form>
	);
};

export default CardPaymentRetailer;
