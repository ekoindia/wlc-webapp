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

	console.log("CRUMBS: ", crumbs);

	// TODO: Go back in browser history, instead of pushing new URLs to the history stack.
	const onCrumbClick = (crumb) => {
		if (crumb.isCurrent || !crumb.href) return;
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
