import { Flex } from "@chakra-ui/react";
import { DateView } from "components";

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

/**
 * DashboardDateFilter component
 * @param root0
 * @param root0.prevDate
 * @param root0.currDate
 * @param root0.dateRange
 * @param root0.setDateRange
 * @returns
 */
const DashboardDateFilter = ({
	prevDate,
	currDate,
	dateRange,
	setDateRange,
}) => {
	const handleDateRangeClick = (/* id, */ value) => {
		setDateRange(value);
	};

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

export default DashboardDateFilter;
