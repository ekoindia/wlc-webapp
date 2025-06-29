import { useRouter } from "next/router";
import { useContext } from "react";
import { BbpsContext } from "../context/BbpsContext";

export const useBbpsNavigation = () => {
	const router = useRouter();
	const { state } = useContext(BbpsContext);
	const base = `/products/bbps/${state.selectedProduct?.id}`;

	return {
		goPreview: () => router.push(`${base}/preview`),
		goSearch: () => router.push(`${base}/search`),
		goPayment: () => router.push(`${base}/payment`),
		goStatus: () => router.push(`${base}/status`),
		backToGrid: () => router.push("/products/bbps"),
	};
};
