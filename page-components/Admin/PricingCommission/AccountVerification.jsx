import { Flex, FormControl, useToast } from "@chakra-ui/react";
import { Button, Icon, Radio } from "components";
import { Endpoints, ParamType, productPricingType, products } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";

const OPERATION = {
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

const account_verification_operation = [
	{
		label: "On",
		value: "0",
	},
	{
		label: "Off",
		value: "1",
	},
];

const _multiselectRenderer = {
	value: "ekocspid",
	label: "DisplayName",
};

/**
 * A AccountVerification tab page-component
 * @example	<AccountVerification/>
 */
const AccountVerification = () => {
	const { DEFAULT } = products.ACCOUNT_VERIFICATION;
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		control,
		// reset,
	} = useForm({
		defaultValues: {
			otp_verification_token: "0",
			operation_type: DEFAULT.operation_type,
			pricing_type: DEFAULT.pricing_type,
		},
	});

	const toast = useToast();
	const { accessToken } = useSession();
	const router = useRouter();
	// const [accountVerificationStatus, setAccountVerificationStatus] =
	// 	useState(null);

	const [multiSelectLabel, setMultiSelectLabel] = useState();
	const [multiSelectOptions, setMultiSelectOptions] = useState([]);

	const watcher = useWatch({
		control,
	});

	// useEffect(() => {
	// 	fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
	// 		body: {
	// 			interaction_type_id: 737,
	// 			operation: OPERATION.FETCH,
	// 		},
	// 		token: accessToken,
	// 	})
	// 		.then((res) => {
	// 			const _accountVerification = res?.data?.otp_verification_token;
	// 			console.log("_accountVerification", _accountVerification);
	// 			setAccountVerificationStatus(_accountVerification);
	// 		})
	// 		.catch((err) => {
	// 			console.error("error", err);
	// 		});
	// }, []);

	useEffect(() => {
		if (watcher.operation_type != "3") {
			/* no need of api call when user clicked on product radio option in select_commission_for field as multiselect option is hidden for this */

			fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					body: {
						interaction_type_id: 737,
						operation: OPERATION.FETCH,
					},
					token: accessToken,
				}
			)
				.then((res) => {
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
				})
				.catch((err) => {
					console.error("error", err);
				});

			let _operationTypeList = operation_type_list.filter(
				(item) => item.value == watcher.operation_type
			);
			let _label =
				_operationTypeList.length > 0 && _operationTypeList[0].label;

			setMultiSelectLabel(_label);
		}
	}, [watcher.operation_type]);

	// useEffect(() => {
	// 	if (accountVerificationStatus !== null) {
	// 		let defaultValues = {};
	// 		defaultValues.otp_verification_token = accountVerificationStatus;
	// 		reset({ ...defaultValues });
	// 	}
	// }, [accountVerificationStatus]);

	const handleFormSubmit = (data) => {
		const { account_verification } = data ?? {};
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: 737,
				operation: OPERATION.SUBMIT,
				otp_verification_token: account_verification,
			},
			token: accessToken,
		})
			.then((res) => {
				// const _accountVerification = res?.data?.otp_verification_token;
				// setAccountVerificationStatus(_accountVerification);
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
			list_elements: pricing_type_list,
			defaultValue: DEFAULT.pricing_type,
		},
		{
			name: "actual_pricing",
			label: `Define ${productPricingType.ACCOUNT_VERIFICATION}`,
			helperText: "(Minimum: ₹1.71 - to avoid losses)",
			parameter_type_id: ParamType.NUMERIC, //ParamType.MONEY
			validations: {
				required: true,
				min: 1.71,
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

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="8">
				{/* handling this separate as Form does not support two-layer/multi-layer visibility  */}
				<FormControl
					id="otp_verification_token"
					w={{ base: "100%", md: "500px" }}
				>
					<Controller
						name="otp_verification_token"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Radio
								label="Account Verification"
								options={account_verification_operation}
								onChange={onChange}
								value={value}
							/>
						)}
					/>
				</FormControl>

				{watcher.otp_verification_token === "0" && (
					<Form
						parameter_list={account_verification_parameter_list}
						register={register}
						control={control}
						formValues={watcher}
						errors={errors}
					/>
				)}

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
						// disabled={
						// 	accountVerificationStatus ===
						// 	watcher.otp_verification_token
						// }
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

export default AccountVerification;
