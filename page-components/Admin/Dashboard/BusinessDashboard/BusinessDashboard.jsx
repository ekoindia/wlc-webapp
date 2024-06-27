import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";
import { EarningOverview, SuccessRate, TopMerchants, TopPanel } from ".";
import { DashboardDateFilter } from "..";

/**
 * A <BusinessDashboard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboard></BusinessDashboard>`
 */
const BusinessDashboard = () => {
	const [data, setData] = useState();
	// const [isLoading, setIsLoading] = useState(true);
	const { accessToken } = useSession();

	const [dateRange, setDateRange] = useState(7);
	const [prevDate, setPrevDate] = useState("");
	const [currDate, setCurrDate] = useState("");

	useEffect(() => {
		let currentDate = new Date();
		let previousDate = new Date(
			currentDate.getTime() - dateRange * 24 * 60 * 60 * 1000
		);
		setCurrDate(currentDate.toISOString());
		setPrevDate(previousDate.toISOString());
	}, [dateRange]);

	useEffect(() => {
		console.log("[BusinessDashboard] fetch init...");

		const controller = new AbortController();

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/businessdashboard",
				"tf-req-method": "GET",
			},
			body: {
				dateFrom: prevDate.slice(0, 10),
				dateTo: currDate.slice(0, 10),
				dateRange: dateRange,
			},
			controller: controller,
			token: accessToken,
		})
			.then((data) => {
				console.log("[BusinessDashboard] - fetch result...", data);
				const _data = data?.data?.dashboard_details[0] || [];
				setData(_data);
				// setIsLoading(false);
			})
			.catch((err) => {
				console.error(`[BusinessDashboard] error: `, err);
			});

		return () => {
			console.log("[BusinessDashboard] fetch aborted...", controller);
			// setIsLoading(true);
			controller.abort();
		};
	}, [currDate, prevDate]);

	const { topPanel, earningOverview, topMerchants, successRate } = data || {};

	return (
		<Flex direction="column">
			<Flex
				bg={{ base: "white", md: "initial" }}
				p={{ base: "10px 0px 30px 0px", md: "0px" }}
				borderRadius="0px 0px 20px 20px"
			>
				<TopPanel data={topPanel} />
			</Flex>
			<Flex p="20px 20px 0px">
				<DashboardDateFilter
					{...{ prevDate, currDate, dateRange, setDateRange }}
				/>
			</Flex>
			<Flex p="20px" gap="4" wrap="wrap">
				<Flex flex="2">
					<EarningOverview data={earningOverview} />
				</Flex>
				<Flex flex="1">
					<SuccessRate data={successRate} />
				</Flex>
			</Flex>
			{topMerchants?.length > 0 ? (
				<Flex p="0px 20px 20px">
					<TopMerchants data={topMerchants} />
				</Flex>
			) : null}
		</Flex>
	);
};

export default BusinessDashboard;
