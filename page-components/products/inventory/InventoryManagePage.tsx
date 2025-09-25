import {
	Box,
	Container,
	Flex,
	HStack,
	Input,
	SimpleGrid,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { Button } from "components";
import {
	addProduct,
	deleteProduct,
	ExtendedPaginationInput,
	updateProduct,
	useProducts,
} from "libs/inventory/hooks";
import {
	Product,
	ProductInput,
	ProductUpdateInput,
} from "libs/inventory/types";
import { ConfirmDialog } from "page-components/products/inventory/ConfirmDialog";
import { GridEmpty } from "page-components/products/inventory/GridEmpty";
import { GridSkeleton } from "page-components/products/inventory/GridSkeleton";
import { InventoryCard } from "page-components/products/inventory/InventoryCard";
import { InventoryFormModal } from "page-components/products/inventory/InventoryFormModal";
import { useState } from "react";

const PRODUCTS_PER_PAGE = 12;

export const InventoryManagePage = (): JSX.Element => {
	const [pagination, setPagination] = useState<ExtendedPaginationInput>({
		page: 1,
		limit: PRODUCTS_PER_PAGE,
		search: "",
	});

	// Modal states
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<
		Product | undefined
	>();
	const [productToDelete, setProductToDelete] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const toast = useToast();

	// Fetch products using SWR
	const { products, isLoading, error, totalCount } = useProducts(pagination);

	// Calculate pagination
	const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

	// Handlers
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = event.target.value;
		setPagination((prev) => ({
			...prev,
			page: 1,
			search: searchTerm,
		}));
	};

	const handlePageChange = (page: number) => {
		setPagination((prev) => ({
			...prev,
			page,
		}));
	};

	const handleAddProduct = () => {
		setSelectedProduct(undefined);
		setIsFormModalOpen(true);
	};

	const handleEditProduct = (product: Product) => {
		setSelectedProduct(product);
		setIsFormModalOpen(true);
	};

	const handleDeleteProduct = (productId: string) => {
		setProductToDelete(productId);
		setIsDeleteDialogOpen(true);
	};

	const handleFormSubmit = async (
		data: ProductInput | ProductUpdateInput
	) => {
		setIsSubmitting(true);
		try {
			if (selectedProduct) {
				await updateProduct(data as ProductUpdateInput, pagination);
				toast({
					title: "Product updated successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				await addProduct(data as ProductInput, pagination);
				toast({
					title: "Product created successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
			setIsFormModalOpen(false);
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Something went wrong",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleConfirmDelete = async () => {
		if (!productToDelete) return;

		setIsSubmitting(true);
		try {
			await deleteProduct(productToDelete, pagination);
			toast({
				title: "Product deleted successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to delete product",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Error state
	if (error) {
		console.error("Products loading error:", error);
		return (
			<Container maxW="container.xl" py={8}>
				<VStack spacing={4}>
					<Text color="red.500" fontSize="lg">
						Error loading products:{" "}
						{error.message || "Unknown error"}
					</Text>
					<Text fontSize="sm" color="gray.600">
						Please check the console for more details.
					</Text>
					<Button
						variant="primary"
						onClick={() => window.location.reload()}
					>
						Retry
					</Button>
				</VStack>
			</Container>
		);
	}

	return (
		<Container maxW="container.xl" py={8}>
			<VStack spacing={6} align="stretch">
				{/* Header */}
				<Flex
					justify="space-between"
					align="center"
					wrap="wrap"
					gap={4}
				>
					<VStack align="start" spacing={1}>
						<Text fontSize="2xl" fontWeight="bold">
							Inventory Management
						</Text>
						<Text color="gray.600">
							{totalCount} product{totalCount !== 1 ? "s" : ""}{" "}
							found
						</Text>
					</VStack>

					<Button
						variant="primary"
						onClick={handleAddProduct}
						icon="add"
						iconPosition="left"
						iconStyle={{
							size: "sm",
						}}
					>
						Add Product
					</Button>
				</Flex>

				{/* Search Bar */}
				<Box maxW="400px">
					<Input
						placeholder="Search products..."
						value={pagination.search}
						onChange={handleSearch}
						bg="white"
					/>
				</Box>

				{/* Products Grid */}
				{isLoading ? (
					<GridSkeleton count={PRODUCTS_PER_PAGE} />
				) : products.length === 0 ? (
					<GridEmpty onAddProduct={handleAddProduct} />
				) : (
					<>
						<SimpleGrid
							columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
							spacing={6}
						>
							{products.map((product) => (
								<InventoryCard
									key={product._id}
									product={product}
									onEdit={handleEditProduct}
									onDelete={handleDeleteProduct}
								/>
							))}
						</SimpleGrid>

						{/* Pagination */}
						{totalPages > 1 && (
							<HStack justify="center" mt={8} spacing={2}>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										handlePageChange(pagination.page - 1)
									}
									disabled={pagination.page === 1}
								>
									Previous
								</Button>

								<Text px={4} py={2}>
									Page {pagination.page} of {totalPages}
								</Text>

								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										handlePageChange(pagination.page + 1)
									}
									disabled={pagination.page === totalPages}
								>
									Next
								</Button>
							</HStack>
						)}
					</>
				)}
			</VStack>

			{/* Form Modal */}
			<InventoryFormModal
				isOpen={isFormModalOpen}
				onClose={() => setIsFormModalOpen(false)}
				onSubmit={handleFormSubmit}
				product={selectedProduct}
				title={selectedProduct ? "Edit Product" : "Add New Product"}
			/>

			{/* Delete Confirmation Dialog */}
			<ConfirmDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => {
					setIsDeleteDialogOpen(false);
					setProductToDelete(null);
				}}
				onConfirm={handleConfirmDelete}
				title="Delete Product"
				message="Are you sure you want to delete this product? This action cannot be undone."
				confirmText="Delete"
				isLoading={isSubmitting}
			/>
		</Container>
	);
};
