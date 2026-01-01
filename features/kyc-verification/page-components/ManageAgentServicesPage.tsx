/**
 * ManageAgentServicesPage - Admin page for managing agent verification services.
 * Allows admins to enable/disable KYC verification services for specific agents.
 */

import { Card, Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { Button, InfoTileGrid, Modal, Select } from "components";
import { useNetworkUsers } from "contexts/NetworkUsersContext";
import { useCallback, useMemo, useState } from "react";
import {
	CategoryTabs,
	ServiceSearch,
	VerificationProgress,
} from "../components";
import { ALL_CATEGORIES_VALUE } from "../constants";
import { useAgentServices } from "../hooks";

/** Type for batch operation actions */
type BatchOperation = "enable" | "disable";

/**
 * Admin page for managing agent verification services.
 * Shows agent selector, service grid with toggles.
 * @returns {JSX.Element} Rendered page component
 */
export const ManageAgentServicesPage = (): JSX.Element => {
	// Network users for agent selection
	const { networkUsersList, loading: loadingUsers } = useNetworkUsers();

	// Modal state for batch operation confirmation
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [pendingOperation, setPendingOperation] =
		useState<BatchOperation | null>(null);

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
		filteredEnabledCount,
		filteredDisabledCount,
		batchProgress,
		enableFilteredServices,
		disableFilteredServices,
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

	// Dynamic button labels based on category context
	const categoryLabel =
		selectedCategory === ALL_CATEGORIES_VALUE
			? ""
			: ` in ${selectedCategory}`;

	// Open confirmation modal for batch operation
	const openBatchConfirmation = useCallback(
		(operation: BatchOperation) => {
			setPendingOperation(operation);
			onOpen();
		},
		[onOpen]
	);

	// Execute confirmed batch operation
	const executeBatchOperation = useCallback(async () => {
		if (pendingOperation === "enable") {
			await enableFilteredServices();
		} else if (pendingOperation === "disable") {
			await disableFilteredServices();
		}
		setPendingOperation(null);
		onClose();
	}, [
		pendingOperation,
		enableFilteredServices,
		disableFilteredServices,
		onClose,
	]);

	// Cancel batch operation
	const cancelBatchOperation = useCallback(() => {
		if (!batchProgress.isRunning) {
			setPendingOperation(null);
			onClose();
		}
	}, [batchProgress.isRunning, onClose]);

	// Modal content based on progress state
	const getModalContent = (): {
		title: string;
		message: string;
		showProgress: boolean;
	} => {
		const count =
			pendingOperation === "enable"
				? filteredDisabledCount
				: filteredEnabledCount;
		const action = pendingOperation === "enable" ? "enable" : "disable";

		if (batchProgress.isRunning) {
			return {
				title: `${action === "enable" ? "Enabling" : "Disabling"} Services`,
				message: `${batchProgress.current} of ${batchProgress.total} ${action}d`,
				showProgress: true,
			};
		}

		return {
			title: `${action === "enable" ? "Enable" : "Disable"} Services`,
			message: `You are about to ${action} ${count} service${count !== 1 ? "s" : ""}${categoryLabel}. Do you want to proceed?`,
			showProgress: false,
		};
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
						// direction={{ base: "column", sm: "row" }}
						align="center"
						gap="2"
						justify="space-between"
						wrap="wrap"
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

					{/* Search and Batch Actions - Responsive Layout */}
					{/* Large screens: search + buttons inline */}
					{/* Medium screens: stats on own row, search + buttons together */}
					{/* Small screens: full-width search, buttons on separate row */}
					<Flex
						direction={{ base: "column", sm: "row" }}
						justify="space-between"
						align={{ base: "stretch", sm: "center" }}
						gap="4"
					>
						{/* Search */}
						<ServiceSearch
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search services..."
						/>

						{/* Batch Action Buttons */}
						<Flex gap="2" direction={{ base: "column", sm: "row" }}>
							<Button
								variant="primary_outline"
								size="sm"
								onClick={() => openBatchConfirmation("enable")}
								isDisabled={
									filteredDisabledCount === 0 ||
									batchProgress.isRunning
								}
								// minW={{ sm: "120px" }}
							>
								Enable ({filteredDisabledCount})
							</Button>
							<Button
								variant="primary_outline"
								size="sm"
								onClick={() => openBatchConfirmation("disable")}
								isDisabled={
									filteredEnabledCount === 0 ||
									batchProgress.isRunning
								}
								// minW={{ sm: "120px" }}
							>
								Disable ({filteredEnabledCount})
							</Button>
						</Flex>
					</Flex>

					{/* Tip Text */}
					<Text fontSize="xs" color="gray.400">
						💡 Tip: Use the toggle switch or double-click/double-tap
						to enable or disable services
					</Text>

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

					{/* Batch Operation Confirmation Modal */}
					<Modal
						title={getModalContent().title}
						isOpen={isOpen}
						onClose={cancelBatchOperation}
						size="md"
						closeOnOverlayClick={!batchProgress.isRunning}
						closeOnEsc={!batchProgress.isRunning}
					>
						<Flex direction="column" gap="4">
							{!batchProgress.isRunning ? (
								<>
									<Text>{getModalContent().message}</Text>
									<Flex gap="3" justify="flex-end" mt="2">
										<Button
											variant="ghost"
											onClick={cancelBatchOperation}
										>
											Cancel
										</Button>
										<Button
											variant="primary"
											onClick={executeBatchOperation}
										>
											{pendingOperation === "enable"
												? "Enable"
												: "Disable"}
										</Button>
									</Flex>
								</>
							) : (
								<VerificationProgress
									current={batchProgress.current}
									total={batchProgress.total}
									successCount={batchProgress.current}
									failedCount={0}
									label=""
									progressLabel={`${batchProgress.current} of ${batchProgress.total} ${pendingOperation === "enable" ? "enabled" : "disabled"}`}
								/>
							)}
						</Flex>
					</Modal>
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
