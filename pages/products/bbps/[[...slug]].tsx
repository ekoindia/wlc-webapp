import { Breadcrumb, PaddingBox } from "components";
import { generateBreadcrumbs } from "components/BreadcrumbWrapper/breadcrumbUtils";
import { useRouter } from "next/router";
import {
	Bbps,
	Payment,
	Preview,
	Search,
	Status,
} from "page-components/products/bbps";
import { BbpsProducts } from "page-components/products/bbps/BbpsProducts";
import { BbpsProvider } from "page-components/products/bbps/context/BbpsContext";
import { Step } from "page-components/products/bbps/context/types";
import { BbpsProduct } from "page-components/products/bbps/types";
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
	status: Status,
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
export default function BbpsPage() {
	const router = useRouter();
	const { query } = router;
	const { productId, step } = parseRouteParams(
		query.slug as string[] | undefined
	);

	const product = productId
		? BbpsProducts.find((p) => p.id === productId)
		: undefined;

	const StepComponent =
		STEP_COMPONENTS[step] || STEP_COMPONENTS["product-view"];

	// Compute label overrides
	const labelOverrides = {
		products: "Products",
		bbps: "Bharat Bill Payment System",
		...(product ? { [product.id]: product.label } : {}),
	};

	const omitPaths = ["/products"];

	// Generate breadcrumbs
	const crumbs = generateBreadcrumbs(
		router.asPath,
		labelOverrides,
		omitPaths
	);

	return (
		<PaddingBox>
			<BbpsProvider initialProductId={productId} initialStep={step}>
				<Breadcrumb crumbs={crumbs} />
				<StepComponent product={product} />
			</BbpsProvider>
		</PaddingBox>
	);
}

BbpsPage.pageMeta = {
	title: "Bbps | Products",
	isFixedBottomAppBar: true,
};
