import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	Input,
	Link,
	NumberInput,
	NumberInputField,
	Text,
	useToast,
} from "@chakra-ui/react";
import { CopyButton, InputLabel } from "components";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useState } from "react";
import { Pintwin } from "tf-components/Pintwin";
import { StepHeader } from "../../components/StepHeader";
import { ANIMATION } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface LoadWalletStepProps {
	mobile: string;
	onFetchBalance: () => Promise<void>;
}

/**
 * Lets the agent load funds into their DigiKhata wallet.
 * Flow: Enter Amount + PIN → loadWallet → on 2447 calls onFetchBalance for OTP flow
 * → verifySenderOtp → hydrate wallet → back to dashboard.
 * @param {object} root0 - Component props
 * @param {string} root0.mobile - User's mobile number for API calls
 * @param {() => Promise<void>} root0.onFetchBalance - Callback to trigger balance refresh and OTP handling
 * @returns {JSX.Element} Wallet loading form with UPI and virtual account options
 */
export const LoadWalletStep = ({
	mobile,
	onFetchBalance,
}: LoadWalletStepProps): JSX.Element => {
	const { dispatch } = useDigiKhata();
	const { loadWallet, isLoadingWallet } = useDigiKhataApi(mobile);

	const toast = useToast();

	const [amount, setAmount] = useState("");
	const [encodedPin, setEncodedPin] = useState("");
	const [isPinComplete, setIsPinComplete] = useState(false);
	const upiVpa = `${mobile}@digikhata`;
	const virtualAccountNumber = `DIGIKTWT${mobile}`;
	const virtualAccountIfsc = "IDFB0040101";

	const handlePinComplete = (_pin: string, ep: string) => {
		setEncodedPin(ep);
		setIsPinComplete(true);
	};

	const handleLoadWallet = async () => {
		const numAmount = parseFloat(amount);
		if (isNaN(numAmount) || numAmount <= 0 || !isPinComplete) return;

		const res = await loadWallet({ amount: numAmount, pin: encodedPin });
		if (res?.data?.status === 0) {
			if (res?.data?.response_type_id === 2447) {
				// Trigger parent's balance fetch to handle OTP flow, to show the updated balance, and to navigate back to the dashboard
				await onFetchBalance();
			} else {
				toast({
					title: res?.data?.message ?? "Failed to load wallet",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		} else {
			toast({
				title: res?.data?.message ?? "Failed to load wallet",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
	};

	const canSubmit =
		isPinComplete && parseFloat(amount) > 0 && !isLoadingWallet;

	return (
		<>
			<Flex
				direction="column"
				gap={10}
				sx={{
					animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
					animationDelay: ANIMATION.STEP_IN_DELAY,
				}}
			>
				<StepHeader
					title="Load Wallet"
					subtitle="Choose how you want to add money to your DigiKhata wallet."
					onBack={() =>
						dispatch({ type: "SET_STEP", step: "wallet-dashboard" })
					}
				/>

				{/* MARK: E-value */}
				<Box
					borderWidth="1px"
					borderColor="gray.200"
					borderRadius="16px"
					bg="white"
					p={4}
					boxShadow="sm"
				>
					<Flex
						justify="space-between"
						align="flex-start"
						gap={3}
						mb={3}
					>
						<Box>
							<Text
								fontSize="lg"
								fontWeight="semibold"
								color="dark"
							>
								Via E-value (Cash Load)
							</Text>
							<Text fontSize="sm" color="gray.600" mt={1}>
								Load this Digi Khata wallet instantly from your
								E-value balance.
							</Text>
							<Text fontSize="sm" color="gray.600" mt={1}>
								<strong>Note:&nbsp;</strong>This is considered
								Cash Load and you can load{" "}
								<strong>
									upto a total of ₹50,000 per month
								</strong>
								&nbsp; using this method. If you want to add
								more, please use the UPI or Virtual Account
								options below.
							</Text>
						</Box>
						<Text
							fontSize="xs"
							fontWeight="semibold"
							color="primary.DEFAULT"
							bg="primary.50"
							px={3}
							py={1}
							borderRadius="full"
						>
							In app
						</Text>
					</Flex>

					<Flex
						// direction={{ base: "column", md: "row" }}
						// gap={{ base: 6, md: "2em" }}
						direction="column"
						gap={4}
						align={{ base: "center", md: "flex-start" }}
					>
						{/* Amount */}
						<Box>
							<InputLabel
								fontSize="sm"
								fontWeight="medium"
								color="dark"
								mb={2}
								required
							>
								Amount (₹)
							</InputLabel>
							<NumberInput
								min={1}
								value={amount}
								onChange={(val) => setAmount(val)}
								borderRadius="10"
							>
								<NumberInputField
									placeholder="Enter amount"
									borderRadius="10"
									fontSize="xl"
									h="14"
								/>
							</NumberInput>
						</Box>

						{/* PIN */}
						<Box>
							<Pintwin
								label="Your Secret PIN"
								length={4}
								onPinComplete={handlePinComplete}
								onPinChange={() => {
									setIsPinComplete(false);
									setEncodedPin("");
								}}
							/>
						</Box>
					</Flex>

					<Button
						w="full"
						mt={4}
						bg="primary.DEFAULT"
						color="white"
						borderRadius="10"
						size="lg"
						isDisabled={!canSubmit}
						isLoading={isLoadingWallet}
						loadingText="Loading Wallet…"
						onClick={handleLoadWallet}
						sx={{
							animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
							animationDelay: ANIMATION.CTA_DELAY,
						}}
						_hover={{ bg: "primary.dark" }}
					>
						Proceed
					</Button>
				</Box>

				{/* MARK: UPI */}
				<Box
					borderWidth="1px"
					borderColor="gray.200"
					borderRadius="16px"
					bg="white"
					p={4}
					boxShadow="sm"
				>
					<Flex
						justify="space-between"
						align="flex-start"
						gap={3}
						mb={3}
					>
						<Box>
							<Text
								fontSize="lg"
								fontWeight="semibold"
								color="dark"
							>
								Via UPI
							</Text>
							<Text fontSize="sm" color="gray.600" mt={1}>
								Use any UPI app like GPay, BHIM, PhonePe, or
								Paytm to transfer money to this DigiKhata VPA.
							</Text>
							<Text fontSize="sm" color="gray.600" mt={1}>
								<strong>Note:&nbsp;</strong>You can load{" "}
								<strong>
									upto a total of ₹25 Lakh per month
								</strong>
								&nbsp; using digital methods like UPI or Virtual
								Account.
							</Text>
						</Box>
						<Text
							fontSize="xs"
							fontWeight="semibold"
							color="orange.600"
							bg="orange.50"
							px={3}
							py={1}
							borderRadius="full"
						>
							External transfer
						</Text>
					</Flex>

					<Box>
						{/* Info Note */}
						<Alert
							bg="primary.DEFAULT"
							status="info"
							borderRadius="10"
							mb={3}
							color="white"
						>
							<AlertIcon color="white" />
							<Box>
								<Text fontWeight="semibold" fontSize="sm">
									Don't have a DigiKhata VPA yet?
								</Text>
								<Text fontSize="sm">
									To get your VPA ID, download the DigiKhata
									app from{" "}
									<Link
										href="https://play.google.com/store/apps/details?id=com.androidapp.digikhata&hl=en"
										isExternal
										fontWeight="bold"
										textDecoration="underline"
										color="blue.300"
									>
										Google Play Store
									</Link>{" "}
									or{" "}
									<Link
										href="https://apps.apple.com/in/app/digi-khata-money-manager/id1571599845"
										isExternal
										fontWeight="bold"
										textDecoration="underline"
										color="blue.300"
									>
										Apple App Store
									</Link>
									, register yourself, and find your VPA ID
									from the app.
								</Text>
							</Box>
						</Alert>
						<Text
							fontSize="xs"
							fontWeight="medium"
							color="gray.500"
							mb={1}
						>
							UPI VPA
						</Text>
						<Flex align="center" gap={2}>
							<Input
								value={upiVpa}
								isReadOnly
								borderRadius="10"
							/>
							<CopyButton text={upiVpa} />
						</Flex>
					</Box>

					<Text fontSize="sm" color="gray.600" mt={3}>
						Open your preferred UPI app and send money to this VPA.
						Your wallet balance will update after the transfer is
						processed.
					</Text>
				</Box>

				{/* MARK: VA */}
				<Box
					borderWidth="1px"
					borderColor="gray.200"
					borderRadius="16px"
					bg="white"
					p={4}
					boxShadow="sm"
				>
					<Flex
						justify="space-between"
						align="flex-start"
						gap={3}
						mb={3}
					>
						<Box>
							<Text
								fontSize="lg"
								fontWeight="semibold"
								color="dark"
							>
								Via Virtual Account
							</Text>
							<Text fontSize="sm" color="gray.600" mt={1}>
								Use your bank's online banking app or website to
								transfer money digitally to DigiKhata virtual
								account for this wallet.
							</Text>
							<Text fontSize="sm" color="gray.600" mt={1}>
								<strong>Note:&nbsp;</strong>You can load{" "}
								<strong>
									upto a total of ₹25 Lakh per month
								</strong>
								&nbsp; using digital methods like UPI or Virtual
								Account.
							</Text>
						</Box>
						<Text
							fontSize="xs"
							fontWeight="semibold"
							color="orange.600"
							bg="orange.50"
							px={3}
							py={1}
							borderRadius="full"
						>
							External transfer
						</Text>
					</Flex>

					{/* Info Note */}
					<Alert
						bg="primary.DEFAULT"
						status="info"
						borderRadius="10"
						mb={3}
						color="white"
					>
						<AlertIcon color="white" />
						<Box>
							<Text fontWeight="semibold" fontSize="sm">
								Don't have a DigiKhata Virtual Account yet?
							</Text>
							<Text fontSize="sm">
								To get your VPA ID, download the DigiKhata app
								from{" "}
								<Link
									href="https://play.google.com/store/apps/details?id=com.androidapp.digikhata&hl=en"
									isExternal
									fontWeight="bold"
									textDecoration="underline"
									color="blue.300"
								>
									Google Play Store
								</Link>{" "}
								or{" "}
								<Link
									href="https://apps.apple.com/in/app/digi-khata-money-manager/id1571599845"
									isExternal
									fontWeight="bold"
									textDecoration="underline"
									color="blue.300"
								>
									Apple App Store
								</Link>
								, register yourself, and find your VPA ID from
								the app.
							</Text>
						</Box>
					</Alert>

					<Box>
						<Text
							fontSize="xs"
							fontWeight="medium"
							color="gray.500"
							mb={1}
						>
							Virtual Account Number
						</Text>
						<Flex align="center" gap={2}>
							<Input
								value={virtualAccountNumber}
								isReadOnly
								borderRadius="10"
							/>
							<CopyButton text={virtualAccountNumber} />
						</Flex>
					</Box>

					<Box mt={3}>
						<Text
							fontSize="xs"
							fontWeight="medium"
							color="gray.500"
							mb={1}
						>
							IFSC
						</Text>
						<Flex align="center" gap={2}>
							<Input
								value={virtualAccountIfsc}
								isReadOnly
								borderRadius="10"
							/>
							<CopyButton text={virtualAccountIfsc} />
						</Flex>
					</Box>

					<Text fontSize="sm" color="gray.600" mt={3}>
						Use your bank's app to make an online transfer to the
						account shown above. Balance will reflect after the
						transfer is processed.
					</Text>
				</Box>
			</Flex>
		</>
	);
};
