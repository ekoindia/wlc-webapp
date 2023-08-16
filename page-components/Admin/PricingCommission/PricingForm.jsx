import { Flex, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { Button, Icon, Input, MultiSelect, Radio, Select } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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

/**
 * A <PricingForm> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<PricingForm></PricingForm>` TODO: Fix example
 */
const PricingForm = ({
	productDetails,
	productPricingType,
	operationTypeList,
	pricingTypeList,
	paymentModeList,
}) => {
	const { uriSegment, slabs, DEFAULT } = productDetails;
	// const focusRef = useRef(null);
	const toast = useToast();
	const { generateNewToken } = useRefreshToken();
	const [data, setData] = useState();
	const [options, setOptions] = useState();
	const [multiSelectLabel, setMultiSelectLabel] = useState();

	const router = useRouter();

	const { accessToken } = useSession();
	const {
		handleSubmit,
		register,
		watch,
		formState: { errors /* isSubmitting */ },
		control,
		setValue,
	} = useForm();

	const watchOperationType = watch("operation_type", DEFAULT.operation_type);
	const watchPricingType = watch("pricing_type", DEFAULT.pricing_type);
	const _disabled = slabs.length === 1;

	const hitQuery = (operation, callback, finalData = {}) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/pricing_commissions/${uriSegment}`,
				"tf-req-method": "POST",
			},
			body: {
				operation_type: watchOperationType,
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
		if (watchOperationType != 3) {
			/* no need of api call when user clicked on product radio option in select_commission_for field as multiselect option is hidden for this */
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

			let _operationTypeList = operationTypeList.filter(
				(item) => item.value == watchOperationType
			);
			let _label =
				_operationTypeList.length > 0 && _operationTypeList[0].label;

			setMultiSelectLabel(_label);
		}
	}, [uriSegment, watchOperationType]);

	useEffect(() => {
		const list = [];
		const len = slabs.length;

		slabs.map((item, index) => {
			const temp = { value: index };

			const label =
				item.min == item.max
					? `₹${item.min}`
					: `₹${item.min} - ₹${item.max}`;

			const selected = len === 1;
			if (len === 1) {
				setValue("select", 0);
			}
			list.push({ ...temp, label, selected });
		});

		setOptions(list);
	}, [slabs]);

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		_finalData.actual_pricing = +data.actual_pricing;

		const { min, max } = slabs[data?.select] || {};
		_finalData.min_slab_amount = min;
		_finalData.max_slab_amount = max;

		const cspList = data?.multiselect?.map((num) => +num);
		if (watchOperationType != 3) {
			_finalData.CspList = `${cspList}`;
		}

		delete _finalData.select;
		delete _finalData.multiselect;

		// console.log("_finalData", _finalData);

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

	// const charges = {
	// 	"Fixed Charges": 1.8,
	// 	Taxes: 0.8,
	// 	"Network Earnings": 4.12,
	// 	"Your Earnings": 3.28,
	// };

	// const handlePopUp = (focused) => {
	// 	focusRef.current.style.display = focused ? "block" : "none";
	// };

	const multiSelectRenderer = {
		value: "ekocspid",
		label: "DisplayName",
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="10">
				{/* operation_type */}
				<RadioInput
					name="operation_type"
					label={`Select ${productPricingType} For`}
					defaultValue={DEFAULT.operation_type}
					radioGroupList={operationTypeList}
					control={control}
				/>

				{/* no need of multiselect when user clicked on product radio option in select_commission_for field */}
				{watchOperationType != 3 && (
					<FormControl
						id="multiselect"
						w={{ base: "100%", md: "500px" }}
					>
						<FormLabel>Select {multiSelectLabel}</FormLabel>
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
				)}

				{/* Select */}
				<FormControl
					id="select"
					w={{ base: "100%", md: "500px" }}
					isInvalid={errors.priority}
				>
					<FormLabel>Select Slab</FormLabel>
					<Controller
						name="select"
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<Select
									options={options}
									// value={watchSelect}
									// defaultValue={_defaultVal}
									onChange={onChange}
									disabled={_disabled}
								/>
							);
						}}
					/>
				</FormControl>

				{/* pricing_type */}
				<RadioInput
					name="pricing_type"
					label={`Select ${productPricingType} Type`}
					defaultValue={DEFAULT.pricing_type}
					radioGroupList={pricingTypeList}
					control={control}
				/>

				{/* Payment Mode */}
				{DEFAULT.payment_mode !== undefined ? (
					<RadioInput
						name="payment_mode"
						label="Select Payment Mode"
						defaultValue={DEFAULT.payment_mode}
						radioGroupList={paymentModeList}
						control={control}
					/>
				) : null}

				{/* input to define new commission */}
				<FormControl
					w={{ base: "100%", md: "500px" }}
					isInvalid={errors?.pricing}
				>
					<Input
						id="actual_pricing"
						required
						label={`Define ${productPricingType}`}
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
						invalid={errors.pricing}
						errorMsg={errors?.title?.message}
						{...register("actual_pricing")}
					/>
				</FormControl>

				{/* Submit Button and Cancel Button */}
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

				{/* Temporary commented (uncomment after separate api for calculating pricing) */}
				{/* <Flex
						w={{ base: "auto", md: "405px" }}
						h="fit-content"
						p="10px"
						bg="focusbg"
						borderRadius="6px"
						border="br-popupcard"
						boxShadow="0px 3px 6px #EFEFEF"
						direction="column"
						ref={focusRef}
					>
						<Flex
							color="white"
							fontSize="xs"
							p="8px 15px"
							bg="accent.DEFAULT"
							justify="space-between"
							borderRadius="6px"
						>
							<Text>Benchmark Transaction</Text>
							<Currency amount={4000} />
						</Flex>
						<SimpleGrid
							p="2"
							columns="2"
							spacingX="10"
							spacingY="5"
						>
							{Object.entries(charges).map(([key, value]) => (
								<Flex key={key} direction="column">
									<Text fontSize="xs">{key}</Text>
									<Text fontSize="sm" fontWeight="semibold">
										<Currency amount={value} />
									</Text>
								</Flex>
							))}
						</SimpleGrid>
					</Flex> */}
			</Flex>
		</form>
	);
};
export default PricingForm;

/**
 * Component to show radio button, label
 * @param {*} param0
 * @returns
 */
const RadioInput = ({ name, label, defaultValue, radioGroupList, control }) => {
	return (
		<FormControl id={name}>
			<FormLabel>{label}</FormLabel>
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				render={({ field: { onChange, value } }) => (
					<Radio
						options={radioGroupList}
						value={value}
						onChange={onChange}
					/>
				)}
			/>
		</FormControl>
	);
};
