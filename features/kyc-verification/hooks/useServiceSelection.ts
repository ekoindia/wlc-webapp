/**
 * Hook for managing service selection state.
 * Supports both single and multi-service selection modes.
 * Persists state to localStorage for session recovery.
 */

import { useLocalStorage } from "hooks";
import { useCallback, useMemo } from "react";
import {
	KYC_MULTI_SERVICE_STORAGE_KEY,
	MULTI_SERVICE_SESSION_TIMEOUT_MS,
} from "../constants";
import type { MultiServiceState } from "../types";

const DEFAULT_STATE: MultiServiceState = {
	isMultiModeEnabled: false,
	selectedServices: [],
	timestamp: 0,
};

interface UseServiceSelectionReturn {
	/** Whether multi-service mode is enabled */
	isMultiModeEnabled: boolean;
	/** Array of selected service codes */
	selectedServices: string[];
	/** Number of selected services */
	selectedCount: number;
	/** Enable/disable multi-service mode */
	setMultiModeEnabled: (_enabled: boolean) => void;
	/** Toggle multi-service mode */
	toggleMultiMode: () => void;
	/** Toggle selection of a service */
	toggleService: (_serviceCode: string) => void;
	/** Add a service to selection */
	addService: (_serviceCode: string) => void;
	/** Remove a service from selection */
	removeService: (_serviceCode: string) => void;
	/** Check if a service is selected */
	isSelected: (_serviceCode: string) => boolean;
	/** Clear all selections */
	clearSelection: () => void;
	/** Reset all state (mode + selection) */
	resetAll: () => void;
	/** Validate if current state is valid for form navigation */
	isValidForNavigation: boolean;
}

/**
 * Hook for managing service selection state.
 * Supports both single and multi-service selection modes with localStorage persistence.
 * @returns {UseServiceSelectionReturn} Object with selection state and control functions
 */
export const useServiceSelection = (): UseServiceSelectionReturn => {
	const [state, setState] = useLocalStorage<MultiServiceState>(
		KYC_MULTI_SERVICE_STORAGE_KEY,
		DEFAULT_STATE
	);

	/**
	 * Check if session is still valid (not expired).
	 */
	const isSessionValid = useMemo(() => {
		if (!state.timestamp) return false;
		const now = Date.now();
		return now - state.timestamp < MULTI_SERVICE_SESSION_TIMEOUT_MS;
	}, [state.timestamp]);

	/**
	 * Get current state, resetting if session expired.
	 */
	const currentState = useMemo((): MultiServiceState => {
		if (!isSessionValid && state.selectedServices.length > 0) {
			// Session expired, return default but keep multi-mode setting
			return {
				...DEFAULT_STATE,
				isMultiModeEnabled: state.isMultiModeEnabled,
			};
		}
		return state;
	}, [state, isSessionValid]);

	/**
	 * Update state with new timestamp.
	 */
	const updateState = useCallback(
		(updates: Partial<MultiServiceState>) => {
			setState((prev) => ({
				...prev,
				...updates,
				timestamp: Date.now(),
			}));
		},
		[setState]
	);

	/**
	 * Set multi-mode enabled/disabled.
	 */
	const setMultiModeEnabled = useCallback(
		(enabled: boolean) => {
			updateState({
				isMultiModeEnabled: enabled,
				// Clear selections when disabling multi-mode
				selectedServices: enabled ? currentState.selectedServices : [],
			});
		},
		[updateState, currentState.selectedServices]
	);

	/**
	 * Toggle multi-mode.
	 */
	const toggleMultiMode = useCallback(() => {
		setMultiModeEnabled(!currentState.isMultiModeEnabled);
	}, [setMultiModeEnabled, currentState.isMultiModeEnabled]);

	/**
	 * Toggle a service's selection.
	 */
	const toggleService = useCallback(
		(serviceCode: string) => {
			const isCurrentlySelected =
				currentState.selectedServices.includes(serviceCode);
			const newSelection = isCurrentlySelected
				? currentState.selectedServices.filter((s) => s !== serviceCode)
				: [...currentState.selectedServices, serviceCode];

			updateState({ selectedServices: newSelection });
		},
		[updateState, currentState.selectedServices]
	);

	/**
	 * Add a service to selection.
	 */
	const addService = useCallback(
		(serviceCode: string) => {
			if (!currentState.selectedServices.includes(serviceCode)) {
				updateState({
					selectedServices: [
						...currentState.selectedServices,
						serviceCode,
					],
				});
			}
		},
		[updateState, currentState.selectedServices]
	);

	/**
	 * Remove a service from selection.
	 */
	const removeService = useCallback(
		(serviceCode: string) => {
			updateState({
				selectedServices: currentState.selectedServices.filter(
					(s) => s !== serviceCode
				),
			});
		},
		[updateState, currentState.selectedServices]
	);

	/**
	 * Check if a service is selected.
	 */
	const isSelected = useCallback(
		(serviceCode: string) =>
			currentState.selectedServices.includes(serviceCode),
		[currentState.selectedServices]
	);

	/**
	 * Clear all selections but keep mode.
	 */
	const clearSelection = useCallback(() => {
		updateState({ selectedServices: [] });
	}, [updateState]);

	/**
	 * Reset everything to default.
	 */
	const resetAll = useCallback(() => {
		setState(DEFAULT_STATE);
	}, [setState]);

	/**
	 * Check if state is valid for navigation to form page.
	 */
	const isValidForNavigation = useMemo(() => {
		return currentState.selectedServices.length > 0;
	}, [currentState.selectedServices.length]);

	return {
		isMultiModeEnabled: currentState.isMultiModeEnabled,
		selectedServices: currentState.selectedServices,
		selectedCount: currentState.selectedServices.length,
		setMultiModeEnabled,
		toggleMultiMode,
		toggleService,
		addService,
		removeService,
		isSelected,
		clearSelection,
		resetAll,
		isValidForNavigation,
	};
};
