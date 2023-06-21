import { Flex } from "@chakra-ui/react";
import { DateView } from "components";

/**
 * A <BusinessDashboardFilters> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboardFilters></BusinessDashboardFilters>`
 */
const BusinessDashboardFilters = ({
	prevDate,
	currDate,
	dateRange,
	setDateRange,
}) => {
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
		<Flex
			w="100%"
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
								handleDateRangeClick(/* item.id, */ item.value)
							}
							cursor="pointer"
						>
							{item.label}
						</Flex>
					);
				})}
			</Flex>
		</Flex>
	);
};

export default BusinessDashboardFilters;
