import { Flex, useToast } from "@chakra-ui/react";
import { ActionButtonGroup, Icon } from "components";
import { Endpoints, ParamType, products, TransactionTypes } from "constants";
import { useSession } from "contexts/";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";

const PRICING_TYPE = {
	PERCENT: "1",
	FIXED: "0",
};

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const _multiselectRenderer = {
	value: "user_code",
	label: "name",
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

const UpiMoneyTransferDistributor = () => {
	const { slabs, serviceCode } = products.UPI_MONEY_TRANSFER;

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
	});

	const watcher = useWatch({ control });
	const toast = useToast();
	const router = useRouter();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const [slabOptions, setSlabOptions] = useState([]);
	const [multiSelectOptions, setMultiSelectOptions] = useState([]);
	const [pricingTypeList, setPricingTypeList] = useState(pricing_type_list);
	const [validation, setValidation] = useState({ min: null, max: null });

	let prefix = "";
	let suffix = "";

	if (watcher["pricing_type"] === PRICING_TYPE.PERCENT) {
		suffix = "%";
	} else {
		prefix = "₹";
	}

	let helperText = "";

	const min = validation?.min;
	const max = validation?.max;

	if (min != undefined) helperText += `Minimum: ${prefix}${min}${suffix}`;
	if (max != undefined)
		helperText += `${
			min != undefined ? " - " : ""
		}Maximum: ${prefix}${max}${suffix}`;

	const upi_money_transfer_distributor_parameter_list = [
		{
			name: "CspList",
			label: "Select Distributor",
			parameter_type_id: ParamType.LIST,
			is_multi: true,
			list_elements: multiSelectOptions,
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
			label: `Select Commission Type`,
			parameter_type_id: ParamType.LIST,
			list_elements: pricingTypeList,
			// defaultValue: PRICING_TYPE.PERCENT,
		},
		{
			name: "actual_pricing",
			label: `Define Commission (Exclusive of GST)`,
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
							: watcher["pricing_type"] == PRICING_TYPE.FIXED
								? "rupee_bg"
								: null
					}
					size="23px"
					color="primary.DEFAULT"
				/>
			),
		},
	];

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

	// This useEffect hook updates the pricing type list based on slab selection.
	// If any pricing type is disabled, it sets the first non-disabled pricing type as the selected pricing type.
	useEffect(() => {
		if (watcher?.select?.value) {
			const _validations =
				slabs[+watcher?.select?.value]?.validation?.DISTRIBUTOR;
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
			const _min = _validation?.DISTRIBUTOR?.[_pricingType]?.min;
			const _max = _validation?.DISTRIBUTOR?.[_pricingType]?.max;

			setValidation({ min: _min, max: _max });
		}
	}, [watcher?.pricing_type, watcher?.select?.value]);

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agent-list?usertype=1",
				"tf-req-method": "GET",
			},
			token: accessToken,
			generateNewToken,
		})
			.then((res) => {
				const _agents = res?.data?.csp_list ?? [];
				setMultiSelectOptions(_agents);
			})
			.catch((error) => {
				console.error("📡Error:", error);
			});
	}, []);

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
			body: {
				interaction_type_id:
					TransactionTypes.SET_COMMISSION_FOR_DISTRIBUTORS,
				service_code: serviceCode,
				communication: 1,
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
						parameter_list:
							upi_money_transfer_distributor_parameter_list,
						formValues: watcher,
						control,
						register,
						errors,
					}}
				/>
				<ActionButtonGroup {...{ buttonConfigList }} />
			</Flex>
		</form>
	);
};

export default UpiMoneyTransferDistributor;
