import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { Icon } from "components";

/**
 * OnboardingDashboardFilters component renders a filter section for onboarding statuses.
 * It allows users to filter the onboarding agents based on their statuses.
 * @param {object} props - Properties passed to the component
 * @param {boolean} props.filterLoading - Indicates if the filter data is still loading
 * @param {Array} props.filterList - List of filter items to display
 * @param {Array} props.funnelKeyList - List of keys representing all possible statuses
 * @param {Array} props.filterStatus - Currently selected filter statuses
 * @param {Function} props.setFilterStatus - Function to update the selected filter statuses
 * @example
 * <OnboardingDashboardFilters
 *   filterLoading={false}
 *   filterList={[{ id: 1, label: 'Active', status_ids: 'active', value: 10 }]}
 *   funnelKeyList={['active', 'inactive']}
 *   filterStatus={['active']}
 *   setFilterStatus={(status) => console.log(status)}
 * />
 */
const OnboardingDashboardFilters = ({
	filterLoading,
	filterList,
	funnelKeyList,
	filterStatus,
	setFilterStatus,
}) => {
	const handleFilterStatusClick = (id, key) => {
		// If "All Onboarding Agent" is clicked
		if (id === 0) {
			const isAllSelected = funnelKeyList
				.flat()
				.every((item) => filterStatus.includes(item));

			// Select all if not already fully selected
			setFilterStatus(
				isAllSelected ? filterStatus : funnelKeyList.flat()
			);
			return; // Prevent direct deselection of "All"
		}

		// Toggle selected status
		const updatedStatus = filterStatus.includes(key)
			? filterStatus.filter((item) => item !== key) // Deselect
			: [...filterStatus, key]; // Select

		// Prevent deselecting all filters (must have at least one active)
		if (updatedStatus.length === 0) return;

		setFilterStatus(updatedStatus);
	};

	return (
		<Flex
			w="100%"
			direction="column"
			bg={{ base: "none", md: "white" }}
			borderRadius="10px"
			p={{ base: "0px", md: "20px" }}
			gap="2"
		>
			<Flex gap="2">
				<Icon name="filter" size="sm" />
				<Text fontSize="sm" fontWeight="semibold">
					Filter By Onboarding Status
				</Text>
			</Flex>
			<Flex
				className="skeleton_filter_parent"
				justify={{ base: "space-between", xl: "flex-start" }}
				overflowX="auto"
				css={{
					"&::-webkit-scrollbar": {
						width: "0px",
						height: "0px",
					},
					"&::-webkit-scrollbar-thumb": {
						borderRadius: "0px",
					},
				}}
			>
				{filterList?.map((item, index) => {
					const isAllSelected = funnelKeyList
						.flat()
						.every((item) => filterStatus.includes(item));
					const isActive =
						item.id === 0
							? isAllSelected
							: filterStatus.includes(item.status_ids);
					return (
						<Flex
							key={item.id}
							direction="column"
							justify="space-between"
							bg="white"
							p="10px 15px"
							border={isActive ? "2px" : "basic"}
							borderColor={isActive ? "primary.light" : "none"}
							boxShadow={
								isActive ? "0px 3px 10px #1F5AA733" : null
							}
							borderRadius="12px"
							minW={{ base: "135px", sm: "160px" }}
							maxW="160px"
							ml={index === 0 ? "0px" : "20px"}
							_hover={{ boxShadow: "basic" }}
							onClick={() => {
								handleFilterStatusClick(
									item.id,
									item.status_ids
								);
							}}
							cursor="pointer"
							gap="2"
							position="relative" // Enable relative positioning for the container
						>
							{/* Radio Indicator */}
							<Flex
								className="radio_indicator"
								position="absolute" // Place in the top-right corner
								top="4px"
								right="4px"
								w="20px"
								h="20px"
								border="2px solid var(--chakra-colors-primary-light)"
								borderRadius="12px"
								align="center"
								justify="center"
							>
								{isActive && (
									<Flex
										w="10px"
										h="10px"
										bg="primary.light"
										borderRadius="6px"
									></Flex>
								)}
							</Flex>

							<Text fontSize="sm" w="90%">
								{item.label}
							</Text>
							<Skeleton
								isLoaded={!filterLoading}
								w="40%"
								minH="1em"
							>
								<Text
									fontWeight="semibold"
									color="primary.DEFAULT"
									fontSize="lg"
								>
									<span>{item.value}</span>
								</Text>
							</Skeleton>
						</Flex>
					);
				})}
			</Flex>
		</Flex>
	);
};

export default OnboardingDashboardFilters;
