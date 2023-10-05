import { Flex, useToast } from "@chakra-ui/react";
import { Button, Icon } from "components";
import {
	Endpoints,
	ParamType,
	productPricingCommissionValidationConfig,
	productPricingType,
	products,
} from "constants";
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
	// { value: PRICING_TYPE.FIXED, label: "Fixed (₹)" },
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

/**
 * A AadhaarPay tab page-component
 * @example	<AadhaarPay/>
 */
const AadhaarPay = () => {
	const { uriSegment, slabs, DEFAULT } = products.AADHAAR_PAY;
	const { PERCENT, FIXED } =
		productPricingCommissionValidationConfig.AADHAAR_PAY;

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			operation_type: DEFAULT.operation_type,
			select: { value: "0", label: "₹1 - ₹10000" }, //TODO: change this asap.
			pricing_type: DEFAULT.pricing_type,
		},
	});

	const watcher = useWatch({ control });
	const toast = useToast();
	const router = useRouter();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const [slabOptions, setSlabOptions] = useState([]);
	const [multiSelectLabel, setMultiSelectLabel] = useState();
	const [multiSelectOptions, setMultiSelectOptions] = useState();

	const min =
		watcher["pricing_type"] === PRICING_TYPE.PERCENT
			? PERCENT.min
			: FIXED.min;

	const max =
		watcher["pricing_type"] === PRICING_TYPE.PERCENT
			? PERCENT.max
			: FIXED.max;

	let prefix = "";
	let suffix = "";

	if (watcher["pricing_type"] === PRICING_TYPE.PERCENT) {
		suffix = "%";
	} else {
		prefix = "₹";
	}

	const aadhaar_pay_parameter_list = [
		{
			name: "operation_type",
			label: `Set ${productPricingType.AADHAAR_PAY} for`,
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
			// defaultValue: "0", // add condition, not hardcoded
			meta: {
				force_dropdown: true,
			},
		},
		{
			name: "pricing_type",
			label: `Select ${productPricingType.AADHAAR_PAY} Type`,
			parameter_type_id: ParamType.LIST,
			list_elements: pricing_type_list,
			// defaultValue: DEFAULT.pricing_type,
		},
		{
			name: "actual_pricing",
			label: `Define ${productPricingType.AADHAAR_PAY}`,
			parameter_type_id: ParamType.NUMERIC, //ParamType.MONEY
			helperText: `Minimum: ${prefix}${min}${suffix} - Maximum: ${prefix}${max}${suffix}`,
			validations: {
				required: true,
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
	}, [slabs]);

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
					parameter_list={aadhaar_pay_parameter_list}
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

export default AadhaarPay;
