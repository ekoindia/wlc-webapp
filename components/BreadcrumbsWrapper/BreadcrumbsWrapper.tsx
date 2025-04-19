import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { Breadcrumbs } from "..";

interface BreadcrumbItem {
	href: string;
	label: string;
	isCurrent: boolean;
}

interface BreadcrumbsData {
	[key: string]: string;
}

interface BreadcrumbsWrapperProps {
	breadcrumbsData: BreadcrumbsData;
	slug?: string;
	children?: ReactNode;
}

/**
 * Breadcrumbs component wrapper to calculate the sub-paths and display the breadcrumbs at the top of the page. It should be used on page components. It should be put inside the <PaddingBox> component to ensure consistent padding on every page.
 * @param props - Component props
 * @param props.breadcrumbsData - Object containing the possible URLs and the labels for the breadcrumbs. Pass the current page and parent page URLs as keys and the labels as values.
 * @param props.slug - Value of the URL slug (if part of the URL)
 * @param props.children - Rest of the child components of the page to be displayed below the breadcrumbs.
 * @example
 * ```tsx
 * // Fixed URL example
 * <BreadcrumbsWrapper
 *   breadcrumbsData={{
 *     "/about": "About",
 *     "/about/team": "Team",
 *     "/about/team/john": "John Doe",
 *  }}
 * >
 *   // Page content goes here
 * </BreadcrumbsWrapper>
 *
 * // Dynamic URL example
 * <BreadcrumbsWrapper
 *  breadcrumbsData={{
 *    "/about": "About",
 *    "/about/team": "Team",
 *    "/about/team/[slug]": "Team Member",
 *    "/about/team/[slug]/details": "Details",
 *  }}
 *  slug="john-doe"
 * >
 *  // Page content goes here
 * </BreadcrumbsWrapper>
 * ```
 */
const BreadcrumbsWrapper = ({
	breadcrumbsData,
	slug,
	children,
}: BreadcrumbsWrapperProps): JSX.Element => {
	const router = useRouter();
	const [crumbs, setCrumbs] = useState<BreadcrumbItem[]>([]);

	/**
	 * Get the breadcrumbs data (sub-path hrefs & labels) based on the current URL
	 */
	useEffect(() => {
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
	}, [breadcrumbsData, router.pathname, slug]);

	return (
		<Box>
			<Breadcrumbs crumbs={crumbs} />
			{children}
		</Box>
	);
};

export default BreadcrumbsWrapper;
