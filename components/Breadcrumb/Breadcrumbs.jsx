import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useSession } from "contexts";
import { useRouter } from "next/router";
import { Icon } from "../";

/**
 * Breadcrumbs component.
 * @param {object} props Properties passed to the component
 * @param {Array} [props.crumbs] Array of breadcrumbs to be displayed. Each item should have a `href` and `label`. The latest item should have `isCurrent` flag set to true.
 */
const Breadcrumbs = ({ crumbs = [] }) => {
	const { isAdmin } = useSession();
	const router = useRouter();
	const onHomeClick = () => {
		const _redirect = isAdmin ? "/admin" : "/home";
		router.push(_redirect);
	};

	/**
	 * Handle click event on a breadcrumb. If the breadcrumb is not the current page, navigate to the URL.
	 * If the breadcrumb URL is part of the browser history for the matching number of steps, go back in the history.
	 * @param {object} crumb The breadcrumb object that was clicked
	 */
	const onCrumbClick = (crumb) => {
		// If the crumb is the current page, do nothing
		if (crumb.isCurrent || !crumb.href) return;

		// If the last URL in Browser History (implied by document.referrer) is the same URL that we want to go back to, go back one step in the history.
		const history = window.history;
		const crumbURL = window.location.origin + crumb.href;
		if (document.referrer === crumbURL) {
			history.back();
			return;
		}

		// Otherwise, just load the URL
		router.push(crumb.href);
	};

	return (
		<Breadcrumb
			display={{ base: "none", md: "flex" }}
			fontSize="xs"
			alignItems="center"
			userSelect="none"
			separator={<Icon size="9px" name="chevron-right" color={"light"} />}
		>
			<BreadcrumbItem>
				<BreadcrumbLink
					fontSize="xs"
					display="flex"
					alignItems="center"
					color={"primary.DEFAULT"}
					_hover={{ textDecoration: "none" }}
					onClick={onHomeClick}
				>
					<Icon
						name="home"
						size={{ base: "16px", md: "14px" }}
						mr="1"
					/>
					Home
				</BreadcrumbLink>
			</BreadcrumbItem>
			{crumbs?.map((crumb, index) => (
				<BreadcrumbItem key={index} isCurrentPage={crumb.isCurrent}>
					<BreadcrumbLink
						onClick={() => onCrumbClick(crumb)}
						_hover={{ textDecoration: "none" }}
						fontSize="xs"
						color={crumb.isCurrent ? "light" : "primary.DEFAULT"}
						// pointerEvents={crumb.isCurrent ? "none" : "auto"}
						cursor="default"
					>
						{crumb.label}
					</BreadcrumbLink>
				</BreadcrumbItem>
			))}
		</Breadcrumb>
	);
};

export default Breadcrumbs;
