import { Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { Button, Icon } from "components";

interface GridEmptyProps {
	onAddProduct: () => void;
}

export const GridEmpty = ({ onAddProduct }: GridEmptyProps): JSX.Element => {
	const bgColor = useColorModeValue("gray.50", "gray.800");
	const textColor = useColorModeValue("gray.600", "gray.400");

	return (
		<VStack
			spacing={6}
			justify="center"
			align="center"
			minH="400px"
			bg={bgColor}
			borderRadius="lg"
			p={8}
		>
			<Icon name="package" size="64px" color={textColor} />

			<VStack spacing={2} textAlign="center">
				<Text fontSize="xl" fontWeight="semibold" color={textColor}>
					No products found
				</Text>
				<Text fontSize="md" color={textColor}>
					Start building your inventory by adding your first product
				</Text>
			</VStack>

			<Button
				variant="primary"
				size="lg"
				onClick={onAddProduct}
				icon="plus"
				iconPosition="left"
				iconStyle={{
					size: "20px",
				}}
			>
				Add Your First Product
			</Button>
		</VStack>
	);
};
