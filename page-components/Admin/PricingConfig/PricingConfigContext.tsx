import { Endpoints } from "constants/EndPoints";
import { TransactionTypes } from "constants/EpsTransactions";
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
	distributorList: Agent[];
	allAgentList: Agent[];
}

export interface Agent {
	user_code: string;
	name: string;
	mobile: string;
	parent_user_code?: string;
	user_type_id: number;
	customer_id: number;
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
	const [pricingTree, setPricingTree] = useState<ProductNode[]>([]);
	const [formDataMap, setFormDataMap] = useState<Record<string, any>>({});
	const [productCategoryList, setProductCategoryList] = useState<
		ProductCategory[]
	>([]);
	const [distributorList, setDistributorList] = useState<Agent[]>([]);
	const [allAgentList, setAllAgentList] = useState<Agent[]>([]);

	// Fetching Product Overview Data
	const [fetchProductConfig] = useApiFetch(Endpoints.TRANSACTION_JSON, {
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
	});

	// Fetch Distributor List Data
	const [fetchDistributorList] = useApiFetch(Endpoints.TRANSACTION, {
		onSuccess: (res) => {
			const distributors = res?.data?.csp_list || [];
			setDistributorList(distributors);
		},
		onError: (err) => {
			console.error("Error fetching distributor list:", err);
		},
	});

	// Fetch All Agent List Data
	const [fetchAllAgentList] = useApiFetch(Endpoints.TRANSACTION, {
		onSuccess: (res) => {
			const allAgents = res?.data?.csp_list || [];
			setAllAgentList(allAgents);
		},
		onError: (err) => {
			console.error("Error fetching all agent list:", err);
		},
	});

	useEffect(() => {
		// Fetch product configuration
		fetchProductConfig({
			body: {
				interaction_type_id: TransactionTypes.GET_PRICING_CONFIG,
			},
		});

		// Fetch Distributor List
		fetchDistributorList({
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agent-list?usertype=1",
				"tf-req-method": "GET",
			},
		});

		// Fetch All Agent List
		fetchAllAgentList({
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agent-list",
				"tf-req-method": "GET",
			},
		});
	}, []);

	return (
		<PricingConfigContext.Provider
			value={{
				pricingTree,
				formDataMap,
				productCategoryList,
				distributorList,
				allAgentList,
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
