import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	color,
	Text,
} from "@chakra-ui/react";
import { Icon } from "../";
/**
 * A <Breadcrumb> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Breadcrumb></Breadcrumb>`
 */
const Breadcrumbs = ({ className = "", ...props }) => {
	const router = useRouter();
	const [breadcrumbs, setBreadcrumbs] = useState();

	useEffect(() => {
		const pathWithoutQuery = router.asPath.split("?")[0];
		let pathArray = pathWithoutQuery.split("/");
		pathArray.shift();

		pathArray = pathArray.filter((path) => path !== "");

		const breadcrumbs = pathArray.map((path, index) => {
			const href = "/" + pathArray.slice(0, index + 1).join("/");
			return {
				href,
				label: path.charAt(0).toUpperCase() + path.slice(1),
				isCurrent: index === pathArray.length - 1,
			};
		});
		breadcrumbs.shift();
		setBreadcrumbs(breadcrumbs);
		console.log(breadcrumbs);
	}, [router.asPath]);

	function capitalizeWordsBreadcrumbs(str) {
		return str
			.replace(/\b[a-z]/g, function (f) {
				return f.toUpperCase();
			})
			.replace(/-/g, " ");
	}

	return (
		<>
			<Box marginBottom={6}>
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
							href="#"
							_hover={{ textDecoration: "none" }}
							fontSize={"13px"}
							color={"accent.DEFAULT"}
							lineHeight={0}
						>
							<Box
								gap={"1"}
								display={"flex"}
								alignItems={"center"}
							>
								<Icon width="14px" height="13px" name="home" />
								<Text>Home</Text>
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
									fontSize={"13px"}
									color={
										breadcrumb.isCurrent
											? "light"
											: "accent.DEFAULT"
									}
									lineHeight={0}
								>
									{capitalizeWordsBreadcrumbs(
										breadcrumb.label
									)}
								</BreadcrumbLink>
							</BreadcrumbItem>
						))}
				</Breadcrumb>
			</Box>
		</>
	);
};

export default Breadcrumbs;
