import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useState } from "react";

/**
 * To modify filter list, will add id to each list item & Onboarding Funnel item
 * @param {Object} data contains onboardingFunnelTotal and filterList
 * @returns {Object} containing funnelKeyList, filterList, & filterListLength
 */
const getModifiedFilterList = (data) => {
	let filterList = [
		{
			id: 0,
			label: "Onboarding Funnel",
			value: data?.onboardingFunnelTotal,
		},
	];

	let funnelKeyList = [];

	const _filterList = data?.filterList;

	_filterList?.forEach((ele, index) => {
		let _filter = { id: index + 1, ...ele };
		filterList.push(_filter);
		funnelKeyList.push(ele?.status_ids);
	});

	filterList[0]["status_ids"] = [...funnelKeyList];

	const filterListLength = filterList?.length;

	return { funnelKeyList, filterList, filterListLength };
};

/**
 * A Onboarding Dashboard Filter page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboardFilters></OnboardingDashboardFilters>`
 */
const OnboardingDashboardFilters = ({
	filterLoading,
	filterData,
	filterStatus,
	setFilterStatus,
}) => {
	const [inFunnel, setInFunnel] = useState(false);

	const { funnelKeyList, filterList, filterListLength } =
		getModifiedFilterList(filterData);

	const handleFilterStatusClick = (id, key) => {
		if (id === 0) {
			if (!inFunnel) {
				setFilterStatus((prev) => {
					const _filterStatus = new Set([...prev, ...key]);
					return [..._filterStatus];
				});
				setInFunnel(true);
			} else {
				setFilterStatus((prev) =>
					prev.filter((item) => !funnelKeyList.includes(item))
				);
				setInFunnel(false);
			}
		} else {
			const filterStatusUpdated = filterStatus.includes(key)
				? filterStatus.filter((item) => item !== key)
				: [...filterStatus, key];

			const isAllItemsIncluded = funnelKeyList.every((item) =>
				filterStatusUpdated.includes(item)
			);
			setInFunnel(isAllItemsIncluded);
			setFilterStatus(filterStatusUpdated);
		}
	};

	return (
		<Flex
			w="100%"
			direction="column"
			bg={{ base: "none", md: "white" }}
			borderRadius="10px"
		>
			<Flex gap="2" p="20px">
				<Icon name="filter" size="23px" />
				<Text fontSize="md" fontWeight="semibold">
					Filter using onboarding status
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
						background: "#cbd5e0",
						borderRadius: "0px",
					},
				}}
				pb="20px"
			>
				{filterList?.map((item, index) => {
					const isActive =
						item.id === 0 && inFunnel
							? true
							: filterStatus?.includes(item.status_ids);
					return (
						<Flex
							key={item.id}
							direction="column"
							justify="space-between"
							bg="white"
							p="10px 15px"
							border={isActive ? "1px" : "basic"}
							borderColor={isActive && "primary.light"}
							boxShadow={
								isActive ? "0px 3px 10px #1F5AA733" : null
							}
							borderRadius="10px"
							minW={{ base: "135px", sm: "160px" }}
							maxW="160px"
							ml="20px"
							mr={index === filterListLength - 1 ? "20px" : null}
							_hover={{ boxShadow: "basic" }}
							onClick={() => {
								handleFilterStatusClick(
									item.id,
									item.status_ids
								);
							}}
							cursor="pointer"
							gap="2"
						>
							<Text fontSize="sm">{item.label}</Text>
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
