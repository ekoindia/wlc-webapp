import React, { useEffect, useState } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Box,
} from "@chakra-ui/react";
/**
 * A <Breadcrumb> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Breadcrumb></Breadcrumb>`
 */
const Breadcrumbs = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);
	const CustomizedBreadcrumbSeparator = () => {
		return <div>&gt;</div>;
	};

	return (
		<div className={`${className}`} {...props}>
			<Breadcrumb separator={<CustomizedBreadcrumbSeparator />}>
				<BreadcrumbItem>
					<BreadcrumbLink href="/admin/my-network#">
						<img src="/icons/home.svg" />
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbItem>
					<BreadcrumbLink href="/admin/my-network#">
						My Network
					</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
		</div>
	);
};

export default Breadcrumbs;
