import { Flex, useToast } from "@chakra-ui/react";
import { Button, Icon } from "components";
import {
	Endpoints,
	ParamType,
	productPricingCommissionValidationConfig,
	productPricingType,
	products,
} from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const OPERATION = {
	VERIFICATION_SUBMIT: 2,
	SUBMIT: 1,
	FETCH: 0,
};

const operation_type_list = [
	{ value: "3", label: "Whole Network" },
	{ value: "2", label: "Distributor's Network" },
	{ value: "1", label: "Individual Distributor/Retailer" },
];

const PRICING_TYPE = {
	PERCENT: "0",
	FIXED: "1",
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

const pricing_type_list = [
	// { value: PRICING_TYPE.PERCENT, label: "Percentage (%)" },
	{ value: PRICING_TYPE.FIXED, label: "Fixed (₹)" },
];

const ValidateUpiId = () => {
	const { serviceCode, DEFAULT } = products.VALIDATE_UPI_ID;
	const { FIXED } = productPricingCommissionValidationConfig.VALIDATE_UPI_ID;
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
			pricing_type: DEFAULT.pricing_type,
		},
	});

	const toast = useToast();
	const { accessToken } = useSession();
	const router = useRouter();
	const { generateNewToken } = useRefreshToken();

	const [multiSelectLabel, setMultiSelectLabel] = useState();
	const [multiSelectOptions, setMultiSelectOptions] = useState([]);

	const watcher = useWatch({
		control,
	});

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset(watcher);
		}
		if (isDirty && !isValid) {
			trigger();
		}
	}, [isSubmitSuccessful, isValid]);

	useEffect(() => {
		if (watcher.operation_type && watcher.operation_type != "3") {
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

	const min = FIXED.min;

	const max = FIXED.max;

	const prefix = "₹";

	const validate_upi_pricing_parameter_list = [
		{
			name: "operation_type",
			label: `Set Pricing For`,
			parameter_type_id: ParamType.LIST,
			list_elements: operation_type_list,
			defaultValue: DEFAULT.operation_type,
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
			name: "pricing_type",
			label: `Select ${productPricingType.ACCOUNT_VERIFICATION} Type`,
			parameter_type_id: ParamType.LIST,
			list_elements: pricing_type_list,
			defaultValue: DEFAULT.pricing_type,
		},
		{
			name: "actual_pricing",
			label: `Define ${productPricingType.ACCOUNT_VERIFICATION} (GST Inclusive)`,
			parameter_type_id: ParamType.NUMERIC, //ParamType.MONEY
			helperText: `Minimum: ${prefix}${min} - Maximum: ${prefix}${max}`,
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

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		const _CspList = data?.CspList?.map(
			(item) => item[_multiselectRenderer.value]
		);

		if (watcher.operation_type == "3") {
			delete _finalData.CspList;
		} else {
			_finalData.CspList = `${_CspList}`;
		}

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: 754,
				service_code: serviceCode,
				operation: OPERATION.SUBMIT,
				..._finalData,
			},
			token: accessToken,
		})
			.then((res) => {
				toast({
					title: res.message,
					status: getStatus(res.status),
					duration: 5000,
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
						parameter_list: validate_upi_pricing_parameter_list,
						register,
						control,
						formValues: watcher,
						errors,
					}}
				/>

				<Flex
					direction={{ base: "column", md: "row" }}
					w={{ base: "100%", md: "500px" }}
					// position={{ base: "fixed", md: "initial" }}
					gap={{ base: "4", md: "16" }}
					align="center"
					// bottom="0"
					// left="0"
				>
					<Button
						type="submit"
						size="lg"
						h="64px"
						w={{ base: "100%", md: "200px" }}
						fontWeight="bold"
						// borderRadius={{ base: "none", md: "10" }}
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
						// borderRadius={{ base: "none", md: "10" }}
						onClick={() => router.back()}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
};

export { ValidateUpiId };
