import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { STEP_STATUS, Stepper } from "components/Stepper";
import type { StepStatus } from "components/Stepper/types";
import { useUser } from "contexts";
import { fadeSlideInTop12 } from "libs/chakraKeyframes";
import { useEffect, useMemo, useState } from "react";
import { OtpModal } from "../components/OtpModal";
import { WalletCard } from "../components/WalletCard";
import { ANIMATION, KYC_STEPS, OTP_MODAL_TITLES } from "../constants";
import { DigiKhataProvider, useDigiKhata } from "../context/DigiKhataContext";
import {
	DigiKhataApiResponse,
	DigiKhataStep,
	transformToWalletData,
} from "../context/types";
import { useDigiKhataApi } from "../hooks/useDigiKhataApi";
import { AadhaarConsentStep } from "./steps/AadhaarConsentStep";
import { AadhaarVerificationStep } from "./steps/AadhaarVerificationStep";
import { AddRecipientStep } from "./steps/AddRecipientStep";
import { CustomerOnboardingStep } from "./steps/CustomerOnboardingStep";
import { FundTransferStep } from "./steps/FundTransferStep";
import { InitialStep } from "./steps/InitialStep";
import { LoadWalletStep } from "./steps/LoadWalletStep";
import { PanVerificationStep } from "./steps/PanVerificationStep";
import { RecipientsStep } from "./steps/RecipientsStep";
import { SearchCustomerStep } from "./steps/SearchCustomerStep";
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

interface DigiKhataInnerProps {
	mode: "self" | "assisted";
}

/**
 * Inner component — consumes DigiKhataContext state and dispatch.
 * Renders step-based flow: customer search, onboarding, KYC, wallet dashboard, transfers.
 * @param {object} root0 - Component props
 * @param {"self" | "assisted"} root0.mode - Flow mode: "self" for agent's wallet, "assisted" for customer search
 * @returns {JSX.Element} DigiKhata flow container with stepper, step content, and OTP modal
 */
const DigiKhataInner = ({ mode }: DigiKhataInnerProps): JSX.Element => {
	const { state, dispatch } = useDigiKhata();
	const { userData } = useUser();
	const toast = useToast();

	// In self mode, seed activeMobile from the logged-in user on first render
	useEffect(() => {
		const userMobile = userData?.userDetails?.mobile ?? "";

		if (mode === "self" && !state.activeMobile && userMobile) {
			dispatch({ type: "SET_ACTIVE_MOBILE", payload: userMobile });
		}
	}, [mode, userData?.userDetails?.mobile, state.activeMobile, dispatch]);

	// In assisted mode, trigger balance fetch once activeMobile is set from search-customer step
	useEffect(() => {
		if (
			mode === "assisted" &&
			state.activeMobile &&
			!state.hasFetchedWallet &&
			state.step === "search-customer"
		) {
			handleFetchBalance();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.activeMobile]);

	const {
		generateSenderOtp,
		isGeneratingSenderOtp,
		verifySenderOtp,
		isVerifyingSenderOtp,
	} = useDigiKhataApi(state.activeMobile);

	const [isSenderOtpModalOpen, setIsSenderOtpModalOpen] = useState(false);

	// ── Fetch Balance / Refresh ────────────────────────────────────────────────
	const handleFetchBalance = async () => {
		// dispatch({ type: "SET_LOADING", payload: true });
		const res = await generateSenderOtp();
		// dispatch({ type: "SET_LOADING", payload: false });

		const responseType = res?.data?.response_type_id;

		// OTP required - show OTP modal
		if (responseType === 2129) {
			dispatch({
				type: "SET_OTP_REF_ID",
				payload: res?.data?.data?.otp_ref_id ?? null,
			});
			setIsSenderOtpModalOpen(true);
		}
		// Onboarding required
		else if (responseType === 308) {
			dispatch({ type: "SET_STEP", step: "customer-onboarding" });
		}
		// Direct profile data returned (balance refresh without OTP)
		else if (responseType === 309 && res?.data?.status === 0) {
			const walletData = transformToWalletData(
				res.data as DigiKhataApiResponse
			);
			dispatch({ type: "SET_WALLET_DATA", payload: walletData });
			if (walletData.walletAcOpened) {
				dispatch({ type: "SET_STEP", step: "wallet-dashboard" });
			}
		}
		// Handle all other cases (e.g., Send OTP Failed or any unhandled response_type_id)
		else {
			toast({
				title: res?.data?.message ?? "Send OTP Failed",
				description: res?.data?.data?.description ?? "",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		}
	};
	const handleSenderOtpSubmit = async (otp: string) => {
		if (!state.otpRefId) {
			dispatch({
				type: "SET_ERROR",
				payload: "Missing OTP reference. Please request OTP again.",
			});
			return null;
		}

		const res = await verifySenderOtp({ otp, otp_ref_id: state.otpRefId });

		const responseType = res?.data?.response_type_id;

		if (res?.data?.status === 0) {
			const walletData = transformToWalletData(
				res.data as DigiKhataApiResponse
			);
			dispatch({ type: "SET_WALLET_DATA", payload: walletData });
			setIsSenderOtpModalOpen(false);

			// Pan Verification Pending, response_type_id 2147
			if (responseType === 2147) {
				dispatch({ type: "SET_STEP", step: "pan-verify" });
			} else if (walletData.walletAcOpened) {
				dispatch({ type: "SET_STEP", step: "wallet-dashboard" });
			} else {
				dispatch({ type: "SET_STEP", step: "aadhaar-consent" });
			}
		} else {
			toast({
				title: res?.data?.message ?? "OTP verification failed",
				description: res?.data?.data?.description ?? "",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
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
			case "search-customer":
				return (
					<SearchCustomerStep
						onSearch={handleSearchCustomer}
						isLoading={state.isLoading || isGeneratingSenderOtp}
					/>
				);
			case "customer-onboarding":
				return (
					<CustomerOnboardingStep
						mobile={state.activeMobile}
						onSuccess={handleFetchBalance}
					/>
				);
			case "aadhaar-consent":
				return <AadhaarConsentStep mobile={state.activeMobile} />;
			case "aadhaar-verify":
				return <AadhaarVerificationStep mobile={state.activeMobile} />;
			case "pan-verify":
				return <PanVerificationStep mobile={state.activeMobile} />;
			case "wallet-dashboard":
				return <WalletDashboard />;
			case "load-wallet":
				return (
					<LoadWalletStep
						mobile={state.activeMobile}
						onFetchBalance={handleFetchBalance}
					/>
				);
			case "recipients":
				return <RecipientsStep mobile={state.activeMobile} />;
			case "add-recipient":
				return <AddRecipientStep mobile={state.activeMobile} />;
			case "fund-transfer":
				return (
					<FundTransferStep
						mobile={state.activeMobile}
						onFetchBalance={handleFetchBalance}
					/>
				);
			default:
				return <InitialStep />;
		}
	};

	const handleSearchCustomer = (searchMobile: string) => {
		dispatch({ type: "SET_ACTIVE_MOBILE", payload: searchMobile });
		// Balance fetch is triggered by the useEffect watching state.activeMobile
	};

	return (
		<Flex direction="column" gap={5} w="full" align="center" pt={4} pb={10}>
			{/* Wallet card — visible always in self mode; only after first fetch in assisted mode */}
			{mode === "self" || state.hasFetchedWallet ? (
				<Box
					px={{ base: 3, md: 0 }}
					w={{ base: "full", lg: "800px" }}
					sx={{
						animation: `${fadeSlideInTop12} ${ANIMATION.WALLET_CARD_IN} ${ANIMATION.EASING} both`,
						"@media print": { display: "none !important" },
					}}
				>
					<WalletCard
						walletData={state.walletData}
						isLoading={state.isLoading}
						hasFetchedWallet={state.hasFetchedWallet}
						onFetchBalance={handleFetchBalance}
						compactMode={
							state.step === "initial" ||
							state.step === "wallet-dashboard" ||
							state.step === "load-wallet"
								? false
								: true
						}
					/>
				</Box>
			) : null}

			{/* Constrained content area for step forms */}
			<Flex
				direction="column"
				gap={5}
				w="full"
				maxW={{ base: "full", lg: "800px" }}
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
				mobileHint={`XXXXXX${state.activeMobile.slice(-4)}`}
			/>
		</Flex>
	);
};

interface DigiKhataPageProps {
	/** Flow mode — "self" uses the agent's own mobile (default), "assisted" starts at customer search */
	mode?: "self" | "assisted";
}

/**
 * DigiKhataPage — root page component for the DigiKhata Wallet & Fund Transfer product.
 * Wraps the entire feature in DigiKhataProvider and orchestrates state management.
 * @param {object} root0 - Component props
 * @param {("self" | "assisted")} [root0.mode] - Flow mode: "self" uses agent's mobile (default), "assisted" starts at customer search
 * @returns {JSX.Element} Provider-wrapped DigiKhata flow container
 */
export const DigiKhataPage = ({
	mode = "self",
}: DigiKhataPageProps): JSX.Element => (
	<DigiKhataProvider mode={mode}>
		<DigiKhataInner mode={mode} />
	</DigiKhataProvider>
);
