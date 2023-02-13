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

const Breadcrumbs = ({ ...props }) => {
	const router = useRouter();
	const [breadcrumbs, setBreadcrumbs] = useState();

	//? Add text accordingly here 👇
	const textChanger = {
		Profile: "Seller Details",
		Pricing: "Pricing & Commissions",
		// "up-sell-info": "Update Personal Information",
		// 'Up Sell Info':'Update Seller Information',
		// 'Up Sell Add':"Update Selller Address",
	};

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
	}, [router.asPath]);

	return (
		<>
			<Box display={{ base: "none", md: "flex" }}>
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
							fontSize={{
								md: "xs",
								lg: "xs",
								xl: "xs",
								"2xl": "md",
							}}
							color={"accent.DEFAULT"}
							lineHeight={0}
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
									fontSize={{
										md: "xs",
										lg: "xs",
										xl: "xs",
										"2xl": "md",
									}}
									color={
										breadcrumb.isCurrent
											? "light"
											: "accent.DEFAULT"
									}
									lineHeight={0}
								>
									{breadcrumb.label}
								</BreadcrumbLink>
							</BreadcrumbItem>
						))}
				</Breadcrumb>
			</Box>
			<Box>
				{breadcrumbs ? (
					<Headings
						hasIcon={breadcrumbs.length > 1 ? true : false}
						title={breadcrumbs[breadcrumbs.length - 1]?.label}
						redirectPath={
							breadcrumbs.length > 1
								? breadcrumbs[breadcrumbs.length - 2].href
								: ""
						}
					/>
				) : (
					""
				)}
			</Box>
		</>
	);
};

export default Breadcrumbs;
