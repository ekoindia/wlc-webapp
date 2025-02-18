import { Divider, Flex, Text } from "@chakra-ui/react";
import { Endpoints, ProductRoleConfiguration } from "constants";
import { useApiFetch } from "hooks";
import { useEffect, useState } from "react";

/**
 * A SuccessRate page-component
 * @param root0
 * @param root0.dateFrom
 * @param root0.dateTo
 * @example	`<SuccessRate></SuccessRate>`
 */
const SuccessRate = ({ dateFrom, dateTo }) => {
	const [requestPayload, setRequestPayload] = useState({});
	const [successRateData, setSuccessRateData] = useState([]);

	// MARK: Fetching Success Rate Data
	const [fetchSuccessRateData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		body: {
			interaction_type_id: 682,
			requestPayload: requestPayload,
		},
		onSuccess: (res) => {
			const _data = res?.data?.dashboard_object?.successRate || {};
			const _product = ProductRoleConfiguration?.products ?? [];

			const _successRate = _product
				.filter((p) => p.tx_typeid && _data[p.tx_typeid]) // Ensure tx_typeid exists in API response
				.map((p) => {
					const productData = _data[p.tx_typeid];

					// Only keep data where successCount and totalCount are greater than 0
					if (
						!productData ||
						productData.successCount === 0 ||
						productData.totalCount === 0
					) {
						return null;
					}

					const successRate =
						(
							(productData.successCount /
								productData.totalCount) *
							100
						).toFixed(2) + "%";

					return {
						key: p.tx_typeid,
						label: p.label,
						value: successRate,
					};
				})
				.filter(Boolean); // Remove null values

			setSuccessRateData(_successRate);
		},
	});

	useEffect(() => {
		if (dateFrom && dateTo) {
			setRequestPayload(() => ({
				success_rate: {
					datefrom: dateFrom,
					dateto: dateTo,
				},
			}));
		}
	}, [dateFrom, dateTo]);

	useEffect(() => {
		if (dateFrom && dateTo) {
			fetchSuccessRateData();
		}
	}, [requestPayload]);

	return (
		<Flex
			direction="column"
			bg="white"
			borderRadius="10px"
			p="5"
			w="100%"
			h={{ base: "auto", xl: "320px" }} // Set fixed height for scrolling
			overflowY="auto" // Enables scrolling
			className="customScrollbars" // Use custom styles if needed
		>
			<Text fontSize="xl" fontWeight="semibold" pb="3">
				Success Rate
			</Text>

			<Divider />

			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", lg: "auto" }} // Scroll only on larger screens
				flex="1" // Takes full height for centering
				justify={successRateData?.length ? "flex-start" : "center"}
				align="center"
			>
				{successRateData?.length ? (
					successRateData.map((item, index) => (
						<Flex
							key={item.key}
							direction="column"
							gap="2"
							w="100%"
						>
							{index > 0 ? <Divider /> : null}
							<Flex
								justify="space-between"
								fontSize="sm"
								gap="2"
								pb="2"
							>
								<Text>{item.label}</Text>
								<Text
									fontWeight="semibold"
									color="primary.DEFAULT"
								>
									{item.value}
								</Text>
							</Flex>
						</Flex>
					))
				) : (
					<Text
						color="gray.500"
						fontSize="md"
						pt={{ base: "4", md: "0" }}
					>
						Nothing Found
					</Text>
				)}
			</Flex>
		</Flex>
	);
};

export default SuccessRate;

{
	/* <Flex
direction="column"
bg="white"
p="20px 20px 30px"
borderRadius="10"
border="basic"
gap="3"
w="100%"
>
<Text fontSize="xl" fontWeight="semibold">
	Success Rate
</Text>
<Divider />
<Flex
	direction="column"
	className="customScrollbars"
	overflowY={{ base: "none", md: "scroll" }}
>
	{successRateData?.map((item, index) => (
		<Flex key={item.key} direction="column">
			<Flex justify="space-between" fontSize="sm">
				<Text whiteSpace="nowrap">{item.label}</Text>
				<Text fontWeight="semibold" color="primary.DEFAULT">
					{item.value}
				</Text>
			</Flex>
			{index < successRateData.length - 1 && <Divider />}
		</Flex>
				))}
				))}
			</Stack>
	))}
			</Stack>
</Flex>
</Flex> */
}
