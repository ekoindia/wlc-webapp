import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useState } from "react";

/**
 * A Filter page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Filter></Filter>`
 */
const Filter = ({ filterData, filterStatus, setFilterStatus }) => {
	const [inFunnel, setInFunnel] = useState(false);
	console.log("[Filter] data", filterData);
	const _data = filterData?.topPanel ?? {};

	const funnelKeyList = [48, 51, 52, 53, 54];

	const listToCalcFunnelValue = [
		_data?.partialAccount,
		_data?.businessDetailsCaptured,
		_data?.aadhaarCaptured,
		_data?.panCaptured,
		_data?.agreementSigned,
	];

	const _onboardingFunnelValue =
		listToCalcFunnelValue?.reduce(
			(acc, curr) => (acc += Number(curr)),
			0
		) || null;

	const filterList = [
		{
			id: 0,
			key: [...funnelKeyList],
			label: "Onboarding Funnel",
			value: _onboardingFunnelValue, //all except 16
		},
		{
			id: 1,
			key: 51,
			label: "Partial Account",
			value: _data?.partialAccount,
		},
		{
			id: 2,
			key: 52,
			label: "Business Detail Captured",
			value: _data?.businessDetailsCaptured,
		},
		{
			id: 3,
			key: 54,
			label: "Aadhaar Captured",
			value: _data?.aadhaarCaptured,
		},
		{
			id: 4,
			key: 53,
			label: "PAN Captured",
			value: _data?.panCaptured,
		},
		{
			id: 5,
			key: 48,
			label: "Agreement Signed",
			value: _data?.agreementSigned,
		},
		{
			id: 6,
			key: 16,
			label: "Onboarded",
			value: _data?.onboarded,
		},
		{
			id: 7,
			key: 16,
			label: "Non Transacting Live",
			value: _data?.nonTransactiingLive, //onboarded but no financial trx
		},
	];

	const handleFilterStatusClick = (id, key) => {
		if (id === 0) {
			if (!inFunnel) {
				setFilterStatus((prev) => {
					const _filterStatus = new Set([...prev, ...key]);
					return [..._filterStatus];
				});
				setInFunnel(true);
			} else {
				setFilterStatus((prev) =>
					prev.filter((item) => !funnelKeyList.includes(item))
				);
				setInFunnel(false);
			}
		} else {
			const filterStatusUpdated = filterStatus.includes(key)
				? filterStatus.filter((item) => item !== key)
				: [...filterStatus, key];

			const isAllItemsIncluded = funnelKeyList.every((item) =>
				filterStatusUpdated.includes(item)
			);
			setInFunnel(isAllItemsIncluded);
			setFilterStatus(filterStatusUpdated);
		}
	};

	const filterListLength = filterList?.length;

	return (
		<Flex
			w="100%"
			direction="column"
			bg={{ base: "none", md: "white" }}
			borderRadius="10px"
		>
			<Flex gap="2" p="20px">
				<Icon name="filter" size="23px" />
				<Text fontSize="md" fontWeight="semibold">
					Filter using onboarding status
				</Text>
			</Flex>
			<Flex
				justify={{ base: "space-between", xl: "flex-start" }}
				overflowX="auto"
				css={{
					"&::-webkit-scrollbar": {
						width: "0px",
						height: "0px",
					},
					"&::-webkit-scrollbar-thumb": {
						background: "#cbd5e0",
						borderRadius: "0px",
					},
				}}
				pb="20px"
			>
				{filterList?.map((item, index) => {
					const isActive =
						item.id === 0 && inFunnel
							? true
							: filterStatus.includes(item.key);
					return (
						item.value && (
							<Flex
								key={item.id}
								direction="column"
								justify="space-between"
								bg="white"
								p="10px 15px"
								border={
									isActive ? "1px solid #1F5AA7" : "basic"
								}
								boxShadow={
									isActive ? "0px 3px 10px #1F5AA733" : null
								}
								borderRadius="10px"
								minW={{ base: "135px", sm: "160px" }}
								maxW="160px"
								ml="20px"
								mr={
									index === filterListLength - 1
										? "20px"
										: null
								}
								_hover={{ boxShadow: "0px 3px 10px #0000000D" }}
								onClick={() => {
									handleFilterStatusClick(item.id, item.key);
								}}
								cursor="pointer"
							>
								<Text fontSize="sm">{item.label}</Text>
								<Text
									fontWeight="semibold"
									color="secondary.DEFAULT"
									fontSize="lg"
								>
									<span>{item.value}</span>
								</Text>
							</Flex>
						)
					);
				})}
			</Flex>
		</Flex>
	);
};

export default Filter;
