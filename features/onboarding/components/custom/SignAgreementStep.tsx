import { Button, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import { ONBOARDING_STEP_IDS } from "features/onboarding/constants";
import { useOnboardingContext } from "features/onboarding/context";
import { useEffect, useState } from "react";
import type { CustomComponentProps } from "../ContentRenderer";

/**
 * SignAgreementStep Component
 *
 * This component handles the e-signature agreement flow in the onboarding process.
 * It integrates with the Leegality e-sign service to allow users to digitally sign agreements.
 *
 * Flow:
 * 1. Component mounts and esign URL is fetched by parent OnboardingSteps
 * 2. Shows loading state while URL is being generated
 * 3. Displays "Sign Agreement" button when ready
 * 4. Opens e-sign popup when user clicks the button
 * 5. After popup is opened, shows "Continue" button to check status
 * 6. Handles retry on failure
 *
 * E-sign Status Values (from state.esign.status):
 * - undefined or "loading": Loading (generating agreement document)
 * - "ready": Agreement URL ready, user can sign
 * - "failed": Failed to generate agreement
 *
 * Integration with Parent:
 * The parent OnboardingSteps component handles the actual esign integration via
 * useEsignIntegration hook. This component exposes callback triggers via window
 * object so the esign library can communicate back.
 * @param {CustomComponentProps} props - Standard custom step props
 * @returns {JSX.Element} The rendered component
 */
const SignAgreementStep = ({
	stepConfig,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	const { state } = useOnboardingContext();

	// Track if popup has been opened by the user
	const [popupOpened, setPopupOpened] = useState(false);
	// True 3s after popupOpened (gives time for popup to load)
	const [popupOpenedDelayed, setPopupOpenedDelayed] = useState(false);

	// Extract esign status from state
	const esignStatus = state?.esign?.status;
	const isEsignFailed = esignStatus === "failed";
	const isEsignLoading = !esignStatus || esignStatus === "loading";

	// Note: The callback triggering is handled by the parent OnboardingSteps
	// when this step becomes active. The widget code calls handleStepCallBack
	// in useEffect, but we rely on the parent's integration instead.
	useEffect(() => {
		console.log(
			"[SignAgreementStep] Component mounted, esign status:",
			esignStatus
		);
	}, [esignStatus]);

	// Expose callback methods via window for esign integration
	// This allows the parent's handleStepCallBack to be triggered
	useEffect(() => {
		// Store reference to trigger callbacks
		(window as any).__onboardingEsignCallbacks = {
			openEsign: () => {
				console.log("[SignAgreementStep] Opening e-sign popup");
				setPopupOpened(true);
				// The actual opening is handled by parent via esign.openEsign()
			},
			checkStatus: () => {
				console.log("[SignAgreementStep] Checking e-sign status");
				// The actual check is handled by parent via esign.checkEsignStatus()
			},
		};

		return () => {
			delete (window as any).__onboardingEsignCallbacks;
		};
	}, []);

	// Set popupOpenedDelayed to true 3s after popupOpened is set to true
	useEffect(() => {
		if (popupOpened) {
			const timer = setTimeout(() => setPopupOpenedDelayed(true), 3000);
			return () => clearTimeout(timer);
		}

		setPopupOpenedDelayed(false);
		return undefined;
	}, [popupOpened]);

	/**
	 * Opens the e-sign popup
	 * Triggers the parent's esign integration
	 */
	const openPopupTab = () => {
		// Trigger callback via window message to parent
		window.postMessage(
			{
				type: "ONBOARDING_CALLBACK",
				payload: {
					type: ONBOARDING_STEP_IDS.SIGN_AGREEMENT,
					method: "legalityOpen",
				},
			},
			"*"
		);
		setPopupOpened(true);
	};

	/**
	 * Checks the e-sign status after user returns from popup
	 */
	const checkStatusAfterPopupOpened = () => {
		// Trigger callback via window message to parent
		window.postMessage(
			{
				type: "ONBOARDING_CALLBACK",
				payload: {
					type: ONBOARDING_STEP_IDS.SIGN_AGREEMENT,
					method: "checkEsignStatus",
				},
			},
			"*"
		);
	};

	/**
	 * Reloads the page to retry
	 */
	const onReload = () => {
		window.location.reload();
	};

	// Render loading state
	if (isEsignLoading) {
		return (
			<VStack
				w="full"
				minH="80vh"
				justify="center"
				align="center"
				bg="white"
				borderRadius="2xl"
				p={8}
			>
				<Image
					src="https://files.eko.co.in/docs/onborading/agreement.png"
					alt="Agreement"
					h="180px"
					mb={6}
				/>
				<Spinner size="lg" color="primary.DEFAULT" />
				<Text fontSize="lg" mt={4} textAlign="center" px={4}>
					Generating agreement document. Please wait...
				</Text>
			</VStack>
		);
	}

	// Render failed state
	if (isEsignFailed) {
		return (
			<VStack
				w="full"
				minH="80vh"
				justify="center"
				align="center"
				bg="white"
				borderRadius="2xl"
				p={8}
			>
				<Image
					src="https://files.eko.co.in/docs/onborading/agreement.png"
					alt="Agreement"
					h="180px"
					mb={6}
				/>
				<Text fontSize="lg" color="error" textAlign="center" px={4}>
					Failed to generate agreement document!
				</Text>
				<Button mt={8} onClick={onReload} colorScheme="red">
					Retry
				</Button>
			</VStack>
		);
	}

	// Render ready state (main UI)
	return (
		<VStack
			w="full"
			minH="80vh"
			justify="center"
			align="center"
			bg="white"
			borderRadius="2xl"
			p={8}
		>
			<Image
				src="https://files.eko.co.in/docs/onborading/agreement.png"
				alt="Agreement"
				h="180px"
				mb={6}
			/>

			<Text fontSize="lg" textAlign="center" px={4}>
				<Text as="span" display={{ base: "inline", sm: "block" }}>
					Only one more to go!&nbsp;
				</Text>
				<Text as="span" display={{ base: "inline", sm: "block" }}>
					Sign the agreement using your Aadhaar number to continue.
				</Text>
			</Text>

			<VStack w="full" mt={6} gap={4}>
				{popupOpenedDelayed ? (
					<VStack w="full" align="center" gap={4}>
						<Text fontSize="md" textAlign="center">
							After completing the e-sign process:
						</Text>
						<Button
							colorScheme="blue"
							isDisabled={isSubmitting}
							onClick={checkStatusAfterPopupOpened}
						>
							Continue
						</Button>

						<Text fontSize="sm" color="gray.500" mt={10}>
							Didn&apos;t complete the e-sign process?&nbsp;
							<Text
								as="span"
								color="primary.DEFAULT"
								textDecoration="underline"
								cursor="pointer"
								onClick={openPopupTab}
							>
								Retry
							</Text>
						</Text>
					</VStack>
				) : (
					<Button
						colorScheme="blue"
						size="lg"
						isDisabled={isSubmitting || popupOpened}
						onClick={openPopupTab}
					>
						{isSubmitting
							? "Loading..."
							: popupOpened
								? "Starting Agreement Sign..."
								: stepConfig.primaryCTAText || "Sign Agreement"}
					</Button>
				)}
			</VStack>
		</VStack>
	);
};

export default SignAgreementStep;
