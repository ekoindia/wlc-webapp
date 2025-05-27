import { Breadcrumb } from "components";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
import {
	BreadcrumbItem,
	BreadcrumbsData,
	LabelOverrides,
	resolveBreadcrumbs,
} from ".";

interface BreadcrumbWrapperProps {
	breadcrumbsData?: BreadcrumbsData; // Static mapping of full URLs to breadcrumb labels
	crumbs?: BreadcrumbItem[]; // Direct breadcrumb list override (highest priority)
	slug?: string; // Slug value for dynamic routes (e.g. [slug])
	children?: ReactNode; // Page content to be rendered below the breadcrumbs
	hideHome?: boolean; // Optional flag to hide the 'Home' breadcrumb
	useDynamic?: boolean; // Enable dynamic breadcrumb generation via URL segments
	labelOverrides?: LabelOverrides; // Optional overrides for specific URL segments (used with useDynamic)
	omitPaths?: string[]; // List of full paths to omit from the generated breadcrumbs
}

/**
 * BreadcrumbWrapper component.
 * Renders a breadcrumb navigation bar and wraps the page content.
 *
 * TODO: The BreadcrumpWrapper component should not be needed. Why `wrap` the page inside an empty box?
 * This logic could be part of Breadcrumb component itself and used as a sibling on top of a page.
 *
 * ### Behavior:
 * - **Direct Crumbs**: If `crumbs` is provided, it directly uses the provided breadcrumb list.
 * - **Dynamic Generation**: If `useDynamic` is true, it generates breadcrumbs from the URL segments using `resolveBreadcrumbs`, with optional `labelOverrides` and `omitPaths`.
 * - **Static Mapping**: If `useDynamic` is false and `breadcrumbsData` is provided, it falls back to a static mapping of full paths to labels.
 * @param {BreadcrumbWrapperProps} props - Component properties.
 * @param {BreadcrumbsData} [props.breadcrumbsData] - Static mapping of full URLs to breadcrumb labels (used when `useDynamic` is false).
 * @param {BreadcrumbItem[]} [props.crumbs] - Direct breadcrumb list override (highest priority).
 * @param {string} [props.slug] - Slug value for dynamic routes (e.g., `[slug]` in Next.js).
 * @param {ReactNode} [props.children] - Page content to be rendered below the breadcrumbs.
 * @param {boolean} [props.hideHome] - Flag to hide the 'Home' breadcrumb.
 * @param {boolean} [props.useDynamic] - Enables dynamic breadcrumb generation via URL segments.
 * @param {LabelOverrides} [props.labelOverrides] - Optional overrides for specific URL segments (used with `useDynamic`).
 * @param {string[]} [props.omitPaths] - List of full paths to omit from the generated breadcrumbs.
 * @returns {JSX.Element} A wrapper component that renders a breadcrumb navigation bar and its children.
 * @example
 * // Static breadcrumbs
 * <BreadcrumbWrapper
 *   breadcrumbsData={{
 *     "/about": "About",
 *     "/about/team": "Team",
 *   }}
 * >
 *   <PageContent />
 * </BreadcrumbWrapper>
 * @example
 * // Dynamic breadcrumbs with segment label overrides
 * <BreadcrumbWrapper
 *   useDynamic
 *   labelOverrides={{
 *     "john-doe": "John Doe",
 *     "agent-pricing": "Agent's Pricing",
 *   }}
 * >
 *   <PageContent />
 * </BreadcrumbWrapper>
 * @example
 * // Fully custom breadcrumbs
 * <BreadcrumbWrapper
 *   crumbs={[
 *     { href: "/dashboard", label: "Dashboard", isCurrent: false },
 *     { href: "/dashboard/settings", label: "Settings", isCurrent: true }
 *   ]}
 * >
 *   <PageContent />
 * </BreadcrumbWrapper>
 */
const BreadcrumbWrapper = ({
	breadcrumbsData,
	crumbs: providedCrumbs,
	slug,
	children,
	hideHome = false,
	useDynamic = false,
	labelOverrides = {},
	omitPaths = [],
}: BreadcrumbWrapperProps): JSX.Element => {
	const { asPath, pathname } = useRouter();

	// Memoize the resolved breadcrumbs to avoid unnecessary recalculations
	const crumbs = useMemo(() => {
		return resolveBreadcrumbs({
			asPath,
			pathname,
			breadcrumbsData,
			providedCrumbs,
			useDynamic,
			labelOverrides,
			omitPaths,
			slug,
		});
	}, [
		asPath,
		pathname,
		breadcrumbsData,
		providedCrumbs,
		useDynamic,
		labelOverrides,
		omitPaths,
		slug,
	]);

	return (
		<div>
			<Breadcrumb crumbs={crumbs} hideHome={hideHome} />
			{children}
		</div>
	);
};

export default BreadcrumbWrapper;
