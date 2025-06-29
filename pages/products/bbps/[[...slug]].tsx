import { PaddingBox } from "components";
import { useRouter } from "next/router";
import { Bbps, Payment, Preview, Search } from "page-components/products/bbps";
import { BbpsProducts } from "page-components/products/bbps/BbpsProducts";
import { BbpsProvider } from "page-components/products/bbps/context/BbpsContext";
import { Step } from "page-components/products/bbps/context/types";
import { BbpsProduct } from "page-components/products/bbps/types";
import { ResponseSection } from "page-components/products/common";
import { FC } from "react";

/**
 * Type definitions for route parameters
 */
interface RouteParams {
	productId?: string;
	step: Step;
}

/**
 * Map of step components for rendering
 */
const STEP_COMPONENTS: Record<Step, FC<{ product?: BbpsProduct }>> = {
	"product-view": Bbps,
	search: Search,
	preview: Preview,
	payment: Payment,
	status: () => (
		<ResponseSection heading="Status" index={1}>
			<div>Status</div>
		</ResponseSection>
	),
};

/**
 * Parse route parameters from Next.js dynamic route
 * @param {string[]} slug  - The slug from the Next.js dynamic route
 * @returns {RouteParams} - The parsed route parameters
 */
const parseRouteParams = (slug?: string[]): RouteParams => {
	if (!slug || slug.length === 0) {
		return { step: "product-view" };
	}

	if (slug.length === 1) {
		return { productId: slug[0], step: "search" };
	}

	return {
		productId: slug[0],
		step: (slug[1] as Step) || "search",
	};
};

/**
 * Entry point for the Bbps page.
 * @returns {JSX.Element} Bbps page
 */
export default function BbpsEntry() {
	const { query } = useRouter();
	const { productId, step } = parseRouteParams(
		query.slug as string[] | undefined
	);

	const product = productId
		? BbpsProducts.find((p) => p.id === productId)
		: undefined;

	const StepComponent =
		STEP_COMPONENTS[step] || STEP_COMPONENTS["product-view"];

	return (
		<PaddingBox>
			<BbpsProvider initialProductId={productId} initialStep={step}>
				<StepComponent product={product} />
			</BbpsProvider>
		</PaddingBox>
	);
}
