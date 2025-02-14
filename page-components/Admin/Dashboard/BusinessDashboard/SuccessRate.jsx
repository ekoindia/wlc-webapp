import { Divider, Flex, Stack, Text } from "@chakra-ui/react";
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
			<Stack divider={<Divider />}>
				{successRateData?.map((item) => (
					<Flex justify="space-between" fontSize="sm" key={item.key}>
						<Text whiteSpace="nowrap">{item.label}</Text>
						<Text fontWeight="semibold" color="primary.DEFAULT">
							{item.value}
						</Text>
					</Flex>
				))}
			</Stack>
		</Flex>
	);
};

export default SuccessRate;
