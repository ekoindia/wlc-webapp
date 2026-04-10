import {
	Box,
	Button,
	Flex,
	SimpleGrid,
	Skeleton,
	Text,
	useToast,
} from "@chakra-ui/react";
import { IcoButton, Icon } from "components";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useEffect, useState } from "react";
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
		sendDeleteRecipientOtp,
		isSendingDeleteRecipientOtp,
		verifyDeleteRecipientOtp,
		isVerifyingDeleteRecipientOtp,
		sendRecipientBankOtp,
		isSendingRecipientBankOtp,
		verifySenderBankOtp,
		isVerifyingSenderBankOtp,
	} = useDigiKhataApi(mobile);

	const toast = useToast();

	const [isOtpOpen, setIsOtpOpen] = useState(false);
	const [pendingRecipient, setPendingRecipient] = useState<Recipient | null>(
		null
	);
	const [otpRefId, setOtpRefId] = useState<string>("");
	const [deleteOtpOpen, setDeleteOtpOpen] = useState(false);
	const [deleteOtpRefId, setDeleteOtpRefId] = useState<string>("");
	const [pendingDeleteRecipient, setPendingDeleteRecipient] =
		useState<Recipient | null>(null);

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
		const res = await sendRecipientBankOtp({
			account: recipient.accountNumber,
			ifsc: recipient.ifsc,
			recipient_name: recipient.name,
			recipient_mobile: recipient.mobile || "",
			bank: recipient.bankName,
			bank_code: recipient.bankName, // Pass as fallback
			recipient_id: recipient.recipient_id,
		});

		if (res?.data?.status === 0) {
			setOtpRefId(res.data.data?.otp_ref_id ?? "");
			setIsOtpOpen(true);
		} else {
			toast({
				title: res?.data?.message ?? "Failed to initiate verification",
				description: res?.data?.data?.description ?? "",
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

	const handleDeleteRecipient = async (recipient: Recipient) => {
		const res = await sendDeleteRecipientOtp(recipient.beneficiary_id ?? 0);
		if (res?.data?.status === 0) {
			setDeleteOtpRefId(res.data.data?.otp_ref_id ?? "");
			setPendingDeleteRecipient(recipient);
			setDeleteOtpOpen(true);
		} else {
			toast({
				title: res?.data?.message ?? "Failed to initiate deletion",
				description: res?.data?.data?.description ?? "",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
	};

	const handleDeleteOtpSubmit = async (otp: string) => {
		if (!pendingDeleteRecipient) return;

		const res = await verifyDeleteRecipientOtp({
			otp,
			otp_ref_id: deleteOtpRefId,
			recipient_id: pendingDeleteRecipient.recipient_id,
		});

		if (res?.data?.status === 0) {
			setDeleteOtpOpen(false);
			dispatch({
				type: "REMOVE_RECIPIENT",
				payload: pendingDeleteRecipient.recipient_id,
			});
			toast({
				title: "Recipient deleted successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			setPendingDeleteRecipient(null);
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

	const handleOtpSubmit = async (otp: string) => {
		if (!pendingRecipient) return;

		const res = await verifySenderBankOtp({
			otp,
			otp_ref_id: otpRefId,
		});

		if (res?.data?.status === 0) {
			setIsOtpOpen(false);
			toast({
				title: "Recipient verified successfully!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			dispatch({ type: "SET_STEP", step: "wallet-dashboard" });
			// const beneficiaryId = res.data.data?.beneficiary_id;
			// if (beneficiaryId) {
			// 	// Update global context so the recipient is fixed
			// 	dispatch({
			// 		type: "UPDATE_RECIPIENT_BENEFICIARY",
			// 		payload: {
			// 			recipient_id: pendingRecipient.recipient_id,
			// 			beneficiary_id: beneficiaryId,
			// 		},
			// 	});

			// 	// Set selected and move forward
			// 	const updatedRecipient = {
			// 		...pendingRecipient,
			// 		beneficiary_id: beneficiaryId,
			// 	};
			// 	dispatch({
			// 		type: "SET_SELECTED_RECIPIENT",
			// 		payload: updatedRecipient,
			// 	});
			// 	setIsOtpOpen(false);
			// 	dispatch({ type: "SET_STEP", step: "fund-transfer" });
			// } else {
			// 	toast({
			// 		title: "Failed to fetch updated beneficiary details",
			// 		status: "error",
			// 		duration: 4000,
			// 		isClosable: true,
			// 	});
			// }
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
							bg="primary.DEFAULT"
							color="white"
							leftIcon={<Icon name="person-add" size="sm" />}
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
								bg: "primary.dark",
								transform: "translateY(-1px)",
							}}
							transition="all 0.2s"
							fontSize="md"
						>
							Add New Recipient
						</Button>
					}
				/>

				{/* Info Note */}
				<Flex
					align="center"
					gap={4}
					px={4}
					py={3}
					bg="blue.50"
					borderRadius="10px"
					border="1px solid"
					borderColor="blue.100"
				>
					<Icon
						name="info-outline"
						size="md"
						color="blue.400"
						flexShrink={0}
					/>
					<Box>
						<Text fontSize="xs" color="blue.700" lineHeight="tall">
							You can add up to{" "}
							<Text as="span" fontWeight="bold">
								5 beneficiaries per day
							</Text>
							.
						</Text>
						<Text fontSize="xs" color="blue.700" lineHeight="tall">
							A maximum of{" "}
							<Text as="span" fontWeight="bold">
								25 beneficiaries
							</Text>{" "}
							can be added in total.
						</Text>
					</Box>
				</Flex>

				{/* Cards Grid */}
				{isGettingRecipients ? (
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
						{[1, 2].map((i) => (
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
									{/* <Skeleton
										h="44px"
										w="44px"
										borderRadius="10px"
									/> */}
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
								isSendingRecipientBankOtp &&
								pendingRecipient?.recipient_id ===
									r.recipient_id;
							const isDeleting =
								isSendingDeleteRecipientOtp &&
								pendingDeleteRecipient?.recipient_id ===
									r.recipient_id;

							return (
								<Flex
									key={r.recipient_id}
									direction="column"
									p={7}
									gap="6"
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
												<Icon name="account-balance" />
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
										{/* <Badge
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
										</Badge> */}
									</Flex>

									<Flex direction="column" gap={3}>
										<Flex
											justify="space-between"
											align="center"
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
										{r.beneficiary_id !== null ? (
											<IcoButton
												iconName="delete"
												theme="ghost"
												size="44px"
												iconSize="md"
												bg="#F3F5FF"
												color="primary.dark"
												rounded="10px"
												title="Delete Recipient"
												onClick={() =>
													handleDeleteRecipient(r)
												}
												isLoading={isDeleting}
												_hover={{
													bg: "#FFF0F3",
													color: "error",
												}}
												transition="all 0.2s"
											/>
										) : null}
									</Flex>
								</Flex>
							);
						})}

						{/* Add New Contact Card */}
						<Flex
							direction="column"
							p={7}
							bg="gray.25"
							borderRadius="10px"
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
								<Icon name="add" size="sm" />
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
					isLoading={isVerifyingSenderBankOtp}
					title={
						OTP_MODAL_TITLES?.ADD_RECIPIENT || "Verify Recipient"
					}
					mobileHint={`XXXXXX${mobile.slice(-4)}`}
				/>
			)}

			{pendingDeleteRecipient && (
				<OtpModal
					isOpen={deleteOtpOpen}
					onClose={() => setDeleteOtpOpen(false)}
					onSubmit={handleDeleteOtpSubmit}
					onResend={() =>
						sendDeleteRecipientOtp(
							pendingDeleteRecipient.beneficiary_id ?? 0
						)
					}
					isLoading={isVerifyingDeleteRecipientOtp}
					title={OTP_MODAL_TITLES.DELETE_RECIPIENT}
					mobileHint={`XXXXXX${mobile.slice(-4)}`}
				/>
			)}
		</>
	);
};
