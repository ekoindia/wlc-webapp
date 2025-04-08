import { Endpoints } from "constants/EndPoints";
import useApiFetch from "hooks/useApiFetch";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { generatePricingTrees } from ".";

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

interface PricingConfigContextValue {
	pricingTree: ProductNode[];
	formDataMap: Record<string, any>;
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

	// Fetching Product Overview Data
	const [fetchProductConfig] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		onSuccess: async (res) => {
			const productList = res?.data?.product_list || [];
			const { pricingTree, formRegistry } =
				generatePricingTrees(productList);

			setPricingTree(pricingTree);
			setFormDataMap(formRegistry);
		},
		onError: (err) => {
			console.error("Error fetching product config:", err);
		},
	});

	// Fetch product configuration on mount
	useEffect(() => {
		fetchProductConfig({
			body: {
				interaction_type_id: 837,
			},
		});
	}, [fetchProductConfig]);

	return (
		<PricingConfigContext.Provider value={{ pricingTree, formDataMap }}>
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
