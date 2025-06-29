// context/BbpsContext.tsx
import * as React from "react";
import { createContext, useEffect, useMemo, useReducer } from "react";
import { BbpsProducts } from "../BbpsProducts";
import { bbpsReducer } from "./reducer";
import { Action, BbpsState, initialState, Step } from "./types";

/**
 * Context for managing BBPS (Bharat Bill Payment System) state
 * @interface BbpsContextType
 * @property {BbpsState} state - Current BBPS state
 * @property {React.Dispatch<Action>} dispatch - State dispatch function
 */
export const BbpsContext = createContext<{
	state: BbpsState;
	dispatch: React.Dispatch<Action>;
}>(null!);

/**
 * Provider component for BBPS context
 * @param {object} props - Component props
 * @param {string} [props.initialProductId] - Initial product ID to select
 * @param {Step} props.initialStep - Initial step to display
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const BbpsProvider: React.FC<{
	initialProductId?: string;
	initialStep: Step;
	children: React.ReactNode;
}> = ({ initialProductId, initialStep, children }) => {
	const [state, dispatch] = useReducer(bbpsReducer, initialState);

	/* sync step */
	useEffect(() => {
		dispatch({
			type: "SET_CURRENT_STEP",
			step: initialStep,
		});
	}, [initialStep]);

	/* auto select product when initialProductId changes */
	useEffect(() => {
		if (initialProductId) {
			// lookup product from registry
			const product = BbpsProducts.find(
				(product) => product.id === initialProductId
			);
			console.log("[BBPS] Selecting product", product);

			// Only dispatch if it's a different product
			if (
				!state.selectedProduct ||
				state.selectedProduct.id !== initialProductId
			) {
				dispatch({ type: "SET_SELECTED_PRODUCT", payload: product });
			}
		}
	}, [initialProductId, state.selectedProduct?.id, dispatch]);

	const value = useMemo(() => ({ state, dispatch }), [state]);

	return (
		<BbpsContext.Provider value={value}>{children}</BbpsContext.Provider>
	);
};
