import { Box, Flex, Radio, RadioGroup, Text } from "@chakra-ui/react";
import { Button, Icon, Input, MultiSelect, Select } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";

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
	commissionForObj = radioDummy,
	commissionTypeObj = radioDummy,
}) => {
	const [commission, setCommission] = useState(2.5);
	const [commissionFor, setCommissionFor] = useState("1");
	const [commissionType, setCommissionType] = useState("0");
	const [fromMultiSelect, setFromMultiSelect] = useState([]);
	const [fromSelect, setFromSelect] = useState([]);
	const [data, setData] = useState([]);
	// const focusRef = useRef(null);
	const { accessToken } = useSession();

	// const charges = {
	// 	"Fixed Charges": 1.8,
	// 	Taxes: 0.8,
	// 	"Network Earnings": 4.12,
	// 	"Your Earnings": 3.28,
	// };

	const hitQuery = (op) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/pricing_commissions/${product}`,
				"tf-req-method": "POST",
			},
			body: {
				operation_type: commissionFor, //commissionFor
				csplist: fromMultiSelect.map((num) => Number(num)), //multiselect
				min_slab_amount: fromSelect[0], //select
				max_slab_amount: fromSelect[1], //select
				pricing_type: commissionType, //commissionType
				actual_pricing: commission, //default input
				operation: op,
			},
			token: accessToken,
		})
			.then((data) => {
				const selectdata =
					commissionFor == 1
						? data?.data?.allCspList ?? []
						: commissionFor == 2
						? data?.data?.allScspList ?? []
						: [];
				setData(selectdata);
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
			});
	};

	useEffect(() => {
		if (commissionFor !== "3") {
			/* no need of api call when user clicked on product radio option in select_commission_for field as multiselect option is hidden for this */
			hitQuery(OPERATION.FETCH);
		}
	}, [product, commissionFor]);

	const handleSubmit = () => {
		hitQuery(OPERATION.SUBMIT);
	};

	// const handlePopUp = (focused) => {
	// 	focusRef.current.style.display = focused ? "block" : "none";
	// };

	const multiSelectRenderer = {
		value: "ekocspid",
		label: "DisplayName",
	};
	return (
		<Flex direction="column" gap="10">
			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">{`Select ${ProductPricingType} For`}</Text>
				<RadioGroup
					defaultValue="0"
					value={commissionFor}
					onChange={(value) => setCommissionFor(value)}
				>
					<Flex gap="16">
						{Object.entries(commissionForObj).map(
							([key, value]) => (
								<Radio size="lg" key={key} value={key}>
									<Text fontSize={{ base: "sm", sm: "md" }}>
										{value}
									</Text>
								</Radio>
							)
						)}
					</Flex>
				</RadioGroup>
			</Flex>
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
						setData={setFromMultiSelect}
					/>
				</Flex>
			) : null}
			<Flex direction="column" gap="2" w={{ base: "100%", md: "500px" }}>
				<Text fontWeight="semibold">Select Slab</Text>
				<Select data={ProductSlabs} setSelected={setFromSelect} />
			</Flex>

			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">{`Select ${ProductPricingType} Type`}</Text>
				<RadioGroup
					defaultValue="0"
					value={commissionType}
					onChange={(value) => setCommissionType(value)}
				>
					<Flex gap="16">
						{Object.entries(commissionTypeObj).map(
							([key, value]) => (
								<Radio size="lg" key={key} value={key}>
									<Text fontSize={{ base: "sm", sm: "md" }}>
										{value}
									</Text>
								</Radio>
							)
						)}
					</Flex>
				</RadioGroup>
			</Flex>

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
							defaultValue={commission}
							onChange={(e) => setCommission(e.target.value)}
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

const radioDummy = {
	0: "Radio 1",
	1: "Radio 2",
};
