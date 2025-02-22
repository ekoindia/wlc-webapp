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

export const isToday = (date) => {
	const today = new Date();
	const givenDate = new Date(date);
	return (
		today.getFullYear() === givenDate.getFullYear() &&
		today.getMonth() === givenDate.getMonth() &&
		today.getDate() === givenDate.getDate()
	);
};

const DashboardDateFilter = ({
	dateFilterList = _dateFilterList,
	prevDate,
	currDate,
	dateRange,
	setDateRange,
}) => {
	const _prevDate = prevDate;
	const _currDate = currDate;
	const isSameDay = _prevDate.slice(0, 10) === _currDate.slice(0, 10);

	// Check if current date is equal to today
	const isCurrentDateToday = isToday(_currDate);

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
						Showing stats for{" "}
						<DateView
							date={_currDate}
							format="dd MMM yyyy"
							fontWeight="medium"
						/>
						{isCurrentDateToday ? (
							<>
								{" "}
								till{" "}
								<DateView
									date={_currDate}
									format="hh:mm a"
									fontWeight="medium"
								/>
							</>
						) : null}
					</>
				) : (
					<>
						Showing stats from{" "}
						<DateView
							date={_prevDate}
							format="dd MMM yyyy"
							fontWeight="medium"
						/>{" "}
						to{" "}
						<DateView
							date={_currDate}
							format="dd MMM yyyy"
							fontWeight="medium"
						/>
						{isCurrentDateToday ? (
							<>
								{" "}
								till{" "}
								<DateView
									date={_currDate}
									format="hh:mm a"
									fontWeight="medium"
								/>
							</>
						) : null}
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
 * - `currDate` is either the exact current time (for "today") or the end of the day (other filters).
 * @param {string} filter - The date range filter. Options: "today", "yesterday", "last7", "last30".
 * @returns {{ prevDate: string, currDate: string }} An object containing `prevDate` (start of the day) and `currDate` (current time or end of day).
 */
export const getDateRange = (filter) => {
	const currentDate = new Date();

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

	// Date range map
	const daysMap = {
		yesterday: 1,
		last7: 7,
		last30: 30,
	};

	let previousDate, currentEndDate;

	if (filter in daysMap) {
		// For "yesterday", "last7", and "last30", end date is yesterday
		currentEndDate = setToEndOfDay(calculateDateBefore(currentDate, 1));

		// Calculate the starting date (e.g., 7 days ago for "last7")
		previousDate = setToStartOfDay(
			calculateDateBefore(currentDate, daysMap[filter])
		);
	} else {
		// Default to "today": start of today and current time
		previousDate = setToStartOfDay(new Date());
		currentEndDate = currentDate; // Keep the exact current time
	}

	return {
		prevDate: formatDateTime(previousDate, "yyyy-MM-dd HH:mm:ss"),
		currDate: formatDateTime(currentEndDate, "yyyy-MM-dd HH:mm:ss"),
	};
};
