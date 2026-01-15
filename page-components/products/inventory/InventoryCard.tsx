import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Button } from "components";
import { Product } from "libs/inventory/types";

interface InventoryCardProps {
	product: Product;
	onEdit: (_product: Product) => void;
	onDelete: (_productId: string) => void;
}

export const InventoryCard = ({
	product,
	onEdit,
	onDelete,
}: InventoryCardProps): JSX.Element => {
	const imageBg = "gray.100"; // useColorModeValue("gray.100", "gray.700");
	const priceColor = "blue.600"; // useColorModeValue("blue.600", "blue.300");
	const cardBg = "white"; // useColorModeValue("white", "gray.800");
	const borderColor = "gray.200"; // useColorModeValue("gray.200", "gray.600");

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

				{/* Status Badge */}
				<Badge
					position="absolute"
					top={3}
					right={3}
					colorScheme={product.published ? "green" : "gray"}
					variant="solid"
					borderRadius="full"
					px={2}
					py={1}
					fontSize="xs"
					fontWeight="medium"
				>
					{product.published ? "Published" : "Draft"}
				</Badge>
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
							{product.salePrice.toFixed(2) ||
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
									₹{product.price.toFixed(2)}
								</Text>
							)}
					</Flex>

					{product.quantity !== undefined && (
						<Text
							fontSize="sm"
							color="gray.600"
							fontWeight="medium"
						>
							Stock: {product.quantity} units
						</Text>
					)}
				</Box>

				{/* Action Buttons */}
				<Flex gap={3} mt="auto" pt={4}>
					<Button
						colorScheme="blue"
						size="sm"
						flex={1}
						onClick={() => onEdit(product)}
						_hover={{
							transform: "translateY(-1px)",
							boxShadow: "md",
						}}
						transition="all 0.2s"
					>
						Edit
					</Button>
					<Button
						variant="outline"
						size="sm"
						colorScheme="red"
						onClick={() => onDelete(product._id)}
						_hover={{
							bg: "red.50",
							borderColor: "red.400",
							transform: "translateY(-1px)",
						}}
						transition="all 0.2s"
					>
						Delete
					</Button>
				</Flex>
			</Flex>
		</Box>
	);
};
