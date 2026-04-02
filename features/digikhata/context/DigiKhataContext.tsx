import React, { createContext, useContext, useMemo, useReducer } from "react";
import { digiKhataReducer, initialState } from "./reducer";
import { Action, DigiKhataState } from "./types";

interface DigiKhataContextValue {
	state: DigiKhataState;
	dispatch: React.Dispatch<Action>;
}

export const DigiKhataContext = createContext<DigiKhataContextValue>(null!);

interface DigiKhataProviderProps {
	children: React.ReactNode;
	/** Flow mode — "assisted" starts at search-customer step, "self" uses default initial state */
	mode?: "self" | "assisted";
}

/**
 * Provider for DigiKhata product state.
 * Wrap the DigiKhata page component with this to enable all step components
 * to access shared wallet/recipient/step state.
 * @param root0
 * @param root0.children
 * @param root0.mode
 */
export const DigiKhataProvider: React.FC<DigiKhataProviderProps> = ({
	children,
	mode = "self",
}) => {
	const computedInitialState: DigiKhataState =
		mode === "assisted"
			? {
					...initialState,
					step: "search-customer",
					mode: "assisted",
					activeMobile: "",
				}
			: initialState;

	const [state, dispatch] = useReducer(
		digiKhataReducer,
		computedInitialState
	);
	const value = useMemo(() => ({ state, dispatch }), [state]);

	return (
		<DigiKhataContext.Provider value={value}>
			{children}
		</DigiKhataContext.Provider>
	);
};

/**
 * Hook to consume DigiKhata context.
 * @throws if used outside <DigiKhataProvider>
 */
export const useDigiKhata = (): DigiKhataContextValue => {
	const ctx = useContext(DigiKhataContext);
	if (!ctx) {
		throw new Error("useDigiKhata must be used inside <DigiKhataProvider>");
	}
	return ctx;
};
