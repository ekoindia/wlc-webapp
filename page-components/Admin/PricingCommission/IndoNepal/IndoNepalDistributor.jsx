import { Flex, useToast } from "@chakra-ui/react";
import { Button, Icon } from "components";
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

const PAYMENT_MODE = {
	CASH_TO_CASH: "1",
	CASH_TO_ACCOUNT: "2",
};

const payment_mode_list = [
	{ value: PAYMENT_MODE.CASH_TO_CASH, label: "Cash to Cash" },
	{ value: PAYMENT_MODE.CASH_TO_ACCOUNT, label: "Cash to Account" },
];

const pricing_type_list = [
	// { value: PRICING_TYPE.PERCENT, label: "Percentage (%)" },
	{ value: PRICING_TYPE.FIXED, label: "Fixed (₹)" },
];

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

const IndoNepalDistributor = () => {
	const { slabs, serviceCode } = products.INDO_NEPAL_FUND_TRANSFER;

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
			pricing_type: "0", //check if product details can store this
			payment_mode: "1",
		},
	});

	const watcher = useWatch({ control });
	const toast = useToast();
	const router = useRouter();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const [slabOptions, setSlabOptions] = useState([]);
	const [multiSelectOptions, setMultiSelectOptions] = useState([]);
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

	const indo_nepal_distributor_parameter_list = [
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
			list_elements: pricing_type_list,
			// defaultValue: PRICING_TYPE.PERCENT,
		},
		{
			name: "payment_mode",
			label: "Select Payment Mode",
			parameter_type_id: ParamType.LIST,
			list_elements: payment_mode_list,
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
	}, []);

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
				_validation?.DISTRIBUTOR?.[_pricingType]?.[_paymentMode]?.min;
			const _max =
				_validation?.DISTRIBUTOR?.[_pricingType]?.[_paymentMode]?.max;

			setValidation({ min: _min, max: _max });
		}
	}, [watcher?.pricing_type, watcher?.payment_mode, watcher?.select?.value]);

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
				service_code:
					watcher.payment_mode === "1"
						? serviceCode[0]
						: watcher.payment_mode === "2"
							? serviceCode[1]
							: null,
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
			.catch((err) => {
				console.error("error", err);
			});
	};
	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="8">
				<Form
					{...{
						parameter_list: indo_nepal_distributor_parameter_list,
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

export default IndoNepalDistributor;
