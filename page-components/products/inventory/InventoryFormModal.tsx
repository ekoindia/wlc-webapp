import {
	Box,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { Button, Input, Switch } from "components";
import {
	Product,
	ProductInput,
	ProductUpdateInput,
} from "libs/inventory/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface InventoryFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (_data: ProductInput | ProductUpdateInput) => Promise<void>;
	product?: Product;
	title: string;
}

interface FormData {
	name: string;
	description: string;
	price: number;
	salePrice: number | null;
	quantity: number;
	weight: number;
	image: string;
	published: boolean;
}

export const InventoryFormModal = ({
	isOpen,
	onClose,
	onSubmit,
	product,
	title,
}: InventoryFormModalProps): JSX.Element => {
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	// Prepare default values based on product
	const defaultValues = {
		name: product?.name || "",
		description: product?.description || "",
		price: product?.price || 0,
		salePrice: product?.salePrice || null,
		quantity: product?.quantity || 0,
		image: product?.image || "",
		published: product?.published || false,
		weight: product?.weightInGrams || 100,
	};

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues,
	});

	const publishedValue = watch("published");

	// Reset form with product data when product changes or modal opens
	useEffect(() => {
		if (isOpen) {
			const formValues = {
				name: product?.name || "",
				description: product?.description || "",
				price: product?.price || 0,
				salePrice: product?.salePrice || null,
				quantity: product?.quantity || 0,
				weight: product?.weightInGrams || 100,
				image: product?.image || "",
				published: product?.published || false,
			};
			reset(formValues);
		}
	}, [isOpen, product, reset]);

	const handleFormSubmit = async (data: FormData) => {
		setIsLoading(true);

		console.log("Submitting form with data:", data);

		try {
			const formattedData = {
				name: data.name,
				description: data.description,
				price: Number(data.price),
				salePrice:
					data.salePrice &&
					Number(data.salePrice) < Number(data.price)
						? Number(data.salePrice)
						: Number(data.price),
				quantity: Number(data.quantity),
				image: data.image,
				weightInGrams: Number(data.weight), // Use weight field from form like working example
				gallery: [""], // Default empty gallery as seen in working example
				published: data.published,
				...(product && { productId: product._id }),
			};

			await onSubmit(formattedData);

			// Reset form to empty state after successful submission
			reset({
				name: "",
				description: "",
				price: 0,
				salePrice: null,
				quantity: 0,
				weight: 100,
				image: "",
				published: false,
			});

			onClose();
			toast({
				title: `Product ${product ? "updated" : "created"} successfully`,
				status: "success",
				duration: 3000,
				isClosable: true,
			});
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
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		// Reset form to empty state when closing
		reset({
			name: "",
			description: "",
			price: 0,
			salePrice: null,
			quantity: 0,
			weight: 100,
			image: "",
			published: false,
		});
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size="lg">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />

				<form
					key={product?._id || "new-product"}
					onSubmit={handleSubmit(handleFormSubmit)}
				>
					<ModalBody>
						<VStack spacing={4} align="stretch">
							{/* Product Name */}
							<div>
								<Text mb={2} fontWeight="medium">
									Product Name *
								</Text>
								<Input
									{...register("name", {
										required: "Product name is required",
										minLength: {
											value: 2,
											message:
												"Name must be at least 2 characters",
										},
									})}
									placeholder="Enter product name"
									isInvalid={!!errors.name}
								/>
								{errors.name && (
									<Text color="red.500" fontSize="sm" mt={1}>
										{errors.name.message}
									</Text>
								)}
							</div>

							{/* Description */}
							<div>
								<Text mb={2} fontWeight="medium">
									Description
								</Text>
								<Input {...register("description")} />
							</div>

							{/* Price & Sale Price */}
							<HStack spacing={4}>
								<Box flex={1}>
									<Text mb={2} fontWeight="medium">
										Price *
									</Text>
									<Input
										{...register("price", {
											required: "Price is required",
											min: {
												value: 0,
												message:
													"Price must be positive",
											},
										})}
										type="number"
										step="0.01"
										placeholder="0.00"
										isInvalid={!!errors.price}
									/>
									{errors.price && (
										<Text
											color="red.500"
											fontSize="sm"
											mt={1}
										>
											{errors.price.message}
										</Text>
									)}
								</Box>

								<Box flex={1}>
									<Text mb={2} fontWeight="medium">
										Sale Price
									</Text>
									<Input
										{...register("salePrice", {
											min: {
												value: 0,
												message:
													"Sale price must be positive",
											},
										})}
										type="number"
										step="0.01"
										placeholder="0.00"
									/>
									{errors.salePrice && (
										<Text
											color="red.500"
											fontSize="sm"
											mt={1}
										>
											{errors.salePrice.message}
										</Text>
									)}
								</Box>
							</HStack>

							{/* Quantity */}
							<div>
								<Text mb={2} fontWeight="medium">
									Stock Quantity
								</Text>
								<Input
									{...register("quantity", {
										min: {
											value: 0,
											message:
												"Quantity must be positive",
										},
									})}
									type="number"
									placeholder="0"
								/>
								{errors.quantity && (
									<Text color="red.500" fontSize="sm" mt={1}>
										{errors.quantity.message}
									</Text>
								)}
							</div>

							{/* Weight */}
							<div>
								<Text mb={2} fontWeight="medium">
									Weight (in grams)
								</Text>
								<Input
									{...register("weight", {
										min: {
											value: 0,
											message: "Weight must be positive",
										},
									})}
									type="number"
									placeholder="100"
								/>
								{errors.weight && (
									<Text color="red.500" fontSize="sm" mt={1}>
										{errors.weight.message}
									</Text>
								)}
							</div>

							{/* Image URL */}
							<div>
								<Text mb={2} fontWeight="medium">
									Image URL
								</Text>
								<Input
									{...register("image")}
									type="url"
									placeholder="https://example.com/image.jpg"
								/>
							</div>

							{/* Published Status */}
							<HStack justify="space-between" align="center">
								<Text fontWeight="medium">Published</Text>
								<Switch
									key={`published-${product?._id || "new"}-${publishedValue}`}
									initialValue={publishedValue}
									onChange={(value) =>
										setValue("published", value)
									}
								/>
							</HStack>
						</VStack>
					</ModalBody>

					<ModalFooter gap={3}>
						<Button variant="ghost" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="primary"
							loading={isLoading}
							disabled={isLoading}
						>
							{product ? "Update" : "Create"} Product
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};
