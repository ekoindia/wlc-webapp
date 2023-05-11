import {
	Box,
	Flex,
	Radio,
	RadioGroup,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";
import { Button, Currency, Icon, Input, MultiSelect, Select } from "components";
import { slabs } from "constants";
import { useRequest } from "hooks";
import { useEffect, useRef, useState } from "react";

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
	commissionForObj = commissionForObjDummy,
	commissionTypeObj = commissionTypeObjDummy,
}) => {
	const [commission, setCommission] = useState(2.5);
	const [commissionFor, setCommissionFor] = useState("1");
	const [commissionType, setCommissionType] = useState("0");
	const focusRef = useRef(null);

	const charges = {
		"Fixed Charges": 1.8,
		Taxes: 0.8,
		"Network Earnings": 4.12,
		"Your Earnings": 3.28,
	};

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/pricing_commissions/${product}`,
		"tf-req-method": "POST",
	};

	const { data, error, isLoading, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
		body: {
			operation_type: 2, //commissionFor
			csplist: [5644, 5649], //select
			min_slab_amount: 100,
			max_slab_amount: 1000,
			pricing_type: 1, //commissionType
			actual_pricing: 10, //default input
			operation: 1, //need to send this when submitting to update to new pricing
		},
	});
	useEffect(() => {
		mutate();
	}, []);

	const handlePopUp = (focused) => {
		focusRef.current.style.display = focused ? "block" : "none";
	};

	return (
		<Flex direction="column" gap="10">
			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">Select commissions for</Text>
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
			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">
					Select {commissionForObj[commissionFor]}
				</Text>
				<MultiSelect />
			</Flex>
			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">Select Slab</Text>
				<Select
					data={slabs.AEPS}
					// setSelected={setSelected}
				/>
			</Flex>

			<Flex direction="column" gap="2">
				<Text fontWeight="semibold">Select commissions Type</Text>
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
				<Text fontWeight="semibold">Define Commission</Text>
				<Flex gap="6" direction={{ base: "column", md: "row" }}>
					<Flex
						direction="column"
						gap="60px"
						w={{ base: "100%", md: "405px" }}
					>
						<Input
							inputRightElement={
								<Icon
									name={
										commissionType == 0
											? "percent_bg"
											: "rupee_bg"
									}
									w="23px"
									h="20px"
									color="accent.DEFAULT"
								/>
							}
							type="number"
							defaultValue={commission}
							onChange={(e) => setCommission(e.target.value)}
							onClick={() => handlePopUp(true)}
							onBlur={() => handlePopUp(false)}
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
								>
									Save Commission
								</Button>
							</Box>
						</Flex>
					</Flex>

					<Flex
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
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
export default PricingForm;

const commissionForObjDummy = {
	0: "Radio 1",
	1: "Radio 2",
};

const commissionTypeObjDummy = {
	0: "Radio 1",
	1: "Radio 2",
};
