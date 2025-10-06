import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { agreementProvider } from "constants/ProductDetails";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useCallback } from "react";
import { ANDROID_ACTION, doAndroidAction } from "utils";
import type { OnboardingStateHook } from "./useOnboardingState";

interface UseEsignIntegrationProps {
	userData: any;
	state: OnboardingStateHook["state"];
	actions: OnboardingStateHook["actions"];
	isAndroid: boolean;
	logo: string;
	onStepSubmit: (_data: any) => void;
}

interface UseEsignIntegrationReturn {
	getSignUrl: () => void;
	openEsign: () => void;
	handleLeegalityCallback: (_res: any) => void;
	initializeEsignScript: () => void;
}

/**
 * Custom hook for managing e-signature integration
 * Handles Leegality/Karza esign flow, URL generation, and callbacks
 * @param {UseEsignIntegrationProps} params - Hook parameters
 * @param {any} params.userData - User data object
 * @param {object} params.state - Onboarding state from useOnboardingState
 * @param {object} params.actions - State actions from useOnboardingState
 * @param {boolean} params.isAndroid - Whether running in Android WebView
 * @param {string} params.logo - Organization logo URL
 * @param {Function} params.onStepSubmit - Callback for step submission
 * @returns {UseEsignIntegrationReturn} E-signature integration methods
 */
export const useEsignIntegration = ({
	userData,
	state,
	actions,
	isAndroid,
	logo,
	onStepSubmit,
}: UseEsignIntegrationProps): UseEsignIntegrationReturn => {
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	const user_id =
		userData?.userDetails?.mobile || userData?.userDetails.signup_mobile;

	/**
	 * Fetches the e-signature URL from the backend
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
					agreement_id: userData?.userDetails?.agreement_id ?? 5,
					latlong: state.latLong || "27.176670,78.008075,7787",
					user_id,
					locale: "en",
				},
			},
			generateNewToken
		)
			.then((res) => {
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
	}, [
		accessToken,
		userData?.userDetails?.agreement_id,
		state.latLong,
		user_id,
		generateNewToken,
		actions,
		toast,
	]);

	/**
	 * Handles the leegality callback response
	 */
	const handleLeegalityCallback = useCallback(
		(res) => {
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
						agreement_id: userData?.userDetails?.agreement_id,
					},
				});
			}
		},
		[userData?.userDetails?.agreement_id, onStepSubmit, toast]
	);

	/**
	 * Opens the e-signature interface based on provider (Signzy/Karza)
	 */
	const openEsign = useCallback(() => {
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
			state.esign.signUrlData.pipe === agreementProvider.KARZA
		) {
			if (!state.esign.signUrlData.short_url) {
				toast({
					title: "Error starting eSign session. Please reload and try again later.",
					status: "error",
					duration: 2000,
				});
				return;
			}

			if (isAndroid) {
				doAndroidAction(
					ANDROID_ACTION.LEEGALITY_ESIGN_OPEN,
					JSON.stringify({
						signing_url: state.esign.signUrlData?.short_url,
						document_id: state.esign.signUrlData?.document_id,
					})
				);
			} else {
				const leegality = new (window as any).Leegality({
					callback: handleLeegalityCallback,
					logo: logo,
				});
				leegality.init();
				leegality.esign(state.esign.signUrlData?.short_url);
			}
		}
	}, [
		state.esign.signUrlData,
		isAndroid,
		handleLeegalityCallback,
		logo,
		toast,
	]);

	/**
	 * Initializes the leegality script
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
		handleLeegalityCallback,
		initializeEsignScript,
	};
};
