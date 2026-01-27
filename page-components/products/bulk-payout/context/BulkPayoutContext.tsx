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
	BulkPayoutState,
	CustomerParams,
	initialState,
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
			setCustomerParams: (params: CustomerParams) =>
				dispatch({ type: "SET_CUSTOMER_PARAMS", params }),

			setTab: (tab: ActiveTab) => dispatch({ type: "SET_TAB", tab }),

			setProcessingBatchCount: (count: number) =>
				dispatch({ type: "SET_PROCESSING_BATCH_COUNT", count }),
		}),
		[dispatch]
	);

	return { ...state, ...actions };
};
