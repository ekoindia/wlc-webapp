import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Breadcrumbs } from "..";

/**
 * Breadcrumbs component wrapper to calculate the sub-paths and display the breadcrumbs at the top of the page.
 * @param {object} props Properties passed to the component
 * @param {object} props.breadcrumbsData Object containing the possible URLs and the labels for the breadcrumbs
 * @param {string} [props.slug] Value of the URL slug (if part of the URL)
 * @param {React.Component} [props.children] Child components to render
 */
const BreadcrumbsWrapper = ({ breadcrumbsData, slug, children }) => {
	const router = useRouter();
	const [crumbs, setCrumbs] = useState([]);

	/**
	 * Get the breadcrumbs data (sub-path hrefs & labels) based on the current URL
	 */
	useEffect(() => {
		if (!breadcrumbsData) return;

		// Get the current path and replace the slug if present
		const currentURL = router.pathname.replace("[slug]", slug || "");
		const pathArray = currentURL.split("/");

		let URL = "";
		let _crumbs = [];

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
