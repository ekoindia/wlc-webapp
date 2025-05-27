import { capitalize, formatCurrency, toKebabCase } from "utils";
import { PRICING_TYPE_OPTIONS, ProductCategory, ProductNode } from ".";

const AGENT_TYPE = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
} as const;

/**
 * Interface for a recursive node structure.
 * Represents a node in the tree with optional properties for different node types.
 */
interface TreeNode {
	type: "form" | "path" | "provider" | "product";
	label: string;
	name: string;
	desc?: string; // Optional for nodes that don't require a description
	formlink?: string; // Only for "form" nodes
	meta?: Record<string, any>; // Optional metadata for "form" nodes
	children?: TreeNode[]; // Recursive children nodes
}

/**
 * Interface for the render list result.
 */
interface PricingTreeResult {
	pricingTree: TreeNode[];
	formRegistry: Record<string, any>;
}

/**
 * Creates a generic node.
 * @param {string} type - Type of the node (e.g., "form", "path", "provider", "product").
 * @param {string} label - Label for the node.
 * @param {string} name - Name of the node (formatted).
 * @param {string} [desc] - Optional description for the node.
 * @param {string} [formlink] - Optional form link (only for "form" nodes).
 * @param {Record<string, any>} [meta] - Optional metadata (only for "form" nodes).
 * @param {TreeNode[]} [children] - Optional child nodes (only for "path", "provider", and "product" nodes).
 * @returns {TreeNode} The created node.
 */
const createNode = ({
	type,
	label,
	name,
	desc,
	formlink,
	meta,
	children,
}: {
	type: "form" | "path" | "provider" | "product";
	label: string;
	name: string;
	desc?: string;
	formlink?: string;
	meta?: Record<string, any>;
	children?: TreeNode[];
}): TreeNode => {
	const node: TreeNode = { type, label, name };

	if (desc) node.desc = desc;
	if (formlink) node.formlink = formlink;
	if (meta) node.meta = meta;
	if (children) node.children = children;

	return node;
};

/**
 * Generates a render list for the pricing configuration.
 * @param {Array<any>} productList - List of products to generate the render list for.
 * @returns {PricingTreeResult} Render list and form data map.
 */
export function generatePricingTrees(productList: any[]): PricingTreeResult {
	const formRegistry: Record<string, any> = {};

	const pricingTree: TreeNode[] = productList.map((product) => {
		const productName = toKebabCase(product.label);

		return {
			type: "product",
			label: capitalize(product.label, false),
			name: productName,
			desc: product.desc,
			meta: {
				service_type: product.serviceType,
			},
			children: product.provider.map((provider) => {
				const providerName = toKebabCase(provider.label);
				const providerNode: TreeNode = {
					type: "provider",
					label: capitalize(provider.label, false),
					name: providerName,
					desc: `Set Pricing for ${provider.label} ${product.label}`,
					children: [],
				};

				const { agentPricing, distributorCommission } = provider;

				// Add Agent Pricing node if agentPricing exists
				if (agentPricing) {
					const agentFormNode = createNode({
						type: "form",
						label: `${capitalize(provider.label, false)} > ${capitalize(agentPricing.label, false)}`,
						name: "agent-pricing",
						formlink: generateKey(
							toKebabCase(product.label),
							"agent-pricing",
							agentPricing,
							formRegistry
						),
						meta: { agentType: AGENT_TYPE.RETAILERS },
					});

					providerNode.children!.push(
						createNode({
							type: "path",
							label: "Agent's Pricing",
							name: toKebabCase("Agent Pricing"),
							desc: `Set Agent's Pricing for ${provider.label}`,
							children: [agentFormNode],
						})
					);
				}

				// Add Distributor Commission node if distributorCommission exists
				if (distributorCommission) {
					const distributorFormNode = createNode({
						type: "form",
						label: `${capitalize(provider.label, false)} > ${capitalize(distributorCommission.label, false)}`,
						name: "distributor-commission",
						formlink: generateKey(
							toKebabCase(product.label),
							"distributor-commission",
							distributorCommission,
							formRegistry
						),
						meta: { agentType: AGENT_TYPE.DISTRIBUTOR },
					});

					providerNode.children!.push(
						createNode({
							type: "path",
							label: "Distributor's Commission",
							name: toKebabCase("Distributor Commission"),
							desc: `Set Distributor's Commission for ${provider.label}`,
							children: [distributorFormNode],
						})
					);
				}

				return providerNode;
			}),
		};
	});

	return { pricingTree, formRegistry };
}

/**
 * Generates a unique key for forms and stores data in formRegistry.
 * @param {string} product - Formatted product name.
 * @param {string} formType - Type of form (agent-pricing/distributor-commission).
 * @param {object} data - Form data.
 * @param {object} formRegistry - Storage map for form data.
 * @returns {string} Generated key.
 */
function generateKey(
	product: string,
	formType: string,
	data: any,
	formRegistry: Record<string, any>
): string {
	const key = `form-${product}-${formType}`;
	formRegistry[key] = data;
	return key;
}

// Helper function to format slabs
export const formatSlabs = (slabs) =>
	slabs?.map((item, index) => ({
		value: `${index}`,
		label:
			item.min === item.max
				? `${formatCurrency(item.min, "INR", false, false)}`
				: `${formatCurrency(item.min, "INR", false, false)} – ${formatCurrency(item.max, "INR", false, false)}`,
		validation: item.validation,
		min_slab_amount: item.min,
		max_slab_amount: item.max,
	})) || [];

// This function checks the status of the API response and returns a string indicating success or error
export const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

/**
 * Groups products by their `service_type` and returns unique categories with associated products.
 * Categories and products within each category are sorted alphabetically.
 * @param {ProductNode[]} productList - List of products, each containing a `meta.service_type` and a `name`.
 * @returns {ProductCategory[]} - Array of product categories.
 * List of categories with their name, description, and associated sorted products.
 */
export const generateProductCategoryList = (productList: any[]) => {
	const grouped = productList.reduce((acc, product) => {
		const category = product?.meta?.service_type;
		if (category) {
			acc[category] ??= {
				category: category,
				description:
					"Set and adjust pricing and commissions for various services within your network.",
				products: [],
			};
			acc[category].products.push(product);
		}
		return acc;
	}, {} as ProductCategory[]);

	// Convert to array and sort categories alphabetically
	return Object.values(grouped)
		.map((cat: ProductCategory) => ({
			...cat,
			products: cat.products.sort((a, b) => a.name.localeCompare(b.name)),
		}))
		.sort((a, b) => a.category.localeCompare(b.category));
};

/**
 * Helper function to get the pricing type string.
 * Maps over PRICING_TYPE_OPTIONS and returns the id if the value matches the provided type.
 * @param {string} type - The pricing type (e.g., PRICING_TYPES.PERCENT or PRICING_TYPES.FIXED).
 * @returns {string | null} - The corresponding id or null if not found.
 */
export const getPricingTypeString = (type) => {
	const match = PRICING_TYPE_OPTIONS.find((option) => option.value === type);
	return match ? match.id : null;
};

/**
 * Recursively finds a node in a tree structure based on a path array.
 * @param {ProductNode[]} tree - The tree structure to search in.
 * @param {string[]} pathArray - Array of path segments to locate the node.
 * @param {number} [index] - Current index in the path array.
 * @returns {ProductNode[] | null} - The found node or null if not found.
 */
export const findNodeInTree = (
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

/**
 * Determines the page title based on the pricing tree and path array.
 * This function retrieves the label of the parent node of the current node
 * or returns a default title if the parent node is not found.
 * @param {ProductNode[]} pricingTree - The hierarchical tree structure representing pricing data.
 * @param {string[] | null} pathArray - Array of path segments representing the navigation path.
 * @returns {string} - The determined page title, or "Pricing & Commissions" as the default.
 */
export const getPageTitle = (
	pricingTree: ProductNode[],
	pathArray: string[] | null
): string => {
	const defaultTitle = "Pricing & Commissions";

	if (!pathArray?.length) return defaultTitle;

	const parentPath = pathArray.slice(0, -1);
	const parentNodeArray =
		parentPath.length === 0
			? pricingTree
			: findNodeInTree(pricingTree, parentPath);

	const currentSegmentName = pathArray[pathArray.length - 1];

	const parentNode = parentNodeArray?.find(
		(node) => node.name === currentSegmentName
	);

	return parentNode?.label ?? defaultTitle;
};
