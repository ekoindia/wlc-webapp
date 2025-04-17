import { Endpoints } from "constants/EndPoints";
import { TransactionTypes } from "constants/EpsTransactions";
import { NetworkUser, useNetworkUsers } from "contexts";
import useApiFetch from "hooks/useApiFetch";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { generatePricingTrees, generateProductCategoryList } from ".";

export interface ProductNode {
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

export interface ProductCategory {
	category: string;
	description: string;
	products: ProductNode[]; // Use the existing ProductNode interface for products
}

interface PricingConfigContextValue {
	pricingTree: ProductNode[];
	formDataMap: Record<string, any>;
	productCategoryList: ProductCategory[];
	distributorList: NetworkUser[];
	allAgentList: NetworkUser[];
	isFetchingProductConfig: boolean;
}

const PricingConfigContext = createContext<PricingConfigContextValue | null>(
	null
);

interface PricingConfigProviderProps {
	children: ReactNode;
}

/**
 * PricingConfigProvider Component
 * Provides pricing configuration data to its children.
 * @param {PricingConfigProviderProps} props - Props for the component.
 * @returns {JSX.Element} - Rendered provider component.
 */
const PricingConfigProvider = ({
	children,
}: PricingConfigProviderProps): JSX.Element => {
	const { networkUsersList, refreshUserList, fetchedAt, loading } =
		useNetworkUsers();
	const [pricingTree, setPricingTree] = useState<ProductNode[]>([]);
	const [formDataMap, setFormDataMap] = useState<Record<string, any>>({});
	const [productCategoryList, setProductCategoryList] = useState<
		ProductCategory[]
	>([]);
	const [distributorList, setDistributorList] = useState<NetworkUser[]>([]);
	const [allAgentList, setAllAgentList] = useState<NetworkUser[]>([]);

	// Fetching Product Overview Data
	const [fetchProductConfig, isFetchingProductConfig] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			onSuccess: async (res) => {
				const productList = res?.data?.product_list || [];
				const { pricingTree, formRegistry } =
					generatePricingTrees(productList);
				const categoryTree = generateProductCategoryList(pricingTree);

				setPricingTree(pricingTree);
				setFormDataMap(formRegistry);
				setProductCategoryList(categoryTree);
			},
			onError: (err) => {
				console.error("Error fetching product config:", err);
			},
		}
	);

	useEffect(() => {
		// Fetch product configuration
		fetchProductConfig({
			body: {
				interaction_type_id: TransactionTypes.GET_PRICING_CONFIG,
			},
		});
	}, []);

	// Fetch Network User List as a tree when tree-view is visible
	useEffect(() => {
		if (fetchedAt === null && !loading) {
			refreshUserList();
		}
	}, [fetchedAt]);

	useEffect(() => {
		if (networkUsersList?.length > 0) {
			const distributors = networkUsersList.filter(
				(user) => user.user_type_id === 1
			);
			setDistributorList(distributors);
			setAllAgentList(networkUsersList);
		}
	}, [networkUsersList]);

	return (
		<PricingConfigContext.Provider
			value={{
				pricingTree,
				formDataMap,
				productCategoryList,
				distributorList,
				allAgentList,
				isFetchingProductConfig,
			}}
		>
			{children}
		</PricingConfigContext.Provider>
	);
};

/**
 * usePricingConfig Hook
 * Provides access to pricing configuration data.
 * @returns {PricingConfigContextValue} - The pricing configuration context value.
 * @throws {Error} - If used outside of PricingConfigProvider.
 */
const usePricingConfig = (): PricingConfigContextValue => {
	const context = useContext(PricingConfigContext);
	if (!context) {
		throw new Error(
			"usePricingConfig must be used within a PricingConfigProvider"
		);
	}
	return context;
};

export { PricingConfigProvider, usePricingConfig };
