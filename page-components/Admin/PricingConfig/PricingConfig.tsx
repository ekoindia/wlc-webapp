import { Avatar, Flex, Grid, Text } from "@chakra-ui/react";
import { Icon } from "components";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PricingForm, ProductNode, usePricingConfig } from ".";

interface PricingConfigProps {
	pathArray?: string[] | null; // Array of path segments for navigation
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
	const [currentPricingTreeNode, setCurrentPricingTreeNode] = useState<
		ProductNode[] | null
	>(null);
	const [formData, setFormData] = useState<Record<string, any>>({});

	// Get pricing tree and form data map from context
	const { pricingTree, formDataMap } = usePricingConfig();

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

	// Render the appropriate UI based on the current pricing node
	const renderContent = (): JSX.Element | null => {
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

		return (
			<ConfigGrid
				product_list={currentPricingTreeNode}
				basePath={basePath}
			/>
		);
	};

	return <>{renderContent()}</>;
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
