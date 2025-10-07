import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { useSession } from "contexts";
import { useRefreshToken } from "hooks";
import { useCallback } from "react";
import { getMobileFromData, type UnifiedUserData } from "../utils";

/**
 * File upload data structure for different document types
 */
interface FileUploadData {
	id: number;
	form_data: {
		aadhaarImages?: {
			front?: { fileData: File };
			back?: { fileData: File };
		};
		panImage?: { fileData: File };
		panNumber?: string;
		shopType?: string;
		shopName?: string;
		videoKyc?: { fileData: File };
	};
}

/**
 * Onboarding state interface for file upload
 */
interface OnboardingState {
	latLong: string;
}

/**
 * Onboarding actions interface for file upload
 */
interface OnboardingActions {
	setApiInProgress: (_inProgress: boolean) => void;
	setLastStepResponse: (_response: any) => void;
}

/**
 * Props for useFileUpload hook
 */
interface UseFileUploadProps {
	userData: UnifiedUserData;
	state: OnboardingState;
	actions: OnboardingActions;
	isAssistedOnboarding: boolean;
	assistedAgentMobile: string | null;
	refreshApiCall: () => Promise<any>;
}

/**
 * Return type for useFileUpload hook
 */
interface UseFileUploadReturn {
	uploadFile: (_data: FileUploadData) => Promise<void>;
	isUploading: boolean;
}

/**
 * Custom hook for handling file upload operations
 * Manages formData creation, upload API calls, and response processing
 * @param {UseFileUploadProps} props - Configuration object for the hook
 * @param {UnifiedUserData} props.userData - User data containing mobile information
 * @param {OnboardingState} props.state - Current onboarding state including location
 * @param {OnboardingActions} props.actions - State management actions for API progress and responses
 * @param {boolean} props.isAssistedOnboarding - Whether this is an assisted onboarding flow
 * @param {string | null} props.assistedAgentMobile - Mobile number of the assisted agent
 * @param {() => Promise<any>} props.refreshApiCall - Function to refresh API data after upload
 * @returns {UseFileUploadReturn} Object containing file upload methods
 */
export const useFileUpload = ({
	userData,
	state,
	actions,
	isAssistedOnboarding,
	assistedAgentMobile,
	refreshApiCall,
}: UseFileUploadProps): UseFileUploadReturn => {
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	const user_id = getMobileFromData(userData);

	/**
	 * Converts object to URLSearchParams format for form data
	 */
	const objectToFormParams = useCallback(
		(obj: Record<string, any>): string => {
			const params = Object.entries(obj).reduce(
				(acc, [key, value]) => {
					acc[key] = String(value ?? "");
					return acc;
				},
				{} as Record<string, string>
			);
			return new URLSearchParams(params).toString();
		},
		[]
	);

	/**
	 * Creates base form data structure for uploads
	 */
	const createBaseFormData = useCallback(() => {
		const cspId = isAssistedOnboarding
			? { csp_id: assistedAgentMobile }
			: {};

		return {
			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
			user_id,
			interaction_type_id: TransactionIds.USER_ONBOARDING_AADHAR,
			intent_id: 3,
			doc_type: 1,
			latlong: state.latLong,
			source: "WLC",
			...cspId,
		};
	}, [user_id, state.latLong, isAssistedOnboarding, assistedAgentMobile]);

	/**
	 * Handles Aadhaar document upload (front and back images)
	 */
	const handleAadhaarUpload = useCallback(
		(data: FileUploadData, formData: FormData, baseFormData: any) => {
			const frontFile = data.form_data.aadhaarImages?.front?.fileData;
			const backFile = data.form_data.aadhaarImages?.back?.fileData;

			if (frontFile && backFile) {
				formData.append("file1", frontFile);
				formData.append("file2", backFile);

				const formDataParams = {
					...baseFormData,
					file1: "",
					file2: "",
				};

				formData.append("formdata", objectToFormParams(formDataParams));
			}
		},
		[objectToFormParams]
	);

	/**
	 * Handles PAN document upload (single image with additional data)
	 */
	const handlePanUpload = useCallback(
		(data: FileUploadData, formData: FormData, baseFormData: any) => {
			const panFile = data.form_data.panImage?.fileData;

			if (panFile) {
				formData.append("file1", panFile);

				const formDataParams = {
					...baseFormData,
					file1: "",
					doc_type: 2,
					doc_id: data.form_data.panNumber || "",
					shop_type: data.form_data.shopType || "",
					shop_name: data.form_data.shopName || "",
				};

				formData.append("formdata", objectToFormParams(formDataParams));
			}
		},
		[objectToFormParams]
	);

	/**
	 * Handles video KYC upload
	 */
	const handleVideoKycUpload = useCallback(
		(data: FileUploadData, formData: FormData, baseFormData: any) => {
			const videoFile = data.form_data.videoKyc?.fileData;

			if (videoFile) {
				formData.append("file1", videoFile);

				const formDataParams = {
					...baseFormData,
					file1: "",
					doc_type: 3,
				};

				formData.append("formdata", objectToFormParams(formDataParams));
			}
		},
		[objectToFormParams]
	);

	/**
	 * Processes different types of file uploads based on data.id
	 */
	const processFileUpload = useCallback(
		(data: FileUploadData) => {
			const formData = new FormData();
			const baseFormData = createBaseFormData();

			switch (data.id) {
				case 4: // Aadhaar upload
					handleAadhaarUpload(data, formData, baseFormData);
					break;
				case 8: // PAN upload
					handlePanUpload(data, formData, baseFormData);
					break;
				case 11: // Video KYC upload
					handleVideoKycUpload(data, formData, baseFormData);
					break;
				default:
					throw new Error(`Unsupported file upload type: ${data.id}`);
			}

			return formData;
		},
		[
			createBaseFormData,
			handleAadhaarUpload,
			handlePanUpload,
			handleVideoKycUpload,
		]
	);

	/**
	 * Handles successful upload response
	 */
	const handleUploadSuccess = useCallback(
		async (response: any) => {
			toast({
				title: response.message,
				status: "success",
				duration: 2000,
			});
			actions.setLastStepResponse(response);
			await refreshApiCall();
		},
		[toast, actions, refreshApiCall]
	);

	/**
	 * Handles upload error response
	 */
	const handleUploadError = useCallback(
		(response: any) => {
			toast({
				title:
					response.message ||
					"Something went wrong, please try again later!",
				status: "error",
				duration: 2000,
			});
			actions.setLastStepResponse(response);
		},
		[toast, actions]
	);

	/**
	 * Main file upload function
	 */
	const uploadFile = useCallback(
		async (data: FileUploadData) => {
			actions.setApiInProgress(true);

			try {
				const formData = processFileUpload(data);

				const response = await fetch(
					process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
						body: formData,
					}
				)
					.then((res) => {
						if (res.ok) {
							return res.json();
						} else {
							res.text().then(() => {});

							const err = new Error("API Error") as any;
							err.response = res;
							err.status = res.status;
							if (res.status === 401) {
								err.name = "UnauthorizedError";
								generateNewToken(true);
								return;
							}
							throw err;
						}
					})
					.catch((err) => {
						toast({
							title:
								err.message ||
								"Something went wrong, please try again later!",
							status: "error",
							duration: 2000,
						});
						return err;
					});

				const success =
					response?.status === 0 &&
					!(Object.keys(response?.invalid_params || {}).length > 0);

				if (success) {
					await handleUploadSuccess(response);
				} else {
					handleUploadError(response);
				}
			} catch (error: any) {
				toast({
					title:
						error.message ||
						"Something went wrong, please try again later!",
					status: "error",
					duration: 2000,
				});
				actions.setLastStepResponse(error);
			} finally {
				actions.setApiInProgress(false);
			}
		},
		[
			actions,
			processFileUpload,
			accessToken,
			generateNewToken,
			toast,
			handleUploadSuccess,
			handleUploadError,
		]
	);

	return {
		uploadFile,
		isUploading: false, // Could track upload state if needed
	};
};
