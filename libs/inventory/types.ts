export interface Product {
	_id: string;
	name: string;
	slug?: string;
	description?: string;
	price?: number;
	salePrice?: number | null;
	quantity?: number;
	image?: string | null;
	published?: boolean;
	deleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
	totalCount?: number;
	type?: string;
	weightInGrams?: number;
	gallery?: string[];
	vendor?: string;
	isOk?: boolean;
	__typename?: string;
}

export interface PaginationInput {
	page: number;
	limit: number;
}

export interface ProductInput {
	name: string;
	slug?: string;
	description?: string;
	price?: number;
	salePrice?: number | null;
	quantity?: number;
	image?: string | null;
	published?: boolean;
	weightInGrams?: number;
	gallery?: string[];
	type?: string;
}

export interface ProductUpdateInput {
	productId: string;
	name?: string;
	description?: string;
	price?: number;
	salePrice?: number | null;
	quantity?: number;
	image?: string | null;
	published?: boolean;
	weightInGrams?: number;
	gallery?: string[];
}

export interface ProductsResponse {
	products: Product[];
}

export interface ProductResponse {
	product: Product;
}

export interface AddProductResponse {
	addProduct: Product;
}

export interface UpdateProductResponse {
	updateProduct: Product;
}
