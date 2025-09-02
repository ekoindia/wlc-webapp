import {
	Box,
	Flex,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Button } from "components";
import { Product } from "libs/inventory/types";

interface PaymentQRModalProps {
	isOpen: boolean;
	onClose: () => void;
	product?: Product;
}

export const PaymentQRModal = ({
	isOpen,
	onClose,
	product,
}: PaymentQRModalProps): JSX.Element => {
	// Static dummy QR code image - using a public QR code generator
	const qrCodeUrl =
		"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Payment%20for%20" +
		encodeURIComponent(product?.name || "Product");

	const totalAmount = product?.salePrice || product?.price || 0;

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader textAlign="center">
					Complete Your Payment
				</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					<VStack spacing={6} align="center">
						{/* Product Summary */}
						<Box
							w="100%"
							p={4}
							bg="gray.50"
							borderRadius="md"
							border="1px solid"
							borderColor="gray.200"
						>
							<VStack spacing={2} align="start">
								<Text fontWeight="bold" fontSize="lg">
									{product?.name}
								</Text>
								{product?.description && (
									<Text
										fontSize="sm"
										color="gray.600"
										noOfLines={2}
									>
										{product.description}
									</Text>
								)}
								<Flex
									justify="space-between"
									w="100%"
									align="center"
								>
									<Text fontWeight="medium">
										Total Amount:
									</Text>
									<Text
										fontSize="xl"
										fontWeight="bold"
										color="green.600"
									>
										₹{totalAmount.toFixed(2)}
									</Text>
								</Flex>
							</VStack>
						</Box>

						{/* QR Code */}
						<VStack spacing={4}>
							<Text
								fontSize="md"
								fontWeight="medium"
								textAlign="center"
							>
								Scan this QR code to complete payment
							</Text>

							<Box
								p={4}
								bg="white"
								border="2px solid"
								borderColor="gray.300"
								borderRadius="lg"
								boxShadow="md"
							>
								<Image
									src={qrCodeUrl}
									alt="Payment QR Code"
									w="250px"
									h="250px"
									fallback={
										<Flex
											w="250px"
											h="250px"
											bg="gray.100"
											align="center"
											justify="center"
											borderRadius="md"
										>
											<VStack>
												<Text fontSize="6xl">📱</Text>
												<Text
													fontSize="sm"
													color="gray.600"
													textAlign="center"
												>
													QR Code
												</Text>
											</VStack>
										</Flex>
									}
								/>
							</Box>

							<VStack spacing={2} textAlign="center">
								<Text fontSize="sm" color="gray.600">
									Use any UPI app to scan and pay
								</Text>
								<Text fontSize="xs" color="gray.500">
									GPay • PhonePe • Paytm • BHIM • Bank Apps
								</Text>
							</VStack>
						</VStack>

						{/* Payment Instructions */}
						<Box
							w="100%"
							p={3}
							bg="blue.50"
							borderRadius="md"
							border="1px solid"
							borderColor="blue.200"
						>
							<VStack spacing={2} align="start">
								<Text
									fontSize="sm"
									fontWeight="medium"
									color="blue.800"
								>
									Payment Instructions:
								</Text>
								<Text fontSize="xs" color="blue.700">
									1. Open your UPI app
								</Text>
								<Text fontSize="xs" color="blue.700">
									2. Scan the QR code above
								</Text>
								<Text fontSize="xs" color="blue.700">
									3. Verify the amount and complete payment
								</Text>
								<Text fontSize="xs" color="blue.700">
									4. Keep the payment receipt for your records
								</Text>
							</VStack>
						</Box>
					</VStack>
				</ModalBody>

				<ModalFooter gap={3}>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="primary" onClick={onClose}>
						Payment Completed
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
