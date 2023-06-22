import { Box, Flex, Radio, RadioGroup, Text, useToast } from "@chakra-ui/react";
import { Button, Icon, Input, MultiSelect, Select } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useReducer } from "react";
import { INITIAL_FORM_STATE, pricingFormReducer } from "./pricingFormReducer";

const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
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
	product,
	ProductSlabs,
	ProductPricingType,
	commissionForObj,
	commissionTypeObj,
	paymentModeObj,
}) => {
	// const focusRef = useRef(null);
	const toast = useToast();
	const [state, dispatch] = useReducer(
		pricingFormReducer,
		INITIAL_FORM_STATE
	);
	const {
		commissionFor,
		commissionType,
		paymentMode,
		data, //to show in multiselect
		finalData,
	} = state;
	const { accessToken } = useSession();

	const handleCommissionChange = (event) => {
		dispatch({ type: "SET_COMMISSION", payload: event.target.value });
	};

	const handleCommissionForChange = (_value) => {
		dispatch({ type: "SET_COMMISSION_FOR", payload: _value });
	};

	const handleCommissionTypeChange = (_value) => {
		dispatch({ type: "SET_COMMISSION_TYPE", payload: _value });
	};

	const handlePaymentModeChange = (_value) => {
		dispatch({ type: "SET_PAYMENT_MODE", payload: _value });
	};

	const handleMultiSelectData = (_data) => {
		dispatch({ type: "SET_FROM_MULTI_SELECT", payload: _data });
	};

	const handleSelectData = (_data) => {
		dispatch({ type: "SET_FROM_SLAB_SELECT", payload: _data });
	};

	const handleReset = () => {
		dispatch({ type: "RESET" });
	};

	const hitQuery = (operation, callback) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/pricing_commissions/${product}`,
				"tf-req-method": "POST",
			},
			body: {
				operation_type: commissionFor, //commissionFor
				operation: operation,
				...finalData,
			},
			token: accessToken,
		})
			.then((data) => {
				callback(data);
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
			});
	};

	useEffect(() => {
		if (commissionFor !== "3") {
			/* no need of api call when user clicked on product radio option in select_commission_for field as multiselect option is hidden for this */
			hitQuery(OPERATION.FETCH, (data) => {
				if (data.status === 0) {
					dispatch({
						type: "SET_DATA",
						payload: data?.data,
						for: commissionFor,
					});
				} else {
					toast({
						title: data.message,
						status: getStatus(data.status),
						duration: 5000,
						isClosable: true,
					});
				}
			});
		}
	}, [product, commissionFor]);

	const handleSubmit = () => {
		hitQuery(OPERATION.SUBMIT, (data) => {
			toast({
				title: data.message,
				status: getStatus(data.status),
				duration: 5000,
				isClosable: true,
			});
			handleReset();
		});
	};

	const getStatus = (status) => {
		switch (status) {
			case 0:
				return "success";
			case 1:
				return "error";
			default:
				return "info";
		}
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
		<Flex direction="column" gap="10" fontSize="md">
			<RadioInput
				label={`Select ${ProductPricingType} For`}
				defaultValue="0"
				value={commissionFor}
				onChange={handleCommissionForChange}
				radioGroupObj={commissionForObj}
			/>

			{commissionFor !== "3" ? (
				/* no need of multiselect when user clicked on product radio option in select_commission_for field */
				<Flex
					direction="column"
					gap="2"
					w={{ base: "100%", md: "500px" }}
				>
					<Text fontWeight="semibold">
						Select {commissionForObj[commissionFor]}
					</Text>
					<MultiSelect
						options={data}
						renderer={multiSelectRenderer}
						setData={handleMultiSelectData}
					/>
				</Flex>
			) : null}

			<Flex direction="column" gap="2" w={{ base: "100%", md: "500px" }}>
				<Text fontWeight="semibold">Select Slab</Text>
				<Select data={ProductSlabs} setSelected={handleSelectData} />
			</Flex>

			<RadioInput
				label={`Select ${ProductPricingType} Type`}
				defaultValue="0"
				value={commissionType}
				onChange={handleCommissionTypeChange}
				radioGroupObj={commissionTypeObj}
			/>

			{paymentModeObj ? (
				<RadioInput
					label="Select Payment Mode"
					defaultValue="1"
					value={paymentMode}
					onChange={handlePaymentModeChange}
					radioGroupObj={paymentModeObj}
				/>
			) : null}

			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">{`Define ${ProductPricingType}`}</Text>
				<Flex gap="6" direction={{ base: "column", md: "row" }}>
					<Flex
						direction="column"
						gap="60px"
						w={{ base: "100%", md: "500px" }}
					>
						<Input
							inputRightElement={
								<Icon
									name={
										commissionType == 0
											? "percent_bg"
											: "rupee_bg"
									}
									size="23px"
									// h="20px"
									color="accent.DEFAULT"
								/>
							}
							type="number"
							fontSize="sm"
							// defaultValue={commission}
							placeholder="2.5"
							onChange={handleCommissionChange}
							// onClick={() => handlePopUp(true)}
							// onBlur={() => handlePopUp(false)}
						/>

						<Flex
							position={{ base: "fixed", md: "initial" }}
							w="100%"
							bottom="0"
							left="0"
						>
							<Box
								display={{ base: "none", md: "flex" }}
								gap="16"
								align="center"
							>
								<Button
									size="lg"
									h={{
										base: "40px",
										md: "64px",
									}}
									fontWeight="bold"
									onClick={handleSubmit}
								>
									Save Commissions
								</Button>

								<Button
									variant="link"
									fontWeight="bold"
									color="accent.DEFAULT"
									_hover={{ textDecoration: "none" }}
									onClick={handleReset}
								>
									Cancel
								</Button>
							</Box>
							<Box
								display={{ base: "flex", md: "none" }}
								w="100%"
							>
								<Button
									bg="white"
									fontWeight="bold"
									borderRadius="none"
									color="accent.DEFAULT"
									_hover={{ bg: "white" }}
									w="100%"
									h="64px"
									onClick={handleReset}
								>
									Cancel
								</Button>
								<Button
									variant="primary"
									w="100%"
									h="64px"
									borderRadius="none"
									onClick={handleSubmit}
								>
									Save Commission
								</Button>
							</Box>
						</Flex>
					</Flex>

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
							bg="primary.DEFAULT"
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
			</Flex>
		</Flex>
	);
};
export default PricingForm;

/**
 * Component to show radio button, label
 * @param {*} param0
 * @returns
 */
const RadioInput = ({
	label,
	defaultValue,
	value,
	onChange,
	radioGroupObj,
}) => {
	return (
		<Flex direction="column" gap="2">
			<Text fontWeight="semibold">{label}</Text>
			<RadioGroup
				defaultValue={defaultValue}
				value={value}
				onChange={onChange}
			>
				<Flex
					direction={{ base: "column", sm: "row" }}
					gap={{ base: "4", md: "16" }}
				>
					{Object.entries(radioGroupObj)?.map(([key, value]) => (
						<Radio size="lg" key={key} value={key}>
							<Text fontSize="sm">{value}</Text>
						</Radio>
					))}
				</Flex>
			</RadioGroup>
		</Flex>
	);
};
