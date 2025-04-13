import { Box } from "@chakra-ui/react";
import { Breadcrumb } from "components";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

/**
 * Interface for breadcrumb data.
 */
interface BreadcrumbData {
	href: string; // URL for the breadcrumb
	label: string; // Display label for the breadcrumb
	isCurrent: boolean; // Indicates if the breadcrumb is the current page
}

/**
 * Props for the BreadcrumbWrapper component.
 */
interface BreadcrumbWrapperProps {
	breadcrumbsData: Record<string, string>; // Object containing possible URLs and their labels
	slug?: string; // Optional slug value for dynamic routes
	children?: ReactNode; // Child components to render
}

/**
 * BreadcrumbWrapper component.
 * Calculates sub-paths and displays breadcrumbs at the top of the page.
 * @param {BreadcrumbWrapperProps} props - Properties passed to the component.
 * @returns {JSX.Element} The rendered BreadcrumbWrapper component.
 */
const BreadcrumbWrapper: React.FC<BreadcrumbWrapperProps> = ({
	breadcrumbsData,
	slug,
	children,
}) => {
	const router = useRouter();
	const [crumbs, setCrumbs] = useState<BreadcrumbData[]>([]);

	/**
	 * Get the breadcrumbs data (sub-path hrefs & labels) based on the current URL.
	 */
	useEffect(() => {
		if (!breadcrumbsData) return;

		// Get the current path and replace the slug if present
		const currentURL = router.pathname.replace("[slug]", slug || "");
		const pathArray = currentURL.split("/");

		let URL = "";
		const _crumbs: BreadcrumbData[] = [];

		pathArray.forEach((path, index) => {
			if (!path) return;
			URL += `/${path}`;
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
			<Breadcrumb crumbs={crumbs} />
			{children}
		</Box>
	);
};

export default BreadcrumbWrapper;
