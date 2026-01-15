/**
 * @file Bulk Payout Feature - State Reducer
 * @description Redux-style reducer for managing Bulk Payout state transitions.
 * Handles all state updates through dispatched actions.
 * @module bulk-payout/context/reducer
 */

import { Action, BulkPayoutState } from "./types";

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
		 * SET_PROCESSING_BATCH_COUNT - Update count of batches in PROCESSING status.
		 * Used when fetching batch history to determine upload availability.
		 */
		case "SET_PROCESSING_BATCH_COUNT":
			return {
				...state,
				processingBatchCount: action.count,
			};

		/**
		 * Default case - return current state unchanged.
		 * Handles unknown action types gracefully.
		 */
		default:
			return state;
	}
};
