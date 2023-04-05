import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@chakra-ui/react";
import { Icon } from "../";

const Breadcrumbs = (props) => {
	const {
		// setNav,
		// setHeadingObj,
		// isNavVisible,
		// isSmallerThan769,
		// propComp,
		hrefs,
		labels,
		handleOnClick,
	} = props;

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
					<BreadcrumbItem>
						<BreadcrumbLink
							fontSize="xs"
							display={"flex"}
							color={"accent.DEFAULT"}
							_hover={{ textDecoration: "none" }}
						>
							<Box
								mr="1"
								width={{ base: "16px", md: "14px" }}
								height={{ base: "16px", md: "14px" }}
							>
								<Icon name="home" width="100%" height="100%" />
							</Box>
							Home
						</BreadcrumbLink>
					</BreadcrumbItem>
					{hrefs?.map((item, index) => {
						const handleBreadcrumbOnClick = () => {
							if (index !== hrefs.length - 1) {
								handleOnClick(hrefs[index]);
							}
						};
						return (
							<BreadcrumbItem key={index}>
								<BreadcrumbLink
									onClick={handleBreadcrumbOnClick}
									_hover={{ textDecoration: "none" }}
									fontSize="xs"
									color={
										index === hrefs.length - 1
											? "light"
											: "accent.DEFAULT"
									}
									cursor={
										index === hrefs.length - 1
											? "default"
											: "pointer"
									}
								>
									{labels[index]}
								</BreadcrumbLink>
							</BreadcrumbItem>
						);
					})}
				</Breadcrumb>
			</Box>
		</>
	);
};

export default Breadcrumbs;
