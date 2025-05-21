import { Avatar, Flex, Grid, Skeleton, Text, Tooltip } from "@chakra-ui/react";
import { BreadcrumbWrapper, Icon, PageTitle } from "components";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { DownloadPricing } from "page-components/Admin/PricingCommission/DownloadPricing";
import { useEffect, useState } from "react";
import { generateBreadcrumbs } from "utils/breadcrumbUtils";
import { PricingForm, ProductNode, usePricingConfig } from ".";

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

interface ConfigGridProps {
	product_list: ProductNode[]; // List of product nodes to display
}

interface CardProps {
	name: string; // Unique name of the card
	label: string; // Label for the card
	desc?: string; // Optional description for the card
	icon?: string; // Optional icon name for the card
	children?: ProductNode[]; // Optional child nodes for navigation
}

// Utility function
/**
 * Recursively finds a node in a tree structure based on a path array.
 * @param {ProductNode[]} tree - The tree structure to search in.
 * @param {string[]} pathArray - Array of path segments to locate the node.
 * @param {number} [index] - Current index in the path array.
 * @returns {ProductNode[] | null} - The found node or null if not found.
 */
const findNodeInTree = (
	tree: ProductNode[],
	pathArray: string[],
	index = 0
): ProductNode[] | null => {
	if (!pathArray) return tree; // Base case: if no path is provided, return the root node
	if (index === pathArray.length) return tree; // Base case: reached the target node

	const currentNode = tree.find((node) => node.name === pathArray[index]);
	const nextNode = currentNode?.children;
	return nextNode ? findNodeInTree(nextNode, pathArray, index + 1) : null;
};

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

	const { asPath, push } = useRouter();

	const crumbs = generateBreadcrumbs(asPath, labelOverrides, ["/admin"]);

	// Get pricing tree and form data map from context
	const {
		pricingTree,
		formDataMap,
		productCategoryList,
		isFetchingProductConfig,
	} = usePricingConfig();

	// Base path for navigation
	const basePath = pathArray?.length
		? `/admin/pricing-config/${pathArray.join("/")}`
		: "/admin/pricing-config";

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
				console.log("[Pricing] name", name);
				push(`${basePath}/${name}`);
			}
		}
	};

	// Set the page title and icon based on the current node
	const title = crumbs?.[crumbs.length - 1]?.label ?? "Pricing & Commissions";
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
					productDetails={formData}
				/>
			);
		}

		return <ConfigGrid product_list={currentPricingTreeNode} />;
	};
	return (
		<BreadcrumbWrapper crumbs={crumbs}>
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
						<ConfigGrid product_list={products} />
					</Flex>
				);
			})}
		</>
	);
};

// MARK: ConfigGrid
/**
 * ConfigGrid Component
 * Displays a grid of configuration items.
 * @param {ConfigGridProps} props - Props for the component.
 * @returns {JSX.Element} - Rendered ConfigGrid component.
 */
const ConfigGrid = ({ product_list }: ConfigGridProps): JSX.Element => {
	return (
		<Grid
			templateColumns={{
				base: "repeat(auto-fill,minmax(250px,1fr))",
				md: "repeat(auto-fill,minmax(300px,1fr))",
			}}
			justifyContent="center"
			py={{ base: "4", md: "0px" }}
			gap={{
				base: 4,
				md: 2,
				lg: 6,
			}}
		>
			{product_list?.map((product) => {
				const { label, name, desc, icon } = product ?? {};
				return (
					<div
						key={name}
						data-card-name={name}
						style={{ width: "100%" }}
					>
						<Card
							key={name}
							name={name}
							label={label}
							desc={desc}
							icon={icon}
						/>
					</div>
				);
			})}
		</Grid>
	);
};

// MARK: Card
/**
 * Card Component
 * Displays a single card for a product or configuration item.
 * @param {CardProps} props - Props for the component.
 * @returns {JSX.Element} - Rendered Card component.
 */
const Card = ({ name, label, desc, icon }: CardProps): JSX.Element => {
	const { h } = useHslColor(label);
	const [onHover, setOnHover] = useState(false);

	return (
		<Flex
			key={name}
			w="100%"
			bg="white"
			p="4"
			borderRadius="8"
			align="center"
			justify="space-between"
			gap="1"
			_hover={{
				bg: `hsl(${h},80%,98%)`,
				transition: "background 0.3s ease-out",
				cursor: "pointer",
			}}
			boxShadow="buttonShadow"
			onMouseEnter={() => setOnHover(true)}
			onMouseLeave={() => setOnHover(false)}
		>
			<Flex align="center" gap="4" w="100%">
				<Avatar
					size={{ base: "sm", md: "md" }}
					name={icon ? null : label}
					border={`2px solid hsl(${h},80%,90%)`}
					bg={`hsl(${h},80%,95%)`}
					color={`hsl(${h},80%,30%)`}
					icon={
						<Icon
							size={{ base: "sm", md: "md" }}
							name={icon}
							color={`hsl(${h},80%,30%)`}
						/>
					}
				/>
				<Flex direction="column" w="80%" gap="1">
					{label?.length > 0 && (
						<Text
							fontSize={{ base: "sm", md: "md" }}
							fontWeight="medium"
							userSelect="none"
						>
							{label}
						</Text>
					)}
					{desc?.length > 0 && (
						<Text fontSize="xxs" userSelect="none" noOfLines={3}>
							{desc}
						</Text>
					)}
				</Flex>
			</Flex>
			<Icon
				name="arrow-forward"
				size={{ base: "xs", sm: "sm" }}
				color={onHover ? `hsl(${h},80%,30%)` : "transparent"}
			/>
		</Flex>
	);
};

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
