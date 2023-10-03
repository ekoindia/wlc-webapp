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

const PRICING_TYPE = {
	PERCENT: "0",
	FIXED: "1",
};

const pricing_type_list = [
	{ value: PRICING_TYPE.PERCENT, label: "Percentage (%)" },
	{ value: PRICING_TYPE.FIXED, label: "Fixed (₹)" },
];

const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
};

const _multiselectRenderer = {
	value: "ekocspid",
	label: "DisplayName",
};

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const CreditCardBillPaymentRetailer = () => {
	const { uriSegment, slabs, DEFAULT } = products.CREDIT_CARD_BILL_PAYMENT;

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			operation_type: DEFAULT.operation_type,
			select: { value: "0", label: "₹100 - ₹199999" }, //TODO: change this asap.
			pricing_type: DEFAULT.pricing_type,
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

	const credit_card_bill_payment_retailer_parameter_list = [
		{
			name: "operation_type",
			label: `Set ${productPricingType.CREDIT_CARD_BILL_PAYMENT} for`,
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
			label: `Select ${productPricingType.CREDIT_CARD_BILL_PAYMENT} Type`,
			parameter_type_id: ParamType.LIST,
			list_elements: pricing_type_list,
			// defaultValue: DEFAULT.pricing_type,
		},
		{
			name: "actual_pricing",
			label: `Define ${productPricingType.CREDIT_CARD_BILL_PAYMENT}`,
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

	const hitQuery = (operation, callback, finalData = {}) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/pricing_commissions/${uriSegment}`,
				"tf-req-method": "POST",
			},
			body: {
				operation_type: watcher.operation_type,
				operation: operation,
				...finalData,
			},
			token: accessToken,
			generateNewToken,
		})
			.then((data) => {
				callback(data);
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
			});
	};

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
			hitQuery(OPERATION.FETCH, (res) => {
				if (res.status === 0) {
					setMultiSelectOptions(res?.data?.allScspList);
				} else {
					toast({
						title: res.message,
						status: getStatus(res.status),
						duration: 5000,
						isClosable: true,
					});
				}
			});

			let _operationTypeList = operation_type_list.filter(
				(item) => item.value == watcher.operation_type
			);
			let _label =
				_operationTypeList.length > 0 && _operationTypeList[0].label;

			setMultiSelectLabel(_label);
		}
	}, [uriSegment, watcher.operation_type]);

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		_finalData.actual_pricing = +data.actual_pricing;

		const { min, max } = slabs[data?.select] || {};
		_finalData.min_slab_amount = min;
		_finalData.max_slab_amount = max;

		const _CspList = data?.CspList?.map(
			(item) => item[_multiselectRenderer.value]
		);

		if (watcher.operation_type != 3) {
			_finalData.CspList = `${_CspList}`;
		}

		delete _finalData.select;

		hitQuery(
			OPERATION.SUBMIT,
			(data) => {
				toast({
					title: data.message,
					status: getStatus(data.status),
					duration: 6000,
					isClosable: true,
				});
				// handleReset();
			},
			_finalData
		);
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="8">
				<Form
					parameter_list={
						credit_card_bill_payment_retailer_parameter_list
					}
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
						loading={isSubmitting}
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

export default CreditCardBillPaymentRetailer;
