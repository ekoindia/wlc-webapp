import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from "@chakra-ui/react";
import { Icon } from "../";

const Breadcrumbs = ({ hrefs = [], labels = [], handleOnClick }) => {
	return (
		<>
			<Box display={{ base: "none", lg: "flex" }}>
				<Breadcrumb
					separator={
						<Icon size="9px" name="chevron-right" color={"light"} />
					}
				>
					<BreadcrumbItem>
						<BreadcrumbLink
							fontSize="xs"
							display={"flex"}
							alignItems={"center"}
							color={"accent.DEFAULT"}
							_hover={{ textDecoration: "none" }}
						>
							<Icon
								name="home"
								size={{ base: "16px", md: "14px" }}
								mr="1"
							/>
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
