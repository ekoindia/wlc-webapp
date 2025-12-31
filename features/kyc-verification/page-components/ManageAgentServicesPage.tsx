/**
 * ManageAgentServicesPage - Admin page for managing agent verification services.
 * Allows admins to enable/disable KYC verification services for specific agents.
 */

import { Card, Flex, Spinner, Text } from "@chakra-ui/react";
import { InfoTileGrid, Select } from "components";
import { useNetworkUsers } from "contexts/NetworkUsersContext";
import { useMemo } from "react";
import { CategoryTabs, ServiceSearch } from "../components";
import { ALL_CATEGORIES_VALUE } from "../constants";
import { useAgentServices } from "../hooks";

/**
 * Admin page for managing agent verification services.
 * Shows agent selector, service grid with toggles.
 * @returns {JSX.Element} Rendered page component
 */
export const ManageAgentServicesPage = (): JSX.Element => {
	// Network users for agent selection
	const { networkUsersList, loading: loadingUsers } = useNetworkUsers();

	// Agent services hook for all data and actions
	const {
		filteredServices,
		categories,
		selectedCategory,
		setSelectedCategory,
		searchQuery,
		setSearchQuery,
		loading,
		error,
		selectedAgentCode,
		selectAgent,
		toggleService,
		togglingServices,
		enabledCount,
		totalCount,
	} = useAgentServices();

	// Transform network users to select options
	const agentOptions = useMemo(() => {
		return networkUsersList.map((user) => ({
			label: `${user.name} (${user.user_code})`,
			value: user.user_code,
		}));
	}, [networkUsersList]);

	// Find selected agent for select component
	const selectedAgent = useMemo(() => {
		if (!selectedAgentCode) return null;
		return (
			agentOptions.find((opt) => opt.value === selectedAgentCode) || null
		);
	}, [agentOptions, selectedAgentCode]);

	// Transform services for InfoTileGrid
	const gridItems = useMemo(() => {
		return filteredServices.map((service) => ({
			label: service.name,
			desc: service.description || "",
			icon: service.icon,
			name: service.serviceCode,
			isEnabled: service.is_enabled,
			onToggle: () => toggleService(service.serviceCode),
			isToggling: togglingServices[service.serviceCode] || false,
			tags:
				selectedCategory === ALL_CATEGORIES_VALUE && service.category
					? [service.category]
					: undefined,
		}));
	}, [filteredServices, selectedCategory, toggleService, togglingServices]);

	// Handle agent selection
	const handleAgentChange = (option: { value: string } | null) => {
		if (option?.value) {
			selectAgent(option.value);
		}
	};

	// Stats text
	const statsText =
		totalCount > 0 ? `${enabledCount} of ${totalCount} enabled` : "";

	return (
		<Flex direction="column" gap="4" mx={{ base: "4", md: "0" }}>
			{/* Agent Selection and Stats */}
			<Flex
				direction={{ base: "column", md: "row" }}
				gap="4"
				align={{ md: "flex-end" }}
				justify="space-between"
			>
				<Flex flex="1" maxW={{ md: "400px" }}>
					<Select
						label="Select Agent"
						placeholder="Choose an agent..."
						options={agentOptions}
						value={selectedAgent}
						onChange={handleAgentChange}
						disabled={loadingUsers}
						size="md"
						required
					/>
				</Flex>
			</Flex>

			{/* Show content only when agent is selected */}
			{selectedAgentCode ? (
				<>
					<Flex
						direction={{ base: "column", md: "row" }}
						align="center"
						gap="2"
						justify="space-between"
					>
						{/* Category Tabs */}
						<CategoryTabs
							categories={categories}
							selectedCategory={selectedCategory}
							onCategoryChange={setSelectedCategory}
						/>

						<Text
							fontSize="xs"
							fontWeight="medium"
							color="gray.500"
						>
							{statsText}
						</Text>
					</Flex>

					{/* Stats and Search Row */}
					<Flex
						direction={{ base: "column", md: "row" }}
						justify="space-between"
						align={{ base: "stretch", md: "center" }}
						gap="4"
					>
						{/* Stats with Tip */}
						<Text fontSize="xs" color="gray.400">
							💡 Tip: Use the toggle switch or
							double-click/double-tap to enable or disable
							services
						</Text>

						{/* Search */}
						<ServiceSearch
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search services..."
						/>
					</Flex>

					{/* Loading State */}
					{loading && (
						<Flex justify="center" align="center" minH="200px">
							<Spinner size="lg" color="primary.DEFAULT" />
						</Flex>
					)}

					{/* Error State */}
					{error && !loading && (
						<Card p="6" bg="red.50">
							<Text color="red.600">{error}</Text>
						</Card>
					)}

					{/* Service Grid */}
					{!loading && !error && (
						<InfoTileGrid
							list={gridItems}
							iconStyle="square"
							toggleMode
							enableDoubleClickToggle
							showTags={selectedCategory === ALL_CATEGORIES_VALUE}
						/>
					)}

					{/* Empty State */}
					{!loading && !error && filteredServices.length === 0 && (
						<Card p="8" textAlign="center">
							<Text color="gray.500">
								No services found matching your criteria.
							</Text>
						</Card>
					)}
				</>
			) : (
				/* Placeholder when no agent selected */
				<Card p="12" textAlign="center" bg="gray.50">
					<Text color="gray.600" fontSize="lg">
						Select an agent to manage their verification services
					</Text>
				</Card>
			)}
		</Flex>
	);
};

export default ManageAgentServicesPage;
