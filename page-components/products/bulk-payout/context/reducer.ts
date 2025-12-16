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
 * - Tab navigation
 * - File upload status management
 * - Batch history updates
 * - Error handling
 * @function bulkPayoutReducer
 * @param {BulkPayoutState} state - Current state of the Bulk Payout feature
 * @param {Action} action - Action object containing type and payload
 * @returns {BulkPayoutState} New state after applying the action
 * @example
 * // Switch to history tab
 * dispatch({ type: "SET_TAB", tab: "history" });
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
		 * SET_CUSTOMER_PARAMS - Set customer params from URL query params.
		 * Called when component mounts to populate customer data from Polymer widget.
		 */
		case "SET_CUSTOMER_PARAMS":
			return {
				...state,
				customerParams: action.params,
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
