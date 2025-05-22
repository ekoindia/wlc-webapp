import { Box } from "@chakra-ui/react";
import { Breadcrumb } from "components";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { generateBreadcrumbs } from ".";

interface BreadcrumbItem {
	href: string; // URL for the breadcrumb
	label: string; // Display label for the breadcrumb
	isCurrent: boolean; // Indicates if the breadcrumb is the current page
}

interface BreadcrumbsData {
	[path: string]: string; // Static mapping: full URL → label
}

interface LabelOverrides {
	[segment: string]: string; // Dynamic override: segment → label
}

interface BreadcrumbWrapperProps {
	breadcrumbsData?: BreadcrumbsData; // For static breadcrumb rendering
	crumbs?: BreadcrumbItem[]; // Direct breadcrumb list override (highest priority)
	slug?: string; // Slug value for dynamic routes (e.g. [slug])
	children?: ReactNode; // Page content to be rendered below the breadcrumbs
	hideHome?: boolean; // Optional flag to hide the 'Home' breadcrumb
	useDynamic?: boolean; // Enable dynamic breadcrumb generation via path segments
	labelOverrides?: LabelOverrides; // Optional dynamic label overrides (used with useDynamic)
	omitPaths?: string[]; // Optional list of full paths to omit from breadcrumbs
}

/**
 * BreadcrumbWrapper component.
 * Wraps page content with a breadcrumb navigation bar.
 *
 * ### Behavior:
 * - **Direct Crumbs**: If `crumbs` is provided, it directly uses the provided breadcrumb list.
 * - **Dynamic Generation**: If `useDynamic` is true, it generates breadcrumbs from the URL segments using `generateBreadcrumbs`, with optional `labelOverrides` and `omitPaths`.
 * - **Static Mapping**: If `useDynamic` is false and `breadcrumbsData` is provided, it falls back to a static mapping of full paths to labels.
 * @param {object} props - Component properties.
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
	const router = useRouter();
	const [crumbs, setCrumbs] = useState<BreadcrumbItem[]>([]);

	useEffect(() => {
		// Priority 1: Direct crumbs provided
		if (providedCrumbs) {
			setCrumbs(providedCrumbs);
			return;
		}

		// Priority 2: Dynamic generation
		if (useDynamic) {
			const asPath = router.asPath;
			const dynamicCrumbs = generateBreadcrumbs(
				asPath,
				labelOverrides,
				omitPaths
			);
			setCrumbs(dynamicCrumbs);
			return;
		}

		// Priority 3: Static path mapping
		if (breadcrumbsData) {
			// Get the current path and replace the slug if present
			const currentURL = router.pathname.replace("[slug]", slug || "");
			const pathArray = currentURL.split("/");

			let URL = "";
			const _crumbs: BreadcrumbItem[] = [];

			pathArray.forEach((path, index) => {
				if (!path) return;
				URL += "/" + path;
				if (breadcrumbsData[URL]) {
					_crumbs.push({
						href: URL,
						label: breadcrumbsData[URL],
						isCurrent: index === pathArray.length - 1,
					});
				}
			});
			setCrumbs(_crumbs);
		}
	}, [providedCrumbs, useDynamic, breadcrumbsData, router.asPath, slug]);

	return (
		<Box>
			<Breadcrumb crumbs={crumbs} hideHome={hideHome} />
			{children}
		</Box>
	);
};

export default BreadcrumbWrapper;
