import { useRouter } from "next/router";
import { useContext } from "react";
import { BbpsContext } from "../context/BbpsContext";

export const useBbpsNavigation = () => {
	const router = useRouter();
	const { state } = useContext(BbpsContext);
	const base = state.selectedProduct?.id
		? `/products/bbps/${state.selectedProduct.id}`
		: null;

	const navigate = (path: string) => {
		if (base) {
			router.push(`${base}${path}`);
		} else {
			console.error("BBPS Navigation Error: No product selected.");
			// Fallback to the main products page
			router.push("/products/bbps");
		}
	};

	return {
		goPreview: () => navigate("/preview"),
		goSearch: () => navigate("/search"),
		goPayment: () => navigate("/payment"),
		goStatus: () => navigate("/status"),
		backToGrid: () => router.push("/products/bbps"),
	};
};
