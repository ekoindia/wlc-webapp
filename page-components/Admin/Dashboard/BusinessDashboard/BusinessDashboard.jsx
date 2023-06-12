import { Flex } from "@chakra-ui/react";
import { DateView } from "components/DateView";
import { EarningOverview, SuccessRate, TopMerchants, TopPanel } from ".";

/**
 * A <BusinessDashboard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboard></BusinessDashboard>`
 */
const BusinessDashboard = ({
	data,
	currDate,
	// setCurrDate,
	prevDate,
	// setPrevDate,
	dateRange,
	setDateRange,
}) => {
	console.log("[BusinessDashboard] data", data);

	const { topPanel, earningOverview, topMerchants, successRate } = data || {};

	const handleDateRangeClick = (/* id, */ value) => {
		setDateRange(value);
	};

	const calendarDataList = [
		{
			id: 0,
			value: 7,
			label: "Last 7 Days",
		},
		{
			id: 1,
			value: 30,
			label: "Last 30 Days",
		},
	];

	return (
		<Flex direction="column">
			<Flex
				bg={{ base: "white", md: "initial" }}
				p={{ base: "10px 0px 30px 0px", md: "0px" }}
				borderRadius="0px 0px 20px 20px"
			>
				<TopPanel data={topPanel} />
			</Flex>
			<Flex
				p="20px 20px 0px"
				align="center"
				justify="space-between"
				direction={{ base: "column-reverse", md: "row" }}
				fontSize="sm"
				gap={{ base: "2", md: "0" }}
			>
				<span>
					Showing stats from{" "}
					<DateView
						date={prevDate}
						format="dd MMM, yyyy"
						fontWeight="medium"
					/>{" "}
					to{" "}
					<DateView
						date={currDate}
						format="dd MMM, yyyy"
						fontWeight="medium"
					/>
				</span>
				<Flex align="center" gap="4">
					{calendarDataList?.map((item) => {
						const isActive = dateRange === item.value;
						return (
							<Flex
								key={item.id}
								bg={isActive ? "white" : "initial"}
								p="6px 8px"
								borderRadius={isActive ? "10px" : "0px"}
								border={isActive ? "card" : "none"}
								onClick={() =>
									handleDateRangeClick(
										/* item.id, */ item.value
									)
								}
								cursor="pointer"
							>
								{item.label}
							</Flex>
						);
					})}
				</Flex>
			</Flex>
			<Flex p="20px" gap="4" wrap="wrap">
				<Flex flex="2">
					<EarningOverview data={earningOverview} />
				</Flex>
				<Flex flex="1">
					<SuccessRate data={successRate} />
				</Flex>
			</Flex>
			<Flex p="0px 20px 20px">
				<TopMerchants data={topMerchants} />
			</Flex>
		</Flex>
	);
};

export default BusinessDashboard;
