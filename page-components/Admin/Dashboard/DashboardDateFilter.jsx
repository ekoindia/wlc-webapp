import { Flex } from "@chakra-ui/react";
import { DateView } from "components";

const _dateFilterList = [
	{ id: 0, value: "today", label: "Today" },
	{ id: 1, value: "yesterday", label: "Yesterday" },
	{ id: 2, value: "last7", label: "Last 7 Days" },
	{ id: 3, value: "last30", label: "Last 30 Days" },
];

const DashboardDateFilter = ({
	dateFilterList = _dateFilterList,
	prevDate,
	currDate,
	dateRange,
	setDateRange,
}) => {
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
				{prevDate === currDate ? (
					<>
						Showing stats for{" "}
						<DateView
							date={currDate}
							format="dd MMM, yyyy"
							fontWeight="medium"
						/>
					</>
				) : (
					<>
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
					</>
				)}
			</span>

			<Flex pt={{ base: "4", md: "0" }} align="center" gap="4">
				{dateFilterList?.map((item) => {
					const isActive = dateRange === item.value;
					return (
						<Flex
							key={item.id}
							bg={isActive ? "white" : "initial"}
							p="6px 8px"
							borderRadius="10px"
							border="card"
							cursor="pointer"
							onClick={() => setDateRange(item.value)}
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

/**
 * Returns the date range based on the selected filter.
 * - `prevDate` starts at 00:00:00 of the respective day.
 * - `currDate` is the exact current time when the function is executed.
 * @param {string} filter - The date range filter. Options: "today", "yesterday", "last7", "last30".
 * @returns {{ prevDate: string, currDate: string }} An object containing `prevDate` (start of the day) and `currDate` (current execution time).
 */
export const getDateRange = (filter) => {
	const currentDate = new Date();
	let previousDate = new Date();

	/**
	 * Sets the given date to the start of the day (00:00:00.000).
	 * @param {Date} date - The date object to modify.
	 * @returns {Date} The updated date object.
	 */
	const setToStartOfDay = (date) => {
		date.setHours(0, 0, 0, 0);
		return date;
	};

	switch (filter) {
		case "yesterday":
			previousDate.setDate(currentDate.getDate() - 1);
			previousDate = setToStartOfDay(previousDate);
			currentDate.setDate(currentDate.getDate() - 1);
			currentDate.setHours(23, 59, 59, 999); // End of yesterday
			break;
		case "last7":
			previousDate.setDate(currentDate.getDate() - 7);
			previousDate = setToStartOfDay(previousDate);
			break;
		case "last30":
			previousDate.setDate(currentDate.getDate() - 30);
			previousDate = setToStartOfDay(previousDate);
			break;
		case "today":
		default:
			previousDate = setToStartOfDay(previousDate);
	}

	return {
		prevDate: previousDate.toISOString().slice(0, 10), // Start of the day (00:00:00)
		currDate: currentDate.toISOString().slice(0, 10), // Exact function execution time
	};
};
