import { Flex, useToast } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { Endpoints, ParamType, productPricingType, products } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";

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

/**
 * A AccountVerification tab page-component
 * @example	<AccountVerification/>
 */
const AccountVerification = () => {
	const { validation: account_verification_validation, DEFAULT } =
		products.ACCOUNT_VERIFICATION;

	const {
		handleSubmit,
		register,
		formState: {
			errors,
			isValid,
			isDirty,
			isSubmitting,
			isSubmitSuccessful,
		},
		control,
		reset,
		trigger,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			operation_type: DEFAULT.operation_type,
		},
	});

	const watcher = useWatch({
		control,
	});
	const toast = useToast();
	const { accessToken } = useSession();
	const router = useRouter();
	const { generateNewToken } = useRefreshToken();
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

	const account_verification_parameter_list = [
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
			list_elements: pricingTypeList,
			defaultValue: DEFAULT.pricing_type,
		},
		{
			name: "actual_pricing",
			label: `Define ${productPricingType.ACCOUNT_VERIFICATION} (GST Inclusive)`,
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

	// If any pricing type is disabled, it sets the first non-disabled pricing type as the selected pricing type.
	useEffect(() => {
		// if (watcher?.select?.value) {
		const _validations = account_verification_validation?.PRICING;
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
		// }
	}, []);

	// This useEffect hook updates the validation state based on the selected slab and pricing type.
	useEffect(() => {
		const _pricingType =
			watcher.pricing_type === PRICING_TYPE.PERCENT
				? "percentage"
				: watcher.pricing_type === PRICING_TYPE.FIXED
					? "fixed"
					: null;

		// If pricing type is selected, update the validation state
		if (_pricingType != null) {
			const _validation = account_verification_validation?.PRICING;
			const _min = _validation?.[_pricingType]?.min;
			const _max = _validation?.[_pricingType]?.max;

			setValidation({ min: _min, max: _max });
		}
	}, [watcher?.pricing_type]);

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
				interaction_type_id: 737,
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
		<Flex direction="column" gap="8">
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Flex direction="column" gap="8">
					{/* <SectionTitle>
						Set Account Verification Pricing
					</SectionTitle> */}

					<Form
						{...{
							parameter_list: account_verification_parameter_list,
							register,
							control,
							formValues: watcher,
							errors,
						}}
					/>

					<Flex
						direction={{ base: "row-reverse", md: "row" }}
						w={{ base: "100%", md: "500px" }}
						position={{ base: "fixed", md: "initial" }}
						gap={{ base: "4", md: "16" }}
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
		</Flex>
	);
};

export { AccountVerification };

// const SectionTitle = ({ children }) => {
// 	return (
// 		<Text
// 			as="h2"
// 			fontWeight="medium"
// 			fontSize={{ base: "lg", md: "xl" }}
// 			lineHeight={{ base: "1.2", md: "1" }}
// 		>
// 			{children}
// 		</Text>
// 	);
// };
