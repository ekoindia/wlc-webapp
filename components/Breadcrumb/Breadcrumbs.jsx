import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Headings, Icon } from "../";

const textChanger = {
	Profile: "Seller Details",
	Pricing: "Pricing & Commissions",
	"Up-sell-info": "Update Seller Information",
	"Up-per-info": "Update Personal Information",
	"Up-sell-add": "Update Seller Address",
	"Preview-sell-info": "Preview Seller Information",
};

const Breadcrumbs = (props) => {
	const router = useRouter();
	const [breadcrumbs, setBreadcrumbs] = useState();

	const { setNav, setHeadingObj, isNavVisible, isSmallerThan769, propComp } =
		props;

	const capitalizeWordsBreadcrumbs = (str) => {
		if (str in textChanger) {
			str = textChanger[str];
		}
		return str
			.replace(/\b[a-z]/g, function (f) {
				return f.toUpperCase();
			})
			.replace(/-/g, " ");
	};

	useEffect(() => {
		const pathWithoutQuery = router.asPath.split("?")[0];
		let pathArray = pathWithoutQuery.split("/");
		pathArray.shift();

		pathArray = pathArray.filter((path) => path !== "");

		const breadcrumbs = pathArray.map((path, index) => {
			const href = "/" + pathArray.slice(0, index + 1).join("/");
			return {
				href,
				label: capitalizeWordsBreadcrumbs(
					path.charAt(0).toUpperCase() + path.slice(1)
				),
				isCurrent: index === pathArray.length - 1,
			};
		});
		breadcrumbs.shift();
		setBreadcrumbs(breadcrumbs);
		if (breadcrumbs.length > 1) {
			setNav(false);
		}
		setHeadingObj({
			title: breadcrumbs[breadcrumbs.length - 1]?.label,
			hasIcon: breadcrumbs.length > 1 ? true : false,
		});
	}, [router.asPath]);

	return (
		<>
			<Box display={{ base: "none", lg: "flex" }}>
				<Breadcrumb
					separator={
						<Icon
							width="9px"
							height="9px"
							name="chevron-right"
							color={"light"}
						/>
					}
				>
					<BreadcrumbItem key={0}>
						<BreadcrumbLink
							href="/admin/my-network"
							_hover={{ textDecoration: "none" }}
							fontSize="xs"
							color={"accent.DEFAULT"}
							lineHeight={1}
						>
							<Box
								gap={"1"}
								display={"flex"}
								alignItems={"center"}
							>
								<Box
									width={{ base: "16px", md: "14px" }}
									height={{ base: "16px", md: "14px" }}
								>
									<Icon
										name="home"
										width="100%"
										height="100%"
									/>
								</Box>
								<Text mt={"0.1vw"}>Home</Text>
							</Box>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{breadcrumbs &&
						breadcrumbs.map((breadcrumb, index) => (
							<BreadcrumbItem
								key={index}
								isCurrentPage={
									index === breadcrumbs.length - 1
										? true
										: false
								}
							>
								<BreadcrumbLink
									href={breadcrumb.href}
									_hover={{ textDecoration: "none" }}
									fontSize="xs"
									color={
										breadcrumb.isCurrent
											? "light"
											: "accent.DEFAULT"
									}
									lineHeight={1}
								>
									{breadcrumb.label}
								</BreadcrumbLink>
							</BreadcrumbItem>
						))}
				</Breadcrumb>
			</Box>

			{isSmallerThan769 ? (
				isNavVisible && (
					<Box mt={"26px"}>
						{breadcrumbs && (
							<Headings
								hasIcon={breadcrumbs.length > 1 ? true : false}
								title={
									breadcrumbs[breadcrumbs.length - 1]?.label
								}
								redirectPath={
									breadcrumbs.length > 1 &&
									breadcrumbs[breadcrumbs.length - 2].href
								}
							/>
						)}
					</Box>
				)
			) : (
				<Box
					mt={{
						base: "0px",
						md: "16px",
						lg: "20px",
						xl: "24px",
						"2xl": "30px",
					}}
				>
					{breadcrumbs && (
						<Headings
							hasIcon={breadcrumbs.length > 1 ? true : false}
							title={breadcrumbs[breadcrumbs.length - 1]?.label}
							redirectPath={
								breadcrumbs.length > 1 &&
								breadcrumbs[breadcrumbs.length - 2].href
							}
							propComp={propComp}
						/>
					)}
				</Box>
			)}
		</>
	);
};

export default Breadcrumbs;
