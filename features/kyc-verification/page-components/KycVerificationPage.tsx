/**
 * KycVerificationPage - Main listing page for KYC verification services.
 * Shows a grid of services with category filtering, search, and multi-select support.
 */

import { Card, Flex, Spinner, Text } from "@chakra-ui/react";
import { Button, InfoTileGrid, PaddingBox, PageTitle } from "components";
import { useRouter } from "next/router";
import { useMemo } from "react";
import {
	CategoryTabs,
	MultiServiceToggle,
	SelectedServicesPill,
	ServiceSearch,
} from "../components";
import { ALL_CATEGORIES_VALUE } from "../constants";
import { useKycServices, useServiceSelection } from "../hooks";

/**
 * Main KYC Verification page component.
 */
export const KycVerificationPage = (): JSX.Element => {
	const router = useRouter();

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

	// Selection state
	const {
		isMultiModeEnabled,
		selectedServices,
		selectedCount,
		toggleMultiMode,
		toggleService,
		removeService,
		isSelected,
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
				: `/products/kyc-verification/${service.serviceCode}`,
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
	]);

	// Debug logging
	console.log("[KycVerificationPage] Services:", filteredServices.length);
	console.log(
		"[KycVerificationPage] isMultiModeEnabled:",
		isMultiModeEnabled
	);
	console.log("[KycVerificationPage] gridItems sample:", gridItems[0]);

	// Handle continue button click
	const handleContinue = () => {
		// Navigate to catch-all route with selected service codes
		const routePath = `/products/kyc-verification/${selectedServices.join("/")}`;
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
				<Card p="6" bg="red.50">
					<Text color="red.600">{error}</Text>
				</Card>
			</PaddingBox>
		);
	}

	return (
		<>
			<PageTitle title="KYC & Verification" isBeta hideBackIcon />
			<Flex direction="column" gap="4" mx={{ base: "4", md: "0" }}>
				{/* Category Tabs */}
				<CategoryTabs
					categories={categories}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
				/>

				{/* Controls Row: Multi-service toggle, Search, Continue button */}
				<Flex
					direction={{ base: "column", md: "row" }}
					justify="space-between"
					align={{ base: "stretch", md: "center" }}
					gap="4"
					flexWrap="wrap"
				>
					<Flex align="center" gap="4" flexWrap="wrap">
						<MultiServiceToggle
							isEnabled={isMultiModeEnabled}
							onToggle={toggleMultiMode}
						/>
					</Flex>

					<Flex align="center" gap="4" flexWrap="wrap">
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
								iconStyle={{ size: "sm" }}
								disabled={selectedCount === 0}
							>
								Continue ({selectedCount})
							</Button>
						) : null}
					</Flex>
				</Flex>

				{/* Selected services pills - show when multi-mode */}
				{isMultiModeEnabled ? (
					<SelectedServicesPill
						services={selectedServiceObjects}
						onRemove={removeService}
						removable
					/>
				) : null}

				{/* Service Grid */}
				<InfoTileGrid
					list={gridItems}
					iconStyle="square"
					selectable={isMultiModeEnabled}
					showTags={selectedCategory === ALL_CATEGORIES_VALUE}
				/>

				{/* Empty state */}
				{filteredServices.length === 0 && (
					<Card p="8" textAlign="center">
						<Text color="gray.500">
							No services found matching your criteria.
						</Text>
					</Card>
				)}
			</Flex>
		</>
	);
};

export default KycVerificationPage;
