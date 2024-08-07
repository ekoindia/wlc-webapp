import { Flex, Text, useToast } from "@chakra-ui/react";
import { ActionButtonGroup, Icon } from "components";
import { Endpoints, ParamType, productPricingType, products } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";
import { CdmBankConfig } from "./CdmBankConfig";

const operation_type_list = [
	{ value: "3", label: "Whole Network" },
	{ value: "2", label: "Distributor's Network" },
	{ value: "1", label: "Individual Distributor/Retailer" },
];

const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
};

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
const DEPOSIT_METHOD = {
	COUNTER_DEPOSIT: "1",
	CDM: "7",
};

const deposit_method_list = [
	{
		value: DEPOSIT_METHOD.COUNTER_DEPOSIT,
		label: "Counter Deposit",
	},
	{
		value: DEPOSIT_METHOD.CDM,
		label: "CDM",
	},
];

const _multiselectRenderer = {
	value: "user_code",
	label: "name",
};

const bank_list_renderer = {
	value: "bank_id",
	label: "bank_name",
};

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

/**
 * A Cdm page component
 */
const Cdm = () => {
	const { DEFAULT } = products.CDM;
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
			payment_mode: DEFAULT.payment_mode,
		},
	});

	const watcher = useWatch({
		control,
	});

	const toast = useToast();
	const { accessToken } = useSession();
	const router = useRouter();
	const { generateNewToken } = useRefreshToken();
	const [banks, setBanks] = useState([]);
	const [descList, setDescList] = useState([]);
	const [validation, setValidation] = useState(null);
	const [pricingTypeList, setPricingTypeList] = useState(pricing_type_list);
	const [multiSelectLabel, setMultiSelectLabel] = useState();
	const [multiSelectOptions, setMultiSelectOptions] = useState([]);

	const { min, max } = validation ?? {};

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

	const cdm_parameter_list = [
		{
			name: "operation_type",
			label: `Set ${productPricingType.CDM} for`,
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
			name: "payment_mode",
			label: "Deposit Method",
			parameter_type_id: ParamType.LIST,
			list_elements: deposit_method_list,
		},
		{
			name: "select",
			label: "Deposit  Bank",
			parameter_type_id: ParamType.LIST,
			list_elements: banks,
			renderer: bank_list_renderer,
			meta: {
				force_dropdown: true,
			},
		},
		{
			name: "pricing_type",
			label: `Select ${productPricingType.CDM} Type`,
			parameter_type_id: ParamType.LIST,
			list_elements: pricingTypeList,
		},
		{
			name: "actual_pricing",
			label: `Define ${productPricingType.CDM} (Exclusive of GST)`,
			parameter_type_id: ParamType.NUMERIC, //ParamType.MONEY
			helperText: helperText,
			validations: {
				// required: true,
				min: min,
				max: max,
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
		if (watcher?.payment_mode) {
			fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					body: {
						interaction_type_id: 761,
						payment_mode: watcher?.payment_mode,
					},
					token: accessToken,
					generateNewToken,
				}
			)
				.then((res) => {
					const _bankList = res?.data?.bank_list_details ?? [];
					let _banks = [];
					let _desc_list = [];

					// based on band_id in _bankList (from API), we can get the bank object from CdmBankConfig
					_bankList.forEach((_bank) => {
						const bank = CdmBankConfig[_bank.bank_id] ?? null;
						if (bank) {
							_banks.push(CdmBankConfig[_bank.bank_id]);
							_desc_list.push({
								[bank["bank_name"]]: bank["desc"],
							});
						}
					});
					setBanks(_banks);
					setDescList(_desc_list);
					reset({
						...watcher,
						select: null,
						pricing_type: "",
						actual_pricing: "",
					});
					setPricingTypeList(pricing_type_list);
					setValidation(null);
				})
				.catch((err) => {
					console.error("error", err);
				});
		}
	}, [watcher?.payment_mode]);

	// This useEffect hook updates the pricing type list based on slab selection.
	// If any pricing type is disabled, it sets the first non-disabled pricing type as the selected pricing type.
	useEffect(() => {
		if (watcher?.select?.bank_id) {
			const { validation } = watcher?.select ?? {};

			let anyDisabled = false;

			const _pricingTypeList = pricing_type_list.map((_typeObj) => {
				const _validation = validation[_typeObj.id];
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
				if (
					_firstNonDisabled &&
					watcher.pricing_type !== _firstNonDisabled.value
				) {
					watcher.pricing_type = _firstNonDisabled.value;
				}
			}

			reset({ ...watcher });
		}
	}, [watcher?.select?.bank_id]);

	// This useEffect hook updates the validation state based on the selected slab and pricing type.
	useEffect(() => {
		const _pricingType =
			watcher.pricing_type === PRICING_TYPE.PERCENT
				? "percentage"
				: watcher.pricing_type === PRICING_TYPE.FIXED
					? "fixed"
					: null;

		// if any pricing type is selected then only we need to validate
		if (_pricingType != null) {
			const { min, max } =
				watcher?.select?.validation?.[_pricingType] ?? {};
			setValidation({ min, max });
		}
	}, [watcher?.pricing_type, watcher?.select?.bank_id]);

	useEffect(() => {
		if (validation) {
			trigger();
		}
	}, [validation]);

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

		const { bank_id } = _finalData["select"] ?? {};

		const _CspList = data?.CspList?.map(
			(item) => item[_multiselectRenderer.value]
		);

		if (watcher.operation_type != 3) {
			_finalData.CspList = `${_CspList}`;
		}

		delete _finalData.select;

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				operation_type: _finalData?.operation_type,
				interaction_type_id: 760,
				operation: OPERATION.SUBMIT,
				bank_id,
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
			<Flex
				direction={{ base: "column", xl: "row" }}
				justify="space-between"
				gap="8"
			>
				<Flex direction="column" gap="8">
					<Form
						{...{
							parameter_list: cdm_parameter_list,
							formValues: watcher,
							control,
							register,
							errors,
						}}
					/>

					<ActionButtonGroup {...{ buttonConfigList }} />
				</Flex>
				{descList?.length > 0 ? (
					<Flex
						direction="column"
						w={{ base: "100%", md: "500px" }}
						gap="1"
						fontSize="sm"
					>
						<Text
							fontSize={{ base: "sm", "2xl": "lg" }}
							fontWeight="bold"
						>
							Info
						</Text>
						<ul style={{ paddingLeft: "1rem" }}>
							{descList.map((item, index) => {
								const bank_id = Object.keys(item)[0];
								const desc = item[bank_id];
								return (
									<li key={index}>
										<Text as="span" fontWeight="semibold">
											{bank_id}
										</Text>
										: {desc}
									</li>
								);
							})}
						</ul>
					</Flex>
				) : null}
			</Flex>
		</form>
	);
};

export default Cdm;
