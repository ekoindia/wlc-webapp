import useSWR, { mutate } from "swr";
import { gqlRequest } from "./gql";
import {
	AddMealMutation,
	AllMeals,
	DeleteMeal,
	MealDetails,
	UpdateMeal,
} from "./queries";
import {
	AddProductResponse,
	PaginationInput,
	Product,
	ProductInput,
	ProductResponse,
	ProductsResponse,
	ProductUpdateInput,
	UpdateProductResponse,
} from "./types";

// Extended pagination interface for client-side features
export interface ExtendedPaginationInput extends PaginationInput {
	search?: string;
}

// SWR Key generators
const getProductsKey = (pagination: ExtendedPaginationInput): string =>
	`products-${pagination.page}-${pagination.limit}-${pagination.search || ""}`;

const getProductKey = (productId: string): string => `product-${productId}`;

// Client-side search function
/**
 *
 * @param products
 * @param searchTerm
 */
function filterProducts(products: Product[], searchTerm?: string): Product[] {
	if (!searchTerm || searchTerm.trim() === "") {
		return products;
	}

	const lowercaseSearch = searchTerm.toLowerCase();
	return products.filter(
		(product) =>
			product.name?.toLowerCase().includes(lowercaseSearch) ||
			product.description?.toLowerCase().includes(lowercaseSearch)
	);
}

// Custom hooks for data fetching
/**
 *
 * @param pagination
 */
export function useProducts(pagination: ExtendedPaginationInput) {
	// Use API pagination without search
	const apiPagination: PaginationInput = {
		page: pagination.page,
		limit: pagination.limit,
	};

	const { data, error, isLoading } = useSWR(
		getProductsKey(pagination),
		() =>
			gqlRequest<ProductsResponse>(AllMeals, {
				paginationInput: apiPagination,
			}),
		{
			revalidateOnFocus: false,
			dedupingInterval: 5000,
			onError: (error) => {
				console.error("SWR Error:", error);
			},
		}
	);

	// Apply client-side search filtering
	const allProducts = data?.products || [];
	const filteredProducts = filterProducts(allProducts, pagination.search);

	return {
		products: filteredProducts,
		isLoading,
		error,
		totalCount: data?.products?.[0]?.totalCount || 0,
	};
}

/**
 *
 * @param productId
 */
export function useProduct(productId: string) {
	const { data, error, isLoading } = useSWR(
		productId ? getProductKey(productId) : null,
		() => gqlRequest<ProductResponse>(MealDetails, { productId }),
		{
			revalidateOnFocus: false,
		}
	);

	return {
		product: data?.product,
		isLoading,
		error,
	};
}

// Mutation functions with optimistic updates
/**
 *
 * @param productInput
 * @param pagination
 */
export async function addProduct(
	productInput: ProductInput,
	pagination: ExtendedPaginationInput
): Promise<Product> {
	try {
		const response = await gqlRequest<AddProductResponse>(AddMealMutation, {
			productInput,
		});

		// Check if the response is successful like in working example
		if (response.addProduct?.isOk) {
			// Invalidate products list to refetch
			await mutate(getProductsKey(pagination));
			return response.addProduct;
		} else {
			throw new Error("Failed to add product");
		}
	} catch (error) {
		console.error("Add product error:", error);
		throw error;
	}
}

/**
 *
 * @param productUpdateInput
 * @param pagination
 */
export async function updateProduct(
	productUpdateInput: ProductUpdateInput,
	pagination: ExtendedPaginationInput
): Promise<Product> {
	try {
		const response = await gqlRequest<UpdateProductResponse>(UpdateMeal, {
			productUpdateInput,
		});

		// Update both the products list and individual product cache
		await Promise.all([
			mutate(getProductsKey(pagination)),
			mutate(getProductKey(productUpdateInput.productId)),
		]);

		return response.updateProduct;
	} catch (error) {
		throw error;
	}
}

/**
 *
 * @param productId
 * @param pagination
 */
export async function deleteProduct(
	productId: string,
	pagination: ExtendedPaginationInput
): Promise<void> {
	try {
		await gqlRequest(DeleteMeal, { productId });

		// Invalidate caches
		await Promise.all([
			mutate(getProductsKey(pagination)),
			mutate(getProductKey(productId)),
		]);
	} catch (error) {
		throw error;
	}
}

// Utility function to manually refresh products list
/**
 *
 * @param pagination
 */
export function refreshProducts(
	pagination: ExtendedPaginationInput
): Promise<any> {
	return mutate(getProductsKey(pagination));
}
