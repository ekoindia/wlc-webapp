import { Avatar, Flex, Grid, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { Endpoints } from "constants/EndPoints";
import useApiFetch from "hooks/useApiFetch";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generatePricingTrees, PricingConfigProvider, PricingForm } from ".";

interface PricingConfigProps {
	pathArray?: string[]; // Array of path segments for navigation
}

interface ConfigGridProps {
	product_list: ProductNode[]; // List of product nodes to display
	basePath: string; // Base path for navigation
}

interface CardProps {
	name: string; // Unique name of the card
	label: string; // Label for the card
	desc?: string; // Optional description for the card
	icon?: string; // Optional icon name for the card
	children?: ProductNode[]; // Optional child nodes for navigation
	basePath: string; // Base path for navigation
}

interface ProductNode {
	name: string; // Unique name of the product node
	label: string; // Label for the product node
	desc?: string; // Optional description
	icon?: string; // Optional icon name
	children?: ProductNode[]; // Optional child nodes
	meta?: {
		agentType?: string; // Metadata for agent type (optional)
		[key: string]: any; // Allow additional metadata properties
	};
	type?: string; // Type of the node (e.g., "form", "product")
	formlink?: string; // Link to the form (optional)
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

// Component: PricingConfig
/**
 * PricingConfig Component
 * Displays a hierarchical configuration interface for pricing and commissions.
 * @param {PricingConfigProps} props - Props for the component.
 * @returns {JSX.Element} - Rendered PricingConfig component.
 */
const PricingConfig = ({ pathArray }: PricingConfigProps): JSX.Element => {
	const [pricingTree, setPricingTree] = useState<ProductNode[]>([]);
	const [currentPricingNode, setCurrentPricingNode] = useState<
		ProductNode[] | null
	>([]);
	const [formDataMap, setFormDataMap] = useState<Record<string, any>>({});
	const [formData, setFormData] = useState<Record<string, any>>({});

	const basePath = pathArray?.length
		? `/admin/pricing-config/${pathArray.join("/")}`
		: "/admin/pricing-config";

	// Fetching Product Overview Data
	const [fetchProductConfig] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		onSuccess: async (res) => {
			const _productList = res?.data?.product_list || [];
			const { pricingTree, formRegistry } =
				generatePricingTrees(_productList);
			console.log("[Pricing] pricingTree", pricingTree);

			setPricingTree(pricingTree);
			setCurrentPricingNode(pricingTree);
			setFormDataMap(formRegistry);
		},
		onError: (err) => {
			console.error("Error fetching product config:", err);
		},
	});

	useEffect(() => {
		fetchProductConfig({
			body: {
				interaction_type_id: 837,
			},
		});
	}, []);

	useEffect(() => {
		if (pathArray?.length > 0 && pricingTree?.length > 0) {
			const node = findNodeInTree(pricingTree, pathArray);

			if (node?.[0]?.type === "form") {
				const _formData = formDataMap[node[0].formlink];
				console.log("[Pricing] _formData", _formData);

				if (_formData) {
					setCurrentPricingNode(() => {
						setFormData(_formData); // Update formData before updating currentPricingNode
						return node;
					});
				}
			} else {
				setCurrentPricingNode(node);
			}
		}
	}, [pathArray, pricingTree]);

	return (
		<PricingConfigProvider>
			{currentPricingNode === null ? (
				<Text>Nothing found</Text>
			) : currentPricingNode?.length > 0 &&
			  currentPricingNode[0]?.type !== "form" ? (
				<ConfigGrid
					product_list={currentPricingNode}
					basePath={basePath}
				/>
			) : formData && currentPricingNode?.[0]?.type === "form" ? (
				<PricingForm
					agentType={currentPricingNode?.[0]?.meta?.agentType}
					productDetails={formData}
				/>
			) : null}
		</PricingConfigProvider>
	);
};

export default PricingConfig;

// Component: ConfigGrid
/**
 * ConfigGrid Component
 * Displays a grid of configuration items.
 * @param {ConfigGridProps} props - Props for the component.
 * @returns {JSX.Element} - Rendered ConfigGrid component.
 */
const ConfigGrid = ({
	product_list,
	basePath,
}: ConfigGridProps): JSX.Element => {
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
				const { label, name, desc, icon, children } = product ?? {};
				return (
					<Card
						key={name}
						name={name}
						label={label}
						desc={desc}
						icon={icon}
						children={children}
						basePath={basePath}
					/>
				);
			})}
		</Grid>
	);
};

// Component: Card
/**
 * Card Component
 * Displays a single card for a product or configuration item.
 * @param {CardProps} props - Props for the component.
 * @returns {JSX.Element} - Rendered Card component.
 */
const Card = ({
	name,
	label,
	desc,
	icon,
	children,
	basePath,
}: CardProps): JSX.Element => {
	const { h } = useHslColor(label);
	const [onHover, setOnHover] = useState(false);
	const router = useRouter();

	const handleClick = () => {
		if (!children?.length) {
			router.push(`${basePath}/form`);
		} else {
			router.push(`${basePath}/${name}`);
		}
	};

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
			onClick={handleClick}
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
