/**
 * KycVerificationPage - Main listing page for KYC verification services.
 * Shows a grid of services with category filtering, search, and multi-select support.
 */

import { Card, Flex, Spinner, Text } from "@chakra-ui/react";
import { Button, InfoTileGrid, PaddingBox, PageTitle } from "components";
import type { WorkflowItem } from "components/WorkflowBuilder/types";
import { UserType } from "constants/index";
import { useSession } from "contexts";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { toKebabCase } from "utils";
import {
	BulkUploadButton,
	CategoryTabs,
	MultiServiceToggle,
	SelectedServicesPill,
	ServiceSearch,
} from "../components";
import { ALL_CATEGORIES_VALUE } from "../constants";
import { useKycServices, useServiceSelection } from "../hooks";
import type { VerificationService } from "../types";
import { ManageAgentServicesPage } from "./ManageAgentServicesPage";

/** Lazy-load workflow builder to keep bundle lean */
const WorkflowBuilder = dynamic(
	() => import("components/WorkflowBuilder/WorkflowBuilder"),
	{ ssr: false }
);

interface KycVerificationPageProps {
	/** Base path for navigation (defaults to /products/kyc-verification) */
	basePath?: string;
}

/**
 * Main KYC Verification page component.
 * Displays a grid of verification services with category filtering, search, and multi-select support.
 * @param {KycVerificationPageProps} [props] - Component props
 * @param {string} [props.basePath] - Base path for navigation (defaults to /products/kyc-verification)
 * @returns {JSX.Element} Rendered page with service grid and controls
 */
export const KycVerificationPage = ({
	basePath = "/products/kyc-verification",
}: KycVerificationPageProps = {}): JSX.Element => {
	const router = useRouter();
	const { isAdmin, userType } = useSession();

	// Services data and filtering
	const {
		filteredServices,
		categories,
		selectedCategory,
		setSelectedCategory,
		searchQuery,
		setSearchQuery,
		loading,
		error,
		getServicesByCodes,
	} = useKycServices();

	// Add user modal state
	// const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

	// Manage services mode state
	const [isManageMode, setIsManageMode] = useState(false);

	// Builder mode state
	const [isBuilderMode, setIsBuilderMode] = useState(false);

	// Selection state
	const {
		isMultiModeEnabled,
		selectedServices,
		selectedCount,
		toggleMultiMode,
		toggleService,
		removeService,
		isSelected,
		selectAll,
		clearSelection,
	} = useServiceSelection();

	// Get full service objects for selected services
	const selectedServiceObjects = useMemo(
		() => getServicesByCodes(selectedServices),
		[getServicesByCodes, selectedServices]
	);

	// Transform services for InfoTileGrid
	const gridItems = useMemo(() => {
		return filteredServices.map((service) => ({
			label: service.name,
			desc: service.description || "",
			icon: service.icon,
			name: service.serviceCode,
			url: isMultiModeEnabled
				? undefined
				: `${basePath}/${toKebabCase(service.name)}`,
			onClick: isMultiModeEnabled ? undefined : undefined,
			selected: isSelected(service.serviceCode),
			onSelect: () => toggleService(service.serviceCode),
			// Show category tag when viewing "All" or show different category than selected
			tags:
				selectedCategory === ALL_CATEGORIES_VALUE && service.category
					? [service.category]
					: undefined,
		}));
	}, [
		filteredServices,
		isMultiModeEnabled,
		isSelected,
		toggleService,
		selectedCategory,
		basePath,
	]);

	// Map services to generic WorkflowItems for the builder
	const workflowItems: WorkflowItem[] = useMemo(
		() =>
			filteredServices.map((s) => ({
				id: s.serviceCode,
				label: s.name,
				category: s.category,
				description: s.description,
				icon: s.icon,
				meta: {
					endpointPath: s.endpointPath,
					requestParamsCount: s.requestParams?.length ?? 0,
				},
			})),
		[filteredServices]
	);

	// Handle continue button click
	const handleContinue = () => {
		// Navigate to catch-all route with selected service slugs (kebab-cased names)
		const selectedSlugs = selectedServiceObjects.map((s) =>
			toKebabCase(s.name)
		);
		const routePath = `${basePath}/${selectedSlugs.join("/")}`;
		router.push(routePath);
	};

	// Render loading state
	if (loading) {
		return (
			<PaddingBox>
				<PageTitle title="KYC & Verification" isBeta hideBackIcon />
				<Flex justify="center" align="center" minH="200px">
					<Spinner size="lg" color="primary.DEFAULT" />
				</Flex>
			</PaddingBox>
		);
	}

	// Render error state
	if (error) {
		return (
			<PaddingBox>
				<PageTitle title="KYC & Verification" isBeta hideBackIcon />
				<Card p="6">
					<Text color="error">{error}</Text>
				</Card>
			</PaddingBox>
		);
	}

	return (
		<>
			<PageTitle
				title="KYC & Verification"
				subtitle={
					!isManageMode
						? "Verify KYC documents for customers"
						: "Enable or disable KYC verification services for agents in your network"
				}
				isBeta
				hideBackIcon
				toolComponent={
					<Flex gap="2">
						<BulkUploadButton
							onClick={() =>
								isAdmin
									? router.push(
											"/admin/products/bulk-verification"
										)
									: router.push("/products/bulk-verification")
							}
						/>

						{/* Builder mode button */}
						{(isAdmin || userType === UserType.DISTRIBUTOR) && (
							<Button
								onClick={() =>
									setIsBuilderMode((prev) => !prev)
								}
								size="sm"
								icon="more-horiz"
								iconStyle={{ size: "xs" }}
								variant={
									isBuilderMode
										? "primary"
										: "primary_outline"
								}
							>
								Builder
							</Button>
						)}

						{(isAdmin || userType === UserType.DISTRIBUTOR) && (
							<Button
								onClick={() => setIsManageMode(!isManageMode)}
								size="sm"
								icon="settings"
								iconStyle={{ size: "xs" }}
								variant={
									isManageMode ? "primary" : "primary_outline"
								}
							>
								Manage
							</Button>
						)}
					</Flex>
				}
			/>

			{/* Conditional content based on manage mode */}
			{isManageMode ? (
				<ManageAgentServicesPage />
			) : isBuilderMode ? (
				<Flex direction="column" gap="4" mx={{ base: "4", md: "0" }}>
					<WorkflowBuilder
						items={workflowItems}
						storageKey="kyc-workflow-builder"
						onSave={(workflow) =>
							console.log(
								"[KycVerificationPage] Workflow saved:",
								workflow
							)
						}
					/>
				</Flex>
			) : (
				<Flex direction="column" gap="4" mx={{ base: "4", md: "0" }}>
					{/* Category Tabs */}
					<CategoryTabs
						categories={categories}
						selectedCategory={selectedCategory}
						onCategoryChange={setSelectedCategory}
					/>

					<Flex
						direction={{ base: "column", md: "row" }}
						justify="space-between"
						align={{ base: "stretch", md: "center" }}
						gap="4"
					>
						<MultiServiceToggle
							isEnabled={isMultiModeEnabled}
							onToggle={toggleMultiMode}
						/>

						<Flex
							align="center"
							gap="4"
							flexWrap="wrap"
							justify={{
								base: "space-between",
								md: "flex-end",
							}}
						>
							<ServiceSearch
								value={searchQuery}
								onChange={setSearchQuery}
								placeholder="Search services..."
							/>

							{/* Continue button - visible when multi-mode */}
							{isMultiModeEnabled ? (
								<Button
									onClick={handleContinue}
									size="md"
									icon="arrow-forward"
									iconPosition="right"
									iconStyle={{ size: "xs" }}
									disabled={selectedCount === 0}
									minW="140px"
								>
									Continue ({selectedCount})
								</Button>
							) : null}
						</Flex>
					</Flex>

					{/* Selected services pills - show when multi-mode */}
					{isMultiModeEnabled ? (
						<Flex
							direction={{ base: "column", md: "row" }}
							justify="space-between"
							align={{ base: "flex-start", md: "center" }}
							gap="4"
							w="100%"
						>
							<SelectedServicesPill
								services={selectedServiceObjects}
								onRemove={removeService}
								removable
							/>

							<SelectAllButton
								filteredServices={filteredServices}
								selectedServices={selectedServices}
								onSelectAll={selectAll}
								onDeselectAll={clearSelection}
							/>
						</Flex>
					) : null}

					{/* Service Grid */}
					<InfoTileGrid
						list={gridItems}
						iconStyle="square"
						selectable={isMultiModeEnabled}
						showTags={selectedCategory === ALL_CATEGORIES_VALUE}
					/>

					{/* Empty state */}
					{filteredServices.length === 0 ? (
						<Card p="8" textAlign="center">
							<Text color="gray.500">
								No services found matching your criteria.
							</Text>
						</Card>
					) : null}
				</Flex>
			)}
		</>
	);
};

export default KycVerificationPage;

interface SelectAllButtonProps {
	/** Current filtered services list */
	filteredServices: VerificationService[];
	/** Currently selected service codes */
	selectedServices: string[];
	/** Callback to select all services */
	onSelectAll: (_codes: string[]) => void;
	/** Callback to deselect all services */
	onDeselectAll: () => void;
}

/**
 * Toggle button for bulk selection of services.
 * Displays "Select All (X)" showing remaining unselected count, or "Deselect All (X)" showing selected count.
 * X represents the count of unselected/selected services in the current filtered view.
 * @param {SelectAllButtonProps} props - Component props
 * @returns {JSX.Element} Rendered button component
 */
const SelectAllButton = ({
	filteredServices,
	selectedServices,
	onSelectAll,
	onDeselectAll,
}: SelectAllButtonProps): JSX.Element => {
	// Get the service codes from filtered services
	const filteredCodes = useMemo(
		() => filteredServices.map((s) => s.serviceCode),
		[filteredServices]
	);

	// Check if all filtered services are selected
	const allSelected = useMemo(() => {
		if (filteredCodes.length === 0) return false;
		return filteredCodes.every((code) => selectedServices.includes(code));
	}, [filteredCodes, selectedServices]);

	// Count of selected services in current filtered view
	const selectedInFilterCount = useMemo(
		() =>
			filteredCodes.filter((code) => selectedServices.includes(code))
				.length,
		[filteredCodes, selectedServices]
	);

	// Count of unselected services in current filtered view
	const unselectedCount = filteredCodes.length - selectedInFilterCount;

	// Handle button click
	const handleClick = (): void => {
		if (allSelected) {
			onDeselectAll();
		} else {
			onSelectAll(filteredCodes);
		}
	};

	// Don't render if no services to select
	if (filteredCodes.length === 0) return <></>;

	return (
		<Button
			variant="ghost"
			size="sm"
			color="primary.DEFAULT"
			onClick={handleClick}
			flexShrink={0}
		>
			{allSelected
				? `Deselect All (${selectedInFilterCount})`
				: `Select All (${unselectedCount})`}
		</Button>
	);
};
