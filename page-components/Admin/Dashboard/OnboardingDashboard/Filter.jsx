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
const Filter = ({ data }) => {
	console.log("[Filter] data", data);
	const [filterStatus, setFilterStatus] = useState("partialAccount");
	const _data = data?.topPanel ?? {};
	const filterList = [
		{
			key: "partialAccount",
			label: "Partial Account",
			value: _data?.partialAccount,
		},
		{
			key: "onboardingFunnel",
			label: "Onboarding Funnel",
			value: _data?.onboardingFunnel, //TODO: Check
		},
		{
			key: "businessDetailsCaptured",
			label: "Business Detail Captured",
			value: _data?.businessDetailsCaptured,
		},
		{
			key: "aadhaarCaptured",
			label: "Aadhaar Captured",
			value: _data?.aadhaarCaptured,
		},
		{
			key: "panCaptured",
			label: "PAN Captured",
			value: _data?.panCaptured,
		},
		{
			key: "agreementSigned",
			label: "Agreement Signed",
			value: _data?.agreementSigned,
		},
		{
			key: "onboarded",
			label: "Onboarded",
			value: _data?.onboarded,
		},
		{
			key: "nonTransactiingLive",
			label: "Non Transacting Live",
			value: _data?.nonTransactiingLive,
		},
	];

	const filterListLength = filterList.length;

	return (
		<Flex
			w="100%"
			direction="column"
			bg={{ base: "none", md: "white" }}
			borderRadius="10px"
		>
			<Flex gap="2" p={{ base: "0px 20px 20px", md: "20px" }}>
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
					const isActive = filterStatus === item.key;
					return (
						item.value && (
							<Flex
								key={item.key}
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
								onClick={() => setFilterStatus(item.key)}
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
