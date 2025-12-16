/**
 * @file Bulk Payout Feature - Type Definitions
 * @description Type definitions for the Bulk Payout module including state management,
 * API payloads, and UI flow control.
 * @module bulk-payout/context/types
 */

/**
 * Active tab in the main view.
 * - `upload` - Upload recipients Excel file
 * - `history` - View batch upload history
 * @typedef {("upload" | "history")} ActiveTab
 */
export type ActiveTab = "upload" | "history";

/**
 * Batch processing status returned from the API.
 * - `INITIATED` - Batch has been created but processing hasn't started
 * - `PROCESSING` - Batch is currently being processed
 * - `SUCCESS` - All records processed successfully
 * - `FAILED` - All records failed to process
 * - `PARTIAL` - Some records succeeded, some failed
 * @typedef {("INITIATED" | "PROCESSING" | "SUCCESS" | "FAILED" | "PARTIAL")} BatchStatus
 */
export type BatchStatus =
	| "INITIATED"
	| "PROCESSING"
	| "SUCCESS"
	| "FAILED"
	| "PARTIAL";

/**
 * Validation error for an individual row in the uploaded Excel file.
 * Returned by the API when file validation fails.
 * @interface ValidationError
 * @property {number} rowNumber - Row number in the Excel file (1-indexed)
 * @property {string} [accountNumber] - Account number if available
 * @property {string[]} errors - Array of error messages for this row
 */
export interface ValidationError {
	/** Row number in the Excel file (1-indexed) */
	rowNumber: number;
	/** Account number associated with the error (if applicable) */
	accountNumber?: string;
	/** Array of validation error messages */
	errors: string[];
}

/**
 * Upload status states for the file upload workflow.
 * - `idle` - No upload in progress
 * - `validating` - Client-side file validation in progress
 * - `uploading` - File is being uploaded to the server
 * - `success` - Upload completed successfully
 * - `error` - Upload failed with error
 * @typedef {("idle" | "validating" | "uploading" | "success" | "error")} UploadStatus
 */
export type UploadStatus =
	| "idle"
	| "validating"
	| "uploading"
	| "success"
	| "error";

/**
 * Single batch history record from the batch list API.
 * Represents one uploaded batch of payout transactions.
 * @interface BatchHistoryItem
 */
export interface BatchHistoryItem {
	/** Unique batch ID from database */
	id: number;
	/** Human-readable batch reference number (e.g., "BATCH1759829405") */
	batchNumber: string;
	/** User code who created the batch */
	userCode: string;
	/** Customer mobile number */
	customerNumber: string;
	/** Customer display name */
	customerName: string;
	/** Total amount in the batch */
	totalAmount: number;
	/** Total number of recipient records */
	totalRecords: number;
	/** Current processing status */
	status: BatchStatus;
	/** Number of successfully processed records */
	successCount: number;
	/** Number of failed records */
	failureCount: number;
	/** Number of invalid records (validation failures) */
	invalidCount?: number;
	/** Number of refunded records */
	refundedCount?: number;
	/** ISO date string when batch was created */
	createdDate: string;
}

/**
 * Extended batch details response for viewing a single batch.
 * Extends BatchHistoryItem with additional fields.
 * @interface BatchDetails
 * @augments BatchHistoryItem
 */
export interface BatchDetails extends BatchHistoryItem {
	/** ISO date string when file was uploaded */
	uploadDate?: string;
}

/**
 * Customer parameters passed via URL query params from Polymer widget.
 * These come from the search customer flow configured in DB.
 * @interface CustomerParams
 */
export interface CustomerParams {
	/** Customer ID (mobile number) */
	customerId: string;
	/** Customer display name */
	customerName: string;
	/** User code for the customer */
	userCode: string;
}

/**
 * Main Bulk Payout context state interface.
 * Contains all state needed for the Bulk Payout feature.
 * @interface BulkPayoutState
 */
export interface BulkPayoutState {
	// =====================
	// Customer Params (from URL)
	// =====================

	/** Customer parameters from URL query params */
	customerParams: CustomerParams | null;

	// =====================
	// Tab State
	// =====================

	/** Currently active tab in the main view */
	activeTab: ActiveTab;

	// =====================
	// Upload State
	// =====================

	/** Current upload operation status */
	uploadStatus: UploadStatus;

	/** Validation errors from file upload */
	validationErrors: ValidationError[];

	/** Batch number after successful upload */
	currentBatchNumber: string | null;

	// =====================
	// History State
	// =====================

	/** List of batch history records */
	batches: BatchHistoryItem[];

	/** Loading state for batch history API */
	isLoadingHistory: boolean;

	// =====================
	// General UI State
	// =====================

	/** General loading state for API calls */
	isLoading: boolean;

	/** Error message to display to user */
	error: string | null;
}

/**
 * Initial state values for Bulk Payout context.
 * Used when initializing the context and for reset operations.
 * @constant {BulkPayoutState} initialState
 */
export const initialState: BulkPayoutState = {
	customerParams: null,
	activeTab: "upload",
	uploadStatus: "idle",
	validationErrors: [],
	currentBatchNumber: null,
	batches: [],
	isLoadingHistory: false,
	isLoading: false,
	error: null,
};

/**
 * Action union type for Bulk Payout reducer.
 * Defines all possible actions that can be dispatched to update state.
 * @typedef {object} Action
 * @description Actions available:
 * @property
 * - `SET_CUSTOMER_PARAMS` - Set customer params from URL query params
 * - `SET_TAB` - Switch between upload and history tabs
 * - `SET_UPLOAD_STATUS` - Update file upload status
 * - `SET_VALIDATION_ERRORS` - Set validation errors from file upload
 * - `SET_CURRENT_BATCH` - Set batch number after successful upload
 * - `SET_BATCHES` - Set batch history list
 * - `UPDATE_BATCH_STATUS` - Update status of a specific batch (for polling)
 * - `SET_LOADING_HISTORY` - Set loading state for history API
 * - `SET_LOADING` - Set general loading state
 * - `SET_ERROR` - Set error message
 * - `RESET_STATE` - Reset to initial state
 * - `RESET_UPLOAD` - Reset only upload-related state
 */
export type Action =
	| { type: "SET_CUSTOMER_PARAMS"; params: CustomerParams }
	| { type: "SET_TAB"; tab: ActiveTab }
	| { type: "SET_UPLOAD_STATUS"; status: UploadStatus }
	| { type: "SET_VALIDATION_ERRORS"; errors: ValidationError[] }
	| { type: "SET_CURRENT_BATCH"; batchNumber: string | null }
	| { type: "SET_BATCHES"; batches: BatchHistoryItem[] }
	| {
			type: "UPDATE_BATCH_STATUS";
			batchNumber: string;
			status: BatchStatus;
			successCount?: number;
			failureCount?: number;
	  }
	| { type: "SET_LOADING_HISTORY"; value: boolean }
	| { type: "SET_LOADING"; value: boolean }
	| { type: "SET_ERROR"; message: string | null }
	| { type: "RESET_STATE" }
	| { type: "RESET_UPLOAD" };
