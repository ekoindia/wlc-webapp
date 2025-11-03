import { useToast } from "@chakra-ui/react";
import { usePubSub } from "contexts";
import { useCallback, useEffect } from "react";
import { ANDROID_ACTION, ANDROID_PERMISSION, doAndroidAction } from "utils";

interface UseAndroidIntegrationProps {
	agreementId: any;
	onStepSubmit: (_data: any) => void;
}

interface UseAndroidIntegrationReturn {
	androidleegalityResponseHandler: (_res: string) => void;
	grantLocationPermission: () => void;
	openEsignWindow: (_signingUrl: string, _documentId: string) => void;
}

/**
 * Custom hook for managing Android WebView integration
 * Handles Android-specific actions, permissions, and pub/sub responses
 * @param {UseAndroidIntegrationProps} params - Hook parameters
 * @param {Function} params.onStepSubmit - Callback for step submission
 * @returns {UseAndroidIntegrationReturn} Android integration methods
 */
export const useAndroidIntegration = ({
	agreementId,
	onStepSubmit,
}: UseAndroidIntegrationProps): UseAndroidIntegrationReturn => {
	const toast = useToast();
	const { subscribe, TOPICS } = usePubSub();

	/**
	 * Handles Android leegality e-sign response
	 */
	const androidleegalityResponseHandler = useCallback(
		(res: string) => {
			try {
				const value = JSON.parse(res);
				if (value.agreement_status === "success") {
					onStepSubmit({
						id: 12,
						form_data: {
							agreement_id: agreementId,
							document_id: value.document_id,
						},
					});
				} else {
					toast({
						title: "Something went wrong, please try again later!",
						status: "error",
						duration: 2000,
					});
				}
			} catch (error) {
				console.error("Failed to parse Android response:", error);
				toast({
					title: "Invalid response from Android app",
					status: "error",
					duration: 2000,
				});
			}
		},
		[agreementId]
	);

	/**
	 * Requests location permission from Android
	 */
	const grantLocationPermission = useCallback(() => {
		doAndroidAction(
			ANDROID_ACTION.GRANT_PERMISSION,
			ANDROID_PERMISSION.LOCATION
		);
	}, []);

	/**
	 * Opens e-sign window in Android WebView
	 */
	const openEsignWindow = useCallback(
		(signingUrl: string, documentId: string) => {
			doAndroidAction(
				ANDROID_ACTION.LEEGALITY_ESIGN_OPEN,
				JSON.stringify({
					signing_url: signingUrl,
					document_id: documentId,
				})
			);
		},
		[]
	);

	// Subscribe to Android responses
	useEffect(() => {
		const unsubscribe = subscribe(TOPICS.ANDROID_RESPONSE, (data) => {
			if (data?.action === ANDROID_ACTION.LEEGALITY_ESIGN_RESPONSE) {
				androidleegalityResponseHandler(data?.data);
			}
		});

		return unsubscribe;
	}, [TOPICS.ANDROID_RESPONSE, subscribe, androidleegalityResponseHandler]);

	return {
		androidleegalityResponseHandler,
		grantLocationPermission,
		openEsignWindow,
	};
};
