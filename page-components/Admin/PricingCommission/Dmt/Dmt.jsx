import { Flex, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { Button, Icon, Input, MultiSelect, Radio } from "components";
import { Endpoints, productPricingType, products } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import useRefreshToken from "hooks/useRefreshToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PricingForm } from "..";

const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
};

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const AGENT_TYPE = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
};

const operationTypeList = [
	{ value: "3", label: "Whole Network" },
	{ value: "2", label: "Distributor's Network" },
	{ value: "1", label: "Individual Distributor/Retailer" },
];

const pricingTypeList = [
	{ value: "0", label: "Percentage (%)" },
	{ value: "1", label: "Fixed (₹)" },
];

const pricingTypeListForDistributor = [
	{ value: "0", label: "Percentage (%)" },
	// { value: "1", label: "Fixed (₹)" },
];

/**
 * A Dmt tab page-component
 * @example	`<Dmt></Dmt>` TODO: Fix example
 */
const Dmt = () => {
	const [data, setData] = useState([]);
	const {
		register,
		handleSubmit,
		// formState: { /*  errors, */ isSubmitting },
		// reset,
		watch,
		control,
	} = useForm({
		defaultValues: {
			agentType: AGENT_TYPE.RETAILERS,
		},
	});

	const { accessToken } = useSession();
	const watchAgentType = watch("agentType");
	const watchPricingType = watch("pricing_type");

	const router = useRouter();

	const toast = useToast();
	const { generateNewToken } = useRefreshToken();

	const hitQuery = (operation, callback, finalData = {}) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/pricing_commissions/dmt`,
				"tf-req-method": "POST",
			},
			body: {
				operation_type: "2",
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
		if (watchAgentType === AGENT_TYPE.DISTRIBUTOR) {
			hitQuery(OPERATION.FETCH, (_data) => {
				if (_data.status === 0) {
					setData(_data?.data?.allScspList);
				} else {
					toast({
						title: _data.message,
						status: getStatus(_data.status),
						duration: 5000,
						isClosable: true,
					});
				}
			});
		}
	}, [watchAgentType]);

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		_finalData.actual_pricing = +data.actual_pricing;

		const cspList = data?.multiselect?.map((num) => +num);

		_finalData.CspList = `${cspList}`;
		_finalData.communication = 1;

		delete _finalData.multiselect;
		delete _finalData.agentType;

		console.log("_finalData", _finalData);

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
	const agentType = [
		{ value: AGENT_TYPE.RETAILERS, label: "Retailers" },
		{ value: AGENT_TYPE.DISTRIBUTOR, label: "Distributors" },
	];

	const multiSelectRenderer = {
		value: "ekocspid",
		label: "DisplayName",
	};

	return (
		<Flex direction="column" gap="8">
			<FormControl>
				<FormLabel>Select Agent Type For</FormLabel>
				<Controller
					name="agentType"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Radio
							value={value}
							options={agentType}
							onChange={onChange}
						/>
					)}
				/>
			</FormControl>
			{watchAgentType === AGENT_TYPE.RETAILERS ? (
				<PricingForm
					productDetails={products.DMT}
					productPricingType={productPricingType.DMT}
					operationTypeList={operationTypeList}
					pricingTypeList={pricingTypeList}
				/>
			) : (
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<Flex direction="column" gap="8">
						<FormControl
							id="multiselect"
							w={{
								base: "auto",
								md: "500px",
							}}
						>
							<FormLabel>Select Distributor</FormLabel>
							<Controller
								name="multiselect"
								control={control}
								render={({ field: { onChange } }) => (
									<MultiSelect
										options={data}
										renderer={multiSelectRenderer}
										onChange={onChange}
									/>
								)}
							/>
						</FormControl>
						<FormControl id="pricing_type">
							<FormLabel>{`Select ${productPricingType.DMT} Type`}</FormLabel>
							<Controller
								name="pricing_type"
								control={control}
								defaultValue="0"
								render={({ field: { onChange, value } }) => (
									<Radio
										options={pricingTypeListForDistributor}
										value={value}
										onChange={onChange}
									/>
								)}
							/>
						</FormControl>
						<FormControl
							w={{ base: "100%", md: "500px" }}
							// isInvalid={errors?.pricing}
						>
							<Input
								id="actual_pricing"
								required
								label={`Define ${productPricingType.DMT}`}
								inputRightElement={
									<Icon
										name={
											watchPricingType == 0
												? "percent_bg"
												: "rupee_bg"
										}
										size="23px"
										color="primary.DEFAULT"
									/>
								}
								type="number"
								step=".01"
								min="0"
								fontSize="sm"
								placeholder="2.5"
								// invalid={errors.pricing}
								// errorMsg={errors?.title?.message}
								{...register("actual_pricing")}
							/>
						</FormControl>
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
							>
								Save Commissions
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
			)}
		</Flex>
	);
};

export default Dmt;
