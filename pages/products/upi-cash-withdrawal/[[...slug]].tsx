import { Breadcrumb, PaddingBox } from "components";
import { generateBreadcrumbs } from "components/BreadcrumbWrapper/breadcrumbUtils";
import { useRouter } from "next/router";
import {
	Onboarding,
	UpiCashWithdrawal,
	Withdrawal,
} from "page-components/products/upi-cash-withdrawal";
import type { UpiCashStep } from "page-components/products/upi-cash-withdrawal";
import { FC } from "react";

/**
 * Map of step slug → component. The default (`gate`) resolves enablement /
 * registration and routes to onboarding vs withdrawal with no provider step.
 */
const STEP_COMPONENTS: Record<UpiCashStep, FC> = {
	gate: UpiCashWithdrawal,
	onboarding: Onboarding,
	withdrawal: Withdrawal,
};

/**
 * Parse the step slug from the Next.js catch-all route. Anything unrecognised
 * (including no slug) falls back to the `gate`, which decides where to send the agent.
 * @param {string[]} [slug] - The catch-all slug segments.
 * @returns {UpiCashStep} The resolved step.
 */
const parseStep = (slug?: string[]): UpiCashStep => {
	const first = slug?.[0];
	if (first && first in STEP_COMPONENTS) {
		return first as UpiCashStep;
	}
	return "gate";
};

/**
 * Entry point for the UPI Cash Withdrawal custom product page.
 * @returns {JSX.Element} The UPI Cash Withdrawal page.
 */
export default function UpiCashWithdrawalPage(): JSX.Element {
	const router = useRouter();
	const step = parseStep(router.query.slug as string[] | undefined);
	const StepComponent = STEP_COMPONENTS[step];

	const labelOverrides = {
		products: "Products",
		"upi-cash-withdrawal": "UPI Cash Withdrawal",
	};

	const omitPaths = ["/products"];

	const crumbs = generateBreadcrumbs(
		router.asPath,
		labelOverrides,
		omitPaths
	);

	return (
		<PaddingBox>
			<Breadcrumb crumbs={crumbs} hideHome />
			<StepComponent />
		</PaddingBox>
	);
}

UpiCashWithdrawalPage.pageMeta = {
	title: "UPI Cash Withdrawal | Products",
	isFixedBottomAppBar: true,
};
