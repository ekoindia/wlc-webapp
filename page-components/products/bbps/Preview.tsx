import {
	Box,
	Checkbox,
	Flex,
	Grid,
	GridItem,
	Heading,
	HStack,
	Radio,
	Text,
	VStack,
} from "@chakra-ui/react";
import { ActionButtonGroup, Button, Input, PageTitle } from "components";
import { useContext, useEffect, useState } from "react";
import { BbpsContext } from "./context/BbpsContext";
import { useBbpsNavigation } from "./hooks/useBbpsNavigation";

interface Bill {
	billid: string;
	label: string;
	amount: number;
	customerName: string;
	billDate: string;
	billDueDate: string;
	billNumber: string;
	dueDateTag?: {
		text: string;
		color: string;
	} | null;
	amountRules: {
		min?: number;
		max?: number;
		multiple?: number;
	};
}

interface BillCardProps {
	bill: Bill;
	isSelected: boolean;
	selectionMode: string;
	onSelect: (_billId: string) => void;
	onAmountChange: (_billId: string, _amount: number) => void;
	amountError?: string;
	formatCurrency: (_amount: number) => string;
}

/**
 * BillCard component for displaying individual bill information
 * @param {BillCardProps} props - The component props
 * @returns {JSX.Element} BillCard component
 */
const BillCard = ({
	bill,
	isSelected,
	selectionMode,
	onSelect,
	onAmountChange,
	amountError,
	formatCurrency,
}: BillCardProps): JSX.Element => {
	const [paymentOption, setPaymentOption] = useState<
		"full" | "minimum" | "partial"
	>("full");
	const [customAmount, setCustomAmount] = useState<string>("");

	const billNumber = bill.billNumber;

	/**
	 * Handle payment option change
	 * @param {string} option - The selected payment option
	 */
	const handlePaymentOptionChange = (
		option: "full" | "minimum" | "partial"
	): void => {
		setPaymentOption(option);

		let amount = bill.amount;
		if (option === "minimum" && bill.amountRules.min) {
			amount = bill.amountRules.min;
		} else if (option === "partial") {
			// Pre-fill with total bill amount
			const billAmountStr = bill.amount.toString();
			setCustomAmount(billAmountStr);
			amount = bill.amount;
		}

		onAmountChange(bill.billid, amount);
	};

	/**
	 * Handle custom amount input change
	 * @param {string} value - The input value
	 */
	const handleCustomAmountChange = (value: string): void => {
		setCustomAmount(value);
		const amount = parseFloat(value) || 0;
		onAmountChange(bill.billid, amount);
	};

	/**
	 * Get current payment amount based on selected option
	 * @returns {number} The current payment amount
	 */
	const getCurrentPaymentAmount = (): number => {
		switch (paymentOption) {
			case "minimum":
				return bill.amountRules.min || bill.amount;
			case "partial":
				return parseFloat(customAmount) || 0;
			default:
				return bill.amount;
		}
	};

	/**
	 * Get amount constraints text
	 * @returns {string} The constraints text
	 */
	const getAmountConstraints = (): string => {
		const { min, max, multiple } = bill.amountRules;
		let constraints = [];

		if (min !== undefined && max !== undefined) {
			constraints.push(
				`₹${min.toLocaleString()} - ₹${max.toLocaleString()}`
			);
		}
		if (multiple !== undefined) {
			constraints.push(`multiples of ₹${multiple.toLocaleString()}`);
		}

		return constraints.length > 0
			? `Amount range: ${constraints.join(" (")}${multiple ? ")" : ""}`
			: "";
	};

	return (
		<Grid
			templateColumns={{
				base: "1fr",
				lg: isSelected ? "1fr 400px" : "1fr",
			}}
			gap={0}
			bg="white"
			borderRadius="xl"
			borderWidth="2px"
			borderColor={isSelected ? "blue.500" : "gray.200"}
			boxShadow={isSelected ? "lg" : "sm"}
			transition="all 0.2s"
			overflow="hidden"
			_hover={{
				borderColor: isSelected ? "blue.500" : "gray.300",
				boxShadow: isSelected ? "lg" : "md",
			}}
		>
			{/* Main Bill Card Content */}
			<GridItem>
				<Box p={{ base: 4, md: 6 }}>
					{/* Header Section */}
					<Flex
						direction={{ base: "column", sm: "row" }}
						justify="space-between"
						align={{ base: "stretch", sm: "flex-start" }}
						mb={4}
						gap={3}
					>
						<HStack spacing={3} flex="1" minW="0">
							{selectionMode === "single" ? (
								<Radio
									isChecked={isSelected}
									onChange={() => onSelect(bill.billid)}
									colorScheme="blue"
									size="lg"
								/>
							) : (
								<Checkbox
									isChecked={isSelected}
									onChange={() => onSelect(bill.billid)}
									isDisabled={
										selectionMode === "multiMandatory"
									}
									colorScheme="blue"
									size="lg"
								/>
							)}
							<VStack
								align="flex-start"
								spacing={0}
								minW="0"
								flex="1"
							>
								<HStack spacing={2} minW="0">
									<Text
										fontSize="sm"
										color="blue.600"
										fontWeight="medium"
									>
										📄
									</Text>
									<Text
										fontWeight="semibold"
										fontSize={{ base: "sm", md: "md" }}
										color="gray.900"
										isTruncated
										maxW="200px"
									>
										{bill.billid}
									</Text>
								</HStack>
								<Text fontSize="xs" color="gray.500">
									Bill ID
								</Text>
							</VStack>
						</HStack>

						{/* Amount Display - Always on Far Right */}
						<VStack
							align={{ base: "flex-start", sm: "flex-end" }}
							spacing={1}
							minW={{ base: "auto", sm: "120px" }}
							flexShrink={0}
						>
							<Text
								fontSize={{ base: "lg", md: "xl" }}
								fontWeight="bold"
								color="gray.900"
								textAlign={{ base: "left", sm: "right" }}
							>
								{formatCurrency(bill.amount)}
							</Text>
							<Text
								fontSize="xs"
								color="gray.500"
								textAlign={{ base: "left", sm: "right" }}
							>
								Total Amount
							</Text>
							{/* Due Date Tag */}
							{bill.dueDateTag && (
								<Box
									bg={
										bill.dueDateTag.color === "red"
											? "red.500"
											: "orange.400"
									}
									color="white"
									px={2}
									py={1}
									borderRadius="md"
									fontSize="xs"
									fontWeight="bold"
									mt={1}
									alignSelf={{
										base: "flex-start",
										sm: "flex-end",
									}}
								>
									{bill.dueDateTag.text}
								</Box>
							)}
						</VStack>
					</Flex>

					{/* Bill Details */}
					<VStack spacing={2} align="stretch">
						<HStack spacing={2}>
							<Text fontSize="sm" color="gray.400">
								👤
							</Text>
							<Text
								fontWeight="medium"
								fontSize="sm"
								color="gray.700"
							>
								{bill.customerName || billNumber}
							</Text>
						</HStack>

						<Grid
							templateColumns={{ base: "1fr", sm: "1fr 1fr" }}
							gap={2}
						>
							<HStack spacing={2}>
								<Text fontSize="sm" color="red.500">
									📅
								</Text>
								<Text fontSize="sm" color="gray.700">
									<Text as="span" fontWeight="medium">
										Due:
									</Text>{" "}
									{bill.billDueDate}
								</Text>
							</HStack>
							<HStack spacing={2}>
								<Text fontSize="sm" color="gray.400">
									🕒
								</Text>
								<Text fontSize="sm" color="gray.700">
									<Text as="span" fontWeight="medium">
										Bill:
									</Text>{" "}
									{bill.billDate}
								</Text>
							</HStack>
						</Grid>
					</VStack>
				</Box>
			</GridItem>

			{/* Right Side - Payment Options (Desktop) / Bottom (Mobile) */}
			{isSelected && (
				<GridItem>
					<Box
						borderLeftWidth={{ base: "0", lg: "1px" }}
						borderTopWidth={{ base: "1px", lg: "0" }}
						borderColor="gray.200"
						bg="gray.50"
						h="100%"
					>
						{/* Payment Options Header */}
						<Box
							px={{ base: 4, md: 6 }}
							py={3}
							borderBottomWidth="1px"
							borderColor="gray.200"
						>
							<HStack spacing={2}>
								<Text fontSize="sm" color="blue.600">
									💳
								</Text>
								<Text
									fontWeight="semibold"
									color="gray.900"
									fontSize="sm"
								>
									Payment Options
								</Text>
							</HStack>
						</Box>

						{/* Payment Options Content */}
						<Box px={{ base: 4, md: 6 }} py={4}>
							<VStack spacing={3} align="stretch">
								{/* Full Amount Option */}
								<Box
									as="label"
									p={3}
									bg="white"
									borderRadius="lg"
									borderWidth="1px"
									borderColor={
										paymentOption === "full"
											? "blue.500"
											: "gray.200"
									}
									cursor="pointer"
									transition="all 0.2s"
									_hover={{ borderColor: "blue.300" }}
								>
									<HStack justify="space-between">
										<HStack>
											<Radio
												name={`payment-option-${bill.billid}`}
												isChecked={
													paymentOption === "full"
												}
												onChange={() =>
													handlePaymentOptionChange(
														"full"
													)
												}
												colorScheme="blue"
											/>
											<Text
												fontWeight="medium"
												fontSize="sm"
												color="gray.900"
											>
												Full Amount
											</Text>
										</HStack>
										<Text
											fontSize="sm"
											color="gray.600"
											fontWeight="medium"
										>
											{formatCurrency(bill.amount)}
										</Text>
									</HStack>
								</Box>

								{/* Minimum Amount Option */}
								{bill.amountRules.min && (
									<Box
										as="label"
										p={3}
										bg="white"
										borderRadius="lg"
										borderWidth="1px"
										borderColor={
											paymentOption === "minimum"
												? "blue.500"
												: "gray.200"
										}
										cursor="pointer"
										transition="all 0.2s"
										_hover={{ borderColor: "blue.300" }}
									>
										<HStack justify="space-between">
											<HStack>
												<Radio
													name={`payment-option-${bill.billid}`}
													isChecked={
														paymentOption ===
														"minimum"
													}
													onChange={() =>
														handlePaymentOptionChange(
															"minimum"
														)
													}
													colorScheme="blue"
												/>
												<Text
													fontWeight="medium"
													fontSize="sm"
													color="gray.900"
												>
													Minimum
												</Text>
											</HStack>
											<Text
												fontSize="sm"
												color="gray.600"
												fontWeight="medium"
											>
												{formatCurrency(
													bill.amountRules.min
												)}
											</Text>
										</HStack>
									</Box>
								)}

								{/* Custom Amount Option */}
								<Box
									p={3}
									bg="white"
									borderRadius="lg"
									borderWidth="1px"
									borderColor={
										paymentOption === "partial"
											? "blue.500"
											: "gray.200"
									}
									transition="all 0.2s"
								>
									<VStack align="stretch" spacing={3}>
										<Box as="label" cursor="pointer">
											<HStack justify="space-between">
												<HStack>
													<Radio
														name={`payment-option-${bill.billid}`}
														isChecked={
															paymentOption ===
															"partial"
														}
														onChange={() =>
															handlePaymentOptionChange(
																"partial"
															)
														}
														colorScheme="blue"
													/>
													<Text
														fontWeight="medium"
														fontSize="sm"
														color="gray.900"
													>
														Custom Amount
													</Text>
												</HStack>
												<Text
													fontSize="sm"
													color="gray.500"
												>
													Enter your amount
												</Text>
											</HStack>
										</Box>

										{/* Custom Amount Input */}
										{paymentOption === "partial" && (
											<VStack align="stretch" spacing={2}>
												<Input
													placeholder={bill.amount.toString()}
													value={customAmount}
													onChange={(e) =>
														handleCustomAmountChange(
															e.target.value
														)
													}
													inputLeftElement={
														<Text
															color="gray.500"
															fontWeight="medium"
														>
															₹
														</Text>
													}
													bg="gray.50"
													borderColor="gray.300"
													_focus={{
														borderColor: "blue.500",
														boxShadow:
															"0 0 0 1px blue.500",
													}}
													fontSize="sm"
												/>
												{/* Amount Constraints */}
												{getAmountConstraints() && (
													<Text
														fontSize="xs"
														color="gray.500"
													>
														{getAmountConstraints()}
													</Text>
												)}
												{amountError && (
													<Text
														fontSize="xs"
														color="red.500"
													>
														{amountError}
													</Text>
												)}
											</VStack>
										)}
									</VStack>
								</Box>

								{/* Selected Amount Confirmation - Only show for full and minimum options */}
								{paymentOption !== "partial" && (
									<Box
										bg="blue.50"
										borderWidth="1px"
										borderColor="blue.200"
										borderRadius="lg"
										p={3}
									>
										<HStack
											justify="space-between"
											align="center"
										>
											<HStack>
												<Text
													fontSize="sm"
													color="blue.600"
												>
													✓
												</Text>
												<Text
													fontSize="sm"
													fontWeight="medium"
													color="blue.800"
												>
													Selected Amount
												</Text>
											</HStack>
											<Text
												fontSize="sm"
												fontWeight="bold"
												color="blue.800"
											>
												{formatCurrency(
													getCurrentPaymentAmount()
												)}
											</Text>
										</HStack>
									</Box>
								)}
							</VStack>
						</Box>
					</Box>
				</GridItem>
			)}
		</Grid>
	);
};

/**
 * Preview component for BBPS bill selection and payment amount input
 * @returns {JSX.Element} Preview component
 */
export const Preview = (): JSX.Element => {
	const nav = useBbpsNavigation();
	const { state, dispatch } = useContext(BbpsContext);
	const { billFetchResult, selectedBills, totalAmount, useMockData } = state;

	// Initialize local state for amount errors
	const [amountErrors, setAmountErrors] = useState<Record<string, string>>(
		{}
	);

	// Initialize selected bills based on selection mode
	useEffect(() => {
		if (!billFetchResult) return;

		if (billFetchResult.selectionMode === "multiMandatory") {
			// For mandatory selection, select all bills automatically
			billFetchResult.bills.forEach((bill) => {
				if (
					!selectedBills.some(
						(selected) => selected.billid === bill.billid
					)
				) {
					dispatch({
						type: "TOGGLE_BILL_SELECTION",
						billid: bill.billid,
					});
				}
			});
		}
		// For other modes, don't auto-select - let user choose
	}, [billFetchResult, dispatch, selectedBills]);

	// Early return if no bill fetch result
	if (!billFetchResult) {
		return (
			<Box p={6} bg="white" borderRadius="10px" boxShadow="basic">
				<Heading size="md" mb={4}>
					No bills found
				</Heading>
				<Button onClick={nav.goSearch}>Back to Search</Button>
			</Box>
		);
	}

	const { bills, selectionMode } = billFetchResult;

	// Debug: Log the transformed bill data to verify end-to-end flow
	console.log("[BBPS Preview] Bill fetch result:", billFetchResult);
	console.log("[BBPS Preview] First bill data:", bills[0]);

	/**
	 * Handle bill selection change
	 * @param {string} billId - The bill ID
	 * @param {boolean} isChecked - Whether the bill is selected
	 */
	const handleBillSelection = (billId: string, isChecked: boolean): void => {
		// Don't allow deselection in mandatory mode
		if (selectionMode === "multiMandatory" && !isChecked) {
			return;
		}

		dispatch({
			type: "TOGGLE_BILL_SELECTION",
			billid: billId,
		});
	};

	/**
	 * Handle amount change for a bill
	 * @param {string} billId - The bill ID
	 * @param {number} amount - The amount value
	 */
	const handleAmountChange = (billId: string, amount: number): void => {
		const bill = bills.find((b) => b.billid === billId);

		if (!bill) return;

		// Validate amount based on rules
		let error = "";
		const { min, max, multiple } = bill.amountRules;

		if (isNaN(amount)) {
			error = "Please enter a valid amount";
		} else if (min !== undefined && amount < min) {
			error = `Amount must be at least ₹${min}`;
		} else if (max !== undefined && amount > max) {
			error = `Amount cannot exceed ₹${max}`;
		} else if (multiple !== undefined && amount % multiple !== 0) {
			error = `Amount must be a multiple of ₹${multiple}`;
		}

		// Update error state
		setAmountErrors({
			...amountErrors,
			[billId]: error,
		});

		// Update bill amount in context if valid
		if (!error) {
			dispatch({
				type: "UPDATE_BILL_AMOUNT",
				billid: billId,
				amount,
			});
		}
	};

	/**
	 * Check if a bill is selected
	 * @param {string} billId - The bill ID
	 * @returns {boolean} Whether the bill is selected
	 */
	const isBillSelected = (billId: string): boolean => {
		return selectedBills.some((bill) => bill.billid === billId);
	};

	/**
	 * Format currency for display
	 * @param {number} amount - The amount to format
	 * @returns {string} Formatted currency string
	 */
	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
			.format(amount)
			.replace(/^(\D+)/, "₹");
	};

	/**
	 * Calculate due date tag based on bill's due date
	 * @param {string} dueDate - The due date in DD/MM/YYYY format
	 * @returns {object|null} Due date tag object or null
	 */
	const calculateDueDateTag = (
		dueDate: string
	): { text: string; color: string } | null => {
		if (!dueDate || dueDate === "N/A") return null;

		try {
			// Parse DD/MM/YYYY format
			const [day, month, year] = dueDate.split("/").map(Number);
			const dueDateObj = new Date(year, month - 1, day);
			const today = new Date();

			// Reset time to compare dates only
			today.setHours(0, 0, 0, 0);
			dueDateObj.setHours(0, 0, 0, 0);

			const diffTime = dueDateObj.getTime() - today.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			if (diffDays < 0) {
				return { text: "Overdue", color: "red" };
			} else if (diffDays <= 7) {
				return {
					text: `Due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
					color: "orange",
				};
			}

			return null;
		} catch (error) {
			console.warn("Error parsing due date:", dueDate, error);
			return null;
		}
	};

	// Check if proceed button should be enabled
	const canProceed =
		selectedBills.length > 0 &&
		Object.values(amountErrors).every((error) => !error);

	/**
	 * Get selection title based on selection mode
	 * @returns {string} The title text
	 */
	const getSelectionSubtitle = (): string => {
		switch (selectionMode) {
			case "multiOptional":
				return "Select one or more bills to pay";
			case "multiMandatory":
				return "All bills must be paid";
			case "single":
				return "Select a bill to pay";
			default:
				return "Select bills to pay";
		}
	};

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Proceed to Payment",
			loading: false,
			disabled: !canProceed,
			onClick: nav.goPayment,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Back to Search",
			onClick: nav.goSearch,
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	return (
		<>
			<PageTitle
				title="Select Bills"
				subtitle={getSelectionSubtitle()}
				toolComponent={
					useMockData && (
						<Box
							px={2}
							py={1}
							bg="yellow.100"
							color="yellow.800"
							borderRadius="md"
							fontSize="sm"
							fontWeight="medium"
						>
							Mock Mode
						</Box>
					)
				}
			/>

			<Flex
				direction="column"
				gap={4}
				mx={{ base: "4", md: "0" }}
				mb={{ base: "128px", md: "64px" }}
			>
				{bills.map((bill) => {
					const isSelected = isBillSelected(bill.billid);

					const calculatedDueDateTag = calculateDueDateTag(
						bill.billDueDate || ""
					);
					const billWithCalculatedTag = {
						...bill,
						dueDateTag: calculatedDueDateTag,
					};

					return (
						<BillCard
							key={bill.billid}
							bill={billWithCalculatedTag}
							isSelected={isSelected}
							selectionMode={selectionMode}
							onSelect={(billId) =>
								handleBillSelection(billId, !isSelected)
							}
							onAmountChange={(billId, amount) =>
								handleAmountChange(billId, amount)
							}
							amountError={amountErrors[bill.billid]}
							formatCurrency={formatCurrency}
						/>
					);
				})}
				{/* Total Amount */}
				{selectedBills.length > 0 && (
					<Flex
						justify="space-between"
						p="4"
						bg="gray.50"
						borderRadius="md"
						fontWeight="bold"
						align="center"
					>
						<Text>Total Amount:</Text>
						<Text fontSize="lg">{formatCurrency(totalAmount)}</Text>
					</Flex>
				)}

				{/* Action Buttons */}
				<ActionButtonGroup
					buttonConfigList={buttonConfigList}
					bg="transparent"
				/>
			</Flex>
		</>
	);
};
