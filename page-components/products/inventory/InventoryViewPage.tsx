import {
	Box,
	Container,
	Flex,
	HStack,
	Input,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Button } from "components";
import { ExtendedPaginationInput, useProducts } from "libs/inventory/hooks";
import { Product } from "libs/inventory/types";
import { GridSkeleton } from "page-components/products/inventory/GridSkeleton";
import { InventoryViewCard } from "page-components/products/inventory/InventoryViewCard";
import { PaymentQRModal } from "page-components/products/inventory/PaymentQRModal";
import { useState } from "react";

const PRODUCTS_PER_PAGE = 12;

export const InventoryViewPage = (): JSX.Element => {
	const [pagination, setPagination] = useState<ExtendedPaginationInput>({
		page: 1,
		limit: PRODUCTS_PER_PAGE,
		search: "",
	});

	// Modal states
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<
		Product | undefined
	>();

	// Fetch products using SWR - filter published products on the client side
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

	const handlePurchase = (product: Product) => {
		setSelectedProduct(product);
		setIsPaymentModalOpen(true);
	};

	// Custom empty state for the public view
	const ViewEmptyState = () => (
		<Box textAlign="center" py={20}>
			<VStack spacing={6}>
				<Text fontSize="6xl">🛍️</Text>
				<VStack spacing={2}>
					<Text fontSize="xl" fontWeight="bold" color="gray.600">
						No Products Available
					</Text>
					<Text color="gray.500">
						Check back later for new products
					</Text>
				</VStack>
			</VStack>
		</Box>
	);

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
						Please try again later.
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
							Our Products
						</Text>
						<Text color="gray.600">
							{totalCount} product{totalCount !== 1 ? "s" : ""}{" "}
							available
						</Text>
					</VStack>
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
					<ViewEmptyState />
				) : (
					<>
						<SimpleGrid
							columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
							spacing={6}
						>
							{products
								.filter((product) => product.published) // Extra safety filter
								.map((product) => (
									<InventoryViewCard
										key={product._id}
										product={product}
										onPurchase={handlePurchase}
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

			{/* Payment QR Modal */}
			<PaymentQRModal
				isOpen={isPaymentModalOpen}
				onClose={() => {
					setIsPaymentModalOpen(false);
					setSelectedProduct(undefined);
				}}
				product={selectedProduct}
			/>
		</Container>
	);
};
