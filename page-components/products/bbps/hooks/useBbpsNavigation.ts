import { useRouter } from "next/router";
import { useContext } from "react";
import { BbpsContext } from "../context/BbpsContext";
import { Step } from "../context/types";

/**
 * Hook for BBPS navigation management
 * Provides navigation functions for different steps in the BBPS workflow
 * @returns {object} Navigation functions for BBPS workflow steps
 * @example
 * ```tsx
 * const { goSearch, goPreview, goPayment, backToGrid } = useBbpsNavigation();
 * ```
 */
export const useBbpsNavigation = () => {
	const router = useRouter();
	const { state } = useContext(BbpsContext);
	const base = state.selectedProduct?.id
		? `/products/bbps/${state.selectedProduct.id}`
		: null;

	/**
	 * Helper to construct full path for a given step
	 * @param {Step} step - The step to get the path for
	 * @returns {string} Full path for the given step
	 */
	const getPathForStep = (step: Step): string => {
		if (step === "product-view" || !state.selectedProduct?.id) {
			return "/products/bbps"; // Grid/list page
		}
		if (step === "search") {
			return `${base}/search`;
		}
		return `${base}/${step}`; // preview, payment, status
	};

	/**
	 * Navigate to a specific path
	 * @param {string} path - The path to navigate to
	 */
	const navigate = (path: string) => {
		router.push(path);
	};

	/**
	 * Navigate to a specific step
	 * @param {Step} step - The step to navigate to
	 */
	const goStep = (step: Step) => navigate(getPathForStep(step));

	/**
	 * Navigate to the previous step in the workflow
	 * Handles special cases like going back from status to search
	 */
	const goPreviousStep = () => {
		const order: Step[] = [
			"product-view",
			"search",
			"preview",
			"payment",
			"status",
		];
		const currentIndex = order.indexOf(state.currentStep);

		// Special case: from status screen, don't go back to payment
		// since payment is already completed - go to search instead
		if (state.currentStep === "status") {
			navigate(getPathForStep("search"));
			return;
		}

		const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
		const prevStep = order[prevIndex];
		navigate(getPathForStep(prevStep));
	};

	/**
	 * Return navigation functions for BBPS workflow
	 * @returns {object} Navigation functions
	 */
	return {
		goPreview: () => goStep("preview"),
		goSearch: () => goStep("search"),
		goPayment: () => goStep("payment"),
		goStatus: () => goStep("status"),
		backToGrid: () => navigate("/products/bbps"),
		goPreviousStep,
	};
};
