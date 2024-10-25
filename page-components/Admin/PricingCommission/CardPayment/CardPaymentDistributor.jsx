import { Flex, useToast } from "@chakra-ui/react";
import { Button, Icon } from "components";
import {
	Endpoints,
	ParamType,
	productPricingCommissionValidationConfig,
	products,
	TransactionTypes,
} from "constants";
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
	{ value: PRICING_TYPE.PERCENT, label: "Percentage (%)" },
	{ value: PRICING_TYPE.FIXED, label: "Fixed (₹)" },
];

const CardPaymentDistributor = () => {
	const { slabs, serviceCode } = products.CARD_PAYMENT;
	const { PERCENT, FIXED } =
		productPricingCommissionValidationConfig.CARD_PAYMENT.DISTRIBUTOR;

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			pricing_type: "1", //check if product details can store this
			select: { value: "0", label: "₹100 - ₹25000" },
		},
	});

	const watcher = useWatch({ control });
	const toast = useToast();
	const router = useRouter();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const [slabOptions, setSlabOptions] = useState([]);
	const [multiSelectOptions, setMultiSelectOptions] = useState([]);

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

	const card_payment_distributor_parameter_list = [
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
			name: "actual_pricing",
			label: `Define Commission`,
			parameter_type_id: ParamType.NUMERIC, //ParamType.MONEY
			helperText: `Minimum: ${prefix}${min}${suffix} - Maximum: ${prefix}${max}${suffix}`,
			validations: {
				min: min,
				max: max,
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
					parameter_list={card_payment_distributor_parameter_list}
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

export default CardPaymentDistributor;
