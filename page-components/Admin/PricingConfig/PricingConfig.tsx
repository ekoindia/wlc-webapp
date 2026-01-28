import { Flex, Skeleton, Text, Tooltip } from "@chakra-ui/react";
import { BreadcrumbWrapper, Icon, InfoTileGrid, PageTitle } from "components";
import { useRouter } from "next/router";
import { DownloadPricing } from "page-components/Admin/PricingCommission/DownloadPricing";
import { useEffect, useState } from "react";
import {
	findNodeInTree,
	getPageTitle,
	PricingForm,
	ProductNode,
	usePricingConfig,
} from ".";

// Base path for pricing configuration
const PricingConfigBasePath = "/admin/pricing-config";

// Label overrides for specific paths
const labelOverrides = {
	"agent-pricing": "Agent's Pricing",
	"distributor-commission": "Distributor's Commission",
	"pricing-config": "Pricing & Commission",
};

interface PricingConfigProps {
	pathArray?: string[] | null; // Array of path segments for navigation
}

interface ConfigCategory {
	category: string; // Name of the category
	description?: string; // Optional description of the category
	products: ProductNode[]; // List of products in the category
}

interface ConfigPageCardProps {
	configCategories: ConfigCategory[]; // Array of configuration categories
	isLoading: boolean; // Flag to indicate if the data is loading
}

// MARK: PricingConfig
/**
 * PricingConfig Component
 * Displays a hierarchical configuration interface for pricing and commissions.
 * @param {PricingConfigProps} props - Props for the component.
 * @returns {JSX.Element} - Rendered PricingConfig component.
 */
const PricingConfig = ({ pathArray }: PricingConfigProps): JSX.Element => {
	const [currentPricingTreeNode, setCurrentPricingTreeNode] = useState<
		ProductNode[] | null
	>(null);
	const [formData, setFormData] = useState<Record<string, any>>({});

	const { push } = useRouter();

	// Get pricing tree and form data map from context
	const {
		pricingTree,
		formDataMap,
		productCategoryList,
		isFetchingProductConfig,
	} = usePricingConfig();

	// Base path for navigation
	const basePath = pathArray?.length
		? `${PricingConfigBasePath}/${pathArray.join("/")}`
		: PricingConfigBasePath;

	// Initialize the pricing tree when it becomes available
	useEffect(() => {
		if (pricingTree?.length > 0) {
			setCurrentPricingTreeNode(pricingTree);
		}
	}, [pricingTree]);

	// Update the current pricing node based on the path array
	useEffect(() => {
		if (!pricingTree?.length) return;

		if (pathArray?.length) {
			const node = findNodeInTree(pricingTree, pathArray);

			// Check if the node is a form type
			// If the node is a form, retrieve the form data from the map and set it in the state
			if (node?.[0]?.type === "form") {
				const _formData = formDataMap[node[0].formlink];
				if (_formData) {
					setFormData(_formData);
					setCurrentPricingTreeNode(node);
				}
			} else {
				setCurrentPricingTreeNode(node);
			}
		} else {
			setCurrentPricingTreeNode(pricingTree);
		}
	}, [pathArray, pricingTree, formDataMap]);

	// Event handler for capturing clicks
	const handleCaptureClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const target = event.target as HTMLElement;
		const cardElement = target.closest<HTMLDivElement>("[data-card-name]");

		if (cardElement) {
			const name = cardElement.dataset.cardName;
			if (name) {
				// Navigate to the new path
				push(`${basePath}/${name}`);
			}
		}
	};

	const title = getPageTitle(pricingTree, pathArray);
	const hideBackIcon = !(pathArray?.length ?? 0 >= 1);
	const toolComponent = pathArray?.length > 0 ? null : <DownloadPricing />;

	// Render the appropriate UI based on the current pricing node
	const renderContent = (): JSX.Element | null => {
		if (pathArray == undefined) {
			return (
				<ConfigPageCard
					configCategories={productCategoryList}
					isLoading={isFetchingProductConfig}
				/>
			);
		}

		if (!currentPricingTreeNode?.length) {
			return <Text>Nothing found</Text>;
		}

		const [firstNode] = currentPricingTreeNode;

		if (firstNode.type === "form" && formData) {
			return (
				<PricingForm
					agentType={firstNode.meta?.agentType}
					pricingType={firstNode.meta?.pricingType}
					productDetails={formData}
				/>
			);
		}

		return (
			<InfoTileGrid
				list={currentPricingTreeNode?.map((product) => ({
					name: product.name,
					label: product.label,
					desc: product.desc,
					icon: product.icon,
				}))}
			/>
		);
	};
	return (
		<BreadcrumbWrapper
			useDynamic
			labelOverrides={labelOverrides}
			omitPaths={["/admin"]}
		>
			<PageTitle
				title={title}
				hideBackIcon={hideBackIcon}
				toolComponent={toolComponent}
			/>
			<Flex
				direction="column"
				px={{ base: "16px", md: "initial" }}
				gap={{ base: "2", md: "8" }}
				onClickCapture={handleCaptureClick}
			>
				{renderContent()}
			</Flex>
		</BreadcrumbWrapper>
	);
};

export default PricingConfig;

// MARK: ConfigPageCard
/**
 * ConfigPageCard Component
 * Displays a configuration page with a list of configuration options.
 * For example, a list of products to set pricing/commissions for.
 * @param {ConfigPageCardProps} props - Props for the component.
 * @param {ConfigCategory[]} props.configCategories - Array of configuration categories.
 * @param {boolean} props.isLoading - Flag to indicate if the data is loading.
 * @returns {JSX.Element} - Rendered ConfigPageCard component.
 */
const ConfigPageCard: React.FC<ConfigPageCardProps> = ({
	configCategories,
	isLoading,
}) => {
	// Render a loading skeleton if data is still being fetched
	if (isLoading) {
		return <SkeletonLoader count={2} />;
	}

	// Render the configuration categories
	return (
		<>
			{configCategories?.map(({ category, description, products }) => {
				if (!products?.length) return null;

				return (
					<Flex
						key={category}
						direction="column"
						gap={{ base: "0.25", md: "2" }}
						py="2"
					>
						{/* Category heading with description-tooltip */}
						{category && (
							<Flex align="center" gap="2">
								<Text
									fontSize={{ base: "md", md: "lg" }}
									fontWeight="semibold"
								>
									{category}
								</Text>
								{description && (
									<Tooltip
										hasArrow
										placement="right"
										label={description}
										aria-label={description}
										fontSize="xs"
										bg="primary.DEFAULT"
										color="white"
										borderRadius="8"
									>
										<span>
											<Icon
												name="info-outline"
												size="xs"
												cursor="pointer"
												color="light"
												display={{
													base: "none",
													md: "block",
												}}
											/>
										</span>
									</Tooltip>
								)}
							</Flex>
						)}

						{/* List of configuration options in the category */}
						<InfoTileGrid
							list={products?.map((product) => ({
								name: product.name,
								label: product.label,
								desc: product.desc,
								icon: product.icon,
							}))}
						/>
					</Flex>
				);
			})}
		</>
	);
};

// MARK: SkeletonLoader
/**
 * SkeletonLoader Component
 * Renders a reusable skeleton loader for a section with a heading and multiple boxes.
 * @param {number} count - Number of skeleton rows to render.
 * @returns {JSX.Element} - Rendered SkeletonLoader component.
 */
const SkeletonLoader: React.FC<{ count: number }> = ({ count }) => {
	return (
		<Flex direction="column" gap="8">
			{Array.from({ length: count }).map((_, index) => (
				<Flex key={index} direction="column" gap="4" w="100%">
					<Skeleton height="24px" width="20%" />
					<Flex
						direction={{ base: "column", md: "row" }}
						justify="space-between"
						gap="4"
						w="100%"
					>
						{Array.from({ length: 3 }).map((_, subIndex) => (
							<Skeleton
								key={subIndex}
								height="80px"
								width="100%"
							/>
						))}
					</Flex>
				</Flex>
			))}
		</Flex>
	);
};
