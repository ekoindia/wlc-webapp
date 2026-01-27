import { Circle, Flex, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "components";
import { rotateAntiClockwise } from "libs/chakraKeyframes";
import { useState } from "react";
import { formatCurrency } from "utils/numberFormat";

/**
 * Display the bank balance information, with refresh option.
 * @param {object} props - Component props
 * @param {string} props.label - Label for the bank account
 * @param {number} props.balance - Current balance of the bank account
 * @param {string} [props.account_number] - Bank account number
 * @param {string} [props.ifsc] - IFSC code of the bank account
 * @param {boolean} [props.loading] - Loading state for the balance
 * @param {Function} [props.onRefresh] - Function to refresh the bank balance
 * @param 	{...*}	rest - Rest of the props
 * @returns {JSX.Element} The BankBalance component
 */
export const BankBalance = ({
	label,
	balance,
	account_number,
	ifsc,
	loading,
	onRefresh,
	...rest
}) => {
	const [disabled, setDisabled] = useState(false);

	// Click handler for "Refresh" button with independent 30-second cooldown
	const onRefreshHandler = () => {
		if (!onRefresh) return;
		if (disabled) return;
		setDisabled(true);

		// fetching updated account balance
		onRefresh();

		// Added 30sec timer
		setTimeout(() => {
			setDisabled(false);
		}, 30000); // enable button after 30 sec
	};

	return (
		<Flex
			w={{ base: "100%", md: "400px" }}
			p="4"
			borderRadius="lg"
			// boxShadow="md"
			bg="white"
			align="center"
			justify="space-between"
			mb="2"
			gap="4"
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
			{...rest}
		>
			<Flex direction="row">
				<Flex direction="column" gap="1" justify="center">
					<Text fontSize="sm" color="gray.500" fontWeight="medium">
						{label}&nbsp;Balance
					</Text>
					<Flex
						direction="row"
						align="center"
						gap="0.25"
						color="gray.700"
					>
						<Icon
							name="rupee"
							size={{ base: "12px", "2xl": "14px" }}
							mr="0.2em"
						/>
						<Text
							fontSize="2xl"
							fontWeight="bold"
							letterSpacing="-0.02em"
						>
							{formatCurrency(balance, "INR", true, true)}
						</Text>
					</Flex>
				</Flex>
				<Flex
					direction="column"
					gap="1"
					ml="6"
					borderLeft="2px solid #eee"
					pl="6"
					justify="center"
				>
					{account_number ? (
						<Text fontSize="xs" color="gray.500">
							A/C: {account_number}
						</Text>
					) : null}

					{ifsc ? (
						<Text fontSize="xs" color="gray.500">
							IFSC: {ifsc}
						</Text>
					) : null}

					<Flex align="center" gap="2">
						<Text fontSize="xs" color="gray.400" mt="1">
							as of 12 Jun 2024, 10:30 AM
						</Text>
						<Tooltip
							label="Refresh"
							placement="top"
							isDisabled={loading}
						>
							<Circle
								size={{ base: "6", "2xl": "8" }}
								bg="white"
								onClick={onRefreshHandler}
								opacity={disabled || loading ? 0.3 : 1}
								cursor={
									disabled || loading
										? "not-allowed"
										: "pointer"
								}
								border="1px solid #EEE"
								shadow="lg"
							>
								<Icon
									name="refresh"
									size={{ base: "12px", "2xl": "16px" }}
									color="primary.dark" // ORIG_THEME: sidebar.card-bg-dark
									sx={
										loading
											? {
													animation: `${rotateAntiClockwise} 1s ease-in-out`,
												}
											: {}
									}
								/>
							</Circle>
						</Tooltip>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
