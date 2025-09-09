import { Flex, Text } from "@chakra-ui/react";
import { DateView, SegmentedControl } from "components";
import { formatDateTime } from "libs/dateFormat";
import { calculateDateBefore } from "utils";

/**
 * Default date filter options
 */
const defaultDateFilterList = [
	{ id: 0, value: "today", label: "Today" },
	{ id: 1, value: "yesterday", label: "Yesterday" },
	{ id: 2, value: "last7", label: "Last 7 Days" },
	{ id: 3, value: "last30", label: "Last 30 Days" },
];

/**
 * Checks if the given date is today.
 * @param {*} date - The date to check.
 * @returns {boolean} - True if the date is today, false otherwise.
 */
export const isToday = (date) => {
	const today = new Date();
	const givenDate = new Date(date);
	return (
		today.getFullYear() === givenDate.getFullYear() &&
		today.getMonth() === givenDate.getMonth() &&
		today.getDate() === givenDate.getDate()
	);
};

/**
 * Dashboard date filter component.
 * @param {object} props - Component props
 * @param {Array} props.dateFilterList - List of date filter options
 * @param {string} props.prevDate - Previous date in ISO format
 * @param {string} props.currDate - Current date in ISO format
 * @param {string} props.dateRange - Selected date range
 * @param {Function} props.setDateRange - Function to update the date range
 * @returns {JSX.Element}
 */
const DashboardDateFilter = ({
	dateFilterList = defaultDateFilterList,
	prevDate,
	currDate,
	dateRange,
	setDateRange,
}) => {
	const _prevDate = prevDate;
	const _currDate = currDate;
	const isSameDay = _prevDate?.slice(0, 10) === _currDate?.slice(0, 10);

	// Check if current date is equal to today
	const isCurrentDateToday = isToday(_currDate);

	// MARK: jsx
	return (
		<Flex
			w="100%"
			align="center"
			justify="space-between"
			direction={{ base: "column-reverse", md: "row" }}
			fontSize="sm"
			gap={{ base: "2", md: "0" }}
		>
			<Text fontSize="0.85em" opacity={0.8}>
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
			</Text>

			<SegmentedControl
				segments={dateFilterList}
				value={dateRange}
				onChange={(value) => setDateRange(value)}
				equalWidth={false}
				minSegmentWidth={"50px"}
				size="sm"
				showDividers
				// color="accent.dark"
			/>
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
