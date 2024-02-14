import { Flex, useToast } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { Endpoints, ParamType } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components";

const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
};

const PRICING_TYPE = {
	PERCENT: "0",
	FIXED: "1",
};

const pricing_type_list = [
	// {
	// 	value: PRICING_TYPE.PERCENT,
	// 	label: "Percentage (%)",
	// },
	{
		value: PRICING_TYPE.FIXED,
		label: "Fixed (₹)",
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
			payment_mode: DEPOSIT_METHOD.COUNTER_DEPOSIT,
			pricing_type: PRICING_TYPE.FIXED,
		},
	});

	const watcher = useWatch({
		control,
	});
	console.log("watcher", watcher);

	const toast = useToast();
	const { accessToken } = useSession();
	const router = useRouter();
	const { generateNewToken } = useRefreshToken();
	const [banks, setBanks] = useState([]);
	const [validation, setValidation] = useState(null);

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
			label: `Select Pricing Type`, //?
			parameter_type_id: ParamType.LIST,
			list_elements: pricing_type_list,
		},
		{
			name: "actual_pricing",
			label: `Define Pricing (Exclusive of GST)`, //?
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

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: 761,
				payment_mode: watcher?.payment_mode,
			},
			token: accessToken,
			generateNewToken,
		})
			.then((res) => {
				const _banks = res?.data?.bank_list_details ?? [];
				setBanks(_banks);
				reset({ ...watcher, select: null, actual_pricing: "" });
				setValidation(null);
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, [watcher?.payment_mode]);

	useEffect(() => {
		if (watcher?.select) {
			const { min_slab_amount, max_slab_amount } = watcher?.select ?? {};
			setValidation({ min: min_slab_amount, max: max_slab_amount });
		}
	}, [watcher?.select]);

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

		delete _finalData["select"];

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				operation_type: "3", //whole network
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

export default Cdm;
