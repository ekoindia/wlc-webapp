import { Box } from "@chakra-ui/react";
import { Breadcrumb } from "components";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

interface BreadcrumbItem {
	href: string; // URL for the breadcrumb
	label: string; // Display label for the breadcrumb
	isCurrent: boolean; // Indicates if the breadcrumb is the current page
}
interface BreadcrumbWrapperProps {
	breadcrumbsData: BreadcrumbItem; // Object containing possible URLs and their labels
	crumbs?: BreadcrumbItem[]; // Pre-generated crumbs
	slug?: string; // Optional slug value for dynamic routes
	children?: ReactNode; // Child components to render
	hideHome?: boolean; // Optional flag to hide the first home breadcrumb
}

/**
 * Breadcrumbs component wrapper to calculate the sub-paths and display the breadcrumbs at the top of the page. It should be used on page components. It should be put inside the <PaddingBox> component to ensure consistent padding on every page.
 * @param props - Component props
 * @param props.breadcrumbsData - Object containing the possible URLs and the labels for the breadcrumbs. Pass the current page and parent page URLs as keys and the labels as values.
 * @param props.slug - Value of the URL slug (if part of the URL)
 * @param props.children - Rest of the child components of the page to be displayed below the breadcrumbs.
 * @param props.hideHome - Optional flag to hide the first home breadcrumb.
 * @param props.crumbs
 * @example
 * ```tsx
 * // Fixed URL example
 * <BreadcrumbWrapper
 *   breadcrumbsData={{
 *     "/about": "About",
 *     "/about/team": "Team",
 *     "/about/team/john": "John Doe",
 *  }}
 * >
 *   // Page content goes here
 * </BreadcrumbWrapper>
 *
 * // Dynamic URL example
 * <BreadcrumbWrapper
 *  breadcrumbsData={{
 *    "/about": "About",
 *    "/about/team": "Team",
 *    "/about/team/[slug]": "Team Member",
 *    "/about/team/[slug]/details": "Details",
 *  }}
 *  slug="john-doe"
 * >
 *  // Page content goes here
 * </BreadcrumbWrapper>
 * ```
 */
const BreadcrumbWrapper = ({
	breadcrumbsData,
	crumbs: providedCrumbs,
	slug,
	hideHome = false,
	children,
}: BreadcrumbWrapperProps): JSX.Element => {
	const router = useRouter();
	const [crumbs, setCrumbs] = useState<BreadcrumbItem[]>([]);

	/**
	 * Get the breadcrumbs data (sub-path hrefs & labels) based on the current URL
	 */
	useEffect(() => {
		if (providedCrumbs) {
			setCrumbs(providedCrumbs);
			return;
		}
		if (!breadcrumbsData) return;

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
	}, [breadcrumbsData, providedCrumbs, router.pathname, slug]);

	return (
		<Box>
			<Breadcrumb crumbs={crumbs} hideHome={hideHome} />
			{children}
		</Box>
	);
};

export default BreadcrumbWrapper;
