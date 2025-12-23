import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { agreementProvider } from "constants/ProductDetails";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useCallback } from "react";
import { ANDROID_ACTION, doAndroidAction, isAndroidApp } from "utils";
import type { OnboardingStateHook } from "./useOnboardingState";

// Response type ID for agreement already signed
const AGREEMENT_ALREADY_SIGNED_RESPONSE_ID = 1069;

interface UseEsignIntegrationProps {
	state: OnboardingStateHook["state"];
	actions: OnboardingStateHook["actions"];
	isAndroid: boolean;
	logo: string;
	agreementId?: string | number;
	mobile?: string;
	onStepSubmit: (_data: any) => void;
	onEsignAlreadyCompleted?: () => void;
}

interface UseEsignIntegrationReturn {
	getSignUrl: () => void;
	openEsign: () => void;
	checkEsignStatus: () => void;
	handleLeegalityCallback: (_res: any) => void;
	initializeEsignScript: () => void;
}

/**
 * Custom hook for managing e-signature integration
 * Handles Leegality/Karza esign flow, URL generation, and callbacks
 * @param {UseEsignIntegrationProps} params - Hook parameters
 * @param {object} params.state - Onboarding state from useOnboardingState
 * @param {object} params.actions - State actions from useOnboardingState
 * @param {boolean} params.isAndroid - Whether running in Android WebView
 * @param {string} params.logo - Organization logo URL
 * @param {Function} params.onStepSubmit - Callback for step submission
 * @returns {UseEsignIntegrationReturn} E-signature integration methods
 */
export const useEsignIntegration = ({
	state,
	actions,
	isAndroid,
	logo,
	agreementId,
	mobile,
	onStepSubmit,
	onEsignAlreadyCompleted,
}: UseEsignIntegrationProps): UseEsignIntegrationReturn => {
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	/**
	 * Call EPS API to manually check the eSign status (if no response from eSign library/SDK)
	 */
	const checkEsignStatus = useCallback(() => {
		console.log(
			"checkEsignStatus:: ",
			state?.esign?.signUrlData?.document_id
		);

		onStepSubmit({
			id: 12,
			form_data: {
				document_id: state?.esign?.signUrlData?.document_id,
				agreement_id: agreementId,
			},
		});
	}, [state]);

	/**
	 * Fetches the e-signature URL from the backend
	 * MARK: Get URL
	 */
	const getSignUrl = useCallback(() => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id:
						TransactionIds?.USER_ONBOARDING_GET_AGREEMENT_URL,
					document_id: "",
					agreement_id: agreementId ?? 5,
					latlong: state.latLong || "27.176670,78.008075,7787",
					csp_id: mobile || "",
					user_id: mobile,
				},
			},
			generateNewToken
		)
			.then((res) => {
				// Check if esign is already completed (response_type_id: 1069)
				if (
					res?.response_type_id ===
					AGREEMENT_ALREADY_SIGNED_RESPONSE_ID
				) {
					toast({
						title: res?.message || "Agreement already signed.",
						status: "info",
						duration: 3000,
					});
					onEsignAlreadyCompleted?.();
					return;
				}

				if (res?.data?.short_url) {
					actions.setSignUrlData(res.data);
					actions.updateEsignStatus("ready");
				} else {
					toast({
						title:
							res?.message ||
							"E-sign initialization failed, please try again.",
						status: "error",
						duration: 5000,
					});
					actions.updateEsignStatus("failed");
				}
			})
			.catch((err) =>
				console.error("[getSignUrl for Leegality] Error:", err)
			);
	}, [mobile, agreementId]);

	/**
	 * Handles the leegality callback response
	 * MARK: Callback
	 */
	const handleLeegalityCallback = useCallback(
		(res) => {
			console.log("[Esign] Leegality Callback: ", res);

			if (res.error) {
				toast({
					title:
						res?.error ||
						"Something went wrong, please try again later!",
					status: "error",
					duration: 2000,
				});
			} else {
				onStepSubmit({
					id: 12,
					form_data: {
						document_id: res.documentId,
						agreement_id: agreementId,
					},
				});
			}
		},
		[agreementId]
	);

	/**
	 * Opens the e-signature interface based on provider (Signzy/Karza)
	 * MARK: Open eSign
	 */
	const openEsign = useCallback(() => {
		console.log(
			"[Esign] openEsign: ",
			state?.esign?.signUrlData,
			isAndroidApp()
		);

		if (
			state.esign.signUrlData &&
			state.esign.signUrlData.pipe === agreementProvider.SIGNZY
		) {
			window.open(
				state.esign.signUrlData.short_url,
				"SignAgreementWindow"
			);
		} else if (
			state.esign.signUrlData &&
			state.esign.signUrlData.pipe === agreementProvider.LEEGALITY &&
			(isAndroid || isAndroidApp())
		) {
			// HACK 19 NOV 2025: LEEGALITY ANDROID: Temporarily open directly in browser for testing...
			// TODO: FIX............
			window.open(
				state.esign.signUrlData.short_url,
				"SignAgreementWindow"
			);
		} else if (
			state.esign.signUrlData &&
			(state.esign.signUrlData.pipe === agreementProvider.KARZA ||
				state.esign.signUrlData.pipe === agreementProvider.LEEGALITY)
		) {
			if (!state.esign.signUrlData.short_url) {
				toast({
					title: "Error starting eSign session. Please reload and try again later.",
					status: "error",
					duration: 2000,
				});
				return;
			}

			if (isAndroid || isAndroidApp()) {
				toast({
					title: "Please select Leegality Helper App to complete eSign.",
					status: "info",
					duration: 2000,
				});

				doAndroidAction(
					ANDROID_ACTION.LEEGALITY_ESIGN_OPEN,
					JSON.stringify({
						signing_url: state.esign.signUrlData?.short_url,
						document_id: state.esign.signUrlData?.document_id,
					})
				);
			} else {
				toast({
					title: "Continuing to eSign...",
					status: "info",
					duration: 2000,
				});
				const leegality = new (window as any).Leegality({
					callback: handleLeegalityCallback,
					logo: logo,
				});
				leegality.init();
				leegality.esign(state.esign.signUrlData?.short_url);
			}
		}
	}, [state.esign.signUrlData, isAndroid, logo]);

	/**
	 * Initializes the leegality script
	 * MARK: Init Script
	 */
	const initializeEsignScript = useCallback(() => {
		const script = document.createElement("script");
		script.src = "/scripts/leegalityv5.min.js";
		script.id = "legality";
		document.body.appendChild(script);
		script.onload = () => {};
		script.onerror = () => {
			toast({
				title: "Failed to initialize eSign",
				description:
					"Please check your network connection & try again.",
				status: "error",
				duration: 2000,
			});
			actions.updateEsignStatus("failed");
		};
	}, [toast, actions]);

	return {
		getSignUrl,
		openEsign,
		checkEsignStatus,
		handleLeegalityCallback,
		initializeEsignScript,
	};
};
