/**
 * useSignAgreement Hook
 *
 * Main orchestration hook for the e-signature flow.
 * Manages the complete lifecycle: initialization, signing, and verification.
 * Supports multiple providers (Leegality, Karza, Signzy) and Android WebView.
 */
import { useToast } from "@chakra-ui/react";
import { useAppSource, usePubSub, useSession } from "contexts";
import { useRefreshToken } from "hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { ANDROID_ACTION } from "utils";
import { useOnboardingContext } from "../context";
import {
	getProvider,
	getSignUrl,
	type EsignStatus,
	type EsignUrlData,
} from "../services/esign";

interface UseSignAgreementReturn {
	/** Current status of the esign flow */
	status: EsignStatus;
	/** Error message if status is 'error' */
	error: string | null;
	/** Initialize the esign session (load script + fetch URL) */
	initialize: () => Promise<void>;
	/** Open the signing popup/SDK */
	openSigning: () => void;
	/** Retry initialization after failure */
	retry: () => void;
	/** Document ID from the sign URL response */
	documentId?: string;
}

/**
 * Hook for managing the complete e-signature flow
 * @returns {UseSignAgreementReturn} Sign agreement methods and state
 */
export const useSignAgreement = (): UseSignAgreementReturn => {
	// State
	const [status, setStatus] = useState<EsignStatus>("idle");
	const [error, setError] = useState<string | null>(null);
	const [signData, setSignData] = useState<EsignUrlData | null>(null);

	// Refs
	const isInitializing = useRef(false);

	// Context and hooks
	const { mobile, agreementId, state, actions } = useOnboardingContext();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const { isAndroid } = useAppSource();
	const { subscribe, TOPICS } = usePubSub();
	const toast = useToast();

	// Get latLong from state
	const latLong = state?.latLong;

	/**
	 * Initialize the esign session
	 * - Load provider script if needed
	 * - Fetch signing URL from backend
	 */
	const initialize = useCallback(async () => {
		// Prevent duplicate initialization
		if (isInitializing.current) return;
		isInitializing.current = true;

		setStatus("loading");
		setError(null);

		try {
			// 1. Fetch signing URL from backend
			const urlData = await getSignUrl(
				{
					agreementId,
					mobile,
					latLong,
				},
				accessToken,
				generateNewToken
			);

			setSignData(urlData);

			// 2. Get the appropriate provider and load script if needed
			const provider = getProvider(urlData.pipe);
			if (provider.requiresScript) {
				await provider.loadScript();
			}

			// 3. Update status to ready
			setStatus("ready");

			// Also update the legacy state for any external dependencies
			actions.setSignUrlData(urlData);
			actions.updateEsignStatus("ready");
		} catch (err: any) {
			console.error("[useSignAgreement] Initialize error:", err);
			setError(err?.message || "Failed to initialize e-sign");
			setStatus("error");
			actions.updateEsignStatus("failed");

			toast({
				title: err?.message || "E-sign initialization failed",
				status: "error",
				duration: 5000,
			});
		} finally {
			isInitializing.current = false;
		}
	}, [
		agreementId,
		mobile,
		latLong,
		accessToken,
		generateNewToken,
		actions,
		toast,
	]);

	/**
	 * Open the signing popup/SDK
	 */
	const openSigning = useCallback(() => {
		if (!signData) {
			console.error("[useSignAgreement] No sign data available");
			toast({
				title: "Please wait for initialization to complete",
				status: "warning",
				duration: 2000,
			});
			return;
		}

		setStatus("signing");

		console.log("[useSignAgreement] pipe:", signData.pipe);

		const provider = getProvider(signData.pipe);

		provider.openSigning(signData.short_url, {
			documentId: signData.document_id,
			isAndroid,
			onCallback: (result) => {
				console.log("[useSignAgreement] Provider callback:", result);

				if (result.error) {
					toast({
						title: result.error || "E-sign failed",
						status: "error",
						duration: 3000,
					});
					setStatus("ready"); // Allow retry
				} else if (result.documentId) {
					// Mark as success after signing
					setStatus("success");
					toast({
						title: "Agreement signed successfully!",
						status: "success",
						duration: 3000,
					});
				}
			},
		});
	}, [signData, isAndroid, toast]);

	/**
	 * Retry initialization after failure
	 */
	const retry = useCallback(() => {
		setStatus("idle");
		setError(null);
		setSignData(null);
		initialize();
	}, [initialize]);

	/**
	 * Listen for Android esign responses
	 */
	useEffect(() => {
		const unsubscribe = subscribe(TOPICS.ANDROID_RESPONSE, (data: any) => {
			if (data?.action === ANDROID_ACTION.LEEGALITY_ESIGN_RESPONSE) {
				console.log("[useSignAgreement] Android response:", data?.data);

				const response = data?.data;
				if (response?.status === "success" || response?.documentId) {
					setStatus("success");
					toast({
						title: "Agreement signed successfully!",
						status: "success",
						duration: 3000,
					});
				} else if (response?.error) {
					toast({
						title: response.error || "E-sign failed",
						status: "error",
						duration: 3000,
					});
					setStatus("ready");
				}
			}
		});

		return unsubscribe;
	}, [subscribe, TOPICS.ANDROID_RESPONSE, toast]);

	/**
	 * Listen for STATUS_UPDATE messages from esign popup
	 */
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data?.type === "STATUS_UPDATE") {
				console.log(
					"[useSignAgreement] Popup status update:",
					event.data
				);
				if (signData?.document_id) {
					setStatus("success");
					toast({
						title: "Agreement signed successfully!",
						status: "success",
						duration: 3000,
					});
				}
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [signData?.document_id, toast]);

	return {
		status,
		error,
		initialize,
		openSigning,
		retry,
		documentId: signData?.document_id,
	};
};
