import {
	createContext,
	Dispatch,
	ReactNode,
	useContext,
	useMemo,
	useReducer,
} from "react";
import { bulkPayoutReducer } from "./reducer";
import {
	Action,
	ActiveTab,
	BatchHistoryItem,
	BulkPayoutState,
	BulkPayoutStep,
	CustomerInfo,
	initialState,
	UploadStatus,
	ValidationError,
} from "./types";

/**
 * Context for Bulk Payout state
 */
const BulkPayoutContext = createContext<{
	state: BulkPayoutState;
	dispatch: Dispatch<Action>;
} | null>(null);

/**
 * Provider component for Bulk Payout context
 * @param root0
 * @param root0.children
 */
export const BulkPayoutProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(bulkPayoutReducer, initialState);

	const value = useMemo(() => ({ state, dispatch }), [state]);

	return (
		<BulkPayoutContext.Provider value={value}>
			{children}
		</BulkPayoutContext.Provider>
	);
};

/**
 * Hook to access Bulk Payout context
 * @returns Context value with state and dispatch
 * @throws Error if used outside provider
 */
export const useBulkPayoutContext = () => {
	const context = useContext(BulkPayoutContext);
	if (!context) {
		throw new Error(
			"useBulkPayoutContext must be used within a BulkPayoutProvider"
		);
	}
	return context;
};

/**
 * Hook for Bulk Payout state and actions
 * Provides convenient action dispatchers
 */
export const useBulkPayout = () => {
	const { state, dispatch } = useBulkPayoutContext();

	const actions = useMemo(
		() => ({
			setStep: (step: BulkPayoutStep) =>
				dispatch({ type: "SET_STEP", step }),

			setTab: (tab: ActiveTab) => dispatch({ type: "SET_TAB", tab }),

			setCustomer: (customer: CustomerInfo | null) =>
				dispatch({ type: "SET_CUSTOMER", payload: customer }),

			setUploadStatus: (status: UploadStatus) =>
				dispatch({ type: "SET_UPLOAD_STATUS", status }),

			setValidationErrors: (errors: ValidationError[]) =>
				dispatch({ type: "SET_VALIDATION_ERRORS", errors }),

			setCurrentBatch: (batchNumber: string | null) =>
				dispatch({ type: "SET_CURRENT_BATCH", batchNumber }),

			setBatches: (batches: BatchHistoryItem[]) =>
				dispatch({ type: "SET_BATCHES", batches }),

			updateBatchStatus: (
				batchNumber: string,
				status: BatchHistoryItem["status"],
				successCount?: number,
				failureCount?: number
			) =>
				dispatch({
					type: "UPDATE_BATCH_STATUS",
					batchNumber,
					status,
					successCount,
					failureCount,
				}),

			setLoadingHistory: (value: boolean) =>
				dispatch({ type: "SET_LOADING_HISTORY", value }),

			setLoading: (value: boolean) =>
				dispatch({ type: "SET_LOADING", value }),

			setError: (message: string | null) =>
				dispatch({ type: "SET_ERROR", message }),

			resetUpload: () => dispatch({ type: "RESET_UPLOAD" }),

			resetState: () => dispatch({ type: "RESET_STATE" }),
		}),
		[dispatch]
	);

	return { ...state, ...actions };
};
