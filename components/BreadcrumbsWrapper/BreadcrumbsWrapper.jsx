import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Breadcrumbs } from "..";

/**
 * A <BreadcrumbsWrapper> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BreadcrumbsWrapper></BreadcrumbsWrapper>`
 */

const BreadcrumbsWrapper = (props) => {
	const { children, BreadcrumbsObject } = props;
	const router = useRouter();
	const hrefs = [];
	const labels = [];
	const currentURL = router.pathname;
	const pathArray = currentURL.split("/");
	pathArray.shift();

	let URL;
	if (BreadcrumbsObject !== undefined)
		pathArray.forEach((ele) => {
			const temp = "/" + ele;
			URL = URL ? URL + temp : temp;
			if (BreadcrumbsObject[URL]) {
				hrefs.push(URL);
				labels.push(BreadcrumbsObject[URL]);
			}
		});

	const handleOnClick = (link) => {
		router.push(link);
	};

	return (
		<Box>
			<Breadcrumbs
				hrefs={hrefs}
				labels={labels}
				handleOnClick={handleOnClick}
			/>
			{children}
		</Box>
	);
};

export default BreadcrumbsWrapper;
