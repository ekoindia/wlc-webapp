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
}

/**
 * Breadcrumb component.
 * Displays a breadcrumb navigation bar with clickable links.
 * @param {BreadcrumbProps} props - Properties passed to the component.
 * @param {BreadcrumbItemProps[]} [props.crumbs] - Array of breadcrumbs to be displayed. Each item should have a `href` and `label`. The latest item should have `isCurrent` flag set to true.
 * @returns {JSX.Element} The rendered Breadcrumb component.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs = [] }) => {
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
	 * Handle click event on a breadcrumb.
	 * If the breadcrumb is not the current page, navigate to the URL.
	 * If the breadcrumb URL matches the browser history, go back in the history.
	 * @param {BreadcrumbItemProps} crumb - The breadcrumb object that was clicked.
	 */
	const onCrumbClick = (crumb: BreadcrumbItemProps): void => {
		if (crumb.isCurrent || !crumb.href) return;

		const history = window.history;
		const crumbURL = window.location.origin + crumb.href;

		if (document.referrer === crumbURL) {
			history.back();
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
