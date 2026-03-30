import {
	Badge,
	Box,
	Button,
	Flex,
	Icon,
	IconButton,
	SimpleGrid,
	Skeleton,
	Text,
	useToast,
} from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiUserPlus } from "react-icons/fi";
import { OtpModal } from "../../components/OtpModal";
import { StepHeader } from "../../components/StepHeader";
import { ANIMATION, OTP_MODAL_TITLES } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { Recipient, transformRecipientList } from "../../context/types";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface RecipientsStepProps {
	mobile: string;
}

/**
 * Shows all registered recipients in a responsive card grid format.
 * Gated selection for legacy recipients handles OTP verification inline.
 * @param {object} root0 - Component props
 * @param {string} root0.mobile - User's mobile number for API calls
 * @returns {JSX.Element} Recipients list with add/delete actions and inline OTP verification
 */
export const RecipientsStep = ({
	mobile,
}: RecipientsStepProps): JSX.Element => {
	const { state, dispatch } = useDigiKhata();
	const {
		getRecipients,
		isGettingRecipients,
		sendAddRecipientOtp,
		isSendingAddRecipientOtp,
		addRecipient,
		isAddingRecipient,
	} = useDigiKhataApi(mobile);

	const toast = useToast();

	const [isOtpOpen, setIsOtpOpen] = useState(false);
	const [pendingRecipient, setPendingRecipient] = useState<Recipient | null>(
		null
	);

	useEffect(() => {
		const load = async () => {
			const res = await getRecipients();
			if (res?.data?.status === 0) {
				const list: Recipient[] = transformRecipientList(
					res.data.data ?? { recipient_list: [] }
				);
				dispatch({ type: "SET_RECIPIENTS", payload: list });
				if (list.length === 0) {
					dispatch({ type: "SET_STEP", step: "add-recipient" });
				}
			} else {
				toast({
					title: res?.data?.message ?? "Failed to load recipients",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		};
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSendOtpForRecipient = async (recipient: Recipient) => {
		const res = await sendAddRecipientOtp({
			account: recipient.accountNumber,
			ifsc: recipient.ifsc,
			recipient_name: recipient.name,
			recipient_mobile: recipient.mobile || "",
			bank: recipient.bankName,
			bank_code: recipient.bankName, // Pass as fallback
		});

		if (res?.data?.status === 0) {
			setIsOtpOpen(true);
		} else {
			toast({
				title: res?.data?.message ?? "Failed to initiate verification",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
		return res;
	};

	const handleTransferClick = async (recipient: Recipient) => {
		// Valid beneficiary_id -> allow transfer navigation
		if (recipient.beneficiary_id && recipient.beneficiary_id !== 0) {
			dispatch({ type: "SET_SELECTED_RECIPIENT", payload: recipient });
			dispatch({ type: "SET_STEP", step: "fund-transfer" });
			return;
		}

		// Null/0 beneficiary_id -> trigger OTP re-registration
		setPendingRecipient(recipient);
		await handleSendOtpForRecipient(recipient);
	};

	const handleOtpSubmit = async (otp: string) => {
		if (!pendingRecipient) return;

		const res = await addRecipient({
			account: pendingRecipient.accountNumber,
			ifsc: pendingRecipient.ifsc,
			recipient_name: pendingRecipient.name,
			recipient_mobile: pendingRecipient.mobile || "",
			bank: pendingRecipient.bankName,
			bank_code: pendingRecipient.bankName,
			otp,
		});

		if (res?.data?.status === 0) {
			const beneficiaryId = res.data.data?.beneficiary_id;
			if (beneficiaryId) {
				// Update global context so the recipient is fixed
				dispatch({
					type: "UPDATE_RECIPIENT_BENEFICIARY",
					payload: {
						recipient_id: pendingRecipient.recipient_id,
						beneficiary_id: beneficiaryId,
					},
				});

				// Set selected and move forward
				const updatedRecipient = {
					...pendingRecipient,
					beneficiary_id: beneficiaryId,
				};
				dispatch({
					type: "SET_SELECTED_RECIPIENT",
					payload: updatedRecipient,
				});
				setIsOtpOpen(false);
				dispatch({ type: "SET_STEP", step: "fund-transfer" });
			} else {
				toast({
					title: "Failed to fetch updated beneficiary details",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		} else {
			toast({
				title: res?.data?.message ?? "Verification failed",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
		return res;
	};

	return (
		<>
			<Flex
				direction="column"
				gap={8}
				px={2}
				sx={{
					animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
					animationDelay: ANIMATION.STEP_IN_DELAY,
				}}
			>
				{/* Header Section */}
				<StepHeader
					title="Registered Beneficiaries"
					subtitle="Manage your recipients and initiate transfers"
					onBack={() =>
						dispatch({ type: "SET_STEP", step: "wallet-dashboard" })
					}
					toolComponent={
						<Button
							bg="primary.dark"
							color="white"
							leftIcon={<Icon as={FiUserPlus} />}
							h="48px"
							px={8}
							borderRadius="10px"
							shadow="0 4px 14px 0 rgba(26, 43, 136, 0.39)"
							onClick={() =>
								dispatch({
									type: "SET_STEP",
									step: "add-recipient",
								})
							}
							_hover={{
								bg: "primary.DEFAULT",
								transform: "translateY(-1px)",
							}}
							transition="all 0.2s"
							fontSize="md"
						>
							Add New Recipient
						</Button>
					}
				/>

				{/* Cards Grid */}
				{isGettingRecipients ? (
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
						{[1, 2, 3].map((i) => (
							<Flex
								key={i}
								direction="column"
								gap={5}
								p={7}
								bg="white"
								borderRadius="10px"
								border="1px solid"
								borderColor="gray.100"
							>
								<Flex gap={4} align="center">
									<Skeleton
										h="44px"
										w="44px"
										borderRadius="12px"
									/>
									<Box flex={1}>
										<Skeleton
											h="16px"
											w="60%"
											mb={2}
											borderRadius="4px"
										/>
										<Skeleton
											h="12px"
											w="40%"
											borderRadius="4px"
										/>
									</Box>
									<Skeleton
										h="20px"
										w="60px"
										borderRadius="full"
									/>
								</Flex>
								<Skeleton h="1px" w="100%" my={1} />
								<Flex justify="space-between">
									<Skeleton
										h="14px"
										w="30%"
										borderRadius="4px"
									/>
									<Skeleton
										h="14px"
										w="40%"
										borderRadius="4px"
									/>
								</Flex>
								<Flex justify="space-between">
									<Skeleton
										h="14px"
										w="30%"
										borderRadius="4px"
									/>
									<Skeleton
										h="14px"
										w="40%"
										borderRadius="4px"
									/>
								</Flex>
								<Flex gap={3} mt={2}>
									<Skeleton
										h="44px"
										flex={1}
										borderRadius="10px"
									/>
									<Skeleton
										h="44px"
										w="44px"
										borderRadius="10px"
									/>
								</Flex>
							</Flex>
						))}
					</SimpleGrid>
				) : (
					<SimpleGrid
						columns={{ base: 1, md: 2 }}
						spacing={6}
						pb={10}
					>
						{state.recipients.map((r) => {
							const isDoingOtp =
								isSendingAddRecipientOtp &&
								pendingRecipient?.recipient_id ===
									r.recipient_id;

							return (
								<Flex
									key={r.recipient_id}
									direction="column"
									p={7}
									bg="white"
									borderRadius="10px"
									boxShadow="0 4px 20px -4px rgba(0,0,0,0.05)"
									border="1px solid"
									borderColor="gray.100"
									position="relative"
									transition="all 0.2s"
									_hover={{
										boxShadow:
											"0 8px 30px -4px rgba(0,0,0,0.08)",
									}}
								>
									{/* Top Row: Icon + Names + Badge */}
									<Flex
										justify="space-between"
										align="center"
										mb={6}
									>
										<Flex align="center" gap={4}>
											<Flex
												align="center"
												justify="center"
												bg="#EEF2FF"
												w="48px"
												h="48px"
												borderRadius="12px"
											>
												<Text fontSize="2xl">🏦</Text>
											</Flex>
											<Box>
												<Text
													fontWeight="bold"
													color="gray.800"
													fontSize="lg"
													lineHeight="1.2"
												>
													{r.name}
												</Text>
												<Text
													fontSize="xs"
													color="gray.500"
													mt={0.5}
												>
													{r.bankName}
												</Text>
											</Box>
										</Flex>
										<Badge
											bg="#E6FFFA"
											color="#319795"
											borderRadius="full"
											px={3}
											py={1}
											textTransform="uppercase"
											fontSize="10px"
											fontWeight="bold"
											letterSpacing="wider"
										>
											{r.accountType
												?.toLowerCase()
												.includes("current")
												? "CURRENT"
												: "SAVINGS"}
										</Badge>
									</Flex>

									<Flex
										justify="space-between"
										align="center"
										mb={3}
									>
										<Text
											fontSize="xs"
											fontWeight="medium"
											color="gray.400"
										>
											Account Number
										</Text>
										<Text
											fontSize="xs"
											fontWeight="semibold"
											color="gray.700"
											letterSpacing="wider"
										>
											XXXX XXXX{" "}
											{r.accountNumber.slice(-4) ||
												"????"}
										</Text>
									</Flex>

									<Flex
										justify="space-between"
										align="center"
										mb={6}
									>
										<Text
											fontSize="xs"
											fontWeight="medium"
											color="gray.400"
										>
											IFSC Code
										</Text>
										<Text
											fontSize="xs"
											fontWeight="semibold"
											color="gray.700"
										>
											{r.ifsc}
										</Text>
									</Flex>

									<Flex gap={3} mt="auto">
										<Button
											flex={1}
											bg="#F3F5FF"
											color="primary.dark"
											h="44px"
											fontSize="sm"
											fontWeight="bold"
											borderRadius="10px"
											onClick={() =>
												handleTransferClick(r)
											}
											isLoading={isDoingOtp}
											loadingText="Verifying..."
											_hover={{ bg: "#EBF1FF" }}
										>
											Transfer Fund
										</Button>
										<IconButton
											aria-label="Delete Recipient"
											icon={<Icon as={FiTrash2} />}
											variant="ghost"
											bg="gray.50"
											color="gray.400"
											h="44px"
											w="44px"
											borderRadius="10px"
											_hover={{
												bg: "red.50",
												color: "red.400",
											}}
										/>
									</Flex>
								</Flex>
							);
						})}

						{/* Add New Contact Card */}
						<Flex
							direction="column"
							p={7}
							bg="gray.25"
							borderRadius="16px"
							border="2px dashed"
							borderColor="gray.200"
							align="center"
							justify="center"
							cursor="pointer"
							onClick={() =>
								dispatch({
									type: "SET_STEP",
									step: "add-recipient",
								})
							}
							_hover={{
								bg: "white",
								borderColor: "primary.DEFAULT",
								boxShadow: "sm",
							}}
							transition="all 0.2s"
							minH="220px"
						>
							<Flex
								align="center"
								justify="center"
								bg="gray.50"
								w="48px"
								h="48px"
								borderRadius="full"
								color="gray.300"
								mb={4}
							>
								<Icon as={FiPlus} boxSize={6} />
							</Flex>
							<Text
								fontWeight="bold"
								color="gray.700"
								fontSize="md"
							>
								Add New Contact
							</Text>
							<Text
								fontSize="xs"
								color="gray.400"
								textAlign="center"
								mt={2}
								lineHeight="tall"
							>
								Securely save accounts
								<br />
								for faster future transfers
							</Text>
						</Flex>
					</SimpleGrid>
				)}
			</Flex>

			{pendingRecipient && (
				<OtpModal
					isOpen={isOtpOpen}
					onClose={() => setIsOtpOpen(false)}
					onSubmit={handleOtpSubmit}
					onResend={() => handleSendOtpForRecipient(pendingRecipient)}
					isLoading={isAddingRecipient}
					title={
						OTP_MODAL_TITLES?.ADD_RECIPIENT || "Verify Recipient"
					}
					mobileHint={`XXXXXX${mobile.slice(-4)}`}
				/>
			)}
		</>
	);
};
