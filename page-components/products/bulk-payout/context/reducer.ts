/**
 * @file Bulk Payout Feature - State Reducer
 * @description Redux-style reducer for managing Bulk Payout state transitions.
 * Handles all state updates through dispatched actions.
 * @module bulk-payout/context/reducer
 */

import { Action, BulkPayoutState, initialState } from "./types";

/**
 * Reducer function for managing Bulk Payout state transitions.
 *
 * This reducer handles all state updates for the Bulk Payout feature including:
 * - Workflow step navigation
 * - Customer search and verification
 * - File upload status management
 * - Batch history updates
 * - Error handling
 * @function bulkPayoutReducer
 * @param {BulkPayoutState} state - Current state of the Bulk Payout feature
 * @param {Action} action - Action object containing type and payload
 * @returns {BulkPayoutState} New state after applying the action
 * @example
 * // Navigate to OTP verification step
 * dispatch({ type: "SET_STEP", step: "otp-verification" });
 * @example
 * // Set customer after successful search
 * dispatch({
 *   type: "SET_CUSTOMER",
 *   payload: { customerId: "123", customerNumber: "9876543210", customerName: "John" }
 * });
 * @example
 * // Update batch status during polling
 * dispatch({
 *   type: "UPDATE_BATCH_STATUS",
 *   batchNumber: "BATCH123",
 *   status: "SUCCESS",
 *   successCount: 10,
 *   failureCount: 0
 * });
 */
export const bulkPayoutReducer = (
	state: BulkPayoutState,
	action: Action
): BulkPayoutState => {
	switch (action.type) {
		/**
		 * SET_STEP - Navigate to a different workflow step.
		 * Also clears any existing error when changing steps.
		 */
		case "SET_STEP":
			return {
				...state,
				currentStep: action.step,
				// Reset error when changing steps
				error: null,
			};

		/**
		 * SET_TAB - Switch between upload and history tabs in main view.
		 */
		case "SET_TAB":
			return {
				...state,
				activeTab: action.tab,
			};

		/**
		 * SET_CUSTOMER - Set customer info after successful search.
		 * Automatically advances to OTP verification step if customer is set.
		 * Returns to customer search step if customer is null.
		 */
		case "SET_CUSTOMER":
			return {
				...state,
				customer: action.payload,
				// Move to OTP step if customer is set
				currentStep: action.payload
					? "otp-verification"
					: "customer-search",
				error: null,
			};

		/**
		 * SET_UPLOAD_STATUS - Update the current upload operation status.
		 * Used to track file upload progress.
		 */
		case "SET_UPLOAD_STATUS":
			return {
				...state,
				uploadStatus: action.status,
			};

		/**
		 * SET_VALIDATION_ERRORS - Set validation errors from file upload.
		 * Automatically sets uploadStatus to 'error' if errors exist.
		 */
		case "SET_VALIDATION_ERRORS":
			return {
				...state,
				validationErrors: action.errors,
				uploadStatus:
					action.errors.length > 0 ? "error" : state.uploadStatus,
			};

		/**
		 * SET_CURRENT_BATCH - Set batch number after successful upload.
		 * Automatically sets uploadStatus to 'success' if batch number is set.
		 */
		case "SET_CURRENT_BATCH":
			return {
				...state,
				currentBatchNumber: action.batchNumber,
				uploadStatus: action.batchNumber
					? "success"
					: state.uploadStatus,
			};

		/**
		 * SET_BATCHES - Replace the entire batch history list.
		 * Used when fetching batch history from API.
		 * Also resets isLoadingHistory to false.
		 */
		case "SET_BATCHES":
			return {
				...state,
				batches: action.batches,
				isLoadingHistory: false,
			};

		/**
		 * UPDATE_BATCH_STATUS - Update status of a specific batch.
		 * Used for polling to update batch processing status.
		 * Only updates the matching batch, preserves others.
		 */
		case "UPDATE_BATCH_STATUS":
			return {
				...state,
				batches: state.batches.map((batch) =>
					batch.batchNumber === action.batchNumber
						? {
								...batch,
								status: action.status,
								successCount:
									action.successCount ?? batch.successCount,
								failureCount:
									action.failureCount ?? batch.failureCount,
							}
						: batch
				),
			};

		/**
		 * SET_LOADING_HISTORY - Set loading state for batch history API.
		 */
		case "SET_LOADING_HISTORY":
			return {
				...state,
				isLoadingHistory: action.value,
			};

		/**
		 * SET_LOADING - Set general loading state for API calls.
		 */
		case "SET_LOADING":
			return {
				...state,
				isLoading: action.value,
			};

		/**
		 * SET_ERROR - Set error message to display to user.
		 * Also sets isLoading to false.
		 */
		case "SET_ERROR":
			return {
				...state,
				error: action.message,
				isLoading: false,
			};

		/**
		 * RESET_UPLOAD - Reset only upload-related state.
		 * Used when user wants to upload another file.
		 * Preserves customer info and other state.
		 */
		case "RESET_UPLOAD":
			return {
				...state,
				uploadStatus: "idle",
				validationErrors: [],
				currentBatchNumber: null,
				error: null,
			};

		/**
		 * RESET_STATE - Reset entire state to initial values.
		 * Used when starting a new session or logging out.
		 */
		case "RESET_STATE":
			return {
				...initialState,
			};

		/**
		 * Default case - return current state unchanged.
		 * Handles unknown action types gracefully.
		 */
		default:
			return state;
	}
};
