import { Endpoints } from "constants/EndPoints";
import { useApiFetch } from "hooks";
import { useCallback } from "react";
import { useBulkPayout } from "../context/BulkPayoutContext";
import {
	BatchHistoryItem,
	CustomerInfo,
	ValidationError,
} from "../context/types";

/**
 * TF API URI paths for Bulk Payout feature
 */
const BULK_PAYOUT_TF_URIS = {
	PROCESS_RECORDS: "/bulk-payout/process-records",
	BATCH_LIST: "/bulk-payout/batch-list",
	BATCH_STATUS: "/bulk-payout/batch",
	DOWNLOAD: "/bulk-payout/download",
	SEARCH_CUSTOMER: "/customer/search",
	VERIFY_PINTWIN: "/authentication/verify-pintwin",
} as const;

/**
 * TF API root path
 */
const TF_ROOT_PATH = "/api/v1";

/**
 * Payload structure for bulk payout process request
 */
export interface ProcessRecordsPayload {
	bc: string;
	sender_name: string;
	source: string;
	locale: string;
	user_code: string;
	pintwin: string;
	is_consent: string;
	latlong: string;
	version: string;
	client_ref_id: string;
	initiator_id: string;
	org_id: string;
	customer_id: string;
	realsourceip?: string;
	service_code: string;
}

/**
 * Hook for Bulk Payout API calls
 * Uses useApiFetch hook with TF (Transaction Framework) header pattern
 * Similar to useBbpsApi pattern
 */
export const useBulkPayoutApi = () => {
	const {
		customer,
		setLoading,
		setError,
		setCustomer,
		setStep,
		setUploadStatus,
		setValidationErrors,
		setCurrentBatch,
		setBatches,
		setLoadingHistory,
		updateBatchStatus,
	} = useBulkPayout();

	// Initialize useApiFetch for API calls with TF headers
	// Using TRANSACTION endpoint like in NotificationCreator.jsx
	const [fetchApi, isLoading] = useApiFetch(Endpoints.TRANSACTION, {
		method: "POST",
	});

	/**
	 * Search for customer by mobile number or customer ID
	 */
	const searchCustomer = useCallback(
		async (searchValue: string) => {
			setLoading(true);
			setError(null);

			try {
				const result = await fetchApi({
					headers: {
						"Content-Type": "application/json",
						"tf-req-uri-root-path": TF_ROOT_PATH,
						"tf-req-uri": BULK_PAYOUT_TF_URIS.SEARCH_CUSTOMER,
						"tf-req-method": "POST",
					},
					body: {
						customer_id: searchValue,
					},
				});

				if (result?.error) {
					const errorMsg =
						result.data?.message || "Failed to search customer";
					setError(errorMsg);
					return { success: false, error: errorMsg };
				}

				const data = result?.data;
				if (data?.status === 0 && data?.data) {
					const customerInfo: CustomerInfo = {
						customerId: data.data.customer_id || data.data.id,
						customerNumber:
							data.data.mobile || data.data.customer_number,
						customerName: data.data.name || data.data.customer_name,
					};
					setCustomer(customerInfo);
					return { success: true, data: customerInfo };
				} else {
					const errorMsg = data?.message || "Customer not found";
					setError(errorMsg);
					return { success: false, error: errorMsg };
				}
			} catch (error) {
				const errorMsg =
					error instanceof Error
						? error.message
						: "Failed to search customer";
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} finally {
				setLoading(false);
			}
		},
		[fetchApi, setLoading, setError, setCustomer]
	);

	/**
	 * Verify OTP/Pintwin for customer
	 */
	const verifyPintwin = useCallback(
		async (pintwin: string) => {
			if (!customer) {
				setError("No customer selected");
				return { success: false, error: "No customer selected" };
			}

			setLoading(true);
			setError(null);

			try {
				const result = await fetchApi({
					headers: {
						"Content-Type": "application/json",
						"tf-req-uri-root-path": TF_ROOT_PATH,
						"tf-req-uri": BULK_PAYOUT_TF_URIS.VERIFY_PINTWIN,
						"tf-req-method": "POST",
					},
					body: {
						customer_id: customer.customerId,
						pintwin: pintwin,
					},
				});

				if (result?.error) {
					const errorMsg =
						result.data?.message || "Pintwin verification failed";
					setError(errorMsg);
					return { success: false, error: errorMsg };
				}

				const data = result?.data;
				if (data?.status === 0) {
					setStep("main");
					return { success: true };
				} else {
					const errorMsg =
						data?.message || "Pintwin verification failed";
					setError(errorMsg);
					return { success: false, error: errorMsg };
				}
			} catch (error) {
				const errorMsg =
					error instanceof Error
						? error.message
						: "Verification failed";
				setError(errorMsg);
				return { success: false, error: errorMsg };
			} finally {
				setLoading(false);
			}
		},
		[fetchApi, customer, setLoading, setError, setStep]
	);

	/**
	 * Process bulk payout records (upload Excel file)
	 * Uses multipart/form-data with TF headers
	 */
	const processRecords = useCallback(
		async (file: File, payload: ProcessRecordsPayload) => {
			setUploadStatus("uploading");
			setError(null);
			setValidationErrors([]);

			try {
				const result = await fetchApi({
					headers: {
						"tf-req-uri-root-path": TF_ROOT_PATH,
						"tf-req-uri": BULK_PAYOUT_TF_URIS.PROCESS_RECORDS,
						"tf-req-method": "POST",
					},
					body: payload,
					files: {
						file: file,
					},
					isMultipart: true,
				});

				if (result?.error) {
					const errorMsg = result.data?.message || "Upload failed";
					setError(errorMsg);
					setUploadStatus("error");
					return { success: false, error: errorMsg };
				}

				const data = result?.data;
				if (data?.status === 0 && data?.data?.batch_number) {
					// Success - batch created
					setCurrentBatch(data.data.batch_number);
					setUploadStatus("success");
					return {
						success: true,
						batchNumber: data.data.batch_number,
					};
				} else if (data?.data?.validation_errors) {
					// File-level validation errors
					const errors: ValidationError[] =
						data.data.validation_errors.map(
							(err: {
								row_number: number;
								account_number?: string;
								errors: string[];
							}) => ({
								rowNumber: err.row_number,
								accountNumber: err.account_number,
								errors: err.errors,
							})
						);
					setValidationErrors(errors);
					setUploadStatus("error");
					return { success: false, validationErrors: errors };
				} else {
					// General error
					const errorMsg = data?.message || "Upload failed";
					setError(errorMsg);
					setUploadStatus("error");
					return { success: false, error: errorMsg };
				}
			} catch (error) {
				const errorMsg =
					error instanceof Error ? error.message : "Upload failed";
				setError(errorMsg);
				setUploadStatus("error");
				return { success: false, error: errorMsg };
			}
		},
		[
			fetchApi,
			setUploadStatus,
			setError,
			setValidationErrors,
			setCurrentBatch,
		]
	);

	/**
	 * Fetch batch history list
	 */
	const fetchBatchList = useCallback(
		async (userCode: string, orgId: string, serviceCode = "46") => {
			setLoadingHistory(true);

			try {
				const result = await fetchApi({
					headers: {
						"Content-Type": "application/json",
						"tf-req-uri-root-path": TF_ROOT_PATH,
						"tf-req-uri": `${BULK_PAYOUT_TF_URIS.BATCH_LIST}?service_code=${serviceCode}&user_code=${userCode}&org_id=${orgId}`,
						"tf-req-method": "GET",
					},
				});

				if (result?.error) {
					return { success: false, error: result.data?.message };
				}

				const data = result?.data;
				if (data?.status === 0 && data?.data) {
					const batches: BatchHistoryItem[] = data.data.map(
						(item: Record<string, unknown>) => ({
							id: item.id,
							batchNumber: item.batch_number,
							userCode: item.user_code,
							customerNumber: item.customer_number,
							customerName: item.customer_name,
							totalAmount: Number(item.total_amount),
							totalRecords: Number(item.total_records),
							status: item.status,
							successCount: Number(item.success_count),
							failureCount: Number(item.failure_count),
							invalidCount: Number(item.invalid_count || 0),
							createdDate: item.created_date as string,
						})
					);
					setBatches(batches);
					return { success: true, data: batches };
				} else {
					return { success: false, error: data?.message };
				}
			} catch (error) {
				const errorMsg =
					error instanceof Error
						? error.message
						: "Failed to fetch batch history";
				return { success: false, error: errorMsg };
			} finally {
				setLoadingHistory(false);
			}
		},
		[fetchApi, setBatches, setLoadingHistory]
	);

	/**
	 * Fetch single batch status (for polling)
	 */
	const fetchBatchStatus = useCallback(
		async (batchNumber: string) => {
			try {
				const result = await fetchApi({
					headers: {
						"Content-Type": "application/json",
						"tf-req-uri-root-path": TF_ROOT_PATH,
						"tf-req-uri": `${BULK_PAYOUT_TF_URIS.BATCH_STATUS}?batchNumber=${batchNumber}`,
						"tf-req-method": "GET",
					},
				});

				if (result?.error) {
					return { success: false };
				}

				const data = result?.data;
				if (data?.status === 0 && data?.data) {
					const batch = data.data;
					updateBatchStatus(
						batchNumber,
						batch.status,
						batch.success_count,
						batch.failure_count
					);
					return {
						success: true,
						data: {
							status: batch.status,
							successCount: batch.success_count,
							failureCount: batch.failure_count,
						},
					};
				}
				return { success: false };
			} catch {
				return { success: false };
			}
		},
		[fetchApi, updateBatchStatus]
	);

	/**
	 * Download batch report
	 */
	const downloadReport = useCallback(
		async (batchNumber: string) => {
			try {
				const result = await fetchApi({
					headers: {
						"tf-req-uri-root-path": TF_ROOT_PATH,
						"tf-req-uri": `${BULK_PAYOUT_TF_URIS.DOWNLOAD}?batchNumber=${batchNumber}`,
						"tf-req-method": "GET",
					},
				});

				if (result?.error) {
					const errorMsg = result.data?.message || "Download failed";
					setError(errorMsg);
					return { success: false, error: errorMsg };
				}

				// For file downloads, we need to handle the response differently
				// The API might return a URL or the file data directly
				const data = result?.data;
				if (data?.data?.download_url) {
					// If API returns a download URL, open it
					window.open(data.data.download_url, "_blank");
					return { success: true };
				} else if (data?.status === 0) {
					// Direct download might be handled by the API response
					return { success: true };
				} else {
					const errorMsg = data?.message || "Download failed";
					setError(errorMsg);
					return { success: false, error: errorMsg };
				}
			} catch (error) {
				const errorMsg =
					error instanceof Error ? error.message : "Download failed";
				setError(errorMsg);
				return { success: false, error: errorMsg };
			}
		},
		[fetchApi, setError]
	);

	return {
		searchCustomer,
		verifyPintwin,
		processRecords,
		fetchBatchList,
		fetchBatchStatus,
		downloadReport,
		isLoading,
	};
};
