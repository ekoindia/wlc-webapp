import { Flex } from "@chakra-ui/react";
import { DateView } from "components";
import { formatDateTime } from "libs/dateFormat";
import { calculateDateBefore } from "utils";

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
	const _prevDate = prevDate.slice(0, 10);
	const _currDate = currDate.slice(0, 10);
	const isSameDay = _prevDate === _currDate;

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
				{isSameDay ? (
					<>
						Showing stats for {""}
						<DateView
							date={_prevDate}
							format="dd MMM, yyyy"
							fontWeight="medium"
						/>
					</>
				) : (
					<>
						Showing stats from{" "}
						<DateView
							date={_prevDate}
							format="dd MMM, yyyy"
							fontWeight="medium"
						/>{" "}
						to{" "}
						<DateView
							date={_currDate}
							format="dd MMM, yyyy"
							fontWeight="medium"
						/>
					</>
				)}
			</span>

			<Flex align="center" gap="4">
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
	let currentDate = new Date();
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

	/**
	 * Sets the given date to the end of the day (23:59:59.999).
	 * @param {Date} date - The date object to modify.
	 * @returns {Date} The updated date object.
	 */
	const setToEndOfDay = (date) => {
		date.setHours(23, 59, 59, 999);
		return date;
	};

	const daysMap = {
		yesterday: 1,
		last7: 7,
		last30: 30,
	};

	if (filter in daysMap) {
		previousDate = setToStartOfDay(
			calculateDateBefore(currentDate, daysMap[filter])
		);

		// If it's "yesterday", set the end time to that day's end, else it's today
		currentDate =
			filter === "yesterday"
				? setToEndOfDay(calculateDateBefore(currentDate, 1))
				: setToEndOfDay(currentDate);
	} else {
		// Default to "today"
		previousDate = setToStartOfDay(previousDate);
		currentDate = setToEndOfDay(currentDate);
	}

	return {
		prevDate: formatDateTime(previousDate, "yyyy-MM-dd HH:mm:ss"),
		currDate: formatDateTime(currentDate, "yyyy-MM-dd HH:mm:ss"),
	};
};
