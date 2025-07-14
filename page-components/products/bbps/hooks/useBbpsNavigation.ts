import { useRouter } from "next/router";
import { useContext } from "react";
import { BbpsContext } from "../context/BbpsContext";
import { Step } from "../context/types";

export const useBbpsNavigation = () => {
	const router = useRouter();
	const { state } = useContext(BbpsContext);
	const base = state.selectedProduct?.id
		? `/products/bbps/${state.selectedProduct.id}`
		: null;

	// Helper to construct full path for a given step
	const getPathForStep = (step: Step): string => {
		if (step === "product-view" || !state.selectedProduct?.id) {
			return "/products/bbps"; // Grid/list page
		}
		if (step === "search") {
			return `${base}/search`;
		}
		return `${base}/${step}`; // preview, payment, status
	};

	const navigate = (path: string) => {
		router.push(path);
	};
	const goStep = (step: Step) => navigate(getPathForStep(step));

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

	return {
		goPreview: () => goStep("preview"),
		goSearch: () => goStep("search"),
		goPayment: () => goStep("payment"),
		goStatus: () => goStep("status"),
		backToGrid: () => navigate("/products/bbps"),
		goPreviousStep,
	};
};
