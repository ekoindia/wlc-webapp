import {
	Box,
	Checkbox,
	Flex,
	FormControl,
	Heading,
	HStack,
	Radio,
	Text,
} from "@chakra-ui/react";
import { ActionButtonGroup, Button } from "components";

import Input from "components/Input/Input";
import { PageTitle } from "components/PageTitle";
import { useContext, useEffect, useState } from "react";
import { BbpsContext } from "./context/BbpsContext";
import { useBbpsNavigation } from "./hooks/useBbpsNavigation";

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
	}, [billFetchResult, dispatch, selectedBills.length]);

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
	 * @param {string} value - The input value
	 */
	const handleAmountChange = (billId: string, value: string): void => {
		const amount = parseFloat(value);
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
	 * Parse bill label to extract bill number and due date
	 * @param {string} label - The bill label
	 * @returns {object} Object with billNumber and dueDate
	 */
	const parseBillLabel = (
		label: string
	): { billNumber: string; dueDate: string } => {
		const parts = label.split(" - ");
		return {
			billNumber: parts[0] || label,
			dueDate: parts[1] || "N/A",
		};
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
		<Flex direction="column" gap={4}>
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
					const { billNumber, dueDate } = parseBillLabel(bill.label);

					return (
						<Box
							key={bill.billid}
							p={4}
							borderWidth="1px"
							borderRadius="lg"
							borderColor={
								isSelected ? "primary.500" : "gray.200"
							}
							bg={isSelected ? "blue.50" : "white"}
							transition="all 0.2s"
						>
							<Flex direction="column" w="100%">
								{/* Bill Header with Selection Control */}
								<Flex
									justify="space-between"
									align="center"
									mb={2}
								>
									<HStack>
										{selectionMode === "single" ? (
											<Radio
												isChecked={isSelected}
												onChange={(e) =>
													handleBillSelection(
														bill.billid,
														e.target.checked
													)
												}
												colorScheme="primary"
											/>
										) : (
											<Checkbox
												isChecked={isSelected}
												onChange={(e) =>
													handleBillSelection(
														bill.billid,
														e.target.checked
													)
												}
												isDisabled={
													selectionMode ===
													"multiMandatory"
												}
												colorScheme="primary"
											/>
										)}
										<Text
											fontWeight="semibold"
											fontSize="lg"
										>
											{billNumber}
										</Text>
									</HStack>
									<Text fontWeight="bold" fontSize="lg">
										{formatCurrency(bill.amount)}
									</Text>
								</Flex>

								{/* Bill Details */}
								<Flex
									justify="space-between"
									ml={6}
									mb={isSelected ? 4 : 0}
								>
									<Box>
										<Text fontSize="sm" color="gray.600">
											Bill Number
										</Text>
										<Text>{billNumber}</Text>
									</Box>
									<Box>
										<Text fontSize="sm" color="gray.600">
											Due Date
										</Text>
										<Text>{dueDate}</Text>
									</Box>
								</Flex>

								{/* Amount Rules and Input (only shown when selected) */}
								{isSelected && (
									<Box ml={6} mt={2}>
										{/* Amount Range */}
										{bill.amountRules.min !== undefined &&
											bill.amountRules.max !==
												undefined && (
												<Text
													fontSize="sm"
													bg="blue.50"
													color="blue.700"
													py={1}
													px={2}
													borderRadius="md"
													mb={2}
												>
													Amount range:{" "}
													{formatCurrency(
														bill.amountRules.min
													)}{" "}
													-{" "}
													{formatCurrency(
														bill.amountRules.max
													)}
												</Text>
											)}

										{/* Amount Multiple */}
										{bill.amountRules.multiple !==
											undefined && (
											<Text
												fontSize="sm"
												bg="orange.50"
												color="orange.700"
												py={1}
												px={2}
												borderRadius="md"
												mb={2}
											>
												Amount must be a multiple of{" "}
												{formatCurrency(
													bill.amountRules.multiple
												)}
											</Text>
										)}

										{/* Payment Amount Input */}
										<FormControl
											mt={3}
											isInvalid={
												!!amountErrors[bill.billid]
											}
										>
											<Text mb={1} fontSize="sm">
												Payment Amount
											</Text>
											<Input
												placeholder="Enter amount"
												defaultValue={bill.amount.toString()}
												onChange={(e) =>
													handleAmountChange(
														bill.billid,
														e.target.value
													)
												}
												inputLeftElement={
													<Text>₹</Text>
												}
												errorMsg={
													amountErrors[bill.billid]
												}
												invalid={
													!!amountErrors[bill.billid]
												}
											/>
										</FormControl>
									</Box>
								)}
							</Flex>
						</Box>
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
		</Flex>
	);
};
