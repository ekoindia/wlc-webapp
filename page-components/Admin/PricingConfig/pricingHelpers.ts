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
		const productName = formatName(product.label);

		return {
			type: "product",
			label: product.label,
			name: productName,
			desc: product.desc,
			meta: {
				service_type: product.serviceType,
			},
			children: product.provider.map((provider) => {
				const providerName = formatName(provider.label);
				const providerNode: TreeNode = {
					type: "provider",
					label: provider.label,
					name: providerName,
					desc: `Set Pricing for ${provider.label} ${product.label}`,
					children: [],
				};

				const { agentPricing, distributorCommission } = provider;

				// Add Agent Pricing node if agentPricing exists
				if (agentPricing) {
					const agentFormNode = createNode({
						type: "form",
						label: `${provider.label} > Agent's Pricing`,
						name: formatName("agent-pricing"),
						formlink: generateKey(
							formatName(product.label),
							"agent-pricing",
							agentPricing,
							formRegistry
						),
						meta: { agentType: AGENT_TYPE.RETAILERS },
					});

					providerNode.children!.push(
						createNode({
							type: "path",
							label: "Agent Pricing",
							name: formatName("Agent Pricing"),
							desc: `Set Agent's Pricing for ${provider.label}`,
							children: [agentFormNode],
						})
					);
				}

				// Add Distributor Commission node if distributorCommission exists
				if (distributorCommission) {
					const distributorFormNode = createNode({
						type: "form",
						label: `${provider.label} > ${distributorCommission.label}`,
						name: formatName("distributor-commission"),
						formlink: generateKey(
							formatName(product.label),
							"distributor-commission",
							distributorCommission,
							formRegistry
						),
						meta: { agentType: AGENT_TYPE.DISTRIBUTOR },
					});

					providerNode.children!.push(
						createNode({
							type: "path",
							label: "Distributor Commission",
							name: formatName("Distributor Commission"),
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

/**
 * Converts a label to a formatted string (lowercase with hyphens).
 * @param {string} label - Label to format.
 * @returns {string} Formatted name.
 */
const formatName = (label: string): string =>
	label.toLowerCase().replace(/\s+/g, "-"); // Convert spaces to '-'

// Helper function to format slabs
export const formatSlabs = (slabs) =>
	slabs?.map((item, index) => ({
		value: `${index}`,
		label:
			item.min === item.max
				? `₹${item.min}`
				: `₹${item.min} – ₹${item.max}`,
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
