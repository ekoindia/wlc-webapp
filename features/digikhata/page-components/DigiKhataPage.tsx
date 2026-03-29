import { Box, Flex, Text } from "@chakra-ui/react";
import { STEP_STATUS, Stepper } from "components/Stepper";
import type { StepStatus } from "components/Stepper/types";
import { useUser } from "contexts";
import { fadeSlideInTop12 } from "libs/chakraKeyframes";
import { useMemo, useState } from "react";
import { OtpModal } from "../components/OtpModal";
import { WalletCard } from "../components/WalletCard";
import { ANIMATION, KYC_STEPS, OTP_MODAL_TITLES } from "../constants";
import { DigiKhataProvider, useDigiKhata } from "../context/DigiKhataContext";
import { DigiKhataStep } from "../context/types";
import { useDigiKhataApi } from "../hooks/useDigiKhataApi";
import { AadhaarConsentStep } from "./steps/AadhaarConsentStep";
import { AadhaarVerificationStep } from "./steps/AadhaarVerificationStep";
import { AddRecipientStep } from "./steps/AddRecipientStep";
import { FundTransferStep } from "./steps/FundTransferStep";
import { InitialStep } from "./steps/InitialStep";
import { LoadWalletStep } from "./steps/LoadWalletStep";
import { PanVerificationStep } from "./steps/PanVerificationStep";
import { RecipientsStep } from "./steps/RecipientsStep";
import { WalletDashboard } from "./steps/WalletDashboard";

/** Step → human-readable label mapping for the KYC Stepper */
const KYC_STEP_LABELS: Record<string, string> = {
	"aadhaar-consent": "Consent",
	"aadhaar-verify": "Aadhaar",
	"pan-verify": "PAN",
};

const KYC_STEP_ORDER: DigiKhataStep[] = [
	"aadhaar-consent",
	"aadhaar-verify",
	"pan-verify",
];

/** Inner component — consumes DigiKhataContext */
const DigiKhataInner = (): JSX.Element => {
	const { state, dispatch } = useDigiKhata();
	const { userData } = useUser();
	const mobile = userData?.userDetails?.mobile ?? "";

	const {
		generateSenderOtp,
		isGeneratingSenderOtp,
		verifySenderOtp,
		isVerifyingSenderOtp,
	} = useDigiKhataApi(mobile);

	const [isSenderOtpModalOpen, setIsSenderOtpModalOpen] = useState(false);

	// ── Fetch Balance / Refresh ────────────────────────────────────────────────
	const handleFetchBalance = async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		const res = await generateSenderOtp();
		dispatch({ type: "SET_LOADING", payload: false });

		if (res?.data?.response_type_id === 2129) {
			setIsSenderOtpModalOpen(true);
		}
	};

	const handleSenderOtpSubmit = async (otp: string) => {
		const res = await verifySenderOtp({ otp });
		if (res?.data?.status === 0) {
			dispatch({ type: "SET_WALLET_DATA", payload: res.data.data });
			setIsSenderOtpModalOpen(false);
			if (res.data.data?.walletAcOpened) {
				dispatch({ type: "SET_STEP", step: "wallet-dashboard" });
			} else {
				dispatch({ type: "SET_STEP", step: "aadhaar-consent" });
			}
		}
		return res;
	};

	// ── KYC Stepper items ──────────────────────────────────────────────────────
	const kycStepItems = useMemo(
		() =>
			KYC_STEP_ORDER.map((s, idx) => {
				const currentIdx = KYC_STEP_ORDER.indexOf(
					state.step as DigiKhataStep
				);
				let status: StepStatus = STEP_STATUS.NOT_STARTED;
				if (idx < currentIdx) status = STEP_STATUS.COMPLETED;
				else if (idx === currentIdx) status = STEP_STATUS.IN_PROGRESS;
				return { id: idx + 1, label: KYC_STEP_LABELS[s], status };
			}),
		[state.step]
	);

	const isKycStep = KYC_STEPS.has(state.step);

	// ── Step component routing ─────────────────────────────────────────────────
	const renderStep = (): JSX.Element => {
		switch (state.step) {
			case "initial":
				return <InitialStep />;
			case "aadhaar-consent":
				return <AadhaarConsentStep mobile={mobile} />;
			case "aadhaar-verify":
				return <AadhaarVerificationStep mobile={mobile} />;
			case "pan-verify":
				return <PanVerificationStep mobile={mobile} />;
			case "wallet-dashboard":
				return <WalletDashboard />;
			case "load-wallet":
				return <LoadWalletStep mobile={mobile} />;
			case "recipients":
				return <RecipientsStep mobile={mobile} />;
			case "add-recipient":
				return <AddRecipientStep mobile={mobile} />;
			case "fund-transfer":
				return <FundTransferStep mobile={mobile} />;
			default:
				return <InitialStep />;
		}
	};

	return (
		<Flex direction="column" gap={5} w="full" pt={4} pb={10}>
			{/* Wallet card — full width hero element */}
			<Box
				px={{ base: 3, md: 0 }}
				sx={{
					animation: `${fadeSlideInTop12} ${ANIMATION.WALLET_CARD_IN} ${ANIMATION.EASING} both`,
				}}
			>
				<WalletCard
					walletData={state.walletData}
					isLoading={state.isLoading || isGeneratingSenderOtp}
					hasFetchedWallet={state.hasFetchedWallet}
					onFetchBalance={handleFetchBalance}
				/>
			</Box>

			{/* Constrained content area for step forms */}
			<Flex
				direction="column"
				gap={5}
				w="full"
				maxW="520px"
				mx="auto"
				px={{ base: 3, md: 0 }}
			>
				{/* KYC Stepper — visible only during the 3 KYC steps */}
				{isKycStep ? (
					<Box
						sx={{
							animation: `${fadeSlideInTop12} 0.18s ${ANIMATION.EASING} both`,
						}}
					>
						<Stepper
							steps={kycStepItems}
							currentStepId={
								KYC_STEP_ORDER.indexOf(
									state.step as DigiKhataStep
								) + 1
							}
							orientation="horizontal"
						/>
					</Box>
				) : null}

				{/* Step content */}
				{state.error ? (
					<Text fontSize="sm" color="error" textAlign="center">
						{state.error}
					</Text>
				) : null}

				<Box
					key={state.step}
					bg="white"
					borderRadius="2xl"
					p={5}
					boxShadow="sm"
				>
					{renderStep()}
				</Box>
			</Flex>

			{/* Sender verification OTP modal */}
			<OtpModal
				isOpen={isSenderOtpModalOpen}
				onClose={() => setIsSenderOtpModalOpen(false)}
				onSubmit={handleSenderOtpSubmit}
				onResend={generateSenderOtp}
				isLoading={isVerifyingSenderOtp}
				title={OTP_MODAL_TITLES.SENDER_VERIFY}
				mobileHint={`XXXXXX${mobile.slice(-4)}`}
				otpLength={4}
			/>
		</Flex>
	);
};

/**
 * DigiKhataPage — root page component for the DigiKhata Wallet & Fund Transfer product.
 * Wraps the entire feature in DigiKhataProvider.
 */
export const DigiKhataPage = (): JSX.Element => (
	<DigiKhataProvider>
		<DigiKhataInner />
	</DigiKhataProvider>
);
