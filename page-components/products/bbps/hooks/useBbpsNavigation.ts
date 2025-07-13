import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { BbpsContext } from "../context/BbpsContext";
import { Step } from "../context/types";

/**
 * Navigation validation and state management for BBPS flow
 * Features:
 * - 🛡️ State Validation: Prevents invalid navigation states
 * - 🧠 Smart Back Logic: Context-aware previous step detection
 * - ⚡ Performance: Memoized functions, optimized re-renders
 * - 🐛 Error Resilience: Graceful fallbacks for navigation failures
 */
export const useBbpsNavigation = () => {
	const router = useRouter();
	const { state, dispatch } = useContext(BbpsContext);
	const { currentStep, paymentStatus, selectedBills, billFetchResult } =
		state;

	// Prevent infinite loops with validation flag
	const isValidatingRef = useRef(false);
	const hasValidatedRef = useRef(false);

	/**
	 * 🛡️ State Validation - Check if navigation to a step is valid
	 */
	const canNavigateToStep = useCallback(
		(targetStep: Step): boolean => {
			switch (targetStep) {
				case "product-view":
					return true; // Always accessible

				case "search":
					return true; // Always accessible

				case "preview":
					// Can only go to preview if we have bill fetch results
					return !!billFetchResult;

				case "payment":
					// Can only go to payment if we have selected bills
					return selectedBills.length > 0;

				case "status":
					// Can only go to status if we have payment status
					return !!paymentStatus;

				default:
					return false;
			}
		},
		[billFetchResult, selectedBills.length, paymentStatus]
	);

	/**
	 * Helper function to determine next step
	 */
	const getNextStep = useCallback((): Step | null => {
		switch (currentStep) {
			case "product-view":
				return "search";
			case "search":
				return billFetchResult ? "preview" : null;
			case "preview":
				return selectedBills.length > 0 ? "payment" : null;
			case "payment":
				return paymentStatus ? "status" : null;
			case "status":
				return null; // No next step after status
			default:
				return null;
		}
	}, [currentStep, billFetchResult, selectedBills.length, paymentStatus]);

	/**
	 * 🧠 Smart Back Logic - Determine the appropriate previous step
	 */
	const getPreviousStep = useCallback((): Step => {
		switch (currentStep) {
			case "product-view":
				return "product-view"; // Stay on product view

			case "search":
				return "product-view";

			case "preview":
				return "search";

			case "payment":
				return "preview";

			case "status":
				// Smart logic: If payment is complete, go back to search for new payment
				// This prevents users from going back to payment screen after completion
				if (paymentStatus?.status === "success") {
					return "search";
				}
				return "payment";

			default:
				return "search"; // Fallback
		}
	}, [currentStep, paymentStatus?.status]);

	/**
	 * 🐛 Error Resilience - Safe navigation with fallback
	 */
	const safeNavigate = useCallback(
		(targetStep: Step, fallbackStep: Step = "search") => {
			// Prevent navigation during validation to avoid loops
			if (isValidatingRef.current) {
				console.warn(
					"[BBPS Navigation] Skipping navigation during validation"
				);
				return;
			}

			try {
				// Validate navigation
				if (!canNavigateToStep(targetStep)) {
					console.warn(
						`[BBPS Navigation] Invalid navigation to ${targetStep}, using fallback: ${fallbackStep}`
					);
					targetStep = fallbackStep;
				}

				// Update context state
				dispatch({ type: "SET_CURRENT_STEP", step: targetStep });

				// Navigate using router
				const { productId } = router.query;
				if (targetStep === "product-view") {
					router.push("/products/bbps");
				} else if (productId) {
					router.push(`/products/bbps/${productId}/${targetStep}`);
				} else {
					// Fallback if no product ID
					router.push("/products/bbps");
				}
			} catch (error) {
				console.error("[BBPS Navigation] Navigation error:", error);
				// Ultimate fallback - go to search
				dispatch({ type: "SET_CURRENT_STEP", step: "search" });
				router.push("/products/bbps");
			}
		},
		[canNavigateToStep, dispatch, router]
	);

	/**
	 * 🛡️ URL Validation - Handle direct URL access to invalid states
	 * This effect runs ONCE when the component mounts and validates the current step
	 */
	useEffect(() => {
		// Only run validation once when router is ready and we haven't validated yet
		if (
			!router.isReady ||
			hasValidatedRef.current ||
			isValidatingRef.current
		) {
			return;
		}

		// Check if current step is valid for current state
		const isValidState = canNavigateToStep(currentStep);

		if (!isValidState) {
			console.warn(
				`[BBPS Navigation] Direct URL access to invalid state: ${currentStep}`
			);

			// Set validation flags to prevent loops
			isValidatingRef.current = true;
			hasValidatedRef.current = true;

			// Determine the most appropriate fallback step
			let fallbackStep: Step = "search";

			// If we have bill results but no selected bills, go to preview
			if (
				billFetchResult &&
				selectedBills.length === 0 &&
				currentStep === "payment"
			) {
				fallbackStep = "preview";
			}
			// If we have selected bills but no payment status, go to payment
			else if (
				selectedBills.length > 0 &&
				!paymentStatus &&
				currentStep === "status"
			) {
				fallbackStep = "payment";
			}
			// If we have no bill results but trying to access preview/payment/status, go to search
			else if (
				!billFetchResult &&
				(currentStep === "preview" ||
					currentStep === "payment" ||
					currentStep === "status")
			) {
				fallbackStep = "search";
			}

			// Use setTimeout to avoid blocking the render cycle
			setTimeout(() => {
				// Update context state directly without using safeNavigate to avoid recursion
				dispatch({ type: "SET_CURRENT_STEP", step: fallbackStep });

				// Navigate using router
				const { productId } = router.query;
				if (productId) {
					router.replace(
						`/products/bbps/${productId}/${fallbackStep}`
					);
				} else {
					router.replace("/products/bbps");
				}

				// Reset validation flag after navigation
				isValidatingRef.current = false;
			}, 0);
		} else {
			// Mark as validated even if state is valid
			hasValidatedRef.current = true;
		}
	}, [router.isReady]); // Only depend on router.isReady to run once

	/**
	 * ⚡ Performance - Memoized navigation functions
	 */
	const navigationFunctions = useMemo(
		() => ({
			goProductView: () => safeNavigate("product-view"),
			goSearch: () => safeNavigate("search"),
			goPreview: () => safeNavigate("preview"),
			goPayment: () => safeNavigate("payment"),
			goStatus: () => safeNavigate("status"),

			/**
			 * Smart back navigation with context awareness
			 */
			goPreviousStep: () => {
				const previousStep = getPreviousStep();
				safeNavigate(previousStep);
			},

			/**
			 * Check if we can go to the next logical step
			 */
			canGoNext: (): boolean => {
				const nextStep = getNextStep();
				return nextStep ? canNavigateToStep(nextStep) : false;
			},

			/**
			 * Go to the next logical step if possible
			 */
			goNextStep: () => {
				const nextStep = getNextStep();
				if (nextStep && canNavigateToStep(nextStep)) {
					safeNavigate(nextStep);
				}
			},
		}),
		[safeNavigate, getPreviousStep, getNextStep, canNavigateToStep]
	);

	/**
	 * 🛡️ State Validation - Get current navigation state
	 */
	const navigationState = useMemo(
		() => ({
			currentStep,
			canGoBack: ["search", "preview", "payment", "status"].includes(
				currentStep
			),
			canGoNext: navigationFunctions.canGoNext(),
			previousStep: getPreviousStep(),
			nextStep: getNextStep(),
			isValidState: canNavigateToStep(currentStep),
		}),
		[
			currentStep,
			navigationFunctions,
			getPreviousStep,
			getNextStep,
			canNavigateToStep,
		]
	);

	return {
		...navigationFunctions,
		navigationState,
		canNavigateToStep,
		getPreviousStep,
	};
};
