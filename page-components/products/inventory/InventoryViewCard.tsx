import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Button } from "components";
import { Product } from "libs/inventory/types";

interface InventoryViewCardProps {
	product: Product;
	onPurchase: (_product: Product) => void;
}

export const InventoryViewCard = ({
	product,
	onPurchase,
}: InventoryViewCardProps): JSX.Element => {
	const imageBg = "gray.100";
	const priceColor = "blue.600";
	const cardBg = "white";
	const borderColor = "gray.200";

	return (
		<Box
			bg={cardBg}
			borderWidth="1px"
			borderColor={borderColor}
			borderRadius="lg"
			p={6}
			boxShadow="sm"
			transition="all 0.2s"
			_hover={{
				transform: "translateY(-2px)",
				boxShadow: "lg",
			}}
			display="flex"
			flexDirection="column"
			h="100%"
		>
			{/* Product Image */}
			<Box
				position="relative"
				mb={4}
				borderRadius="md"
				overflow="hidden"
				bg={imageBg}
				h="200px"
				_hover={{
					transform: "scale(1.02)",
				}}
				transition="transform 0.2s"
			>
				{product.image ? (
					<Image
						src={product.image}
						alt={product.name}
						w="100%"
						h="100%"
						objectFit="cover"
					/>
				) : (
					<Flex
						w="100%"
						h="100%"
						align="center"
						justify="center"
						color="gray.500"
						fontSize="sm"
					>
						No Image
					</Flex>
				)}

				{/* Status Badge - Only show Published products */}
				{product.published && (
					<Badge
						position="absolute"
						top={3}
						right={3}
						colorScheme="green"
						variant="solid"
						borderRadius="full"
						px={2}
						py={1}
						fontSize="xs"
						fontWeight="medium"
					>
						Available
					</Badge>
				)}
			</Box>

			{/* Product Details */}
			<Flex direction="column" flex={1}>
				<Text
					fontSize="xl"
					fontWeight="bold"
					mb={3}
					noOfLines={2}
					minH="3.5rem"
					lineHeight="1.3"
				>
					{product.name}
				</Text>

				{product.description && (
					<Text
						fontSize="sm"
						color="gray.600"
						mb={4}
						noOfLines={3}
						minH="4.5rem"
						lineHeight="1.4"
					>
						{product.description}
					</Text>
				)}

				{/* Price Information */}
				<Box mb={4} p={3} bg="gray.50" borderRadius="md">
					<Flex align="center" gap={2} mb={2}>
						<Text
							fontSize="xl"
							fontWeight="bold"
							color={priceColor}
						>
							₹
							{product.salePrice?.toFixed(2) ||
								product.price?.toFixed(2) ||
								"0.00"}
						</Text>
						{product.salePrice &&
							product.salePrice !== product.price && (
								<Text
									fontSize="md"
									textDecoration="line-through"
									color="gray.500"
								>
									₹{product.price?.toFixed(2) || "0.00"}
								</Text>
							)}
					</Flex>

					{product.quantity !== undefined && product.quantity > 0 && (
						<Text
							fontSize="sm"
							color="green.600"
							fontWeight="medium"
						>
							In Stock: {product.quantity} units
						</Text>
					)}

					{product.quantity !== undefined &&
						product.quantity === 0 && (
							<Text
								fontSize="sm"
								color="red.500"
								fontWeight="medium"
							>
								Out of Stock
							</Text>
						)}

					{product.weightInGrams && (
						<Text fontSize="xs" color="gray.500" mt={1}>
							Weight: {product.weightInGrams}g
						</Text>
					)}
				</Box>

				{/* Purchase Button */}
				<Box mt="auto" pt={4}>
					<Button
						colorScheme="green"
						size="md"
						w="100%"
						onClick={() => onPurchase(product)}
						isDisabled={
							!product.published ||
							(product.quantity !== undefined &&
								product.quantity === 0)
						}
						_hover={{
							transform: "translateY(-1px)",
							boxShadow: "md",
						}}
						transition="all 0.2s"
						iconPosition="left"
						icon="shopping-cart"
					>
						{!product.published
							? "Not Available"
							: product.quantity === 0
								? "Out of Stock"
								: "Purchase"}
					</Button>
				</Box>
			</Flex>
		</Box>
	);
};
