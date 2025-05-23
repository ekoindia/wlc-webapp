import {
	BreadcrumbItem,
	BreadcrumbLink,
	Breadcrumb as ChakraBreadcrumb,
} from "@chakra-ui/react";
import { useSession } from "contexts";
import { useRouter } from "next/router";
import { Icon } from "../";

/**
 * Interface for a single breadcrumb item.
 */
interface BreadcrumbItemProps {
	href?: string; // URL to navigate to when clicked
	label: string; // Display label for the breadcrumb
	isCurrent?: boolean; // Indicates if the breadcrumb is the current page
}

/**
 * Props for the Breadcrumb component.
 */
interface BreadcrumbProps {
	crumbs?: BreadcrumbItemProps[]; // Array of breadcrumb items to display
	hideHome?: boolean; // Optional flag to hide the first home breadcrumb
}

/**
 * Breadcrumb component.
 * Displays a breadcrumb navigation bar with clickable links.
 * @param {BreadcrumbProps} props - Properties passed to the component.
 * @param {BreadcrumbItemProps[]} [props.crumbs] - Array of breadcrumbs to be displayed. Each item should have a `href` and `label`. The latest item should have `isCurrent` flag set to true.
 * @param {boolean} [props.hideHome] Optional flag to hide the first home breadcrumb.
 * @returns {JSX.Element} The rendered Breadcrumb component.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({
	crumbs = [],
	hideHome = false,
}) => {
	const { isAdmin } = useSession();
	const router = useRouter();

	/**
	 * Navigate to the home page based on the user's role.
	 */
	const onHomeClick = (): void => {
		const redirectPath = isAdmin ? "/admin" : "/home";
		router.push(redirectPath);
	};

	/**
	 * Handles breadcrumb click navigation.
	 * - If the breadcrumb represents the current page or lacks an `href`, it does nothing.
	 * - If the document referrer matches the breadcrumb URL (ignoring trailing slashes),
	 * and browser history length is greater than 1, it navigates back in history.
	 * - Otherwise, it performs a router push to the breadcrumb's URL.
	 *
	 * This logic improves over a naive `document.referrer === crumb.href` check by:
	 * - Normalizing paths to ignore trailing slashes.
	 * - Avoiding referrer-based navigation if history is too shallow.
	 * @param {BreadcrumbItemProps} crumb - The breadcrumb object that was clicked.
	 */
	const onCrumbClick = (crumb: BreadcrumbItemProps): void => {
		if (crumb.isCurrent || !crumb.href) return;

		const { origin } = window.location;
		const crumbURL = new URL(crumb.href, origin);
		const referrerURL = document.referrer
			? new URL(document.referrer)
			: null;

		/**
		 * Normalize path by removing trailing slashes to avoid false mismatches.
		 * @param {URL} url - The URL object to normalize.
		 * @returns {string} Normalized pathname without trailing slashes.
		 */
		const normalizePath = (url: URL): string =>
			url.pathname.replace(/\/+$/, "");

		const isSamePage =
			referrerURL &&
			normalizePath(referrerURL) === normalizePath(crumbURL);

		if (isSamePage && window.history.length > 1) {
			window.history.back();
			return;
		}

		router.push(crumb.href);
	};

	return (
		<ChakraBreadcrumb
			display={{ base: "none", md: "flex" }}
			fontSize="xs"
			alignItems="center"
			userSelect="none"
			separator={<Icon size="9px" name="chevron-right" color="light" />}
		>
			{hideHome !== true ? (
				<BreadcrumbItem>
					<BreadcrumbLink
						fontSize="xs"
						display="flex"
						alignItems="center"
						color="primary.DEFAULT"
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
			) : null}
			{crumbs.map((crumb, index) => (
				<BreadcrumbItem key={index} isCurrentPage={crumb.isCurrent}>
					<BreadcrumbLink
						onClick={() => onCrumbClick(crumb)}
						_hover={{ textDecoration: "none" }}
						fontSize="xs"
						color={crumb.isCurrent ? "light" : "primary.DEFAULT"}
						cursor="default"
					>
						{crumb.label}
					</BreadcrumbLink>
				</BreadcrumbItem>
			))}
		</ChakraBreadcrumb>
	);
};

export default Breadcrumb;
