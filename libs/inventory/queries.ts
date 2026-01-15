export const AllMeals = `
query products($paginationInput: paginationInput!) {
	products(paginationInput: $paginationInput) {
		_id
		name
		description
		price
		salePrice
		quantity
		image
		published
		deleted
		totalCount
	}
}
`;

export const MealDetails = `
query product($productId: String!) {
	product(productId: $productId) {
		_id
		name
		description
		price
		salePrice
		quantity
		image
		published
		deleted
		totalCount
	}
}
`;

export const AddMealMutation = `
mutation addProduct($productInput: productInput!) {
	addProduct(productInput: $productInput) {
		isOk
		_id
		createdAt
		updatedAt
		deleted
		name
		slug
		quantity
		price
		salePrice
		description
		type
		image
		weightInGrams
		gallery
		vendor
		published
		totalCount
		__typename
	}
}
`;

export const UpdateMeal = `
mutation updateProduct($productUpdateInput: productUpdateInput!) {
	updateProduct(productUpdateInput: $productUpdateInput) {
		isOk
		_id
		createdAt
		updatedAt
		deleted
		name
		slug
		quantity
		price
		salePrice
		description
		type
		image
		weightInGrams
		gallery
		vendor
		published
		totalCount
		__typename
	}
}
`;

export const DeleteMeal = `
mutation deleteProduct($productId: String!) {
	deleteProduct(productId: $productId) {
		_id
		deleted
	}
}`;
