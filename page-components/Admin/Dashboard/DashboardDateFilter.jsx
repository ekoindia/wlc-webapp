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

export const getDateRange = (filter) => {
	const currentDate = new Date();
	let previousDate = new Date();

	switch (filter) {
		case "yesterday":
			previousDate.setDate(currentDate.getDate() - 1);
			currentDate.setDate(currentDate.getDate() - 1);
			break;
		case "last7":
			previousDate.setDate(currentDate.getDate() - 7);
			break;
		case "last30":
			previousDate.setDate(currentDate.getDate() - 30);
			break;
		case "today":
		default:
			previousDate = currentDate;
	}

	return {
		prevDate: previousDate.toISOString().slice(0, 10),
		currDate: currentDate.toISOString().slice(0, 10),
	};
};
